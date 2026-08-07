import { Router } from "express";
import {
  uploadFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
  generateShareLink,
  revokeShareLink,
  shareWithUser,
  unshareWithUser,
  getSharedWithMe,
  getByShareToken,
} from "../controllers/file.controller.js";
import {
  updateFileSchema,
  shareUserSchema,
} from "../validators/file.validator.js";
import upload from "../config/multer.js";
import validate from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// PUBLIC Endpoint — Access file via shareable token (no authentication required)
router.get("/share/:shareToken", getByShareToken);

// All endpoints below require user authentication
router.use(authenticate);

// Upload single file (multipart form data)
router.post("/upload", upload.single("file"), uploadFile);

// List user owned files (supports pagination, search, sorting, folder filtering)
router.get("/", getFiles);

// List files shared with current user
router.get("/shared-with-me", getSharedWithMe);

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

// Share file with specific user by email or username
router.post("/:id/share-user", validate(shareUserSchema), shareWithUser);

// Unshare file from specific user
router.delete("/:id/share-user/:targetUserId", unshareWithUser);

export default router;
