import { z } from "zod";

// Validation schema for user registration requests
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

// Validation schema for user login requests
export const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(1, "Email or username is required"),
    password: z.string().min(1, "Password is required"),
  }),
});

// Validation schema for Google OAuth login requests
export const googleLoginSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, "Google ID token is required"),
  }),
});

// Validation schema for updating user profile (username)
export const updateProfileSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  }),
});

// Validation schema for setting or changing a password
// currentPassword is optional at schema level — controller enforces it for password accounts
export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().optional(),
      newPassword: z.string().min(6, "New password must be at least 6 characters"),
      confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

// Validation schema for updating user avatar
export const updateAvatarSchema = z.object({
  body: z.object({
    avatarUrl: z.string().url("Invalid avatar URL").optional().nullable(),
  }),
});

