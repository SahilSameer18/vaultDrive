import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import validate from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

// Register new user account (rate limited to 5 req/15m to prevent registration spam)
router.post("/register", authLimiter, validate(registerSchema), register);

// Authenticate user with credentials (rate limited to 5 req/15m to block brute force)
router.post("/login", authLimiter, validate(loginSchema), login);

// Rotate refresh token and issue new access token
router.post("/refresh", refresh);

// Invalidate user refresh token session and clear auth cookies
router.post("/logout", logout);

// Fetch current authenticated user profile details
router.get("/me", authenticate, getMe);

export default router;
