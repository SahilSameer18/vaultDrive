import { useState, useRef, useEffect } from "react";

const SORT_OPTIONS = [
  { label: "Newest Uploads", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Oldest Uploads", sortBy: "createdAt", sortOrder: "asc" },
  { label: "Name (A to Z)", sortBy: "name", sortOrder: "asc" },
  { label: "Name (Z to A)", sortBy: "name", sortOrder: "desc" },
  { label: "Size (Largest First)", sortBy: "size", sortOrder: "desc" },
  { label: "Size (Smallest First)", sortBy: "size", sortOrder: "asc" },
];

export default function FileSortDropdown({ sortBy, sortOrder, onChangeSort }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption =
    SORT_OPTIONS.find(
      (opt) => opt.sortBy === sortBy && opt.sortOrder === sortOrder
    ) || SORT_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChangeSort(option.sortBy, option.sortOrder);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)] text-xs font-semibold text-[var(--theme-text)] hover:border-[var(--theme-accent)]/50 hover:text-[var(--theme-accent)] transition-all flex items-center gap-2 cursor-pointer select-none shadow-sm"
        title="Sort Assets"
      >
        <svg className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 6h18M6 12h12M9 18h6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
        <span className="hidden sm:inline text-[var(--theme-text-muted)] font-mono text-[11px]">SORT:</span>
        <span className="truncate max-w-[110px] sm:max-w-none text-xs">{currentOption.label}</span>
        <svg className={`w-3.5 h-3.5 text-[var(--theme-text-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)]/95 backdrop-blur-xl shadow-2xl p-1.5 z-40 animate-scale-up select-none">
          <div className="px-2.5 py-1.5 border-b border-[var(--theme-border)]/60 mb-1 flex items-center justify-between">
            <p className="text-[9px] font-mono tracking-widest text-[var(--theme-text-muted)] uppercase">
              SORT CRITERIA
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
          </div>
          <div className="space-y-0.5">
            {SORT_OPTIONS.map((opt) => {
              const isActive =
                opt.sortBy === sortBy && opt.sortOrder === sortOrder;
              return (
                <button
                  key={`${opt.sortBy}-${opt.sortOrder}`}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    isActive
                      ? "bg-[var(--theme-surface)] text-[var(--theme-accent)] font-semibold shadow-inner"
                      : "text-[var(--theme-text)] hover:bg-[var(--theme-surface)]/60 hover:text-[var(--theme-text)]"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isActive && (
                    <span className="text-[var(--theme-accent)] font-mono text-xs">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
