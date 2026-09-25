import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { filesApi } from "../api/files.api";
import { FileCategoryIcon } from "../utils/fileIcons";
import { formatBytes, formatDate } from "../utils/formatters";
import { useToast } from "../components/ui/Toast";
import FilePreviewModal from "../components/file/FilePreviewModal";
import ShareModal from "../components/file/ShareModal";
import FileSkeleton from "../components/ui/FileSkeleton";

export default function SharedByMePage() {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [manageFile, setManageFile]   = useState(null);
  const { addToast }                  = useToast();

  const fetchSharedByMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await filesApi.getSharedByMe();
      setSharedFiles(res.data.data.files || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load files shared by you");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSharedByMe();

    const handleFilesChanged = () => {
      fetchSharedByMe();
    };

    window.addEventListener("vault:files-changed", handleFilesChanged);
    return () => {
      window.removeEventListener("vault:files-changed", handleFilesChanged);
    };
  }, [fetchSharedByMe]);

  const copyShareLink = (shareToken) => {
    const origin = window.location.origin;
    const url = `${origin}/share/${shareToken}`;
    navigator.clipboard.writeText(url);
    addToast("Public share gateway link copied to clipboard!", "success");
  };

  const handleShareUpdate = (updatedFile) => {
    setManageFile(updatedFile);
    fetchSharedByMe();
  };

  const publicFilesCount = sharedFiles.filter((f) => f.isPublic).length;
  const userSharedCount = sharedFiles.filter((f) => f.sharedWith && f.sharedWith.length > 0).length;

  return (
    <div className="space-y-6 fade-in select-none pb-12">
      
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--theme-border)]">
        <div>
          <nav className="flex items-center gap-2 text-xs font-mono text-[var(--theme-text-muted)] mb-1">
            <Link to="/dashboard" className="text-[var(--theme-accent)] hover:underline flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
              ROOT
            </Link>
            <span className="text-[var(--theme-border)]">/</span>
            <span className="text-[var(--theme-text)] font-semibold">Shared by Me</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--theme-text)]">
            Distribution Channels
          </h1>
          <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
            Monitor and administer all active public links and delegated user authorizations.
          </p>
        </div>

        {/* Quick summary metrics */}
        {!loading && sharedFiles.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap font-mono">
            <span className="px-3 py-1.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)] text-xs text-[var(--theme-text-muted)] flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--theme-accent)]" />
              <strong className="text-[var(--theme-text)]">{sharedFiles.length}</strong> Total
              <span className="opacity-40">·</span>
              <span className="text-emerald-400 font-semibold">{publicFilesCount} Public</span>
              <span className="opacity-40">·</span>
              <span className="text-sky-400 font-semibold">{userSharedCount} Delegated</span>
            </span>
          </div>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      {loading ? (
        <FileSkeleton count={4} viewMode="grid" />
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
          [ERROR] {error}
        </div>
      ) : sharedFiles.length === 0 ? (
        <div className="min-h-[300px] rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-panel)]/30 flex flex-col items-center justify-center p-6 text-center shadow-inner">
          <div className="w-14 h-14 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-accent)]/30 flex items-center justify-center mb-4 shadow-xl">
            <svg className="w-7 h-7 text-[var(--theme-accent)]" viewBox="0 0 24 24" fill="none">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="16 6 12 2 8 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[var(--theme-text)] mb-1">No Distributed Assets</h3>
          <p className="text-xs text-[var(--theme-text-muted)] max-w-sm mb-6 leading-relaxed">
            You haven't issued any public links or delegated access to other users yet. You can activate sharing directly on any asset in your Vault.
          </p>

          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl text-xs font-mono font-semibold text-[#0d0f12] bg-[var(--theme-accent)] hover:brightness-110 transition-all shadow-md cursor-pointer"
          >
            Go to My Vault
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sharedFiles.map((file) => {
            const hasUsers = file.sharedWith && file.sharedWith.length > 0;

            return (
              <div
                key={file.id}
                className="p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] hover:border-[var(--theme-accent)]/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center shadow-inner group-hover:border-[var(--theme-accent)]/40 transition-colors">
                      <FileCategoryIcon mimetype={file.mimeType} className="w-5 h-5 text-[var(--theme-accent)] group-hover:scale-110 transition-transform" />
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-col items-end gap-1">
                      {file.isPublic && (
                        <span className="px-2 py-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-[9px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          PUBLIC LINK
                        </span>
                      )}
                      {hasUsers && (
                        <span className="px-2 py-0.5 rounded-md border border-sky-500/30 bg-sky-500/10 text-[9px] font-mono text-sky-400 font-semibold">
                          {file.sharedWith.length} {file.sharedWith.length === 1 ? "USER" : "USERS"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-[var(--theme-text)] truncate mb-1 group-hover:text-[var(--theme-accent)] transition-colors" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[10px] font-mono text-[var(--theme-text-muted)]">
                      {formatBytes(file.size)} <span className="opacity-40">•</span> {formatDate(file.updatedAt || file.createdAt)}
                    </p>

                    {/* Shared users avatars / pills */}
                    {hasUsers && (
                      <div className="mt-2.5 pt-2 border-t border-[var(--theme-border)]/50">
                        <span className="text-[9px] font-mono text-[var(--theme-text-muted)] block mb-1">Delegated:</span>
                        <div className="flex flex-wrap gap-1">
                          {file.sharedWith.slice(0, 3).map((s) => (
                            <span
                              key={s.id}
                              className="px-1.5 py-0.5 rounded bg-[var(--theme-surface)] text-[9px] font-mono text-[var(--theme-text)] border border-[var(--theme-border)] truncate max-w-[120px]"
                              title={s.user?.email || s.user?.username}
                            >
                              @{s.user?.username || "user"}
                            </span>
                          ))}
                          {file.sharedWith.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-[var(--theme-surface)] text-[9px] font-mono text-[var(--theme-text-muted)] border border-[var(--theme-border)]">
                              +{file.sharedWith.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-[var(--theme-border)]/60 space-y-2">
                  <div className="flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewFile(file)}
                      className="px-2.5 py-1.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[10px] font-mono text-[var(--theme-text)] hover:border-[var(--theme-accent)]/50 hover:text-[var(--theme-accent)] transition-colors flex-1 text-center cursor-pointer shadow-sm"
                    >
                      Inspect
                    </button>

                    <button
                      type="button"
                      onClick={() => setManageFile(file)}
                      className="px-2.5 py-1.5 rounded-lg border border-[var(--theme-accent)]/40 bg-[var(--theme-accent)]/10 text-[10px] font-mono text-[var(--theme-accent)] hover:bg-[var(--theme-accent)] hover:text-[#0d0f12] transition-all flex-1 text-center font-medium cursor-pointer shadow-sm"
                    >
                      Manage
                    </button>

                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="p-1.5 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] rounded-lg transition-colors cursor-pointer"
                      title="Download File"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>

                  {/* 1-Click Copy Public Link if file is public */}
                  {file.isPublic && file.shareToken && (
                    <button
                      type="button"
                      onClick={() => copyShareLink(file.shareToken)}
                      className="w-full py-1 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 text-[10px] font-mono text-emerald-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span>Copy Gateway URL</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Share & Permissions Modal */}
      <ShareModal
        isOpen={!!manageFile}
        onClose={() => setManageFile(null)}
        file={manageFile}
        onShareUpdate={handleShareUpdate}
      />

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />

    </div>
  );
}
