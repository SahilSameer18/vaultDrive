import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { generalLimiter } from "./middlewares/rateLimit.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Trust reverse proxies (Render, Railway, Vercel, Nginx, Cloudflare) for accurate client IP identification
app.set("trust proxy", 1);

// Security HTTP headers via Helmet
// Cross-origin resource policies are relaxed to allow Cloudinary media delivery
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://res.cloudinary.com",
          "https://*.cloudinary.com",
          "https://*.googleusercontent.com",
          "https://lh3.googleusercontent.com",
        ],
        mediaSrc: ["'self'", "https://res.cloudinary.com"],
        frameSrc: [
          "'self'",
          "https://res.cloudinary.com",
          "https://docs.google.com",
          "https://*.google.com",
        ],
        connectSrc: [
          "'self'",
          "https://res.cloudinary.com",
          "https://api.cloudinary.com",
          "https://*.cloudinary.com",
        ],
        upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null,
      },
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// General rate limiter applied globally
app.use(generalLimiter);

// Body parsers & Cookie parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

import authRouter from "./routes/auth.routes.js";
import fileRouter from "./routes/file.routes.js";
import folderRouter from "./routes/folder.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import trashRouter from "./routes/trash.routes.js";

// Health check route
app.get("/", (req, res) => {
  res.json({ success: true, message: "VaultDrive API is running smoothly." });
});

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/folders", folderRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/trash", trashRouter);

// Global Error Handler
app.use(errorMiddleware);

export default app;

