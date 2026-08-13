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

    const trimmedName = name ? name.trim() : "";
    if (!trimmedName) {
      throw new ApiError(400, "Folder name cannot be empty");
    }

    // Normalize parentId string ("root" or "null" -> null)
    const normalizedParentId =
      parentId === "root" || parentId === "null" || !parentId
        ? null
        : parentId;

    // Validate parent folder ownership if parentId is provided
    if (normalizedParentId) {
      const parentFolder = await prisma.folder.findUnique({
        where: { id: normalizedParentId },
      });
      if (!parentFolder || parentFolder.userId !== userId) {
        throw new ApiError(404, "Parent folder not found");
      }
    }

    // Prevent duplicate folder names under the same parent directory
    const existingFolder = await prisma.folder.findFirst({
      where: {
        userId,
        parentId: normalizedParentId,
        name: {
          equals: trimmedName,
          mode: "insensitive",
        },
      },
    });

    if (existingFolder) {
      throw new ApiError(
        400,
        `A folder named "${trimmedName}" already exists in this directory`
      );
    }

    const folder = await prisma.folder.create({
      data: {
        name: trimmedName,
        userId,
        parentId: normalizedParentId,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { folder }, "Folder created successfully"));
  } catch (error) {
    next(error);
  }
};

// List folders owned by the user (supports parentId query filter)
export const getFolders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { parentId } = req.query;

    const whereClause = { userId };
    if (parentId === "root" || parentId === "null") {
      whereClause.parentId = null;
    } else if (parentId) {
      whereClause.parentId = parentId;
    }

    const folders = await prisma.folder.findMany({
      where: whereClause,
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
        new ApiResponse(200, { folders }, "Folders retrieved successfully")
      );
  } catch (error) {
    next(error);
  }
};

// Fetch folder details including contained files, subfolders, and parent breadcrumbs
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

    // Build full ancestor breadcrumb chain
    const breadcrumbs = [];
    let currentParent = folder.parent;
    while (currentParent) {
      breadcrumbs.unshift({ id: currentParent.id, name: currentParent.name });
      if (currentParent.parentId) {
        currentParent = await prisma.folder.findUnique({
          where: { id: currentParent.parentId },
          select: { id: true, name: true, parentId: true },
        });
      } else {
        currentParent = null;
      }
    }
    breadcrumbs.push({ id: folder.id, name: folder.name });

    return res
      .status(200)
      .json(new ApiResponse(200, { folder: { ...folder, breadcrumbs } }, "Folder details retrieved successfully"));
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

    const targetName = name !== undefined ? name.trim() : folder.name;
    if (!targetName) {
      throw new ApiError(400, "Folder name cannot be empty");
    }

    const targetParentId =
      parentId !== undefined
        ? parentId === "root" || parentId === "null" || !parentId
          ? null
          : parentId
        : folder.parentId;

    // If moving to a new parent folder, validate parent and check for circular dependency
    if (parentId !== undefined && targetParentId !== folder.parentId) {
      if (targetParentId === id) {
        throw new ApiError(400, "A folder cannot be its own parent");
      }
      if (targetParentId !== null) {
        const targetParent = await prisma.folder.findUnique({
          where: { id: targetParentId },
        });
        if (!targetParent || targetParent.userId !== userId) {
          throw new ApiError(404, "Target parent folder not found");
        }
        // Check if targetParent is a descendant of folder (cycle prevention)
        const isCycle = await checkCircularDependency(id, targetParentId);
        if (isCycle) {
          throw new ApiError(
            400,
            "Cannot move a folder into one of its own subfolders (circular dependency)"
          );
        }
      }
    }

    // Prevent duplicate folder names under the target parent directory
    const existingFolder = await prisma.folder.findFirst({
      where: {
        userId,
        parentId: targetParentId,
        name: {
          equals: targetName,
          mode: "insensitive",
        },
        id: { not: id }, // Exclude current folder being updated
      },
    });

    if (existingFolder) {
      throw new ApiError(
        400,
        `A folder named "${targetName}" already exists in the target directory`
      );
    }

    const updatedFolder = await prisma.folder.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: targetName }),
        ...(parentId !== undefined && { parentId: targetParentId }),
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { folder: updatedFolder },
          "Folder updated successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

// Delete a folder (safe cascading deletion: files inside deleted folder have folderId set to NULL)
export const deleteFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const folder = await prisma.folder.findUnique({ where: { id } });
    if (!folder || folder.userId !== userId) {
      throw new ApiError(404, "Folder not found");
    }

    await prisma.folder.delete({ where: { id } });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Folder deleted successfully"));
  } catch (error) {
    next(error);
  }
};

