import { Router } from "express";
import {
  getTrashItems,
  getTrashFolderById,
  restoreItem,
  deletePermanently,
  emptyTrash,
} from "../controllers/trash.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// All Trash routes require authentication
router.use(authenticate);

// Fetch top-level trashed items & summary stats
router.get("/", getTrashItems);

// Empty entire trash (purges all trashed items and Cloudinary assets)
router.delete("/empty", emptyTrash);

// Fetch contents of a specific trashed folder (read-only view)
router.get("/folder/:id", getTrashFolderById);

// Restore a file or folder from Trash
router.patch("/:id/restore", restoreItem);

// Permanently delete a single file or folder
router.delete("/:id", deletePermanently);

export default router;
