import { z } from "zod";

// Validation schema for creating a new folder
export const createFolderSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Folder name is required").max(100, "Folder name too long"),
    parentId: z.string().nullable().optional(),
  }),
});

// Validation schema for updating or moving a folder
export const updateFolderSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Folder name cannot be empty").max(100, "Folder name too long").optional(),
    parentId: z.string().nullable().optional(),
  }),
});
