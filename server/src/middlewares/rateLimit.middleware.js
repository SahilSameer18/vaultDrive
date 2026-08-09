import rateLimit from "express-rate-limit";

// General rate limiter for API endpoints (100 requests per 15 minutes)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Strict rate limiter for sensitive Auth endpoints (5 requests per 15 minutes to block brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login/registration attempts. Please try again after 15 minutes.",
  },
});
