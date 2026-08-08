import { useState } from "react";

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
                <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </div>
            <h3 className="font-bold text-base text-vault-text">Create New Folder</h3>
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
          <div>
            <label className="block text-xs font-medium text-vault-text mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g. Project Assets 2027"
              autoFocus
              required
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
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#14161A] bg-gradient-to-r from-vault-accent to-vault-accent-hover hover:brightness-110 disabled:opacity-50 transition-all shadow-md"
            >
              {loading ? "Creating..." : "Create Directory"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
