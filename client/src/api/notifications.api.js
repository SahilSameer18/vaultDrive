import api from "./axios";

export const notificationsApi = {
  // Fetch recipient notifications list and unread count
  getNotifications: () => api.get("/notifications"),

  // Mark all unread notifications as read
  markAllAsRead: () => api.patch("/notifications/read-all"),

  // Mark single notification as read
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),

  // Delete notification
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};
