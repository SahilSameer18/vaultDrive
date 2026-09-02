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

  return (
    <div
      onClick={handleFolderClick}
      className={`group relative flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 select-none ${
        isFolderSelected
          ? "border-vault-accent ring-1 ring-vault-accent/40 bg-vault-accent/5 shadow-sm"
          : "border-vault-border bg-vault-panel hover:border-vault-accent/50"
      } ${isSelectionMode ? "cursor-pointer" : ""} ${menuOpen ? "z-40" : "z-0"}`}
    >
      {/* Left: Checkbox (auto-shown in selection mode) + Link & Info */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {isSelectionMode && onToggleSelectFolder && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSelectFolder(folder.id);
            }}
            className="p-1 rounded-lg transition-transform shrink-0 cursor-pointer opacity-100 animate-scale-up"
            title={isFolderSelected ? "Deselect Folder" : "Select Folder"}
          >
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                isFolderSelected
                  ? "bg-vault-accent border-vault-accent text-vault-bg"
                  : "border-vault-muted/70 bg-vault-surface hover:border-vault-accent"
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
          className="flex items-center gap-2.5 min-w-0 flex-1"
        >
          <div className="w-8 h-8 rounded-lg bg-vault-surface border border-vault-accent/30 flex items-center justify-center text-vault-accent group-hover:bg-vault-accent group-hover:text-vault-bg transition-colors shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.75" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-vault-text truncate">{folder.name}</p>
            <p className="text-[10px] font-mono text-vault-muted">
              {folder._count?.files || 0} files
            </p>
          </div>
        </Link>
      </div>

      {/* 3-Dots Menu & Arrow */}
      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
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
              {onToggleSelectFolder && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuOpen(false);
                    onToggleSelectFolder(folder.id);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-vault-accent hover:bg-vault-surface transition-colors flex items-center gap-2 cursor-pointer font-medium"
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
                  className="w-full text-left px-3 py-2 rounded-lg text-vault-text hover:bg-vault-surface transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Rename Folder
                </button>
              )}

              {onDeleteFolder && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDeleteFolder(folder);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-vault-danger hover:bg-vault-danger/10 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Delete Folder
                </button>
              )}
            </div>
          )}
        </div>

        {!isSelectionMode && (
          <Link to={`/folder/${folder.id}`} className="text-vault-muted group-hover:text-vault-accent transition-colors ml-1">
            →
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
    <div className="space-y-6">
      {/* ── Subfolders Grid Section ──────────────────────────────────────── */}
      {folders.length > 0 && (
        <div>
          <p className="text-[10px] font-mono tracking-widest text-vault-muted mb-3">
            DIRECTORIES ({folders.length})
          </p>

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
          <p className="text-[10px] font-mono tracking-widest text-vault-muted mb-3">
            FILES ({files.length})
          </p>

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
