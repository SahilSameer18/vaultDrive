import { useState, useRef, useEffect } from "react";
import { FileCategoryIcon } from "../../utils/fileIcons";
import { formatBytes, formatDate } from "../../utils/formatters";
import { handleFileDownload } from "../../utils/download";
import VaultToggle from "./VaultToggle";

export default function FileCard({
  file,
  viewMode = "grid",
  isSelected = false,
  isSelectionMode = false,
  onToggleSelect,
  onTogglePrivacy,
  onOpenShare,
  onRename,
  onDelete,
  onPreview,
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

  const onDownloadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileDownload(file.url, file.name);
  };

  const handleCardClick = (e) => {
    // In selection mode, clicking the card toggles selection
    if (isSelectionMode && onToggleSelect) {
      e.preventDefault();
      e.stopPropagation();
      onToggleSelect(file.id);
      return;
    }
    if (onPreview) {
      onPreview(file);
    }
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={handleCardClick}
        className={`group relative flex items-center justify-between gap-3 sm:gap-4 p-3 rounded-xl border transition-all duration-150 select-none ${
          isSelected
            ? "border-vault-accent ring-1 ring-vault-accent/40 bg-vault-accent/5 shadow-sm"
            : "border-vault-border bg-vault-panel hover:border-vault-accent/40 hover:bg-vault-panel/80"
        } ${isSelectionMode ? "cursor-pointer" : ""} ${menuOpen ? "z-40" : "z-0"}`}
      >
        {/* Left: Auto Checkbox (when in selection mode) + Icon & File Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Checkbox ONLY appears when selection mode is active */}
          {isSelectionMode && onToggleSelect && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleSelect(file.id);
              }}
              className="p-1 rounded-lg transition-transform shrink-0 cursor-pointer animate-scale-up"
              title={isSelected ? "Deselect File" : "Select File"}
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-vault-accent border-vault-accent text-[#14161A]"
                    : "border-vault-muted/70 bg-vault-surface hover:border-vault-accent"
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          )}

          <div
            onClick={(e) => {
              if (isSelectionMode) return; // let card handler toggle selection
              onPreview && onPreview(file);
            }}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
            title="Click to Preview Asset"
          >
            <FileCategoryIcon mimetype={file.mimeType} className="w-5 h-5 shrink-0 text-vault-accent group-hover:scale-110 transition-transform" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-vault-text truncate group-hover:text-vault-accent transition-colors">{file.name}</p>
              <p className="text-[10px] font-mono text-vault-muted mt-0.5">
                {formatBytes(file.size)} • {formatDate(file.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <VaultToggle
            isPublic={file.isPublic}
            onToggle={() => onTogglePrivacy && onTogglePrivacy(file)}
          />

          {/* Quick Preview Eye Button */}
          <button
            type="button"
            onClick={() => onPreview && onPreview(file)}
            className="p-1.5 rounded-lg text-vault-muted hover:text-vault-accent hover:bg-vault-surface transition-colors cursor-pointer"
            title="Preview Asset"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.75" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
            </svg>
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={onDownloadClick}
            className="p-1.5 rounded-lg text-vault-muted hover:text-vault-text hover:bg-vault-surface transition-colors cursor-pointer"
            title="Download File"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 3-Dots Options Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-1.5 rounded-lg text-vault-muted hover:text-vault-text hover:bg-vault-surface transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl border border-vault-border bg-vault-panel p-1.5 shadow-2xl z-50 font-mono text-xs animate-scale-up">
                {/* Select Option in Dropdown */}
                {onToggleSelect && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleSelect(file.id);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-vault-accent hover:bg-vault-surface transition-colors flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                      {isSelected && <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
                    </svg>
                    {isSelected ? "Deselect File" : "Select File"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onPreview && onPreview(file);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-vault-text hover:bg-vault-surface transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Preview Asset
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    setMenuOpen(false);
                    onDownloadClick(e);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-vault-text hover:bg-vault-surface transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Download File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenShare && onOpenShare(file);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-vault-text hover:bg-vault-surface transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Share Options
                </button>
                {onRename && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onRename(file);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-vault-text hover:bg-vault-surface transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    Rename File
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete && onDelete(file.id);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-vault-danger hover:bg-vault-danger/10 transition-colors flex items-center gap-2 cursor-pointer"
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
    <div
      onClick={handleCardClick}
      className={`group relative p-4 rounded-2xl border transition-all duration-150 flex flex-col justify-between select-none ${
        isSelected
          ? "border-vault-accent ring-1 ring-vault-accent/40 bg-vault-accent/5 shadow-md -translate-y-0.5"
          : "border-vault-border bg-vault-panel hover:border-vault-accent/50 hover:-translate-y-1 hover:shadow-xl"
      } ${isSelectionMode ? "cursor-pointer" : ""} ${menuOpen ? "z-40" : "z-0"}`}
    >
      {/* Top Bar: Auto Checkbox (when in selection mode) + Category Icon + Eye Preview + Options Menu */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Checkbox ONLY appears when selection mode is active */}
          {isSelectionMode && onToggleSelect && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleSelect(file.id);
              }}
              className="p-1 rounded-lg transition-transform shrink-0 cursor-pointer animate-scale-up"
              title={isSelected ? "Deselect File" : "Select File"}
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-vault-accent border-vault-accent text-[#14161A]"
                    : "border-vault-muted/70 bg-vault-surface hover:border-vault-accent"
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          )}

          <div
            onClick={(e) => {
              if (isSelectionMode) return; // let card handler toggle selection
              e.stopPropagation();
              onPreview && onPreview(file);
            }}
            className="w-10 h-10 rounded-xl bg-vault-surface border border-vault-border flex items-center justify-center group-hover:border-vault-accent/40 transition-colors cursor-pointer"
            title="Preview Asset"
          >
            <FileCategoryIcon mimetype={file.mimeType} className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {/* Quick Preview Button */}
          <button
            type="button"
            onClick={() => onPreview && onPreview(file)}
            className="p-1.5 rounded-lg text-vault-muted hover:text-vault-accent hover:bg-vault-surface transition-colors cursor-pointer"
            title="Preview Asset"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.75" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
            </svg>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-1.5 rounded-lg text-vault-muted hover:text-vault-text hover:bg-vault-surface transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl border border-vault-border bg-vault-panel p-1.5 shadow-2xl z-50 font-mono text-xs animate-scale-up">
                {/* Select Option in Dropdown */}
                {onToggleSelect && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleSelect(file.id);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-vault-accent hover:bg-vault-surface transition-colors flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                      {isSelected && <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
                    </svg>
                    {isSelected ? "Deselect File" : "Select File"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onPreview && onPreview(file);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-vault-text hover:bg-vault-surface transition-colors cursor-pointer"
                >
                  Preview Asset
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    setMenuOpen(false);
                    onDownloadClick(e);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-vault-text hover:bg-vault-surface transition-colors cursor-pointer"
                >
                  Download File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenShare && onOpenShare(file);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-vault-text hover:bg-vault-surface transition-colors cursor-pointer"
                >
                  Share Options
                </button>
                {onRename && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onRename(file);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-vault-text hover:bg-vault-surface transition-colors cursor-pointer"
                  >
                    Rename File
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete && onDelete(file.id);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-vault-danger hover:bg-vault-danger/10 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Delete File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle: File Name */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-vault-text truncate group-hover:text-vault-accent transition-colors" title={file.name}>
          {file.name}
        </h4>
        <p className="text-[10px] font-mono text-vault-muted mt-1">
          {formatBytes(file.size)} • {formatDate(file.createdAt)}
        </p>
      </div>

      {/* Bottom Bar: Privacy Pill */}
      <div className="flex items-center justify-between pt-3 border-t border-vault-border/50 text-[10px] font-mono" onClick={(e) => e.stopPropagation()}>
        <span className="text-vault-muted">Visibility:</span>
        <VaultToggle
          isPublic={file.isPublic}
          onToggle={() => onTogglePrivacy && onTogglePrivacy(file)}
        />
      </div>
    </div>
  );
}
