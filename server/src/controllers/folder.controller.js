import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Helper function to check if targetParentId is a subfolder/descendant of folderId (prevents circular loops)
const checkCircularDependency = async (folderId, targetParentId) => {
  let currentParentId = targetParentId;
  while (currentParentId) {
    if (currentParentId === folderId) {
      return true; // Cycle detected: target parent is a descendant of folderId
    }
    const parentFolder = await prisma.folder.findUnique({
      where: { id: currentParentId },
      select: { parentId: true },
    });
    if (!parentFolder) break;
    currentParentId = parentFolder.parentId;
  }
  return false;
};

// Create a new folder under root or inside a parent folder
export const createFolder = async (req, res, next) => {
  try {
    const { name, parentId } = req.body;
    const userId = req.user.id;

    // Validate parent folder ownership if parentId is provided
    if (parentId) {
      const parentFolder = await prisma.folder.findUnique({
        where: { id: parentId },
      });
      if (!parentFolder || parentFolder.userId !== userId) {
        throw new ApiError(404, "Parent folder not found");
      }
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        userId,
        parentId: parentId || null,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { folder }, "Folder created successfully"));
  } catch (error) {
    next(error);
  }
};

// List all folders owned by the user (with subfolder tree hierarchy)
export const getFolders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch all folders for current user
    const allFolders = await prisma.folder.findMany({
      where: { userId },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { files: true, children: true },
        },
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { folders: allFolders }, "Folders retrieved successfully")
      );
  } catch (error) {
    next(error);
  }
};

// Fetch folder details including contained files, subfolders, and parent breadcrumb
export const getFolderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const folder = await prisma.folder.findUnique({
      where: { id },
      include: {
        parent: {
          select: { id: true, name: true, parentId: true },
        },
        children: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            _count: { select: { files: true, children: true } },
          },
          orderBy: { name: "asc" },
        },
        files: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!folder || folder.userId !== userId) {
      throw new ApiError(404, "Folder not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { folder }, "Folder details retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

// Rename or move a folder (includes cycle guard against circular folder structures)
export const updateFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, parentId } = req.body;

    const folder = await prisma.folder.findUnique({ where: { id } });
    if (!folder || folder.userId !== userId) {
      throw new ApiError(404, "Folder not found");
    }

    // Move folder validation logic
    if (parentId !== undefined && parentId !== folder.parentId) {
      if (parentId === id) {
        throw new ApiError(400, "Folder cannot be set as its own parent");
      }

      if (parentId !== null) {
        // Validate target parent folder ownership
        const targetParent = await prisma.folder.findUnique({
          where: { id: parentId },
        });
        if (!targetParent || targetParent.userId !== userId) {
          throw new ApiError(404, "Target parent folder not found");
        }

        // Folder cycle guard: prevent moving a folder into its own child/descendant
        const isCircular = await checkCircularDependency(id, parentId);
        if (isCircular) {
          throw new ApiError(
            400,
            "Cannot move folder into one of its own subfolders (circular structure)"
          );
        }
      }
    }

    const updatedFolder = await prisma.folder.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(parentId !== undefined && { parentId }),
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { folder: updatedFolder }, "Folder updated successfully")
      );
  } catch (error) {
    next(error);
  }
};

// Delete folder (returns 400 if subfolders exist; files inside automatically move to root via SetNull)
export const deleteFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const folder = await prisma.folder.findUnique({
      where: { id },
      include: {
        _count: {
          select: { children: true },
        },
      },
    });

    if (!folder || folder.userId !== userId) {
      throw new ApiError(404, "Folder not found");
    }

    // Check if subfolders exist — return 400 error instead of leaking DB constraint error
    if (folder._count.children > 0) {
      throw new ApiError(
        400,
        "Folder is not empty — please delete or move all subfolders first"
      );
    }

    // Delete folder from DB (files inside have onDelete: SetNull so their folderId becomes null/root)
    await prisma.folder.delete({ where: { id } });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Folder deleted successfully"));
  } catch (error) {
    next(error);
  }
};
