import crypto from "crypto";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  generateUploadSignature,
  deleteFromCloudinary,
} from "../utils/cloudinary.upload.js";

const TOTAL_STORAGE_QUOTA_BYTES = 1 * 1024 * 1024 * 1024; // 1 GB (1,073,741,824 bytes)

// Generate Cloudinary presigned upload parameters & HMAC signature for direct client uploads
export const getSignUpload = async (req, res, next) => {
  try {
    const { filename, mimeType, size, folderId } = req.body;
    const userId = req.user.id;

    // Validate 1 GB storage quota before issuing signature
    const storageSum = await prisma.file.aggregate({
      where: { userId },
      _sum: { size: true },
    });
    const currentUsedBytes = storageSum._sum.size || 0;
    const uploadSize = size || 0;

    if (currentUsedBytes + uploadSize > TOTAL_STORAGE_QUOTA_BYTES) {
      const usedMB = (currentUsedBytes / (1024 * 1024)).toFixed(1);
      throw new ApiError(
        400,
        `Storage quota exceeded! Your 1 GB vault storage limit is full (${usedMB} MB / 1024 MB used).`
      );
    }

    // Validate target folder ownership if folderId is provided
    if (folderId) {
      const folder = await prisma.folder.findUnique({
        where: { id: folderId },
      });
      if (!folder || folder.userId !== userId) {
        throw new ApiError(404, "Target folder not found");
      }
    }

    const tempFileId = crypto.randomUUID();

    const signParams = generateUploadSignature(
      userId,
      tempFileId,
      filename,
      mimeType
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        signParams,
        "Direct upload signature generated successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

// Confirm completed Cloudinary upload and record file metadata in database
export const confirmUpload = async (req, res, next) => {
  try {
    const { name, size, mimeType, resourceType, url, publicId, folderId } = req.body;
    const userId = req.user.id;

    // Enforce 1 GB storage quota check on confirm
    const storageSum = await prisma.file.aggregate({
      where: { userId },
      _sum: { size: true },
    });
    const currentUsedBytes = storageSum._sum.size || 0;

    if (currentUsedBytes + (size || 0) > TOTAL_STORAGE_QUOTA_BYTES) {
      const usedMB = (currentUsedBytes / (1024 * 1024)).toFixed(1);
      throw new ApiError(
        400,
        `Storage quota exceeded! Your 1 GB vault storage limit is full (${usedMB} MB / 1024 MB used).`
      );
    }

    // Validate target folder ownership if folderId is provided
    if (folderId) {
      const folder = await prisma.folder.findUnique({
        where: { id: folderId },
      });
      if (!folder || folder.userId !== userId) {
        throw new ApiError(404, "Target folder not found");
      }
    }

    const file = await prisma.file.create({
      data: {
        name,
        size,
        mimeType,
        resourceType: resourceType || "image",
        url,
        publicId,
        userId,
        folderId: folderId || null,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { file }, "File upload confirmed successfully"));
  } catch (error) {
    next(error);
  }
};


// List user's owned files with pagination, sorting, and folder filtering
export const getFiles = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      folderId,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    // Build Prisma query filter
    const where = {
      userId,
      ...(folderId === "root" || folderId === "null"
        ? { folderId: null }
        : folderId
        ? { folderId }
        : {}),
      ...(search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {}),
    };

    const [files, totalCount] = await Promise.all([
      prisma.file.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limitNum,
      }),
      prisma.file.count({ where }),
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          files,
          pagination: {
            page: pageNum,
            limit: limitNum,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNum),
          },
        },
        "Files retrieved successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

// Fetch single file by ID (allowed if owner, public, or shared with user)
export const getFileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    if (!file) {
      throw new ApiError(404, "File not found");
    }

    // Check authorization: Owner OR Public OR Shared with User
    const isOwner = file.userId === userId;
    const isPublic = file.isPublic;

    let isShared = false;
    if (!isOwner && !isPublic) {
      const shareRecord = await prisma.sharedFile.findUnique({
        where: {
          fileId_userId: { fileId: id, userId },
        },
      });
      isShared = !!shareRecord;
    }

    if (!isOwner && !isPublic && !isShared) {
      throw new ApiError(403, "Access denied: You do not have permission to view this file");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { file, accessType: isOwner ? "owner" : isPublic ? "public" : "shared" }, "File retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

// Update file properties (rename, move folder, or toggle public status)
export const updateFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, isPublic, folderId } = req.body;

    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new ApiError(404, "File not found");
    }

    if (file.userId !== userId) {
      throw new ApiError(403, "Forbidden: Only file owner can modify file properties");
    }

    // Validate target folder if provided
    if (folderId !== undefined && folderId !== null) {
      const folder = await prisma.folder.findUnique({ where: { id: folderId } });
      if (!folder || folder.userId !== userId) {
        throw new ApiError(404, "Target folder not found");
      }
    }

    const updatedFile = await prisma.file.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(isPublic !== undefined && { isPublic }),
        ...(folderId !== undefined && { folderId }),
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { file: updatedFile }, "File updated successfully"));
  } catch (error) {
    next(error);
  }
};

// Delete file from Cloudinary storage and database
export const deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new ApiError(404, "File not found");
    }

    if (file.userId !== userId) {
      throw new ApiError(403, "Forbidden: Only file owner can delete file");
    }

    // Delete file asset from Cloudinary using exact stored resourceType
    await deleteFromCloudinary(file.publicId, file.resourceType);

    // Delete file record from DB
    await prisma.file.delete({ where: { id } });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "File deleted successfully"));
  } catch (error) {
    next(error);
  }
};

// Generate public share token for file
export const generateShareLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new ApiError(404, "File not found");
    }

    if (file.userId !== userId) {
      throw new ApiError(403, "Forbidden: Only file owner can generate share link");
    }

    // Generate random 64-char hex share token if not present
    const shareToken = file.shareToken || crypto.randomBytes(32).toString("hex");

    const updatedFile = await prisma.file.update({
      where: { id },
      data: { shareToken, isPublic: true },
    });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const shareUrl = `${clientUrl}/share/${updatedFile.shareToken}`;

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { shareToken: updatedFile.shareToken, shareUrl },
          "Share link generated successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

// Revoke public share link for file
export const revokeShareLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new ApiError(404, "File not found");
    }

    if (file.userId !== userId) {
      throw new ApiError(403, "Forbidden: Only file owner can revoke share link");
    }

    await prisma.file.update({
      where: { id },
      data: { shareToken: null, isPublic: false },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Share link revoked successfully"));
  } catch (error) {
    next(error);
  }
};

// Share file with specific user by email or username
export const shareWithUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { targetIdentifier } = req.body;

    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new ApiError(404, "File not found");
    }

    if (file.userId !== userId) {
      throw new ApiError(403, "Forbidden: Only file owner can share file");
    }

    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: targetIdentifier }, { username: targetIdentifier }],
      },
    });

    if (!targetUser) {
      throw new ApiError(404, "Target user not found");
    }

    if (targetUser.id === userId) {
      throw new ApiError(400, "Cannot share file with yourself");
    }

    // Upsert SharedFile record to prevent duplicate shares
    const sharedFile = await prisma.sharedFile.upsert({
      where: {
        fileId_userId: { fileId: id, userId: targetUser.id },
      },
      update: {},
      create: {
        fileId: id,
        userId: targetUser.id,
      },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { sharedFile }, `File shared with ${targetUser.username}`));
  } catch (error) {
    next(error);
  }
};

// Unshare file from specific user
export const unshareWithUser = async (req, res, next) => {
  try {
    const { id, targetUserId } = req.params;
    const userId = req.user.id;

    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new ApiError(404, "File not found");
    }

    if (file.userId !== userId) {
      throw new ApiError(403, "Forbidden: Only file owner can modify shares");
    }

    await prisma.sharedFile.delete({
      where: {
        fileId_userId: { fileId: id, userId: targetUserId },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "File unshared successfully"));
  } catch (error) {
    next(error);
  }
};

// Get list of users a file is shared with (file owner only)
export const getFileSharedUsers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new ApiError(404, "File not found");
    }

    if (file.userId !== userId) {
      throw new ApiError(403, "Forbidden: Only file owner can view file shares");
    }

    const shares = await prisma.sharedFile.findMany({
      where: { fileId: id },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const sharedUsers = shares.map((s) => ({
      shareId: s.id,
      userId: s.user.id,
      username: s.user.username,
      email: s.user.email,
      sharedAt: s.createdAt,
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, { sharedUsers }, "Shared users retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

// List files shared with current user
export const getSharedWithMe = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const sharedRecords = await prisma.sharedFile.findMany({
      where: { userId },
      include: {
        file: {
          include: {
            user: {
              select: { id: true, username: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const files = sharedRecords.map((record) => record.file);

    return res
      .status(200)
      .json(new ApiResponse(200, { files }, "Shared files retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

// PUBLIC access to view/download file using share token (no authentication required)
export const getByShareToken = async (req, res, next) => {
  try {
    const { shareToken } = req.params;

    const file = await prisma.file.findUnique({
      where: { shareToken },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    if (!file || !file.isPublic) {
      throw new ApiError(404, "Share link not found or has been revoked");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { file }, "Public file retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
