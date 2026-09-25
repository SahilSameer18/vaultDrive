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
    <aside aria-label="Batch actions toolbar" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl animate-slide-up select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)]/95 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.8)] text-[var(--theme-text)]">

        {/* Left: Selected Counter & Payload Telemetry */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white/40"></span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-[var(--theme-text)]">
              {totalCount} selected
            </span>
          </div>

          {totalSizeBytes > 0 && (
            <span className="hidden sm:inline-block text-[11px] font-mono text-[var(--theme-text-muted)] bg-[var(--theme-surface)] px-2.5 py-0.5 rounded-full border border-[var(--theme-border)] shadow-inner">
              {formatBytes(totalSizeBytes)}
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-wrap justify-end gap-1.5 sm:gap-2 shrink-0">
          {/* Select / Deselect All Toggle */}
          {onSelectAll && (
            <button
              type="button"
              onClick={onSelectAll}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:border-white/30 text-[var(--theme-text)] transition-colors cursor-pointer shadow-sm"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono text-[#0d0f12] bg-[var(--theme-accent)] hover:brightness-110 transition-all cursor-pointer shadow-md disabled:opacity-50"
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono text-white bg-rose-600 hover:bg-rose-500 transition-all cursor-pointer shadow-md disabled:opacity-50"
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
            className="w-7 h-7 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:border-white/30 flex items-center justify-center transition-colors cursor-pointer"
            title="Clear Selection (Esc)"
          >
            <span className="text-xs font-bold">✕</span>
          </button>
        </div>

      </div>
    </aside>
  );
}
