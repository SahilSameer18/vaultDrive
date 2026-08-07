import { z } from "zod";

// Validation schema for updating file metadata (name, public status, folder)
export const updateFileSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Filename cannot be empty").optional(),
    isPublic: z.boolean().optional(),
    folderId: z.string().nullable().optional(),
  }),
});

// Validation schema for sharing file with another user by email or username
export const shareUserSchema = z.object({
  body: z.object({
    targetIdentifier: z.string().min(1, "Email or username of target user is required"),
  }),
});
