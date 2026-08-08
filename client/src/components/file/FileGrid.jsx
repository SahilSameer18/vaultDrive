import { Link } from "react-router-dom";
import FileCard from "./FileCard";

export default function FileGrid({
  folders = [],
  files = [],
  viewMode = "grid",
  onTogglePrivacy,
  onOpenShare,
  onDeleteFile,
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
              <Link
                key={folder.id}
                to={`/folder/${folder.id}`}
                className="group flex items-center justify-between p-3.5 rounded-xl border border-vault-border bg-vault-panel hover:border-vault-accent/50 transition-all select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-vault-surface border border-vault-accent/30 flex items-center justify-center text-vault-accent group-hover:bg-vault-accent group-hover:text-[#14161A] transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.75" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-vault-text truncate">{folder.name}</p>
                    <p className="text-[10px] font-mono text-vault-muted">
                      {folder._count?.files || 0} files
                    </p>
                  </div>
                </div>

                <span className="text-vault-muted group-hover:text-vault-accent transition-colors">→</span>
              </Link>
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
                onDelete={onDeleteFile}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
