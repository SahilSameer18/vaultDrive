import { Link } from "react-router-dom";

export default function FolderBreadcrumb({ breadcrumbs = [] }) {
  return (
    <nav aria-label="Directory navigation" className="flex items-center gap-1.5 text-xs text-[var(--theme-text-muted)] flex-wrap select-none">
      <Link
        to="/dashboard"
        className="px-2 py-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)]/80 text-[var(--theme-text)] hover:border-white/30 font-semibold flex items-center gap-1.5 transition-all shadow-sm"
      >
        <svg className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" viewBox="0 0 24 24" fill="none">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" strokeWidth="1.75" />
        </svg>
        <span className="text-xs">Vault</span>
      </Link>

      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <span key={crumb.id || idx} className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[var(--theme-border)] shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {isLast ? (
              <span className="px-2 py-1 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text)] font-semibold flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <span className="truncate max-w-[160px] sm:max-w-xs">{crumb.name}</span>
              </span>
            ) : (
              <Link
                to={`/folder/${crumb.id}`}
                className="px-2 py-1 rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors truncate max-w-[120px] sm:max-w-[200px]"
              >
                {crumb.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
