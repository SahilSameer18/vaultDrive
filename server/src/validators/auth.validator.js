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


