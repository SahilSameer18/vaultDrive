import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { notificationsApi } from "../../api/notifications.api";
import { filesApi } from "../../api/files.api";
import { formatDate } from "../../utils/formatters";
import FilePreviewModal from "../file/FilePreviewModal";

export default function NotificationDropdown() {
  const [open, setOpen]                   = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [previewFile, setPreviewFile]     = useState(null);
  const [loading, setLoading]             = useState(false);
  const dropdownRef                       = useRef(null);
  const navigate                          = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await notificationsApi.getNotifications();
      const { notifications: list, unreadCount: count } = res.data.data;
      setNotifications(list || []);
      setUnreadCount(count || 0);
    } catch {
      // Silently handle notification fetch failures
    }
  };

  // Fetch on mount and sync smartly (tab focus, local share actions, and gentle 15s interval when tab is visible)
  useEffect(() => {
    fetchNotifications();

    // Gentle 15s interval only when tab is actively visible to save bandwidth & CPU
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchNotifications();
      }
    }, 15000);

    const handleSync = () => {
      if (document.visibilityState === "visible") {
        fetchNotifications();
      }
    };

    window.addEventListener("focus", handleSync);
    window.addEventListener("vault:notifications-changed", handleSync);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleSync);
      window.removeEventListener("vault:notifications-changed", handleSync);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!open) {
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // Silently handle
    }
  };

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      try {
        await notificationsApi.markAsRead(n.id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
        );
      } catch {
        // Silently handle
      }
    }

    if (n.fileId) {
      try {
        setOpen(false);
        const res = await filesApi.getById(n.fileId);
        if (res.data?.data?.file) {
          setPreviewFile(res.data.data.file);
          return;
        }
      } catch {
        // Fallback navigation if file not directly viewable
      }
    }

    if (n.type === "FILE_SHARED") {
      setOpen(false);
      navigate("/shared-with-me");
    }
  };

  const handleDelete = async (e, id, isRead) => {
    e.stopPropagation();
    try {
      await notificationsApi.deleteNotification(id);
      if (!isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      // Silently handle
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-2 rounded-xl border border-vault-border bg-vault-panel text-vault-muted hover:text-vault-text hover:border-vault-accent/60 transition-all cursor-pointer"
        aria-label="Notifications"
        title="View Notifications"
      >
        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Unread Counter Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-vault-danger text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Glassmorphic Notifications Dropdown */}
      {open && (
        <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-96 rounded-2xl border border-vault-border bg-vault-panel/95 backdrop-blur-2xl shadow-2xl p-4 z-50 animate-scale-up select-none">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-vault-border mb-3">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-vault-text">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-vault-accent/20 border border-vault-accent/40 text-vault-accent font-mono text-[10px] font-semibold">
                  {unreadCount} UNREAD
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-mono text-vault-accent hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-vault-surface border border-vault-border flex items-center justify-center text-vault-muted mx-auto">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <p className="text-xs text-vault-muted">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                    n.isRead
                      ? "bg-vault-surface/40 border-vault-border/60 opacity-80 hover:opacity-100"
                      : "bg-vault-surface border-vault-accent/40 shadow-sm"
                  }`}
                >
                  {/* Category / Actor Icon */}
                  <div className="w-8 h-8 rounded-lg bg-vault-panel border border-vault-border flex items-center justify-center shrink-0 mt-0.5">
                    {n.type === "FILE_SHARED" ? (
                      <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none">
                        <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.75" />
                        <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
                        <circle cx="18" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.75" />
                        <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" stroke="currentColor" strokeWidth="1.75" />
                      </svg>
                    ) : n.type === "ACCESS_REVOKED" ? (
                      <svg className="w-4 h-4 text-vault-danger" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
                        <path d="m15 9-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none">
                        <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
                      </svg>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-7">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="text-xs font-semibold text-vault-text truncate">{n.title}</p>
                      {!n.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-vault-accent shrink-0" title="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-vault-muted leading-relaxed line-clamp-2">{n.message}</p>
                    <p className="text-[10px] font-mono text-vault-muted/70 mt-1">
                      {formatDate(n.createdAt)}
                    </p>
                  </div>

                  {/* Delete Item Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, n.id, n.isRead)}
                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-vault-muted hover:text-vault-danger transition-opacity absolute top-2 right-2 cursor-pointer z-10"
                    title="Dismiss notification"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* File Preview Modal for notification click actions */}
      {previewFile && (
        <FilePreviewModal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          file={previewFile}
        />
      )}
    </div>
  );
}

