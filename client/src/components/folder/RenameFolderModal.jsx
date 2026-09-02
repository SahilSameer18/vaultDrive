import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function RenameFolderModal({ isOpen, onClose, folder, onRenameFolder }) {
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (folder) {
      setName(folder.name || "");
      setError("");
    }
  }, [folder]);

  if (!isOpen || !folder) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || name === folder.name) return;

    setError("");
    setLoading(true);
    try {
      await onRenameFolder(folder.id, name.trim());
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to rename folder");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded-2xl border border-vault-border bg-vault-panel p-6 shadow-2xl z-10 animate-scale-up select-none">
        <div className="flex items-center justify-between border-b border-vault-border pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-vault-surface border border-vault-accent/40 flex items-center justify-center text-vault-accent">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.75" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </div>
            <h3 className="font-bold text-base text-vault-text">Rename Directory</h3>
          </div>

          <button type="button" onClick={onClose} className="text-vault-muted hover:text-vault-text text-sm p-1">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-vault-danger/10 border border-vault-danger/30 text-vault-danger text-xs font-mono">
            [ERROR] {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-vault-text mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Finance Reports"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-vault-surface border border-vault-border text-vault-text text-sm placeholder:text-vault-muted/40 focus:border-vault-accent focus:outline-none transition-colors"
            />
          </div>

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
              disabled={loading || !name.trim() || name === folder.name}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-vault-bg bg-vault-accent hover:bg-vault-accent-hover disabled:opacity-50 transition-colors shadow-md"
            >
              {loading ? "Saving..." : "Save Name"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
