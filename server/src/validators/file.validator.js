import { z } from "zod";

// Validation schema for requesting Cloudinary direct upload signature
export const signUploadSchema = z.object({
  body: z.object({
    filename: z.string().min(1, "Filename is required"),
    mimeType: z.string().min(1, "Mime type is required"),
    folderId: z.string().nullable().optional(),
  }),
});

// Validation schema for confirming completed Cloudinary upload
export const confirmUploadSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Filename is required"),
    size: z.number().positive("File size must be positive"),
    mimeType: z.string().min(1, "Mime type is required"),
    resourceType: z.enum(["image", "video", "raw"]).default("image"),
    url: z.string().url("Invalid Cloudinary URL"),
    publicId: z.string().min(1, "Public ID is required"),
    folderId: z.string().nullable().optional(),
  }),
});

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

