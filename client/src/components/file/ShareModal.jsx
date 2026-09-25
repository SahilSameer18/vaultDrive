import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { filesApi } from "../../api/files.api";

export default function ShareModal({ isOpen, onClose, file, onShareUpdate }) {
  const [activeTab, setActiveTab]               = useState("link"); // "link" | "user"
  const [shareToken, setShareToken]             = useState(file?.shareToken || null);
  const [targetIdentifier, setTargetIdentifier] = useState("");
  const [sharedUsers, setSharedUsers]           = useState([]);
  const [loadingUsers, setLoadingUsers]         = useState(false);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState("");
  const [success, setSuccess]                   = useState("");

  const fetchSharedUsers = useCallback(async () => {
    if (!file?.id) return;
    setLoadingUsers(true);
    try {
      const res = await filesApi.getSharedUsers(file.id);
      setSharedUsers(res.data.data.sharedUsers || []);
    } catch {
      // Silently handle if unable to fetch shared users list
    } finally {
      setLoadingUsers(false);
    }
  }, [file]);

  useEffect(() => {
    if (file) {
      setShareToken(file.shareToken || null);
      setError("");
      setSuccess("");
      if (isOpen) {
        fetchSharedUsers();
      }
    }
  }, [file, isOpen, fetchSharedUsers]);

  if (!isOpen || !file) return null;

  const publicUrl = shareToken
    ? `${window.location.origin}/share/${shareToken}`
    : null;

  const handleGenerateLink = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await filesApi.generateShareLink(file.id);
      const { shareToken: newToken } = res.data.data;
      setShareToken(newToken);
      setSuccess("Public share link generated!");
      
      const updatedFile = { ...file, shareToken: newToken, isPublic: true };
      onShareUpdate && onShareUpdate(updatedFile);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate share link");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeLink = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await filesApi.revokeShareLink(file.id);
      setShareToken(null);
      setSuccess("Public share link revoked!");

      const updatedFile = { ...file, shareToken: null, isPublic: false };
      onShareUpdate && onShareUpdate(updatedFile);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to revoke share link");
    } finally {
      setLoading(false);
    }
  };

  const handleShareWithUser = async (e) => {
    e.preventDefault();
    if (!targetIdentifier.trim()) return;

    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await filesApi.shareWithUser(file.id, { targetIdentifier: targetIdentifier.trim() });
      setSuccess(`File shared with ${targetIdentifier.trim()}!`);
      setTargetIdentifier("");
      fetchSharedUsers();
      window.dispatchEvent(new CustomEvent("vault:notifications-changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to share file with user");
    } finally {
      setLoading(false);
    }
  };

  const handleUnshareUser = async (targetUserId, username) => {
    setError("");
    setSuccess("");
    try {
      await filesApi.unshareWithUser(file.id, targetUserId);
      setSuccess(`Access revoked for ${username}`);
      setSharedUsers((prev) => prev.filter((u) => u.userId !== targetUserId));
      window.dispatchEvent(new CustomEvent("vault:notifications-changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to revoke access");
    }
  };

  const copyToClipboard = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      setSuccess("Link copied to clipboard!");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] p-6 shadow-2xl z-10 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-4 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-accent)]/40 flex items-center justify-center text-[var(--theme-accent)] shrink-0 shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.75" />
                <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
                <circle cx="18" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.75" />
                <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base text-[var(--theme-text)] truncate">{file.name}</h3>
              <p className="text-[10px] font-mono text-[var(--theme-text-muted)] tracking-wider">SHARE & ACCESS DELEGATION</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:border-[var(--theme-accent)] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="text-xs font-bold">✕</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
            [ERROR] {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Physical Segmented Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] mb-5">
          <button
            type="button"
            onClick={() => setActiveTab("link")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === "link"
                ? "bg-[var(--theme-panel)] text-[var(--theme-accent)] font-semibold shadow-sm border border-[var(--theme-border)]"
                : "text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
            }`}
          >
            Public Gateway Link
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("user")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === "user"
                ? "bg-[var(--theme-panel)] text-[var(--theme-accent)] font-semibold shadow-sm border border-[var(--theme-border)]"
                : "text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
            }`}
          >
            User Delegation
          </button>
        </div>

        {/* Tab 1: Public Share Link */}
        {activeTab === "link" && (
          <div className="space-y-4">
            {publicUrl ? (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-[var(--theme-text)]">
                  Active Share Gateway URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicUrl}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-accent)] text-xs font-mono select-all focus:outline-none shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="px-4 py-2.5 rounded-xl border border-[var(--theme-accent)]/40 bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] text-xs font-mono font-semibold hover:bg-[var(--theme-accent)] hover:text-[#0d0f12] transition-all shrink-0 cursor-pointer shadow-sm"
                  >
                    Copy
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> GATEWAY ACTIVE
                  </span>
                  <button
                    type="button"
                    onClick={handleRevokeLink}
                    disabled={loading}
                    className="text-xs font-mono text-rose-400 hover:underline cursor-pointer"
                  >
                    Revoke Link
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 space-y-3">
                <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
                  No public gateway token is currently active for this payload. Generating a link allows any recipient to stream and verify this file.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateLink}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-xs font-mono font-semibold text-[#0d0f12] bg-[var(--theme-accent)] hover:brightness-110 transition-all shadow-md cursor-pointer"
                >
                  {loading ? "Generating..." : "Generate Public Gateway Link"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Share with Specific User */}
        {activeTab === "user" && (
          <div className="space-y-5">
            <form onSubmit={handleShareWithUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--theme-text)] mb-2">
                  Grant Explicit Access to Vault User
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={targetIdentifier}
                    onChange={(e) => setTargetIdentifier(e.target.value)}
                    placeholder="User email or username..."
                    required
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text)] text-xs placeholder:text-[var(--theme-text-muted)]/40 focus:border-[var(--theme-accent)] focus:outline-none shadow-inner transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading || !targetIdentifier.trim()}
                    className="px-4 py-2.5 rounded-xl text-xs font-mono font-semibold text-[#0d0f12] bg-[var(--theme-accent)] hover:brightness-110 disabled:opacity-50 transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    {loading ? "Granting..." : "Authorize"}
                  </button>
                </div>
              </div>
            </form>

            {/* List of users who currently have access */}
            <div className="border-t border-[var(--theme-border)] pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--theme-text)]">
                  Authorized Users ({sharedUsers.length})
                </span>
                {loadingUsers && (
                  <span className="text-[10px] font-mono text-[var(--theme-text-muted)] animate-pulse">Syncing…</span>
                )}
              </div>

              {sharedUsers.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-surface)]/40 text-center">
                  <p className="text-xs text-[var(--theme-text-muted)]">No users have been granted explicit delegated access.</p>
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                  {sharedUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="p-2.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)]/40 flex items-center justify-center text-[var(--theme-accent)] font-mono font-bold text-xs shrink-0">
                          {user.username?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[var(--theme-text)] truncate">{user.username}</p>
                          <p className="text-[10px] font-mono text-[var(--theme-text-muted)] truncate">{user.email}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUnshareUser(user.userId, user.username)}
                        className="px-2.5 py-1 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[11px] font-mono font-medium transition-colors shrink-0 cursor-pointer"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
