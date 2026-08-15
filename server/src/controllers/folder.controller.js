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

// Helper function to collect a folder ID and all its recursive descendant folder IDs
export const getAllDescendantFolderIds = async (folderId, userId) => {
  const allFolders = await prisma.folder.findMany({
    where: { userId },
    select: { id: true, parentId: true },
  });

  const descendantIds = [folderId];
  const queue = [folderId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = allFolders.filter((f) => f.parentId === currentId);
    for (const child of children) {
      if (!descendantIds.includes(child.id)) {
        descendantIds.push(child.id);
        queue.push(child.id);
      }
    }
  }

  return descendantIds;
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
      if (!parentFolder || parentFolder.userId !== userId || parentFolder.deletedAt) {
        throw new ApiError(404, "Parent folder not found or in trash");
      }
    }

    // Prevent duplicate folder names under the same active parent directory
    const existingFolder = await prisma.folder.findFirst({
      where: {
        userId,
        parentId: normalizedParentId,
        deletedAt: null,
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

// List active folders owned by the user (supports parentId query filter)
export const getFolders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { parentId } = req.query;

    const whereClause = { userId, deletedAt: null };
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
          select: {
            files: { where: { deletedAt: null } },
            children: { where: { deletedAt: null } },
          },
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
        children: {
          where: { deletedAt: null },
          select: {
            id: true,
            name: true,
            createdAt: true,
            _count: {
              select: {
                files: { where: { deletedAt: null } },
                children: { where: { deletedAt: null } },
              },
            },
          },
          orderBy: { name: "asc" },
        },
        files: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!folder || folder.userId !== userId || folder.deletedAt) {
      throw new ApiError(404, "Folder not found or in trash");
    }

    // High-speed in-memory breadcrumb construction (single database query for all user folders)
    const allUserFolders = await prisma.folder.findMany({
      where: { userId, deletedAt: null },
      select: { id: true, name: true, parentId: true },
    });

    const folderMap = new Map(allUserFolders.map((f) => [f.id, f]));
    const breadcrumbs = [];
    let currId = folder.parentId;

    while (currId && folderMap.has(currId)) {
      const p = folderMap.get(currId);
      breadcrumbs.unshift({ id: p.id, name: p.name });
      currId = p.parentId;
    }
    breadcrumbs.push({ id: folder.id, name: folder.name });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { folder: { ...folder, breadcrumbs } },
          "Folder details retrieved successfully"
        )
      );
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
    if (!folder || folder.userId !== userId || folder.deletedAt) {
      throw new ApiError(404, "Folder not found or in trash");
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
        if (!targetParent || targetParent.userId !== userId || targetParent.deletedAt) {
          throw new ApiError(404, "Target parent folder not found or in trash");
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
        deletedAt: null,
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

// Soft delete a folder and all its descendant subfolders & files (moves entire tree to Trash together!)
export const deleteFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const folder = await prisma.folder.findUnique({ where: { id } });
    if (!folder || folder.userId !== userId) {
      throw new ApiError(404, "Folder not found");
    }

    // Collect all recursive descendant folder IDs
    const allFolderIds = await getAllDescendantFolderIds(id, userId);
    const now = new Date();

    // Transactionally soft delete folder, subfolders, and all files inside them
    await prisma.$transaction([
      prisma.file.updateMany({
        where: { folderId: { in: allFolderIds }, userId },
        data: { deletedAt: now },
      }),
      prisma.folder.updateMany({
        where: { id: { in: allFolderIds }, userId },
        data: { deletedAt: now },
      }),
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { trashedFolderCount: allFolderIds.length },
          "Folder and all contents moved to Trash successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};
