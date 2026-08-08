import { useEffect, useState } from "react";
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
        const res = await filesApi.list(null);
        const allFiles = res.data.data.files || [];
        // Sort chronologically by newest first
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
    <div className="space-y-6 fade-in select-none">
      
      {/* Header */}
      <div className="pb-4 border-b border-vault-border">
        <nav className="flex items-center gap-2 text-xs font-mono text-vault-muted mb-1">
          <span className="text-vault-accent font-semibold">Repository</span>
          <span>/</span>
          <span className="text-vault-text">Recent Activity</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-vault-text">
          Recent Vault Activity
        </h1>
      </div>

      {/* Content */}
      {loading ? (
        <FileSkeleton count={5} viewMode="list" />
      ) : error ? (
        <div className="p-4 rounded-xl bg-vault-danger/10 border border-vault-danger/30 text-vault-danger text-xs font-mono">
          [ERROR] {error}
        </div>
      ) : recentFiles.length === 0 ? (
        <div className="min-h-[350px] rounded-2xl border border-dashed border-vault-border bg-vault-panel/20 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-vault-panel border border-vault-accent/30 flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-vault-text">No Recent Activity</h3>
          <p className="text-xs text-vault-muted mt-1 max-w-sm">
            Upload files or interact with assets to build your activity feed.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentFiles.map((file) => (
            <div
              key={file.id}
              className="p-3.5 rounded-xl border border-vault-border bg-vault-panel hover:border-vault-accent/40 transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <FileCategoryIcon mimetype={file.mimeType} className="w-5 h-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-vault-text truncate">{file.name}</p>
                  <p className="text-[10px] font-mono text-vault-muted mt-0.5">
                    Uploaded on {formatDate(file.createdAt)} • {formatBytes(file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewFile(file)}
                  className="px-3 py-1.5 rounded-lg border border-vault-border bg-vault-surface text-[10px] font-mono text-vault-text hover:border-vault-accent transition-colors"
                >
                  Preview
                </button>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="p-1.5 text-vault-muted hover:text-vault-accent transition-colors"
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
