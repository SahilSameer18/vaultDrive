import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { filesApi } from "../api/files.api";
import { FileCategoryIcon } from "../utils/fileIcons";
import { formatBytes, formatDate } from "../utils/formatters";
import FilePreviewModal from "../components/file/FilePreviewModal";
import FileSkeleton from "../components/ui/FileSkeleton";

export default function RecentActivityPage() {
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await filesApi.list(null, { limit: 12 });
        const allFiles = res.data.data.files || [];
        const sorted = [...allFiles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentFiles(sorted.slice(0, 12));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load recent activity");
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
          <span className="text-[var(--theme-text)]">Recent Activity</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--theme-text)]">
          Audit Trail & Activity
        </h1>
        <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
          Chronological event feed of all payload ingests and modifications in your personal vault.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <FileSkeleton count={5} viewMode="list" />
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
          [ERROR] {error}
        </div>
      ) : recentFiles.length === 0 ? (
        <div className="min-h-[350px] rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-panel)]/30 flex flex-col items-center justify-center p-8 text-center shadow-inner">
          <div className="w-14 h-14 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-accent)]/30 flex items-center justify-center mb-3 shadow-md">
            <svg className="w-7 h-7 text-[var(--theme-accent)]" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[var(--theme-text)]">No Recent Activity Recorded</h3>
          <p className="text-xs text-[var(--theme-text-muted)] mt-1 max-w-sm leading-relaxed">
            Ingest assets or create directories to build your chronological telemetry log.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {recentFiles.map((file) => (
            <div
              key={file.id}
              className="p-3.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)] hover:border-[var(--theme-accent)]/50 hover:bg-[var(--theme-surface)]/60 transition-all flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center shrink-0 shadow-inner">
                  <FileCategoryIcon mimetype={file.mimeType} className="w-4 h-4 text-[var(--theme-accent)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--theme-text)] truncate">{file.name}</p>
                  <p className="text-[10px] font-mono text-[var(--theme-text-muted)] mt-0.5">
                    Ingested on {formatDate(file.createdAt)} <span className="opacity-40">•</span> {formatBytes(file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewFile(file)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[10px] font-mono text-[var(--theme-text)] hover:border-[var(--theme-accent)]/50 hover:text-[var(--theme-accent)] transition-colors cursor-pointer shadow-sm"
                >
                  Inspect
                </button>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="p-1.5 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] rounded-lg transition-colors cursor-pointer"
                  title="Download"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />

    </div>
  );
}
