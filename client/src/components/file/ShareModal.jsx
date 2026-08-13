import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { filesApi } from "../../api/files.api";

export default function ShareModal({ isOpen, onClose, file, onShareUpdate }) {
  const [activeTab, setActiveTab]               = useState("link"); // "link" | "user"
  const [shareToken, setShareToken]             = useState(file?.shareToken || null);
  const [targetIdentifier, setTargetIdentifier] = useState("");
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState("");
  const [success, setSuccess]                   = useState("");

  useEffect(() => {
    if (file) {
      setShareToken(file.shareToken || null);
      setError("");
      setSuccess("");
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const publicUrl = shareToken
    ? `${window.location.origin}/share/${shareToken}`
    : null;

  // Generate public share link
  const handleGenerateLink = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await filesApi.generateShareLink(file.id);
      // Backend returns: new ApiResponse(200, { shareToken: updatedFile.shareToken, shareUrl }, "...")
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

  // Revoke public share link
  const handleRevokeLink = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // Backend returns: new ApiResponse(200, null, "...") — res.data.data is null
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

  // Share with specific user by targetIdentifier
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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to share file with user");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      setSuccess("Link copied to clipboard!");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-vault-border bg-vault-panel p-6 shadow-2xl z-10 fade-in select-none">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-vault-border pb-4 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-vault-surface border border-vault-accent/40 flex items-center justify-center text-vault-accent shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.75" />
                <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
                <circle cx="18" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.75" />
                <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base text-vault-text truncate">{file.name}</h3>
              <p className="text-[10px] font-mono text-vault-muted">Share Management</p>
            </div>
          </div>

          <button type="button" onClick={onClose} className="text-vault-muted hover:text-vault-text text-sm p-1">
            ✕
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-vault-danger/10 border border-vault-danger/30 text-vault-danger text-xs font-mono">
            [ERROR] {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-vault-success/10 border border-vault-success/30 text-vault-success text-xs font-mono">
            [SUCCESS] {success}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl border border-vault-border bg-vault-surface mb-5">
          <button
            type="button"
            onClick={() => setActiveTab("link")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === "link" ? "bg-vault-panel text-vault-accent font-semibold shadow-sm" : "text-vault-muted hover:text-vault-text"
            }`}
          >
            Public Share Link
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("user")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === "user" ? "bg-vault-panel text-vault-accent font-semibold shadow-sm" : "text-vault-muted hover:text-vault-text"
            }`}
          >
            User Access
          </button>
        </div>

        {/* Tab 1: Public Share Link */}
        {activeTab === "link" && (
          <div className="space-y-4">
            {publicUrl ? (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-vault-text">
                  Active Public Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicUrl}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-vault-surface border border-vault-border text-vault-accent text-xs font-mono select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="px-3.5 py-2.5 rounded-xl border border-vault-accent/40 bg-vault-accent/10 text-vault-accent text-xs font-semibold hover:bg-vault-accent/20 transition-colors shrink-0"
                  >
                    Copy
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-vault-success flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-vault-success" /> LINK ACTIVE
                  </span>
                  <button
                    type="button"
                    onClick={handleRevokeLink}
                    disabled={loading}
                    className="text-xs font-mono text-vault-danger hover:underline"
                  >
                    Revoke Link
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-vault-muted">
                  No public share link is active for this file. Generate a share link to make it accessible to anyone with the URL.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateLink}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#14161A] bg-vault-accent hover:bg-vault-accent-hover transition-colors shadow-md"
                >
                  {loading ? "Generating..." : "Generate Public Link"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Share with Specific User */}
        {activeTab === "user" && (
          <form onSubmit={handleShareWithUser} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-vault-text mb-2">
                User Email or Username
              </label>
              <input
                type="text"
                value={targetIdentifier}
                onChange={(e) => setTargetIdentifier(e.target.value)}
                placeholder="e.g. alice@vault.com or alice"
                required
                className="w-full px-4 py-3 rounded-xl bg-vault-surface border border-vault-border text-vault-text text-sm placeholder:text-vault-muted/40 focus:border-vault-accent focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || !targetIdentifier.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#14161A] bg-vault-accent hover:bg-vault-accent-hover disabled:opacity-50 transition-colors shadow-md"
              >
                {loading ? "Sharing..." : "Grant Access"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>,
    document.body
  );
}
