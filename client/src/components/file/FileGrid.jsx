import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import FileCard from "./FileCard";

function FolderItem({
  folder,
  isFolderSelected,
  isSelectionMode,
  onToggleSelectFolder,
  onRenameFolder,
  onDeleteFolder,
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

  const handleFolderClick = (e) => {
    if (isSelectionMode && onToggleSelectFolder) {
      e.preventDefault();
      e.stopPropagation();
      onToggleSelectFolder(folder.id);
    }
  };

  const fileCount = folder._count?.files ?? 0;

  return (
    <div
      onClick={handleFolderClick}
      className={`group relative flex items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all duration-200 select-none ${
        isFolderSelected
          ? "border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent)]/40 bg-[var(--theme-accent)]/[0.05] shadow-[0_0_16px_rgba(197,160,89,0.08)]"
          : "border-[var(--theme-border)] bg-[var(--theme-panel)] hover:border-white/20 hover:bg-[var(--theme-surface)]/60 shadow-sm"
      } ${isSelectionMode ? "cursor-pointer" : ""} ${menuOpen ? "z-40" : "z-0"}`}
    >
      {/* Left: Checkbox + Link & Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {isSelectionMode && onToggleSelectFolder && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSelectFolder(folder.id);
            }}
            className="p-1 rounded-lg transition-transform shrink-0 cursor-pointer animate-scale-up"
            title={isFolderSelected ? "Deselect Folder" : "Select Folder"}
          >
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                isFolderSelected
                  ? "bg-[var(--theme-accent)] border-[var(--theme-accent)] text-[#0d0f12] shadow-[0_0_8px_rgba(197,160,89,0.5)]"
                  : "border-[var(--theme-border)] bg-[var(--theme-surface)] hover:border-white/30"
              }`}
            >
              {isFolderSelected && (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </button>
        )}

        <Link
          to={isSelectionMode ? "#" : `/folder/${folder.id}`}
          onClick={(e) => {
            if (isSelectionMode) {
              e.preventDefault();
            }
          }}
          className="flex items-center gap-3 min-w-0 flex-1"
        >
          <div className="w-9 h-9 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-text-muted)] group-hover:border-white/20 transition-all shrink-0 shadow-inner">
            <svg className="w-4 h-4 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none">
              <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.75" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--theme-text)] truncate">
              {folder.name}
            </p>
            <p className="text-[10px] font-mono text-[var(--theme-text-muted)] mt-0.5">
              {fileCount} {fileCount === 1 ? "file" : "files"}
            </p>
          </div>
        </Link>
      </div>

      {/* 3-Dots Menu & Arrow */}
      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="p-1.5 rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors cursor-pointer"
            title="Folder Options"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="5" r="1.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="19" r="1.5" fill="currentColor" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)]/95 backdrop-blur-xl p-1.5 shadow-2xl z-50 text-xs animate-scale-up">
              {onToggleSelectFolder && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuOpen(false);
                    onToggleSelectFolder(folder.id);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors flex items-center gap-2 cursor-pointer font-medium"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                    {isFolderSelected && <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
                  </svg>
                  {isFolderSelected ? "Deselect Folder" : "Select Folder"}
                </button>
              )}

              {onRenameFolder && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuOpen(false);
                    onRenameFolder(folder);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.75" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.75" />
                  </svg>
                  Rename Folder
                </button>
              )}

              <div className="h-px bg-[var(--theme-border)]/60 my-1" />

              {onDeleteFolder && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDeleteFolder(folder);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Delete Folder
                </button>
              )}
            </div>
          )}
        </div>

        {!isSelectionMode && (
          <Link
            to={`/folder/${folder.id}`}
            className="text-[var(--theme-text-muted)] group-hover:text-[var(--theme-text)] group-hover:translate-x-0.5 transition-all p-1"
            title="Open Folder"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function FileGrid({
  folders = [],
  files = [],
  viewMode = "grid",
  selectedFileIds = new Set(),
  selectedFolderIds = new Set(),
  isSelectionMode = false,
  onToggleSelectFile,
  onToggleSelectFolder,
  onTogglePrivacy,
  onOpenShare,
  onRenameFile,
  onDeleteFile,
  onRenameFolder,
  onDeleteFolder,
  onPreviewFile,
}) {
  return (
    <div className="space-y-7">
      {/* ── Subfolders Grid Section ──────────────────────────────────────── */}
      {folders.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <p className="text-xs text-[var(--theme-text-muted)]">
              Folders ({folders.length})
            </p>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5"
                : "space-y-2"
            }
          >
            {folders.map((folder) => (
              <FolderItem
                key={folder.id}
                folder={folder}
                isFolderSelected={selectedFolderIds.has(folder.id)}
                isSelectionMode={isSelectionMode}
                onToggleSelectFolder={onToggleSelectFolder}
                onRenameFolder={onRenameFolder}
                onDeleteFolder={onDeleteFolder}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Files Grid Section ───────────────────────────────────────────── */}
      {files.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <p className="text-xs text-[var(--theme-text-muted)]">
              Files ({files.length})
            </p>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "space-y-2"
            }
          >
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                viewMode={viewMode}
                isSelected={selectedFileIds.has(file.id)}
                isSelectionMode={isSelectionMode}
                onToggleSelect={onToggleSelectFile}
                onTogglePrivacy={onTogglePrivacy}
                onOpenShare={onOpenShare}
                onRename={onRenameFile}
                onDelete={onDeleteFile}
                onPreview={onPreviewFile}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
