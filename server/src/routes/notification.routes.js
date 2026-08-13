import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// All notification endpoints require user authentication
router.use(authenticate);

// List current user's notifications and unread count
router.get("/", getNotifications);

// Mark all notifications as read
router.patch("/read-all", markAllAsRead);

// Mark single notification as read
router.patch("/:id/read", markAsRead);

// Delete notification
router.delete("/:id", deleteNotification);

export default router;
