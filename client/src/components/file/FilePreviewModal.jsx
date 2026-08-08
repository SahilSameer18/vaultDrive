import { useState, useEffect } from "react";
import { formatBytes, formatDate } from "../../utils/formatters";
import { getFileCategory } from "../../utils/fileIcons";

export default function FilePreviewModal({ isOpen, onClose, file }) {
  const [textContent, setTextContent] = useState("");
  const [loadingText, setLoadingText] = useState(false);

  const category = file ? getFileCategory(file.mimeType) : "file";

  useEffect(() => {
    if (file && (category === "code" || file.mimeType?.includes("text") || file.mimeType?.includes("json"))) {
      setLoadingText(true);
      fetch(file.url)
        .then((res) => res.text())
        .then((data) => {
          setTextContent(data.slice(0, 10000)); // Cap preview at 10KB
          setLoadingText(false);
        })
        .catch(() => {
          setTextContent("Unable to load text preview.");
          setLoadingText(false);
        });
    }
  }, [file, category]);

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border border-vault-border bg-vault-panel flex flex-col shadow-2xl z-10 overflow-hidden fade-in select-none">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-vault-border flex items-center justify-between bg-vault-bg/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-vault-surface border border-vault-accent/40 flex items-center justify-center text-vault-accent shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke="currentColor" strokeWidth="1.75" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base text-vault-text truncate">{file.name}</h3>
              <p className="text-[10px] font-mono text-vault-muted">
                {formatBytes(file.size)} • {formatDate(file.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="px-3.5 py-1.5 rounded-xl border border-vault-accent/40 bg-vault-accent/10 text-vault-accent text-xs font-semibold hover:bg-vault-accent/20 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download
            </a>
            <button type="button" onClick={onClose} className="text-vault-muted hover:text-vault-text p-1.5 text-base">
              ✕
            </button>
          </div>
        </div>

        {/* Media Preview Viewport */}
        <div className="flex-1 p-6 overflow-auto flex items-center justify-center min-h-[350px] bg-vault-bg/80">
          {category === "image" ? (
            <img
              src={file.url}
              alt={file.name}
              className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl border border-vault-border"
            />
          ) : category === "video" ? (
            <video
              src={file.url}
              controls
              autoPlay
              className="max-h-[70vh] max-w-full rounded-xl shadow-2xl border border-vault-border"
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
              <audio src={file.url} controls className="w-full" />
            </div>
          ) : category === "pdf" ? (
            <iframe
              src={file.url}
              title={file.name}
              className="w-full h-[70vh] rounded-xl border border-vault-border shadow-2xl"
            />
          ) : category === "code" || file.mimeType?.includes("text") || file.mimeType?.includes("json") ? (
            <div className="w-full h-[65vh] p-4 rounded-xl border border-vault-border bg-[#14161A] overflow-auto font-mono text-xs text-[#E8E6E0]">
              {loadingText ? (
                <div className="py-12 text-center text-vault-muted">Loading preview text...</div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono leading-relaxed">{textContent}</pre>
              )}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-vault-panel border border-vault-border flex items-center justify-center text-vault-muted mx-auto">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z" stroke="currentColor" strokeWidth="1.75" />
                  <path d="M13 2v7h7" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-vault-text">No direct browser preview for this file type</p>
                <p className="text-xs text-vault-muted mt-1">Download the asset to view its contents on your device.</p>
              </div>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-[#14161A] bg-vault-accent hover:bg-vault-accent-hover transition-colors shadow-md"
              >
                Download Asset
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
