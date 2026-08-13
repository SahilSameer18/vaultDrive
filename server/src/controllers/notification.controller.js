import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Fetch user notifications and unread count
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 30,
        include: {
          actor: {
            select: { id: true, username: true, avatarUrl: true },
          },
        },
      }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        { notifications, unreadCount },
        "Notifications retrieved successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

// Mark single notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { notification: updated }, "Notification marked as read"));
  } catch (error) {
    next(error);
  }
};

// Mark all user notifications as read
export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "All notifications marked as read"));
  } catch (error) {
    next(error);
  }
};

// Delete notification
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    await prisma.notification.delete({
      where: { id },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Notification deleted successfully"));
  } catch (error) {
    next(error);
  }
};
