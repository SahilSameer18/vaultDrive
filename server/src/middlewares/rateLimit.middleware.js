import rateLimit from "express-rate-limit";

// General rate limiter for API endpoints (500 requests per 15 minutes)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Rate limiter for Registration endpoint (10 attempts per 15 minutes)
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again after 15 minutes.",
  },
});

// Rate limiter for Login endpoints (10 failed attempts per 15 minutes; successful logins skip counting)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true, // Only failed logins count
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

