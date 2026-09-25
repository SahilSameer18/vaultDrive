import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function RenameFileModal({ isOpen, onClose, file, onRenameFile }) {
  const [baseName, setBaseName]   = useState("");
  const [extension, setExtension] = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    if (file && file.name) {
      const lastDot = file.name.lastIndexOf(".");
      if (lastDot > 0) {
        setBaseName(file.name.slice(0, lastDot));
        setExtension(file.name.slice(lastDot));
      } else {
        setBaseName(file.name);
        setExtension("");
      }
      setError("");
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const originalFullName = file.name || "";
  const currentFullName = `${baseName.trim()}${extension}`;
  const isChanged = currentFullName !== originalFullName && baseName.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChanged) return;

    setError("");
    setLoading(true);
    try {
      await onRenameFile(file.id, currentFullName);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to rename file");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] p-6 shadow-2xl z-10 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-accent)]/40 flex items-center justify-center text-[var(--theme-accent)] shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.75" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </div>
            <h3 className="font-bold text-base text-[var(--theme-text)]">Rename File</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:border-[var(--theme-accent)] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="text-xs font-bold">✕</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
            [ERROR] {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-[var(--theme-text)]">
                File Name
              </label>
              {extension && (
                <span className="text-[10px] font-mono text-[var(--theme-text-muted)]">
                  Extension locked
                </span>
              )}
            </div>

            <div className="flex items-stretch rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] overflow-hidden focus-within:border-[var(--theme-accent)] shadow-inner transition-colors">
              <input
                type="text"
                value={baseName}
                onChange={(e) => setBaseName(e.target.value)}
                placeholder="e.g. quarterly_audit"
                required
                autoFocus
                className="flex-1 px-4 py-2.5 bg-transparent text-[var(--theme-text)] text-sm placeholder:text-[var(--theme-text-muted)]/40 focus:outline-none min-w-0"
              />
              {extension && (
                <span
                  className="px-3.5 py-2.5 bg-[var(--theme-panel)]/80 border-l border-[var(--theme-border)] text-[var(--theme-accent)] font-mono text-xs font-semibold flex items-center select-none shrink-0"
                  title="File extension is locked to preserve MIME type integrity"
                >
                  {extension}
                </span>
              )}
            </div>

            <p className="text-[10px] font-mono text-[var(--theme-text-muted)] mt-2 truncate">
              Output identifier: <span className="text-[var(--theme-accent)] font-semibold">{currentFullName || "—"}</span>
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--theme-border)] text-xs font-medium text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isChanged}
              className="px-5 py-2 rounded-xl text-xs font-mono font-semibold text-[#0d0f12] bg-[var(--theme-accent)] hover:brightness-110 disabled:opacity-50 transition-all shadow-md cursor-pointer"
            >
              {loading ? "Writing..." : "Save Name"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}