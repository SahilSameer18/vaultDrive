import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { filesApi } from "../api/files.api";
import { FileCategoryIcon } from "../utils/fileIcons";
import { formatBytes, formatDate } from "../utils/formatters";
import { handleFileDownload } from "../utils/download";
import FilePreviewModal from "../components/file/FilePreviewModal";
import FileSkeleton from "../components/ui/FileSkeleton";

export default function SharedWithMePage() {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await filesApi.getSharedWithMe();
        setSharedFiles(res.data.data.files || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load shared files");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6 fade-in select-none pb-12">
      
      {/* Header */}
      <div className="pb-4 border-b border-[var(--theme-border)]">
        <nav className="flex items-center gap-2 text-xs font-mono text-[var(--theme-text-muted)] mb-1">
          <Link to="/dashboard" className="text-[var(--theme-accent)] hover:underline flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
            ROOT
          </Link>
          <span className="text-[var(--theme-border)]">/</span>
          <span className="text-[var(--theme-text)]">Shared With Me</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--theme-text)]">
          Delegated Payloads
        </h1>
        <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
          Assets and files explicitly shared with your cryptographic account by other VaultDrive users.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <FileSkeleton count={4} viewMode="grid" />
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
          [ERROR] {error}
        </div>
      ) : sharedFiles.length === 0 ? (
        <div className="min-h-[350px] rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-panel)]/30 flex flex-col items-center justify-center p-8 text-center shadow-inner">
          <div className="w-14 h-14 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-accent)]/30 flex items-center justify-center mb-3 shadow-md">
            <svg className="w-7 h-7 text-[var(--theme-accent)]" viewBox="0 0 24 24" fill="none">
              <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.75" />
              <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
              <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.75" />
              <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" stroke="currentColor" strokeWidth="1.75" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[var(--theme-text)]">No Delegated Files</h3>
          <p className="text-xs text-[var(--theme-text-muted)] mt-1 max-w-sm leading-relaxed">
            When another user grants your username or email authorization to a payload, it will stream here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sharedFiles.map((file) => (
            <div
              key={file.id}
              className="p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] hover:border-[var(--theme-accent)]/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center shadow-inner group-hover:border-[var(--theme-accent)]/40 transition-colors">
                  <FileCategoryIcon mimetype={file.mimeType} className="w-5 h-5 text-[var(--theme-accent)] group-hover:scale-110 transition-transform" />
                </div>
                <span className="px-2 py-0.5 rounded-md border border-sky-500/30 bg-sky-500/10 text-[9px] font-mono text-sky-400 font-semibold tracking-wider">
                  DELEGATED
                </span>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-[var(--theme-text)] truncate mb-1 group-hover:text-[var(--theme-accent)] transition-colors" title={file.name}>
                  {file.name}
                </p>
                <p className="text-[10px] font-mono text-[var(--theme-text-muted)]">
                  {formatBytes(file.size)} <span className="opacity-40">•</span> {formatDate(file.createdAt)}
                </p>
                {file.user && (
                  <p className="text-[10px] font-mono text-[var(--theme-accent)] mt-1">
                    Owner: @{file.user.username}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--theme-border)]/60 gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewFile(file)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[10px] font-mono text-[var(--theme-text)] hover:border-[var(--theme-accent)]/50 hover:text-[var(--theme-accent)] transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  Inspect
                </button>
                <button
                  type="button"
                  onClick={() => handleFileDownload(file.url, file.name)}
                  className="p-1.5 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] rounded-lg transition-colors cursor-pointer"
                  title="Download"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />

    </div>
  );
}
