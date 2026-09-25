import { useState } from "react";
import { createPortal } from "react-dom";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  title = "Move to Trash",
  description = "This item will be moved to Trash. You can restore it anytime from your Trash Bin.",
  itemName = "",
  confirmText = "Move to Trash",
  isPermanent = false,
  onConfirm,
}) {
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Handled by parent toast
    } finally {
      setProcessing(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] p-6 shadow-2xl z-10 animate-scale-up">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--theme-border)] pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-base text-[var(--theme-text)]">{title}</h3>
            <p className="text-xs text-[var(--theme-text-muted)]">
              {isPermanent ? "This can't be undone." : "You can restore this from Trash later."}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">{description}</p>
          {itemName && (
            <div className="p-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-xs font-mono text-[var(--theme-text)] truncate shadow-inner">
              {itemName}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="px-4 py-2 rounded-xl border border-[var(--theme-border)] text-xs font-medium text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing}
            className="px-5 py-2 rounded-xl text-xs font-semibold font-mono text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition-colors shadow-md flex items-center gap-2 cursor-pointer"
          >
            {processing ? (isPermanent ? "Deleting..." : "Moving to Trash...") : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}