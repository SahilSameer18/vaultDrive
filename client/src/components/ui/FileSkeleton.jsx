export default function FileSkeleton({ count = 4, viewMode = "grid" }) {
  const items = Array.from({ length: count });

  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {items.map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 p-3 rounded-xl border border-vault-border bg-vault-panel"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Icon block — matches FileCard's w-5 h-5 icon in list view */}
              <div className="skeleton w-5 h-5 shrink-0 rounded-md" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="skeleton h-3 rounded" style={{ width: `${55 + (i % 3) * 10}%` }} />
                <div className="skeleton h-2.5 w-24 rounded" />
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* VaultToggle-shaped pill */}
              <div className="skeleton h-6 w-20 rounded-lg" />
              {/* Download icon */}
              <div className="skeleton h-4 w-4 rounded" />
              {/* Menu dots */}
              <div className="skeleton h-4 w-4 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl border border-vault-border bg-vault-panel flex flex-col justify-between"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {/* Top bar: category icon block + menu dots — matches FileCard's w-10 h-10 icon box */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="skeleton w-10 h-10 rounded-xl" />
            <div className="skeleton w-4 h-4 rounded" />
          </div>

          {/* Title + metadata — matches FileCard's text block */}
          <div className="mb-4 space-y-2">
            <div className="skeleton h-3 rounded" style={{ width: `${65 + (i % 4) * 8}%` }} />
            <div className="skeleton h-2.5 w-2/3 rounded" />
          </div>

          {/* Bottom row: VaultToggle pill + download icon */}
          <div className="flex items-center justify-between pt-3 border-t border-vault-border">
            <div className="skeleton h-6 w-16 rounded-lg" />
            <div className="skeleton h-4 w-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}


