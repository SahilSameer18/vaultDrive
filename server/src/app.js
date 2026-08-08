import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { generalLimiter } from "./middlewares/rateLimit.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Security HTTP headers
// app.use(helmet());

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

// Health check route
app.get("/", (req, res) => {
  res.json({ success: true, message: "VaultDrive API is running smoothly." });
});

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/folders", folderRouter);

// Global Error Handler
app.use(errorMiddleware);

export default app;

