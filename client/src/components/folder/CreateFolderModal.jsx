import { useState } from "react";
import { createPortal } from "react-dom";

export default function CreateFolderModal({ isOpen, onClose, onCreateFolder }) {
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError("Folder name cannot be empty");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await onCreateFolder(folderName.trim());
      setFolderName("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] p-6 shadow-2xl z-10 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-text-muted)] shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </div>
            <h3 className="font-bold text-base text-[var(--theme-text)]">Create Folder</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:border-white/30 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="text-xs font-bold">✕</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--theme-text)] mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g. Tax Documents"
              autoFocus
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text)] text-sm placeholder:text-[var(--theme-text-muted)]/40 focus:border-white/30 focus:outline-none shadow-inner transition-colors"
            />
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
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-mono font-semibold text-[#0d0f12] bg-[var(--theme-accent)] hover:brightness-110 disabled:opacity-50 transition-all shadow-md cursor-pointer"
            >
              {loading ? "Creating..." : "Create Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
