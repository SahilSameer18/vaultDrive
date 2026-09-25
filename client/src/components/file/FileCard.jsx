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

  const fileExt = file?.name?.includes(".")
    ? file.name.split(".").pop().toUpperCase().slice(0, 4)
    : "FILE";

  // ── List View Representation ──────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <div
        onClick={handleCardClick}
        className={`group relative flex items-center justify-between gap-3 sm:gap-4 p-3 rounded-xl border transition-all duration-200 select-none ${
          isSelected
            ? "border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent)]/40 bg-[var(--theme-accent)]/[0.05] shadow-[0_0_16px_rgba(197,160,89,0.08)]"
            : "border-[var(--theme-border)] bg-[var(--theme-panel)] hover:border-white/20 hover:bg-[var(--theme-surface)]/60 shadow-sm"
        } ${isSelectionMode ? "cursor-pointer" : ""} ${menuOpen ? "z-40" : "z-0"}`}
      >
        {/* Left: Checkbox + Icon & File Metadata */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
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
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-[var(--theme-accent)] border-[var(--theme-accent)] text-[#0d0f12] shadow-[0_0_8px_rgba(197,160,89,0.5)]"
                    : "border-[var(--theme-border)] bg-[var(--theme-surface)] hover:border-white/30"
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
              if (isSelectionMode) return;
              e.stopPropagation();
              onPreview && onPreview(file);
            }}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
            title="Click to Preview"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center group-hover:border-white/20 transition-colors shrink-0 shadow-inner">
              <FileCategoryIcon mimetype={file.mimeType} className="w-4 h-4 text-[var(--theme-text-muted)] group-hover:scale-110 transition-transform" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-[var(--theme-text)] truncate">
                  {file.name}
                </p>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text-muted)]">
                  {fileExt}
                </span>
              </div>
              <p className="text-[10px] font-mono text-[var(--theme-text-muted)] mt-0.5">
                {formatBytes(file.size)} <span className="opacity-40">•</span> {formatDate(file.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions: Latch + Download + Preview + 3-Dots Menu */}
        <div className="flex items-center flex-wrap justify-end gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <VaultToggle
            isPublic={file.isPublic}
            onToggle={() => onTogglePrivacy && onTogglePrivacy(file)}
          />

          {/* Quick Preview Eye Button */}
          <button
            type="button"
            onClick={() => onPreview && onPreview(file)}
            className="p-1.5 rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors cursor-pointer"
            title="Preview"
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
            className="p-1.5 rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors cursor-pointer"
            title="Download"
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
              className="p-1.5 rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors cursor-pointer"
              title="File Options"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)]/95 backdrop-blur-xl p-1.5 shadow-2xl z-50 font-mono text-xs animate-scale-up">
                {onToggleSelect && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleSelect(file.id);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors flex items-center gap-2 cursor-pointer font-medium"
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
                  className="w-full text-left px-3 py-2 rounded-lg text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.75" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
                  </svg>
                  Preview
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    setMenuOpen(false);
                    onDownloadClick(e);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenShare && onOpenShare(file);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" viewBox="0 0 24 24" fill="none">
                    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.75" />
                    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
                    <circle cx="18" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.75" />
                    <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" stroke="currentColor" strokeWidth="1.75" />
                  </svg>
                  Share Options
                </button>
                {onRename && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onRename(file);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.75" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.75" />
                    </svg>
                    Rename File
                  </button>
                )}
                <div className="h-px bg-[var(--theme-border)]/60 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete && onDelete(file.id);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Move to Trash
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Grid View Representation ──────────────────────────────────────────────
  return (
    <div
      onClick={handleCardClick}
      className={`group relative p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between select-none ${
        isSelected
          ? "border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent)]/40 bg-[var(--theme-accent)]/[0.05] shadow-[0_4px_24px_rgba(197,160,89,0.12)] -translate-y-0.5"
          : "border-[var(--theme-border)] bg-[var(--theme-panel)] hover:border-white/20 hover:-translate-y-1 hover:shadow-xl shadow-sm"
      } ${isSelectionMode ? "cursor-pointer" : ""} ${menuOpen ? "z-40" : "z-0"}`}
    >
      {/* Top Bar: Checkbox + Icon + Badge + Quick Actions */}
      <div className="flex items-start justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
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
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-[var(--theme-accent)] border-[var(--theme-accent)] text-[#0d0f12] shadow-[0_0_8px_rgba(197,160,89,0.5)]"
                    : "border-[var(--theme-border)] bg-[var(--theme-surface)] hover:border-white/30"
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
              if (isSelectionMode) return;
              e.stopPropagation();
              onPreview && onPreview(file);
            }}
            className="w-11 h-11 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center group-hover:border-white/20 transition-colors cursor-pointer shadow-inner"
            title="Preview"
          >
            <FileCategoryIcon mimetype={file.mimeType} className="w-5 h-5 text-[var(--theme-text-muted)] group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Top-Right Quick Inspection & Overflow Menu */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onPreview && onPreview(file)}
            className="p-1.5 rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
            title="Preview"
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
              className="p-1.5 rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors cursor-pointer"
              title="Options"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)]/95 backdrop-blur-xl p-1.5 shadow-2xl z-50 font-mono text-xs animate-scale-up">
                {onToggleSelect && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleSelect(file.id);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors flex items-center gap-2 cursor-pointer font-medium"
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
                  className="w-full text-left px-3 py-2 rounded-lg text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.75" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
                  </svg>
                  Preview
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    setMenuOpen(false);
                    onDownloadClick(e);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenShare && onOpenShare(file);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" viewBox="0 0 24 24" fill="none">
                    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.75" />
                    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
                    <circle cx="18" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.75" />
                    <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" stroke="currentColor" strokeWidth="1.75" />
                  </svg>
                  Share Options
                </button>
                {onRename && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onRename(file);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.75" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.75" />
                    </svg>
                    Rename File
                  </button>
                )}
                <div className="h-px bg-[var(--theme-border)]/60 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete && onDelete(file.id);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Move to Trash
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle: File Name + Extension Badge + Size/Date */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-xs font-semibold text-[var(--theme-text)] truncate" title={file.name}>
            {file.name}
          </h4>
          <span className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text-muted)]">
            {fileExt}
          </span>
        </div>
        <p className="text-[10px] font-mono text-[var(--theme-text-muted)]">
          {formatBytes(file.size)} <span className="opacity-40">•</span> {formatDate(file.createdAt)}
        </p>
      </div>

      {/* Bottom Bar: Privacy Pill + Quick Download */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--theme-border)]/60 text-[10px] font-mono" onClick={(e) => e.stopPropagation()}>
        <VaultToggle
          isPublic={file.isPublic}
          onToggle={() => onTogglePrivacy && onTogglePrivacy(file)}
        />

        <button
          type="button"
          onClick={onDownloadClick}
          className="p-1 rounded-md text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors cursor-pointer"
          title="Download"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
