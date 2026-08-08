import { useState, useRef } from "react";
import { formatBytes } from "../../utils/formatters";

export default function UploadModal({ isOpen, onClose, onUploadFile }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [progress, setProgress]         = useState(0);
  const [error, setError]               = useState("");
  const fileInputRef                    = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError("File size exceeds 100MB limit.");
        setSelectedFile(null);
        return;
      }
      setError("");
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError("File size exceeds 100MB limit.");
        setSelectedFile(null);
        return;
      }
      setError("");
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      await onUploadFile(selectedFile, (percent) => setProgress(percent));
      setSelectedFile(null);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-vault-border bg-vault-panel p-6 shadow-2xl z-10 fade-in select-none">
        
        <div className="flex items-center justify-between border-b border-vault-border pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-vault-surface border border-vault-accent/40 flex items-center justify-center text-vault-accent">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-bold text-base text-vault-text">Upload File to Vault</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-vault-muted hover:text-vault-text text-sm p-1"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-vault-danger/10 border border-vault-danger/30 text-vault-danger text-xs font-mono">
            [ERROR] {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-vault-border hover:border-vault-accent/60 bg-vault-surface/40 p-8 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />

            <svg className="w-8 h-8 text-vault-accent mb-2" viewBox="0 0 24 24" fill="none">
              <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {selectedFile ? (
              <div>
                <p className="text-xs font-semibold text-vault-text truncate max-w-[260px]">{selectedFile.name}</p>
                <p className="text-[10px] font-mono text-vault-accent mt-0.5">{formatBytes(selectedFile.size)}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-vault-text">Drag and drop file here or click to browse</p>
                <p className="text-[10px] font-mono text-vault-muted mt-1">Maximum file size: 100 MB</p>
              </div>
            )}
          </div>

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-vault-accent">UPLOADING ASSET...</span>
                <span className="text-vault-text">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-vault-surface border border-vault-border overflow-hidden">
                <div className="h-full bg-vault-accent transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-vault-border text-xs font-medium text-vault-muted hover:text-vault-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#14161A] bg-gradient-to-r from-vault-accent to-vault-accent-hover hover:brightness-110 disabled:opacity-50 transition-all shadow-md"
            >
              {uploading ? "Uploading..." : "Start Upload"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
