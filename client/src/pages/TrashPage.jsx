import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { trashApi } from "../api/trash.api";
import { formatBytes, formatDate } from "../utils/formatters";
import { FileCategoryIcon } from "../utils/fileIcons";
import FileSkeleton from "../components/ui/FileSkeleton";
import DeleteConfirmModal from "../components/ui/DeleteConfirmModal";

export default function TrashPage() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({ totalItems: 0, totalBytes: 0 });
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Modals
  const [emptyModalOpen, setEmptyModalOpen] = useState(false);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null);

  const loadTrash = useCallback(async () => {
    setLoading(true);
    try {
      if (currentFolder) {
        const res = await trashApi.getFolderById(currentFolder.id);
        const folderData = res.data.data.folder;
        setFolders(folderData.children || []);
        setFiles(folderData.files || []);
      } else {
        const res = await trashApi.list();
        const data = res.data.data;
        setFolders(data.folders || []);
        setFiles(data.files || []);
        setStats({
          totalItems: data.totalTrashedItems || 0,
          totalBytes: data.totalTrashedBytes || 0,
        });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Failed to load Trash items" });
    } finally {
      setLoading(false);
    }
  }, [currentFolder]);

  useEffect(() => {
    loadTrash();
  }, [loadTrash]);

  const handleRestore = async (id, type, name) => {
    setActionLoading(id);
    try {
      const res = await trashApi.restore(id, type);
      const message = res.data.message || `${name} restored successfully`;
      setStatusMessage({ type: "success", text: message });
      window.dispatchEvent(new CustomEvent("vault:files-changed"));
      loadTrash();
    } catch {
      setStatusMessage({ type: "error", text: `Failed to restore ${name}` });
    } finally {
      setActionLoading(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!permanentDeleteTarget) return;
    const { id, type, name } = permanentDeleteTarget;
    setActionLoading(id);
    setPermanentDeleteTarget(null);
    try {
      await trashApi.deletePermanently(id, type);
      setStatusMessage({ type: "success", text: `${name} permanently purged` });
      window.dispatchEvent(new CustomEvent("vault:files-changed"));
      loadTrash();
    } catch {
      setStatusMessage({ type: "error", text: `Failed to permanently purge ${name}` });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEmptyTrash = async () => {
    setActionLoading("empty_all");
    setEmptyModalOpen(false);
    try {
      await trashApi.emptyTrash();
      setStatusMessage({ type: "success", text: "Trash purged successfully. Storage quota reclaimed." });
      window.dispatchEvent(new CustomEvent("vault:files-changed"));
      loadTrash();
    } catch {
      setStatusMessage({ type: "error", text: "Failed to empty Trash" });
    } finally {
      setActionLoading(null);
    }
  };

  const isEmpty = folders.length === 0 && files.length === 0;

  return (
    <div className="space-y-6 fade-in select-none pb-12">
      
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--theme-border)]">
        <div>
          <nav className="flex items-center gap-2 text-xs font-mono text-[var(--theme-text-muted)] mb-1">
            <Link to="/dashboard" className="text-[var(--theme-accent)] hover:underline flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
              ROOT
            </Link>
            <span className="text-[var(--theme-border)]">/</span>
            {currentFolder ? (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentFolder(null)}
                  className="text-[var(--theme-accent)] hover:underline cursor-pointer"
                >
                  Trash Bin
                </button>
                <span className="text-[var(--theme-border)]">/</span>
                <span className="text-[var(--theme-text)] font-semibold truncate max-w-[150px]">{currentFolder.name}</span>
              </>
            ) : (
              <span className="text-[var(--theme-text)] font-semibold">Trash Bin</span>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--theme-text)]">
              {currentFolder ? currentFolder.name : "Trash Bin"}
            </h1>
            {!currentFolder && !loading && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text-muted)] shadow-inner">
                {stats.totalItems} {stats.totalItems === 1 ? "item" : "items"} ({formatBytes(stats.totalBytes)})
              </span>
            )}
          </div>
        </div>

        {/* Empty Trash Button (Top Right) */}
        {!currentFolder && (
          <button
            type="button"
            disabled={isEmpty || loading || actionLoading === "empty_all"}
            onClick={() => setEmptyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono border border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none self-start sm:self-auto shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{actionLoading === "empty_all" ? "Purging…" : "Purge All Trash"}</span>
          </button>
        )}
      </div>

      {/* ── Status Alert Banner ───────────────────────────────────── */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono shadow-sm animate-scale-up ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusMessage.type === "success" ? "bg-emerald-400" : "bg-rose-500"}`} />
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] cursor-pointer ml-3 font-sans"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Info Notice ───────────────────────────────────────────────────── */}
      <div className="p-3.5 rounded-xl border border-[var(--theme-accent)]/20 bg-[var(--theme-surface)] flex items-center gap-3 text-xs text-[var(--theme-text-muted)] shadow-sm">
        <svg className="w-4 h-4 text-[var(--theme-accent)] shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>
          Trashed items are sequestered from active views. You can restore them to their original location or execute a permanent cryptographic purge.
        </span>
      </div>

      {/* ── Content Area ──────────────────────────────────────────────────── */}
      {loading ? (
        <FileSkeleton count={4} viewMode="grid" />
      ) : isEmpty ? (
        /* Empty State */
        <div className="min-h-[360px] rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-panel)]/30 flex flex-col items-center justify-center p-8 text-center shadow-inner">
          <div className="w-16 h-16 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center mb-3 text-[var(--theme-accent)] shadow-md">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[var(--theme-text)] mb-1">Trash Bin is Empty</h3>
          <p className="text-xs text-[var(--theme-text-muted)] max-w-sm leading-relaxed">
            {currentFolder
              ? "This trashed folder has no files or subfolders inside."
              : "Items you move to Trash will appear here for safe recovery."}
          </p>
          {currentFolder && (
            <button
              type="button"
              onClick={() => setCurrentFolder(null)}
              className="mt-4 px-4 py-2 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-accent)] text-xs font-mono font-semibold hover:border-[var(--theme-accent)]/50 cursor-pointer shadow-sm"
            >
              ← Return to Main Trash Bin
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Trashed Folders Section */}
          {folders.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
                <h2 className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--theme-text-muted)]">
                  DIRECTORIES ({folders.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {folders.map((folder) => {
                  const isProcessing = actionLoading === folder.id;
                  const totalSub = (folder._count?.files || 0) + (folder._count?.children || 0);

                  return (
                    <div
                      key={folder.id}
                      className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)] hover:border-[var(--theme-accent)]/40 transition-all flex flex-col justify-between group relative shadow-sm"
                    >
                      <div
                        onClick={() => setCurrentFolder(folder)}
                        className="cursor-pointer flex items-start gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-accent)]/30 flex items-center justify-center text-[var(--theme-accent)] shrink-0 shadow-inner">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.75" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[var(--theme-text)] truncate group-hover:text-[var(--theme-accent)] transition-colors" title={folder.name}>
                            {folder.name}
                          </p>
                          <p className="text-[10px] font-mono text-[var(--theme-text-muted)] mt-0.5">
                            {totalSub} {totalSub === 1 ? "item" : "items"}
                          </p>
                          <p className="text-[9px] font-mono text-[var(--theme-text-muted)]/70 mt-1">
                            {folder.deletedAt ? formatDate(folder.deletedAt) : "Recently"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[var(--theme-border)]/50">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleRestore(folder.id, "folder", folder.name)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] hover:border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-semibold text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          title="Restore folder and all contents"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{isProcessing ? "Restoring…" : "Restore"}</span>
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => setPermanentDeleteTarget({ id: folder.id, type: "folder", name: folder.name })}
                          className="p-1.5 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] hover:border-rose-500/40 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                          title="Purge Permanently"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Trashed Files Section */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
                <h2 className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--theme-text-muted)]">
                  ASSETS ({files.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {files.map((file) => {
                  const isProcessing = actionLoading === file.id;

                  return (
                    <div
                      key={file.id}
                      className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)] hover:border-[var(--theme-accent)]/40 transition-all flex flex-col justify-between group shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center shrink-0 shadow-inner">
                          <FileCategoryIcon mimetype={file.mimeType} className="w-5 h-5 text-[var(--theme-accent)]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[var(--theme-text)] truncate group-hover:text-[var(--theme-accent)] transition-colors" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-[10px] font-mono text-[var(--theme-text-muted)] mt-0.5">
                            {formatBytes(file.size)}
                          </p>
                          <p className="text-[9px] font-mono text-[var(--theme-text-muted)]/70 mt-1">
                            {file.deletedAt ? formatDate(file.deletedAt) : "Recently"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[var(--theme-border)]/50">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleRestore(file.id, "file", file.name)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] hover:border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-semibold text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          title="Restore file"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{isProcessing ? "Restoring…" : "Restore"}</span>
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => setPermanentDeleteTarget({ id: file.id, type: "file", name: file.name })}
                          className="p-1.5 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] hover:border-rose-500/40 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                          title="Purge Permanently"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Permanent Delete */}
      <DeleteConfirmModal
        isOpen={!!permanentDeleteTarget}
        onClose={() => setPermanentDeleteTarget(null)}
        title="Permanent Purge"
        description="This asset will be permanently erased from secure storage. This action is irreversible."
        itemName={permanentDeleteTarget?.name || ""}
        confirmText="Purge Forever"
        isPermanent={true}
        onConfirm={handlePermanentDelete}
      />

      {/* Confirmation Modal for Empty Trash */}
      <DeleteConfirmModal
        isOpen={emptyModalOpen}
        onClose={() => setEmptyModalOpen(false)}
        title="Purge Entire Trash Bin"
        description="All files and directories in Trash will be permanently erased. Encrypted storage blocks will be reclaimed immediately."
        itemName={`All ${stats.totalItems} trashed payload(s)`}
        confirmText="Purge All"
        isPermanent={true}
        onConfirm={handleEmptyTrash}
      />

    </div>
  );
}
