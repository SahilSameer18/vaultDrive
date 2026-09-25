export default function FileSkeleton({ count = 5, viewMode = "grid" }) {
  const items = Array.from({ length: count });

  if (viewMode === "list") {
    return (
      <div className="space-y-2 select-none">
        {items.map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 p-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)] shadow-sm"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="skeleton w-9 h-9 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="skeleton h-3.5 rounded" style={{ width: `${45 + (i % 3) * 15}%` }} />
                <div className="skeleton h-2.5 w-28 rounded" />
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="skeleton h-6 w-20 rounded-lg" />
              <div className="skeleton h-7 w-7 rounded-lg" />
              <div className="skeleton h-7 w-7 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 select-none">
      {items.map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] flex flex-col justify-between shadow-sm"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {/* Top bar: icon box + action icons */}
          <div className="flex items-start justify-between gap-2 mb-3.5">
            <div className="skeleton w-11 h-11 rounded-xl" />
            <div className="flex items-center gap-1">
              <div className="skeleton w-6 h-6 rounded-lg" />
              <div className="skeleton w-6 h-6 rounded-lg" />
            </div>
          </div>

          {/* Title + metadata */}
          <div className="mb-4 space-y-2">
            <div className="skeleton h-3.5 rounded" style={{ width: `${60 + (i % 4) * 8}%` }} />
            <div className="skeleton h-2.5 w-2/3 rounded" />
          </div>

          {/* Bottom row: Privacy pill + download */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--theme-border)]/60">
            <div className="skeleton h-6 w-18 rounded-lg" />
            <div className="skeleton h-5 w-5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
