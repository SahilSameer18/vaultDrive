import { useState } from "react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  title = "Delete Confirmation",
  description = "Are you sure you want to delete this item?",
  itemName = "",
  onConfirm,
}) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Handled by parent toast
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-vault-border bg-vault-panel p-6 shadow-2xl z-10 fade-in">
        
        <div className="flex items-center gap-3 border-b border-vault-border pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-vault-danger/15 border border-vault-danger/40 flex items-center justify-center text-vault-danger shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-base text-vault-text">{title}</h3>
            <p className="text-[10px] font-mono text-vault-muted">IRREVERSIBLE ACTION</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-xs text-vault-muted leading-relaxed">{description}</p>
          {itemName && (
            <div className="p-3 rounded-xl bg-vault-surface border border-vault-border text-xs font-mono text-vault-accent truncate">
              {itemName}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2.5 rounded-xl border border-vault-border text-xs font-medium text-vault-muted hover:text-vault-text transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold font-mono text-white bg-vault-danger hover:bg-vault-danger/90 disabled:opacity-50 transition-colors shadow-md flex items-center gap-2"
          >
            {deleting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>

      </div>
    </div>
  );
}
