import { useState, useRef, useEffect } from "react";
import { FileCategoryIcon } from "../../utils/fileIcons";
import { formatBytes, formatDate } from "../../utils/formatters";
import VaultToggle from "./VaultToggle";

export default function FileCard({
  file,
  viewMode = "grid",
  onTogglePrivacy,
  onOpenShare,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (viewMode === "list") {
    return (
      <div className="group flex items-center justify-between gap-4 p-3 rounded-xl border border-vault-border bg-vault-panel hover:border-vault-accent/40 hover:bg-vault-panel/80 transition-all duration-200 select-none animate-fade-in-up">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <FileCategoryIcon mimetype={file.mimeType} className="w-5 h-5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-vault-text truncate">{file.name}</p>
            <p className="text-[10px] font-mono text-vault-muted mt-0.5">
              {formatBytes(file.size)} • {formatDate(file.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <VaultToggle
            isPublic={file.isPublic}
            onToggle={() => onTogglePrivacy && onTogglePrivacy(file)}
          />

          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="p-1.5 rounded-lg text-vault-muted hover:text-vault-text hover:bg-vault-surface transition-colors"
            title="Download File"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-1.5 rounded-lg text-vault-muted hover:text-vault-text hover:bg-vault-surface transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl border border-vault-border bg-vault-panel p-1.5 shadow-2xl z-20 font-mono text-xs animate-scale-up">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenShare && onOpenShare(file);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-vault-text hover:bg-vault-surface transition-colors flex items-center gap-2"
                >
                  Share Options
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete && onDelete(file.id);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-vault-danger hover:bg-vault-danger/10 transition-colors flex items-center gap-2"
                >
                  Delete File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group relative p-4 rounded-2xl border border-vault-border bg-vault-panel hover:border-vault-accent/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 flex flex-col justify-between select-none animate-fade-in-up">
      
      {/* Top Bar: Category Icon + Menu */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="w-10 h-10 rounded-xl bg-vault-surface border border-vault-border flex items-center justify-center group-hover:border-vault-accent/30 transition-colors">
          <FileCategoryIcon mimetype={file.mimeType} className="w-5 h-5" />
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1.5 rounded-lg text-vault-muted hover:text-vault-text hover:bg-vault-surface transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="5" r="1.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="19" r="1.5" fill="currentColor" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-xl border border-vault-border bg-vault-panel p-1.5 shadow-2xl z-20 font-mono text-xs animate-scale-up">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenShare && onOpenShare(file);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-vault-text hover:bg-vault-surface transition-colors"
              >
                Share Options
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete && onDelete(file.id);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-vault-danger hover:bg-vault-danger/10 transition-colors"
              >
                Delete File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center: File Info */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-vault-text truncate mb-1 group-hover:text-vault-accent transition-colors" title={file.name}>
          {file.name}
        </p>
        <p className="text-[10px] font-mono text-vault-muted">
          {formatBytes(file.size)} • {formatDate(file.createdAt)}
        </p>
      </div>

      {/* Bottom: Vault Toggle Switch */}
      <div className="flex items-center justify-between pt-3 border-t border-vault-border">
        <VaultToggle
          isPublic={file.isPublic}
          onToggle={() => onTogglePrivacy && onTogglePrivacy(file)}
        />
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="p-1 text-vault-muted hover:text-vault-accent transition-colors"
          title="Download"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

    </div>
  );
}
