import { formatBytes } from "../../utils/formatters";

export default function BatchActionBar({
  selectedFilesCount = 0,
  selectedFoldersCount = 0,
  totalSizeBytes = 0,
  onSelectAll,
  isAllSelected = false,
  onClearSelection,
  onBatchDownload,
  onBatchTrash,
  isProcessing = false,
}) {
  const totalCount = selectedFilesCount + selectedFoldersCount;
  if (totalCount === 0) return null;

  return (
    <aside aria-label="Batch actions toolbar" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl animate-slide-up">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 rounded-2xl border border-vault-accent/40 bg-vault-surface/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(230,175,46,0.15)] text-vault-text select-none">
        
        {/* Left: Selected Counter & Size */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vault-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-vault-accent"></span>
            </span>
            <span className="text-xs sm:text-sm font-bold font-mono text-vault-accent">
              {totalCount} {totalCount === 1 ? "item" : "items"} selected
            </span>
          </div>

          {totalSizeBytes > 0 && (
            <span className="hidden sm:inline-block text-[11px] font-mono text-vault-muted bg-vault-surface px-2.5 py-0.5 rounded-full border border-vault-border">
              {formatBytes(totalSizeBytes)}
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Select / Deselect All Toggle */}
          {onSelectAll && (
            <button
              type="button"
              onClick={onSelectAll}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-medium border border-vault-border bg-vault-surface hover:border-vault-accent/50 text-vault-text transition-colors cursor-pointer"
              title={isAllSelected ? "Deselect All Items" : "Select All Items"}
            >
              {isAllSelected ? "Deselect All" : "Select All"}
            </button>
          )}

          {/* Download All (only visible if files are selected) */}
          {selectedFilesCount > 0 && onBatchDownload && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={onBatchDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono text-vault-text bg-vault-surface border border-vault-border hover:border-vault-accent hover:text-vault-accent transition-all cursor-pointer shadow-sm disabled:opacity-50"
              title={`Download ${selectedFilesCount} File(s)`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Download ({selectedFilesCount})</span>
            </button>
          )}

          {/* Move to Trash Button */}
          {onBatchTrash && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={onBatchTrash}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono text-vault-bg bg-vault-danger hover:bg-vault-danger/90 transition-all cursor-pointer shadow-md disabled:opacity-50"
              title="Move Selected Items to Trash"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Trash</span>
            </button>
          )}

          {/* Deselect / Cancel Button */}
          <button
            type="button"
            onClick={onClearSelection}
            className="p-1.5 rounded-xl text-vault-muted hover:text-vault-text hover:bg-vault-surface transition-colors cursor-pointer"
            title="Clear Selection (Esc)"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

      </div>
    </aside>
  );
}
