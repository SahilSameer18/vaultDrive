import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  googleLogin,
  updateProfile,
  changePassword,
  updateAvatar,
} from "../controllers/auth.controller.js";
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateAvatarSchema,
} from "../validators/auth.validator.js";
import validate from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  registerLimiter,
  loginLimiter,
  avatarLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

// Register new user account (rate limited to 10 req/15m)
router.post("/register", registerLimiter, validate(registerSchema), register);

// Authenticate user with credentials (rate limited to 10 failed req/15m)
router.post("/login", loginLimiter, validate(loginSchema), login);

// Authenticate Google OAuth ID token (rate limited to 10 failed req/15m)
router.post("/google", loginLimiter, validate(googleLoginSchema), googleLogin);

// Rotate refresh token and issue new access token
router.post("/refresh", refresh);

// Invalidate user refresh token session and clear auth cookies
router.post("/logout", logout);

// Fetch current authenticated user profile details
router.get("/me", authenticate, getMe);

// Update profile (username)
router.patch("/profile", authenticate, validate(updateProfileSchema), updateProfile);

// Update profile picture (avatar, rate limited to 15 req/15m)
router.patch("/avatar", authenticate, avatarLimiter, validate(updateAvatarSchema), updateAvatar);

// Set or change password (SET for OAuth users, CHANGE for password accounts)
router.patch("/change-password", authenticate, validate(changePasswordSchema), changePassword);

export default router;
