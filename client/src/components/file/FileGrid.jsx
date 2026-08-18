import { Link } from "react-router-dom";
import FileCard from "./FileCard";

export default function FileGrid({
  folders = [],
  files = [],
  viewMode = "grid",
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
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
                : "space-y-2"
            }
          >
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="group relative flex items-center justify-between p-3.5 rounded-xl border border-vault-border bg-vault-panel hover:border-vault-accent/50 transition-all select-none"
              >
                <Link
                  to={`/folder/${folder.id}`}
                  className="flex items-center gap-3 min-w-0 flex-1"
                >
                  <div className="w-8 h-8 rounded-lg bg-vault-surface border border-vault-accent/30 flex items-center justify-center text-vault-accent group-hover:bg-vault-accent group-hover:text-[#14161A] transition-colors shrink-0">
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

                <div className="flex items-center gap-1 shrink-0">
                  {onRenameFolder && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRenameFolder(folder);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-vault-muted hover:text-vault-accent hover:bg-vault-surface transition-all"
                      title="Rename Folder"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.75" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.75" />
                      </svg>
                    </button>
                  )}

                  {onDeleteFolder && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDeleteFolder(folder);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-vault-muted hover:text-vault-danger hover:bg-vault-danger/10 transition-all"
                      title="Delete Folder"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}

                  <Link to={`/folder/${folder.id}`} className="text-vault-muted group-hover:text-vault-accent transition-colors ml-1">
                    →
                  </Link>
                </div>
              </div>
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
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                : "space-y-2"
            }
          >
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                viewMode={viewMode}
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
