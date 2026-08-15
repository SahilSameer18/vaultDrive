import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { deleteFromCloudinary } from "../utils/cloudinary.upload.js";
import { getAllDescendantFolderIds } from "./folder.controller.js";

// Fetch top-level trashed items (hierarchical view: hides nested sub-items whose parent is also in Trash)
export const getTrashItems = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Fetch all trashed folders and files for user
    const [trashedFolders, trashedFiles] = await Promise.all([
      prisma.folder.findMany({
        where: { userId, deletedAt: { not: null } },
        orderBy: { deletedAt: "desc" },
        include: {
          _count: {
            select: { files: true, children: true },
          },
        },
      }),
      prisma.file.findMany({
        where: { userId, deletedAt: { not: null } },
        orderBy: { deletedAt: "desc" },
      }),
    ]);

    const trashedFolderIdSet = new Set(trashedFolders.map((f) => f.id));

    // 2. Filter top-level items: Only show items whose parent folder is NOT in trash
    const topLevelFolders = trashedFolders.filter(
      (f) => !f.parentId || !trashedFolderIdSet.has(f.parentId)
    );

    const topLevelFiles = trashedFiles.filter(
      (f) => !f.folderId || !trashedFolderIdSet.has(f.folderId)
    );

    const totalTrashedBytes = trashedFiles.reduce(
      (acc, f) => acc + (f.size || 0),
      0
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          folders: topLevelFolders,
          files: topLevelFiles,
          totalTrashedItems: trashedFolders.length + trashedFiles.length,
          totalTrashedBytes,
        },
        "Trash items retrieved successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

// Fetch contents of a specific trashed folder (for read-only browsing inside Trash)
export const getTrashFolderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const folder = await prisma.folder.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { name: "asc" },
          include: {
            _count: { select: { files: true, children: true } },
          },
        },
        files: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!folder || folder.userId !== userId || !folder.deletedAt) {
      throw new ApiError(404, "Trashed folder not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { folder },
          "Trashed folder contents retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

// Restore a file or folder from Trash with smart parent fallback
export const restoreItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // "file" | "folder"
    const userId = req.user.id;

    if (type === "folder") {
      const folder = await prisma.folder.findUnique({ where: { id } });
      if (!folder || folder.userId !== userId || !folder.deletedAt) {
        throw new ApiError(404, "Trashed folder not found");
      }

      // Check if original parent is active (not deleted and exists)
      let targetParentId = folder.parentId;
      let restoredTo = "folder";

      if (folder.parentId) {
        const parentFolder = await prisma.folder.findUnique({
          where: { id: folder.parentId },
        });
        if (!parentFolder || parentFolder.deletedAt) {
          targetParentId = null; // Re-parent to Root
          restoredTo = "root";
        }
      } else {
        restoredTo = "root";
      }

      // Recursively collect all descendant folder IDs
      const allFolderIds = await getAllDescendantFolderIds(id, userId);

      // Restore folder, all subfolders, and all descendant files in a transaction
      await prisma.$transaction([
        prisma.folder.update({
          where: { id },
          data: { deletedAt: null, parentId: targetParentId },
        }),
        prisma.folder.updateMany({
          where: { id: { in: allFolderIds }, userId },
          data: { deletedAt: null },
        }),
        prisma.file.updateMany({
          where: { folderId: { in: allFolderIds }, userId },
          data: { deletedAt: null },
        }),
      ]);

      return res.status(200).json(
        new ApiResponse(
          200,
          { id, type: "folder", restoredTo },
          restoredTo === "root"
            ? "Folder and contents restored to Home (original parent folder was in trash)"
            : "Folder and all contents restored successfully"
        )
      );
    } else {
      // Restore a File
      const file = await prisma.file.findUnique({ where: { id } });
      if (!file || file.userId !== userId || !file.deletedAt) {
        throw new ApiError(404, "Trashed file not found");
      }

      let targetFolderId = file.folderId;
      let restoredTo = "folder";

      if (file.folderId) {
        const parentFolder = await prisma.folder.findUnique({
          where: { id: file.folderId },
        });
        if (!parentFolder || parentFolder.deletedAt) {
          targetFolderId = null; // Re-parent to Root
          restoredTo = "root";
        }
      } else {
        restoredTo = "root";
      }

      const restoredFile = await prisma.file.update({
        where: { id },
        data: {
          deletedAt: null,
          folderId: targetFolderId,
        },
      });

      return res.status(200).json(
        new ApiResponse(
          200,
          { file: restoredFile, type: "file", restoredTo },
          restoredTo === "root"
            ? "File restored to Home (original folder was in trash)"
            : "File restored to its folder successfully"
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

// Permanently delete a single file or folder (destroys Cloudinary assets & DB records)
export const deletePermanently = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // "file" | "folder"
    const userId = req.user.id;

    if (type === "folder") {
      const folder = await prisma.folder.findUnique({ where: { id } });
      if (!folder || folder.userId !== userId) {
        throw new ApiError(404, "Folder not found");
      }

      // Collect all descendant folder IDs and files
      const allFolderIds = await getAllDescendantFolderIds(id, userId);
      const descendantFiles = await prisma.file.findMany({
        where: { folderId: { in: allFolderIds }, userId },
        select: { id: true, publicId: true, resourceType: true },
      });

      // Destroy all Cloudinary assets in parallel
      await Promise.allSettled(
        descendantFiles.map((f) => deleteFromCloudinary(f.publicId, f.resourceType))
      );

      // Hard delete files and folders from PostgreSQL
      await prisma.$transaction([
        prisma.file.deleteMany({
          where: { folderId: { in: allFolderIds }, userId },
        }),
        prisma.folder.deleteMany({
          where: { id: { in: allFolderIds }, userId },
        }),
      ]);

      return res.status(200).json(
        new ApiResponse(
          200,
          { purgedFiles: descendantFiles.length, purgedFolders: allFolderIds.length },
          "Folder and contents permanently destroyed"
        )
      );
    } else {
      // Single file permanent deletion
      const file = await prisma.file.findUnique({ where: { id } });
      if (!file || file.userId !== userId) {
        throw new ApiError(404, "File not found");
      }

      // Destroy Cloudinary asset
      await deleteFromCloudinary(file.publicId, file.resourceType);

      // Delete DB record
      await prisma.file.delete({ where: { id } });

      return res.status(200).json(
        new ApiResponse(200, null, "File permanently deleted")
      );
    }
  } catch (error) {
    next(error);
  }
};

// Empty entire trash: purges all trashed files & folders for user
export const emptyTrash = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find all trashed files
    const trashedFiles = await prisma.file.findMany({
      where: { userId, deletedAt: { not: null } },
      select: { id: true, publicId: true, resourceType: true },
    });

    // Destroy all Cloudinary assets in parallel
    await Promise.allSettled(
      trashedFiles.map((f) => deleteFromCloudinary(f.publicId, f.resourceType))
    );

    // Hard delete all trashed files and folders in a transaction
    await prisma.$transaction([
      prisma.file.deleteMany({
        where: { userId, deletedAt: { not: null } },
      }),
      prisma.folder.deleteMany({
        where: { userId, deletedAt: { not: null } },
      }),
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        { purgedCount: trashedFiles.length },
        "Trash emptied successfully. Storage quota reclaimed."
      )
    );
  } catch (error) {
    next(error);
  }
};
