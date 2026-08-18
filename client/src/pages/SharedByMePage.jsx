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
    addToast("Public share link copied to clipboard!", "success");
  };

  const handleShareUpdate = (updatedFile) => {
    setManageFile(updatedFile);
    // If access was completely revoked, update list or re-fetch
    fetchSharedByMe();
  };

  const publicFilesCount = sharedFiles.filter((f) => f.isPublic).length;
  const userSharedCount = sharedFiles.filter((f) => f.sharedWith && f.sharedWith.length > 0).length;

  return (
    <div className="space-y-6 fade-in select-none">
      
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-vault-border">
        <div>
          <nav className="flex items-center gap-2 text-xs font-mono text-vault-muted mb-1">
            <Link to="/dashboard" className="text-vault-accent hover:underline">Repository</Link>
            <span>/</span>
            <span className="text-vault-text font-semibold">Shared by Me</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-vault-text">
            Files Shared by You
          </h1>
          <p className="text-xs text-vault-muted mt-0.5">
            Monitor and manage all files you have shared publicly or with specific users.
          </p>
        </div>

        {/* Quick summary metrics */}
        {!loading && sharedFiles.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1.5 rounded-xl border border-vault-border bg-vault-panel text-xs font-mono text-vault-muted flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-vault-accent" />
              {sharedFiles.length} {sharedFiles.length === 1 ? "File" : "Files"} Shared
            </span>
          </div>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      {loading ? (
        <FileSkeleton count={4} viewMode="grid" />
      ) : error ? (
        <div className="p-4 rounded-xl bg-vault-danger/10 border border-vault-danger/30 text-vault-danger text-xs font-mono">
          [ERROR] {error}
        </div>
      ) : sharedFiles.length === 0 ? (
        <div className="min-h-[300px] rounded-2xl border border-dashed border-vault-border bg-vault-panel/20 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-vault-panel border border-vault-accent/30 flex items-center justify-center mb-4 shadow-xl">
            <svg className="w-7 h-7 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="16 6 12 2 8 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-vault-text mb-1">No Shared Files</h3>
          <p className="text-xs text-vault-muted max-w-sm mb-6">
            You haven't shared any files yet. You can create public links or invite users directly from your Vault.
          </p>

          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#14161A] bg-vault-accent hover:bg-vault-accent-hover transition-colors shadow-md cursor-pointer"
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
                className="p-4 rounded-2xl border border-vault-border bg-vault-panel hover:border-vault-accent/40 transition-[border-color,box-shadow] duration-150 flex flex-col justify-between group shadow-sm"
              >
                {/* Top Info */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-vault-surface border border-vault-border flex items-center justify-center">
                      <FileCategoryIcon mimetype={file.mimeType} className="w-5 h-5" />
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-col items-end gap-1">
                      {file.isPublic && (
                        <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-[9px] font-mono text-emerald-400 flex items-center gap-1 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          PUBLIC LINK
                        </span>
                      )}
                      {hasUsers && (
                        <span className="px-2 py-0.5 rounded border border-sky-500/30 bg-sky-500/10 text-[9px] font-mono text-sky-400 font-medium">
                          {file.sharedWith.length} {file.sharedWith.length === 1 ? "USER" : "USERS"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-vault-text truncate mb-1" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[10px] font-mono text-vault-muted">
                      {formatBytes(file.size)} • {formatDate(file.updatedAt || file.createdAt)}
                    </p>

                    {/* Shared users avatars / pills */}
                    {hasUsers && (
                      <div className="mt-2 pt-2 border-t border-vault-border/50">
                        <span className="text-[9px] font-mono text-vault-muted block mb-1">Shared with:</span>
                        <div className="flex flex-wrap gap-1">
                          {file.sharedWith.slice(0, 3).map((s) => (
                            <span
                              key={s.id}
                              className="px-1.5 py-0.5 rounded bg-vault-surface text-[9px] font-mono text-vault-text/80 border border-vault-border truncate max-w-[120px]"
                              title={s.user?.email || s.user?.username}
                            >
                              @{s.user?.username || "user"}
                            </span>
                          ))}
                          {file.sharedWith.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-vault-surface text-[9px] font-mono text-vault-muted border border-vault-border">
                              +{file.sharedWith.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-vault-border space-y-2">
                  <div className="flex items-center justify-between gap-1.5">
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewFile(file)}
                      className="px-2.5 py-1.5 rounded-lg border border-vault-border bg-vault-surface text-[10px] font-mono text-vault-text hover:border-vault-accent transition-colors flex-1 text-center cursor-pointer"
                    >
                      Preview
                    </button>

                    {/* Manage Share / Access */}
                    <button
                      type="button"
                      onClick={() => setManageFile(file)}
                      className="px-2.5 py-1.5 rounded-lg border border-vault-accent/40 bg-vault-accent/10 text-[10px] font-mono text-vault-accent hover:bg-vault-accent/20 transition-colors flex-1 text-center font-medium cursor-pointer"
                    >
                      Manage
                    </button>

                    {/* Download */}
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="p-1.5 text-vault-muted hover:text-vault-accent transition-colors"
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
                      className="w-full py-1 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 text-[10px] font-mono text-emerald-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Copy Public Link
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
