import { Link } from "react-router-dom";

export default function FolderBreadcrumb({ breadcrumbs = [] }) {
  return (
    <nav className="flex items-center gap-2 text-xs font-mono text-vault-muted flex-wrap">
      <Link to="/dashboard" className="text-vault-accent hover:underline font-semibold flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" strokeWidth="1.75" />
        </svg>
        Home
      </Link>

      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <span key={crumb.id || idx} className="flex items-center gap-2">
            <span className="text-vault-border">/</span>
            {isLast ? (
              <span className="text-vault-text font-semibold">{crumb.name}</span>
            ) : (
              <Link to={`/folder/${crumb.id}`} className="hover:text-vault-text hover:underline">
                {crumb.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
