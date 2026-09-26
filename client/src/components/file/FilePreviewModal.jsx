import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { formatBytes, formatDate } from "../../utils/formatters";
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

  useEffect(() => {
    setMediaError(false);
  }, [file?.url]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose && onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleMediaError = useCallback(async () => {
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
  }, [file, onRefreshUrl]);

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
  }, [file, category, handleMediaError]);

  if (!isOpen || !file) return null;

  const fileExt = file?.name?.includes(".")
    ? file.name.split(".").pop().toUpperCase()
    : "ASSET";

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 select-none font-sans">
      {/* ── Fullscreen Backdrop ─────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* ── Modal Card Container (Centered in viewport) ───────────────────── */}
      <div className="relative z-[100000] w-full max-w-5xl h-[88vh] rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden animate-scale-up origin-center">
        
        {/* ── Luxury Header Bar ────────────────────────────────────────────── */}
        <div className="px-5 py-3.5 border-b border-[var(--theme-border)] flex items-center justify-between bg-[var(--theme-surface)] shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
            <div className="w-9 h-9 rounded-xl bg-[var(--theme-panel)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-text-muted)] shrink-0 shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke="currentColor" strokeWidth="1.75" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[var(--theme-text)] truncate apple-headline">{file.name}</h3>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider bg-[var(--theme-panel)] border border-[var(--theme-border)] text-[var(--theme-text-muted)] apple-mono">
                  {fileExt}
                </span>
              </div>
              <p className="text-[10px] font-mono text-[var(--theme-text-muted)] flex items-center gap-1.5 mt-0.5 apple-caption">
                <span>{formatBytes(file.size)}</span>
                <span className="opacity-40">•</span>
                <span>{formatDate(file.createdAt)}</span>
              </p>
            </div>
          </div>

          {/* Action buttons: Download & Close Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleFileDownload(file.url, file.name)}
              className="px-3.5 py-1.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)] text-xs font-semibold hover:border-white/30 transition-all flex items-center gap-2 cursor-pointer shadow-sm apple-caption touch-target-44"
              title="Download File"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Download</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:border-white/30 flex items-center justify-center transition-colors cursor-pointer touch-target-44"
              title="Close Preview (Esc)"
            >
              <span className="text-sm font-bold">✕</span>
            </button>
          </div>
        </div>

        {/* ── Media Preview Body Viewport ─────────────────────────────────── */}
        <div className="flex-1 bg-[var(--theme-bg)] p-4 sm:p-6 overflow-hidden flex items-center justify-center relative">
          {mediaError ? (
            <div className="text-center py-12 space-y-4 max-w-md">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--theme-text)]">Unable to load media preview</p>
                <p className="text-xs text-[var(--theme-text-muted)] mt-1">Access token may have expired or file was moved to Trash.</p>
              </div>
              <button
                type="button"
                onClick={() => handleFileDownload(file.url, file.name)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-[var(--theme-text)] bg-[var(--theme-surface)] border border-[var(--theme-border)] hover:border-white/30 transition-all shadow-md cursor-pointer"
              >
                Download File Instead
              </button>
            </div>
          ) : category === "image" ? (
            <div className="max-h-full max-w-full flex items-center justify-center p-2">
              <img
                key={file.url}
                src={file.url}
                alt={file.name}
                onError={handleMediaError}
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl border border-[var(--theme-border)]"
              />
            </div>
          ) : category === "video" ? (
            <div className="max-h-full max-w-full flex items-center justify-center p-2 w-full">
              <video
                key={file.url}
                src={file.url}
                controls
                autoPlay
                onError={handleMediaError}
                className="max-h-[75vh] max-w-full rounded-xl shadow-2xl border border-[var(--theme-border)] bg-black"
              />
            </div>
          ) : category === "audio" ? (
            <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] text-center shadow-2xl space-y-6">
              <div className="w-20 h-20 rounded-full bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-text-muted)] mx-auto relative shadow-inner">
                <div className="w-12 h-12 rounded-full border border-dashed border-white/20 animate-spin flex items-center justify-center" style={{ animationDuration: "12s" }}>
                  <div className="w-4 h-4 rounded-full bg-white/20" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--theme-text)] truncate">{file.name}</h4>
                <p className="text-xs font-mono text-[var(--theme-text-muted)] mt-1">{formatBytes(file.size)}</p>
              </div>
              <audio key={file.url} src={file.url} controls onError={handleMediaError} className="w-full accent-[var(--theme-accent)]" />
            </div>
          ) : category === "pdf" ? (
            <iframe
              key={file.url}
              src={
                typeof window !== "undefined" &&
                (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768) &&
                file.url.startsWith("http") &&
                !isGatekeeperUrl
                  ? `https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=true`
                  : file.url
              }
              title={file.name}
              onError={handleMediaError}
              className="w-full h-full rounded-xl border border-[var(--theme-border)] bg-white shadow-2xl"
            />
          ) : category === "office" ? (
            isGatekeeperUrl ? (
              <div className="text-center py-12 space-y-4 max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-[var(--theme-panel)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-text-muted)] mx-auto shadow-lg">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.75" />
                    <path d="M14 2v6h6M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--theme-text)]">Protected Office Document</p>
                  <p className="text-xs text-[var(--theme-text-muted)] mt-1 max-w-sm mx-auto leading-relaxed">
                    Direct browser preview is disabled on shared links to keep document contents private. Download to view safely.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleFileDownload(file.url, file.name)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-[var(--theme-text)] bg-[var(--theme-surface)] border border-[var(--theme-border)] hover:border-white/30 transition-all shadow-md cursor-pointer"
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
                className="w-full h-full rounded-xl border border-[var(--theme-border)] bg-white shadow-2xl"
              />
            )
          ) : category === "code" || file.mimeType?.includes("text") || file.mimeType?.includes("json") ? (
            <div className="w-full h-full p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] overflow-auto font-mono text-xs text-[var(--theme-text)]">
              {loadingText ? (
                <div className="py-12 text-center text-[var(--theme-text-muted)] flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white/30 animate-ping" />
                  <span>Loading preview...</span>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono leading-relaxed">{textContent}</pre>
              )}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-[var(--theme-panel)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-text-muted)] mx-auto shadow-lg">
                <svg className="w-8 h-8 text-[var(--theme-text-muted)]" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z" stroke="currentColor" strokeWidth="1.75" />
                  <path d="M13 2v7h7" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--theme-text)]">No direct browser preview for this file type</p>
                <p className="text-xs text-[var(--theme-text-muted)] mt-1">Download the asset to view its contents on your device.</p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleFileDownload(file.url, file.name)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-[var(--theme-text)] bg-[var(--theme-surface)] border border-[var(--theme-border)] hover:border-white/30 transition-all shadow-md cursor-pointer"
                >
                  Download
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:border-white/30 transition-colors cursor-pointer"
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

  return createPortal(modalContent, document.body);
}
