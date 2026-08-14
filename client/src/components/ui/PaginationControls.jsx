export default function PaginationControls({
  page,
  limit,
  totalCount,
  totalPages,
  onPageChange,
  onLimitChange,
}) {
  // Hide entirely if there is only 1 page or no items
  if (totalCount === 0 || totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem   = Math.min(page * limit, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-12 mb-4 pt-4 border-t border-vault-border/30 text-xs text-vault-muted select-none">
      {/* Summary Text */}
      <div className="text-xs text-vault-muted">
        Showing <span className="font-mono text-vault-text font-semibold">{startItem}</span>–
        <span className="font-mono text-vault-text font-semibold">{endItem}</span> of{" "}
        <span className="font-mono text-vault-text font-semibold">{totalCount}</span> files
      </div>

      {/* Controls Group */}
      <div className="flex items-center gap-4">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-vault-muted">Per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-2 py-1 rounded-lg border border-vault-border bg-vault-panel text-vault-text font-mono text-xs focus:border-vault-accent focus:outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 rounded-lg border border-vault-border bg-vault-panel text-xs text-vault-text hover:border-vault-accent hover:text-vault-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            ← Prev
          </button>

          <span className="px-2 font-mono text-xs text-vault-muted">
            <span className="text-vault-accent font-semibold">{page}</span> / {totalPages || 1}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 rounded-lg border border-vault-border bg-vault-panel text-xs text-vault-text hover:border-vault-accent hover:text-vault-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
