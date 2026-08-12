import { Router } from "express";
import {
  register,

  login,
  refresh,
  logout,
  getMe,
  googleLogin,
  demoLogin,
} from "../controllers/auth.controller.js";
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
} from "../validators/auth.validator.js";
import validate from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  registerLimiter,
  loginLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

// Register new user account (rate limited to 10 req/15m)
router.post("/register", registerLimiter, validate(registerSchema), register);

// Authenticate user with credentials (rate limited to 10 failed req/15m)
router.post("/login", loginLimiter, validate(loginSchema), login);

// Authenticate Google OAuth ID token (rate limited to 10 failed req/15m)
router.post("/google", loginLimiter, validate(googleLoginSchema), googleLogin);

// 1-Click Demo Login for Reviewers
router.post("/demo-login", loginLimiter, demoLogin);




// Rotate refresh token and issue new access token
router.post("/refresh", refresh);

// Invalidate user refresh token session and clear auth cookies
router.post("/logout", logout);

// Fetch current authenticated user profile details
router.get("/me", authenticate, getMe);

export default router;

