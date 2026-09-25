export default function PaginationControls({
  page,
  limit,
  totalCount,
  totalPages,
  onPageChange,
  onLimitChange,
}) {
  if (totalCount === 0 || totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem   = Math.min(page * limit, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-10 mb-4 pt-4 border-t border-[var(--theme-border)]/40 text-xs text-[var(--theme-text-muted)] select-none">
      {/* Summary Telemetry */}
      <div className="text-xs text-[var(--theme-text-muted)] font-mono">
        Telemetry: showing <span className="text-[var(--theme-text)] font-semibold">{startItem}</span>–
        <span className="text-[var(--theme-text)] font-semibold">{endItem}</span> of{" "}
        <span className="text-[var(--theme-accent)] font-semibold">{totalCount}</span> assets
      </div>

      {/* Controls Group */}
      <div className="flex items-center gap-3">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--theme-text-muted)] font-mono">Per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-2.5 py-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)] font-mono text-xs focus:border-[var(--theme-accent)] focus:outline-none cursor-pointer shadow-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 font-mono">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-xs text-[var(--theme-text)] hover:border-[var(--theme-accent)]/50 hover:text-[var(--theme-accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
          >
            ← Prev
          </button>

          <span className="px-2 text-xs text-[var(--theme-text-muted)]">
            <span className="text-[var(--theme-accent)] font-semibold">{page}</span> / {totalPages || 1}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-xs text-[var(--theme-text)] hover:border-[var(--theme-accent)]/50 hover:text-[var(--theme-accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
