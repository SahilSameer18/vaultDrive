import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { formatBytes, formatDate } from "../../utils/formatters";
import { getFileCategory } from "../../utils/fileIcons";
import { handleFileDownload } from "../../utils/download";

// Helper to infer preview category from filename extension and mimeType
function inferCategory(filename = "", mimeType = "") {
  const ext = filename?.split(".").pop()?.toLowerCase();
  const type = mimeType?.toLowerCase() || "";

  if (["png", "jpg", "jpeg", "webp", "gif", "svg", "bmp", "ico"].includes(ext) || type.startsWith("image/")) return "image";
  if (["mp4", "webm", "mov", "mkv", "avi"].includes(ext) || type.startsWith("video/")) return "video";
  if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(ext) || type.startsWith("audio/")) return "audio";
  if (ext === "pdf" || type.includes("pdf")) return "pdf";
  if (
    ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv", "rtf", "odt", "ods", "odp"].includes(ext) ||
    type.includes("word") ||
    type.includes("officedocument") ||
    type.includes("excel") ||
    type.includes("spreadsheet") ||
    type.includes("powerpoint") ||
    type.includes("presentation") ||
    type.includes("msword")
  ) {
    return "office";
  }
  if (
    ["js", "jsx", "ts", "tsx", "html", "css", "json", "txt", "md", "py", "java", "c", "cpp", "go", "rs", "sql", "sh", "yaml", "yml", "xml"].includes(ext) ||
    type.startsWith("text/") ||
    type.includes("json") ||
    type.includes("javascript")
  ) {
    return "code";
  }
  return "file";
}

export default function FilePreviewModal({ isOpen, onClose, file, onRefreshUrl }) {
  const [textContent, setTextContent] = useState("");
  const [loadingText, setLoadingText] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  const category = file ? inferCategory(file.name, file.mimeType) : "file";
  const isGatekeeperUrl = Boolean(file?.url && (file.url.includes("/share/") || file.url.includes("/content")));

  // Reset error state on file change
  useEffect(() => {
    setMediaError(false);
  }, [file?.url]);

  // Global Escape key listener
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose && onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle media load error via HEAD probe check
  const handleMediaError = async () => {
    if (!file?.url) return;
    try {
      const check = await fetch(file.url, { method: "HEAD" });
      if (check.status === 401 || check.status === 403) {
        if (onRefreshUrl) {
          const refreshed = await onRefreshUrl();
          if (refreshed) {
            setMediaError(false);
            return;
          }
        }
      }
      setMediaError(true);
    } catch {
      setMediaError(true);
    }
  };

  // Fetch text file contents if code/text file
  useEffect(() => {
    if (file && (category === "code" || file.mimeType?.includes("text") || file.mimeType?.includes("json"))) {
      setLoadingText(true);
      fetch(file.url)
        .then((res) => {
          if (res.status === 401 || res.status === 403) {
            handleMediaError();
            throw new Error("Unauthorized or expired");
          }
          return res.text();
        })
        .then((data) => {
          setTextContent(data.slice(0, 10000));
          setLoadingText(false);
        })
        .catch(() => {
          setTextContent("Unable to load text preview.");
          setLoadingText(false);
        });
    }
  }, [file, category]);

  if (!isOpen || !file) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 select-none font-sans">
      
      {/* ── Fullscreen Dark Backdrop ─────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* ── Modal Card Container (Centered in viewport) ───────────────────── */}
      <div className="relative z-[100000] w-full max-w-4xl h-[85vh] rounded-2xl border border-vault-border bg-vault-panel flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        
        {/* ── Clean Header Bar ────────────────────────────────────────────── */}
        <div className="px-5 py-3.5 border-b border-vault-border flex items-center justify-between bg-vault-surface shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
            <div className="w-8 h-8 rounded-lg bg-vault-panel border border-vault-accent/40 flex items-center justify-center text-vault-accent shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke="currentColor" strokeWidth="1.75" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-vault-text truncate">{file.name}</h3>
              <p className="text-[10px] font-mono text-vault-muted">
                {formatBytes(file.size)} • {formatDate(file.createdAt)}
              </p>
            </div>
          </div>

          {/* Action buttons: Download & Close Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleFileDownload(file.url, file.name)}
              className="px-3 py-1.5 rounded-lg border border-vault-accent/40 bg-vault-accent/10 text-vault-accent text-xs font-semibold hover:bg-vault-accent/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-vault-border bg-vault-panel text-vault-muted hover:text-vault-text hover:border-vault-accent flex items-center justify-center transition-colors cursor-pointer"
              title="Close Preview (Esc)"
            >
              <span className="text-sm font-bold">✕</span>
            </button>
          </div>
        </div>

        {/* ── Media Preview Body Viewport ─────────────────────────────────── */}
        <div className="flex-1 bg-vault-bg p-4 overflow-hidden flex items-center justify-center relative">
          {mediaError ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-vault-danger/10 border border-vault-danger/30 flex items-center justify-center text-vault-danger mx-auto">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-vault-text">Unable to load media preview</p>
                <p className="text-xs text-vault-muted mt-1">Access token may have expired or file was moved to Trash.</p>
              </div>
              <button
                type="button"
                onClick={() => handleFileDownload(file.url, file.name)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-vault-bg bg-vault-accent hover:bg-vault-accent-hover transition-colors shadow-md"
              >
                Download File Instead
              </button>
            </div>
          ) : category === "image" ? (
            <img
              key={file.url}
              src={file.url}
              alt={file.name}
              onError={handleMediaError}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-vault-border"
            />
          ) : category === "video" ? (
            <video
              key={file.url}
              src={file.url}
              controls
              autoPlay
              onError={handleMediaError}
              className="max-h-full max-w-full rounded-xl shadow-2xl border border-vault-border"
            />
          ) : category === "audio" ? (
            <div className="w-full max-w-md p-8 rounded-2xl border border-vault-border bg-vault-panel text-center shadow-xl space-y-6">
              <div className="w-16 h-16 rounded-full bg-vault-accent/15 border border-vault-accent/40 flex items-center justify-center text-vault-accent mx-auto">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
                  <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-vault-text truncate">{file.name}</h4>
                <p className="text-xs font-mono text-vault-muted mt-1">{formatBytes(file.size)}</p>
              </div>
              <audio key={file.url} src={file.url} controls onError={handleMediaError} className="w-full" />
            </div>
          ) : category === "pdf" ? (
            <iframe
              key={file.url}
              src={
                // On mobile phones, use Google Docs Viewer so Android Chrome & iOS Safari render multi-page PDFs cleanly inside iframe
                typeof window !== "undefined" &&
                (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768) &&
                file.url.startsWith("http") &&
                !isGatekeeperUrl
                  ? `https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=true`
                  : file.url
              }
              title={file.name}
              onError={handleMediaError}
              className="w-full h-full rounded-xl border border-vault-border bg-white shadow-2xl"
            />
          ) : category === "office" ? (
            isGatekeeperUrl ? (
              // Office docs via Gatekeeper: show protected download card to prevent leaking to third-party Google viewers
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-vault-panel border border-vault-border flex items-center justify-center text-vault-accent mx-auto shadow-lg">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.75" />
                    <path d="M14 2v6h6M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-vault-text">Protected Office Document</p>
                  <p className="text-xs text-vault-muted mt-1 max-w-sm mx-auto">
                    Direct browser preview is disabled on shared links to keep document contents private. Download to view safely.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleFileDownload(file.url, file.name)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-vault-bg bg-vault-accent hover:bg-vault-accent-hover transition-colors shadow-md cursor-pointer"
                  >
                    Download Document
                  </button>
                </div>
              </div>
            ) : (
              <iframe
                key={file.url}
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=true`}
                title={file.name}
                className="w-full h-full rounded-xl border border-vault-border bg-white shadow-2xl"
              />
            )
          ) : category === "code" || file.mimeType?.includes("text") || file.mimeType?.includes("json") ? (
            <div className="w-full h-full p-4 rounded-xl border border-vault-border bg-vault-bg overflow-auto font-mono text-xs text-vault-text">
              {loadingText ? (
                <div className="py-12 text-center text-vault-muted">Loading preview text...</div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono leading-relaxed">{textContent}</pre>
              )}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-vault-panel border border-vault-border flex items-center justify-center text-vault-muted mx-auto">
                <svg className="w-8 h-8 text-vault-accent" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z" stroke="currentColor" strokeWidth="1.75" />
                  <path d="M13 2v7h7" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-vault-text">No direct browser preview for this file type</p>
                <p className="text-xs text-vault-muted mt-1">Download the asset to view its contents on your device.</p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleFileDownload(file.url, file.name)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-vault-bg bg-vault-accent hover:bg-vault-accent-hover transition-colors shadow-md cursor-pointer"
                >
                  Download Asset
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-vault-border text-xs font-mono text-vault-muted hover:text-vault-text hover:border-vault-accent transition-colors cursor-pointer"
                >
                  Close Modal
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );

  // Render via React Portal into document.body so position:fixed is ALWAYS relative to the entire screen
  return createPortal(modalContent, document.body);
}
