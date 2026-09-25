import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { filesApi } from "../api/files.api";
import { FileCategoryIcon } from "../utils/fileIcons";
import { formatBytes, formatDate } from "../utils/formatters";
import { handleFileDownload } from "../utils/download";
import FilePreviewModal from "../components/file/FilePreviewModal";
import VaultLoadingScreen from "../components/ui/VaultLoadingScreen";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const API_ORIGIN = API_URL.replace(/\/api\/v1\/?$/, "");

const resolveContentUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function PublicSharePage() {
  const { shareToken } = useParams();
  const [file, setFile] = useState(null);
  const [contentUrl, setContentUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const hasRetriedRef = useRef(false);

  const fetchShareMetadata = useCallback(async () => {
    try {
      const res = await filesApi.getByShareToken(shareToken);
      const rawFile = res.data.data.file;
      const rawContentUrl = res.data.data.contentUrl;
      const resolvedUrl = resolveContentUrl(rawContentUrl);
      setFile(rawFile);
      setContentUrl(resolvedUrl);
      return resolvedUrl;
    } catch (err) {
      setError(err.response?.data?.message || "Public share link is invalid, expired, or has been revoked.");
      return null;
    }
  }, [shareToken]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      await fetchShareMetadata();
      setLoading(false);
    })();
  }, [fetchShareMetadata]);

  // Transparent single-retry token refresher on 401/403 expiration
  const handleRefreshContentUrl = async () => {
    if (hasRetriedRef.current) return null;
    hasRetriedRef.current = true;
    return await fetchShareMetadata();
  };

  const onDownloadClick = async () => {
    if (!contentUrl || !file) return;
    try {
      setDownloading(true);
      await handleFileDownload(contentUrl, file.name);
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  if (loading) {
    return (
      <VaultLoadingScreen
        message="Verifying cryptographic token & decrypting payload…"
        headerTag="✦ SECURED GATEWAY ✦"
        footerTag="Institutional Key Verification"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--color-vault-text)] font-sans flex flex-col justify-between relative selection:bg-vault-accent/30 selection:text-white overflow-x-hidden">
      
      {/* Background Architectural Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[450px] bg-gradient-to-b from-vault-accent/[0.08] via-transparent to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--theme-bg)_85%)]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]/80 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-accent rounded-lg p-1">
            <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface)] border border-vault-accent/40 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-[var(--color-vault-text)]">VaultDrive</span>
              <span className="text-[9px] font-mono tracking-widest text-[var(--color-vault-muted)] uppercase">Public Handover</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-md flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">GATEWAY // </span>TLS 1.3 SECURED
            </span>
          </div>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl text-center">
          
          {error ? (
            /* Error State Chassis */
            <div className="depth-vault-chassis rounded-2xl p-6 sm:p-10 border border-rose-500/30 text-center space-y-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
              
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-inner">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-rose-400 font-semibold">
                  GATEWAY EXCEPTION 404
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-vault-text)] mt-1">
                  Access Restricted or Revoked
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-vault-muted)] mt-2 leading-relaxed max-w-md mx-auto">
                  {error}
                </p>
              </div>

              {/* Monospace diagnostic panel */}
              <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-3 text-left font-mono text-[10px] sm:text-[11px] space-y-1 text-[var(--color-vault-muted)]">
                <div className="flex justify-between border-b border-[var(--theme-border)] pb-1.5 mb-1.5 text-[9px] tracking-wider text-[var(--color-vault-muted)]">
                  <span>ERR_SECURITY_HANDSHAKE</span>
                  <span className="text-rose-400">DENIED</span>
                </div>
                <div>TOKEN: {shareToken ? `${shareToken.substring(0, 12)}...` : "NONE"}</div>
                <div>POLICY: ONE_TIME_OR_REVOKED</div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/"
                  className="tactile-btn px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-vault-accent hover:bg-vault-accent-hover transition-colors shadow-md text-center"
                >
                  Return to Main Portal
                </Link>
              </div>
            </div>
          ) : file ? (
            /* Verified File Payload Chassis */
            <div className="depth-vault-chassis rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-2xl overflow-hidden text-left relative">
              
              {/* Header Telemetry Ribbon */}
              <div className="px-5 sm:px-7 py-3 border-b border-[var(--theme-border)] bg-[var(--theme-panel)]/50 flex items-center justify-between text-[10px] font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  AUTHENTICATED ASSET
                </span>
                <span className="text-[var(--color-vault-muted)]">
                  ENCRYPTED REPOSITORY
                </span>
              </div>

              {/* Main Payload Card Body */}
              <div className="p-5 sm:p-7 space-y-6">
                
                {/* File Icon & Identity Header */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--theme-bg)] border border-[var(--theme-border)] flex items-center justify-center shrink-0 shadow-inner group">
                    <FileCategoryIcon mimetype={file.mimeType} className="w-7 h-7 sm:w-8 sm:h-8 text-vault-accent transition-transform group-hover:scale-110" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-vault-accent/10 border border-vault-accent/30 text-vault-accent">
                        {file.mimeType?.split("/")[1] || "FILE"}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--color-vault-muted)]">
                        {formatBytes(file.size)}
                      </span>
                    </div>
                    <h1 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] truncate" title={file.name}>
                      {file.name}
                    </h1>
                    <p className="text-xs text-[var(--color-vault-muted)] mt-0.5 font-mono">
                      Timestamp: {formatDate(file.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Sender & Security Attribute Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)]">
                    <div className="text-[9px] uppercase tracking-wider text-[var(--color-vault-muted)] mb-1">
                      Origin Signer
                    </div>
                    <div className="text-[var(--color-vault-text)] font-semibold truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-vault-accent" />
                      {file.user?.name || file.user?.username ? `@${file.user.username || file.user.name}` : "Verified Vault Member"}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)]">
                    <div className="text-[9px] uppercase tracking-wider text-[var(--color-vault-muted)] mb-1">
                      Transport Cipher
                    </div>
                    <div className="text-emerald-400 font-semibold truncate flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      End-To-End Direct Stream
                    </div>
                  </div>
                </div>

                {/* Action Handlers */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-semibold border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--color-vault-text)] hover:border-vault-accent hover:bg-[var(--theme-panel)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <svg className="w-4 h-4 text-[var(--color-vault-muted)]" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Preview Asset
                  </button>

                  <button
                    type="button"
                    onClick={onDownloadClick}
                    disabled={downloading}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-vault-accent hover:bg-vault-accent-hover transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-vault-accent/20 active:scale-98 disabled:opacity-60 tactile-btn"
                  >
                    {downloading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Streaming...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Download Encrypted File</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Institutional Assurance Footer */}
              <div className="px-5 sm:px-7 py-3 bg-[var(--theme-bg)]/60 border-t border-[var(--theme-border)] flex items-center justify-between text-[9px] font-mono text-[var(--color-vault-muted)]">
                <span>RECIPIENT_PROTOCOL // DIRECT_VERIFIED</span>
                <Link to="/privacy" className="hover:text-[var(--color-vault-text)] underline">
                  Security Disclosures
                </Link>
              </div>

            </div>
          ) : null}

        </div>
      </main>

      {/* Persistent Page Footer */}
      <footer className="relative z-10 border-t border-[var(--theme-border)] bg-[var(--theme-bg)] py-4 text-center text-[10px] font-mono text-[var(--color-vault-muted)] flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 px-4">
        <span>VAULTDRIVE ENGINE © 2027</span>
        <span className="hidden sm:inline opacity-30">•</span>
        <span>END-TO-END ENCRYPTED</span>
        <span className="hidden sm:inline opacity-30">•</span>
        <Link to="/" className="text-vault-accent hover:underline">
          Return to Portal
        </Link>
      </footer>

      {/* Modal Preview Layer */}
      {file && (
        <FilePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          file={{ ...file, url: contentUrl }}
          onRefreshUrl={handleRefreshContentUrl}
        />
      )}

    </div>
  );
}
