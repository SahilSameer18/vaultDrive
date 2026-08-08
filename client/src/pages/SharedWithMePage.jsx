import { useEffect, useState } from "react";
import { filesApi } from "../api/files.api";
import { FileCategoryIcon } from "../utils/fileIcons";
import { formatBytes, formatDate } from "../utils/formatters";
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
        // Backend returns: new ApiResponse(200, { files }, "Shared files retrieved successfully")
        setSharedFiles(res.data.data.files || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load shared files");
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
          <span className="text-vault-text">Shared With Me</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-vault-text">
          Files Shared With You
        </h1>
      </div>

      {/* Content */}
      {loading ? (
        <FileSkeleton count={4} viewMode="grid" />
      ) : error ? (
        <div className="p-4 rounded-xl bg-vault-danger/10 border border-vault-danger/30 text-vault-danger text-xs font-mono">
          [ERROR] {error}
        </div>
      ) : sharedFiles.length === 0 ? (
        <div className="min-h-[350px] rounded-2xl border border-dashed border-vault-border bg-vault-panel/20 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-vault-panel border border-vault-accent/30 flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.75" />
              <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
              <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.75" />
              <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" stroke="currentColor" strokeWidth="1.75" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-vault-text">No Files Shared With You</h3>
          <p className="text-xs text-vault-muted mt-1 max-w-sm">
            When other VaultDrive users grant your username or email access to a file, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sharedFiles.map((file) => (
            <div
              key={file.id}
              className="p-4 rounded-2xl border border-vault-border bg-vault-panel hover:border-vault-accent/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-vault-surface border border-vault-border flex items-center justify-center">
                  <FileCategoryIcon mimetype={file.mimeType} className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded border border-vault-accent/30 bg-vault-accent/10 text-[9px] font-mono text-vault-accent">
                  SHARED
                </span>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-vault-text truncate mb-1" title={file.name}>
                  {file.name}
                </p>
                <p className="text-[10px] font-mono text-vault-muted">
                  {formatBytes(file.size)} • {formatDate(file.createdAt)}
                </p>
                {file.user && (
                  <p className="text-[10px] font-mono text-vault-accent mt-1">
                    Owner: @{file.user.username}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-vault-border gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewFile(file)}
                  className="px-3 py-1.5 rounded-lg border border-vault-border bg-vault-surface text-[10px] font-mono text-vault-text hover:border-vault-accent transition-colors flex items-center gap-1"
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

      {/* Preview Modal */}
      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />

    </div>
  );
}
