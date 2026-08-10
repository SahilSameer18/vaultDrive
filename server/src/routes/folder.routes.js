import { Router } from "express";
import {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
} from "../controllers/folder.controller.js";
import {
  createFolderSchema,
  updateFolderSchema,
} from "../validators/folder.validator.js";
import validate from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// All folder endpoints require user authentication
router.use(authenticate);

// Create a new folder under root or inside a parent folder
router.post("/", validate(createFolderSchema), createFolder);

// List all folders owned by the user
router.get("/", getFolders);

// Fetch folder details including contained files and subfolders
router.get("/:id", getFolderById);

// Rename or move a folder (includes cycle guard against circular folder structures)
router.patch("/:id", validate(updateFolderSchema), updateFolder);

// Delete folder — subfolders are cascade-deleted; files inside are moved to root (folderId → null)
router.delete("/:id", deleteFolder);

export default router;

