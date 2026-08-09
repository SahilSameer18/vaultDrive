import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { filesApi } from "../api/files.api";
import { FileCategoryIcon } from "../utils/fileIcons";
import { formatBytes, formatDate } from "../utils/formatters";
import { handleFileDownload } from "../utils/download";
import FilePreviewModal from "../components/file/FilePreviewModal";

export default function PublicSharePage() {
  const { shareToken } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await filesApi.getByShareToken(shareToken);
        // Backend returns: new ApiResponse(200, { file }, "Public file retrieved successfully")
        setFile(res.data.data.file);
      } catch (err) {
        setError(err.response?.data?.message || "Public share link is invalid or has been revoked.");
      } finally {
        setLoading(false);
      }
    })();
  }, [shareToken]);

  return (
    <div className="min-h-screen bg-vault-bg text-vault-text font-sans flex flex-col justify-between relative selection:bg-vault-accent/30">
      
      {/* Background Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: `linear-gradient(#2A2E37 1px, transparent 1px), linear-gradient(90deg, #2A2E37 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Top Header Bar */}
      <header className="relative z-10 border-b border-vault-border bg-vault-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-vault-surface border border-vault-accent/40 flex items-center justify-center shadow-md group-hover:border-vault-accent transition-colors">
              <svg className="w-5 h-5 text-vault-accent" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight text-vault-text">VaultDrive</span>
          </Link>

          <span className="px-2.5 py-1 text-[10px] font-mono text-vault-success bg-vault-success/10 border border-vault-success/30 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-vault-success" />
            PUBLIC SHARE REPOSITORY
          </span>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center fade-in">
          
          {loading ? (
            <div className="py-12 flex items-center justify-center text-xs font-mono text-vault-muted">
              <span className="w-2 h-2 rounded-full bg-vault-accent animate-ping mr-2" />
              Decrypting public share link...
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-vault-panel border border-vault-danger/40 flex items-center justify-center text-vault-danger mx-auto">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-vault-text">Link Unavailable</h2>
              <p className="text-xs text-vault-muted leading-relaxed max-w-sm mx-auto">{error}</p>
              <Link
                to="/"
                className="inline-block mt-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-[#14161A] bg-vault-accent hover:bg-vault-accent-hover transition-colors shadow-md"
              >
                Return to Home
              </Link>
            </div>
          ) : file ? (
            <div className="p-8 rounded-2xl border border-vault-border bg-vault-panel shadow-2xl space-y-6 text-left">
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-2xl bg-vault-surface border border-vault-border flex items-center justify-center shrink-0">
                  <FileCategoryIcon mimetype={file.mimeType} className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded border border-vault-success/30 bg-vault-success/10 text-[10px] font-mono text-vault-success">
                  PUBLIC ACCESS
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-vault-text truncate mb-1">{file.name}</h2>
                <p className="text-xs font-mono text-vault-muted">
                  {formatBytes(file.size)} • Shared on {formatDate(file.createdAt)}
                </p>
                {file.user && (
                  <p className="text-xs font-mono text-vault-accent mt-1">
                    Shared by: @{file.user.username}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold border border-vault-border bg-vault-surface text-vault-text hover:border-vault-accent transition-colors"
                >
                  Preview File
                </button>
                <button
                  type="button"
                  onClick={() => handleFileDownload(file.url, file.name)}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-[#14161A] bg-gradient-to-r from-vault-accent to-vault-accent-hover hover:brightness-110 shadow-md transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  Download
                </button>
              </div>
            </div>
          ) : null}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-vault-border bg-vault-bg py-4 text-center text-xs font-mono text-vault-muted">
        VaultDrive Engine © 2027 • Encrypted Cloud Asset Repository
      </footer>

      {/* Preview Modal */}
      {file && (
        <FilePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          file={file}
        />
      )}

    </div>
  );
}
