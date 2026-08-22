import { Router } from "express";
import {
  getSignUpload,
  confirmUpload,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
  generateShareLink,
  revokeShareLink,
  shareWithUser,
  unshareWithUser,
  getFileSharedUsers,
  getSharedWithMe,
  getSharedByMe,
  getByShareToken,
  streamSharedFileContent,
  getStorageStats,
  batchTrashItems,
} from "../controllers/file.controller.js";
import {
  signUploadSchema,
  confirmUploadSchema,
  updateFileSchema,
  shareUserSchema,
} from "../validators/file.validator.js";
import validate from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// PUBLIC Endpoints — Access file metadata and secure streaming via shareable token (no auth required)
router.get("/share/:shareToken", getByShareToken);
router.get("/share/:shareToken/content", streamSharedFileContent);
router.head("/share/:shareToken/content", streamSharedFileContent);

// All endpoints below require user authentication
router.use(authenticate);

// Request Cloudinary direct upload HMAC signature
router.post("/sign-upload", validate(signUploadSchema), getSignUpload);

// Confirm completed Cloudinary upload and save record to DB
router.post("/confirm-upload", validate(confirmUploadSchema), confirmUpload);

// Get aggregated user storage usage stats (lightweight quota calculation)
router.get("/storage-stats", getStorageStats);

// List user owned files (supports pagination, search, sorting, folder filtering)
router.get("/", getFiles);

// List files shared with current user
router.get("/shared-with-me", getSharedWithMe);

// List files shared BY current user (public or shared with others)
router.get("/shared-by-me", getSharedByMe);

// Batch move multiple files and folders to Trash
router.post("/batch-trash", batchTrashItems);

// Get single file details (owner, public, or shared user)
router.get("/:id", getFileById);

// Update file metadata (rename, move folder, toggle public)
router.patch("/:id", validate(updateFileSchema), updateFile);

// Delete file from Cloudinary and database
router.delete("/:id", deleteFile);

// Generate public share link token
router.post("/:id/share-link", generateShareLink);

// Revoke public share link token
router.delete("/:id/share-link", revokeShareLink);

// Get list of users a file is shared with
router.get("/:id/share-user", getFileSharedUsers);

// Share file with specific user by email or username
router.post("/:id/share-user", validate(shareUserSchema), shareWithUser);

// Unshare file from specific user
router.delete("/:id/share-user/:targetUserId", unshareWithUser);

export default router;
