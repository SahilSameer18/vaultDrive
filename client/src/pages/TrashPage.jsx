import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { trashApi } from "../api/trash.api";
import { formatBytes, formatDate } from "../utils/formatters";
import { FileCategoryIcon } from "../utils/fileIcons";
import FileSkeleton from "../components/ui/FileSkeleton";

export default function TrashPage() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({ totalItems: 0, totalBytes: 0 });
  const [currentFolder, setCurrentFolder] = useState(null); // null = top-level, or folder object
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // ID of item being restored/deleted
  const [statusMessage, setStatusMessage] = useState(null);

  // Modals
  const [emptyModalOpen, setEmptyModalOpen] = useState(false);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null);

  // Fetch top-level trash items
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

  // Handle Restore item (file or folder)
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

  // Handle Permanent Delete item
  const handlePermanentDelete = async () => {
    if (!permanentDeleteTarget) return;
    const { id, type, name } = permanentDeleteTarget;
    setActionLoading(id);
    setPermanentDeleteTarget(null);
    try {
      await trashApi.deletePermanently(id, type);
      setStatusMessage({ type: "success", text: `${name} permanently deleted` });
      window.dispatchEvent(new CustomEvent("vault:files-changed"));
      loadTrash();
    } catch {
      setStatusMessage({ type: "error", text: `Failed to permanently delete ${name}` });
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Empty Trash
  const handleEmptyTrash = async () => {
    setActionLoading("empty_all");
    setEmptyModalOpen(false);
    try {
      await trashApi.emptyTrash();
      setStatusMessage({ type: "success", text: "Trash emptied successfully. Storage quota reclaimed." });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-vault-border">
        <div>
          <nav className="flex items-center gap-2 text-xs font-mono text-vault-muted mb-1">
            <Link to="/dashboard" className="text-vault-accent hover:underline">Home</Link>
            <span>/</span>
            {currentFolder ? (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentFolder(null)}
                  className="text-vault-accent hover:underline cursor-pointer"
                >
                  Trash
                </button>
                <span>/</span>
                <span className="text-vault-text font-semibold truncate max-w-[150px]">{currentFolder.name}</span>
              </>
            ) : (
              <span className="text-vault-text font-semibold">Trash</span>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-vault-text">
              {currentFolder ? currentFolder.name : "Trash Bin"}
            </h1>
            {!currentFolder && !loading && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-vault-surface border border-vault-border text-vault-muted">
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-vault-danger/40 bg-vault-danger/10 text-vault-danger hover:bg-vault-danger hover:text-white transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none self-start sm:self-auto"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {actionLoading === "empty_all" ? "Purging…" : "Empty Trash"}
          </button>
        )}
      </div>

      {/* ── Status / Toast Alert Banner ───────────────────────────────────── */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-vault-danger/10 border-vault-danger/30 text-vault-danger"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-vault-muted hover:text-vault-text cursor-pointer ml-3 font-sans"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Info Notice ───────────────────────────────────────────────────── */}
      <div className="p-3.5 rounded-xl border border-vault-accent/20 bg-vault-accent/5 flex items-center gap-3 text-xs text-vault-muted">
        <span className="text-base">💡</span>
        <span>
          Items in Trash do not appear in your drive. You can restore them to their original location or delete them forever.
        </span>
      </div>

      {/* ── Content Area ──────────────────────────────────────────────────── */}
      {loading ? (
        <FileSkeleton count={4} viewMode="grid" />
      ) : isEmpty ? (
        /* Empty State */
        <div className="min-h-[360px] rounded-2xl border border-dashed border-vault-border bg-vault-panel/20 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-vault-panel border border-vault-border flex items-center justify-center mb-3 text-2xl text-vault-muted">
            🗑️
          </div>
          <h3 className="text-base font-bold text-vault-text mb-1">Trash is Empty</h3>
          <p className="text-xs text-vault-muted max-w-sm">
            {currentFolder
              ? "This trashed folder has no files or subfolders inside."
              : "Items you move to Trash will appear here for safe recovery."}
          </p>
          {currentFolder && (
            <button
              type="button"
              onClick={() => setCurrentFolder(null)}
              className="mt-4 px-4 py-2 rounded-xl bg-vault-panel border border-vault-border text-vault-accent text-xs font-semibold hover:bg-vault-surface cursor-pointer"
            >
              ← Back to Main Trash
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Trashed Folders Section */}
          {folders.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-vault-muted">
                Folders ({folders.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {folders.map((folder) => {
                  const isProcessing = actionLoading === folder.id;
                  const totalSub = (folder._count?.files || 0) + (folder._count?.children || 0);

                  return (
                    <div
                      key={folder.id}
                      className="p-4 rounded-xl border border-vault-border bg-vault-panel/60 hover:border-vault-accent/40 transition-[border-color,background-color] duration-150 flex flex-col justify-between group relative"
                    >
                      {/* Top: Folder Info */}
                      <div
                        onClick={() => setCurrentFolder(folder)}
                        className="cursor-pointer flex items-start gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-lg shrink-0">
                          📁
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-vault-text truncate group-hover:text-vault-accent transition-colors" title={folder.name}>
                            {folder.name}
                          </p>
                          <p className="text-[11px] font-mono text-vault-muted mt-0.5">
                            {totalSub} {totalSub === 1 ? "item" : "items"}
                          </p>
                          <p className="text-[10px] text-vault-muted/70 mt-1">
                            Deleted {folder.deletedAt ? formatDate(folder.deletedAt) : "recently"}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Actions: Restore & Delete Permanently */}
                      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-vault-border/50">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleRestore(folder.id, "folder", folder.name)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-vault-surface border border-vault-border hover:border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          title="Restore folder and all contents"
                        >
                          <span>🔄</span>
                          {isProcessing ? "Restoring…" : "Restore"}
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => setPermanentDeleteTarget({ id: folder.id, type: "folder", name: folder.name })}
                          className="p-1.5 rounded-lg bg-vault-surface border border-vault-border hover:border-vault-danger/40 text-vault-danger hover:bg-vault-danger/10 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Permanently"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
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
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-vault-muted">
                Files ({files.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {files.map((file) => {
                  const isProcessing = actionLoading === file.id;

                  return (
                    <div
                      key={file.id}
                      className="p-4 rounded-xl border border-vault-border bg-vault-panel/60 hover:border-vault-accent/40 transition-[border-color,background-color] duration-150 flex flex-col justify-between group"
                    >
                      {/* Top: File Info */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-vault-surface border border-vault-border flex items-center justify-center shrink-0">
                          <FileCategoryIcon mimeType={file.mimeType} className="w-5 h-5 text-vault-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-vault-text truncate group-hover:text-vault-accent transition-colors" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-[11px] font-mono text-vault-muted mt-0.5">
                            {formatBytes(file.size)}
                          </p>
                          <p className="text-[10px] text-vault-muted/70 mt-1">
                            Deleted {file.deletedAt ? formatDate(file.deletedAt) : "recently"}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Actions: Restore & Delete Permanently */}
                      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-vault-border/50">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleRestore(file.id, "file", file.name)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-vault-surface border border-vault-border hover:border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          title="Restore file"
                        >
                          <span>🔄</span>
                          {isProcessing ? "Restoring…" : "Restore"}
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => setPermanentDeleteTarget({ id: file.id, type: "file", name: file.name })}
                          className="p-1.5 rounded-lg bg-vault-surface border border-vault-border hover:border-vault-danger/40 text-vault-danger hover:bg-vault-danger/10 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Permanently"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
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

      {/* ── Empty Trash Confirmation Modal ───────────────────────────────── */}
      {emptyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 fade-in">
          <div className="w-full max-w-md rounded-2xl border border-vault-border bg-vault-panel p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-vault-danger/15 border border-vault-danger/30 flex items-center justify-center text-vault-danger mx-auto text-xl">
              ⚠️
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-vault-text">Empty Entire Trash?</h3>
              <p className="text-xs text-vault-muted leading-relaxed">
                All {stats.totalItems} trashed items and sub-assets will be permanently deleted from cloud storage. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEmptyModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-vault-border bg-vault-surface text-vault-text hover:bg-vault-panel font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEmptyTrash}
                className="flex-1 py-2.5 rounded-xl bg-vault-danger text-white hover:bg-vault-danger/90 font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-vault-danger/20"
              >
                Empty Trash Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Single Item Permanent Delete Modal ────────────────────────────── */}
      {permanentDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 fade-in">
          <div className="w-full max-w-md rounded-2xl border border-vault-border bg-vault-panel p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-vault-danger/15 border border-vault-danger/30 flex items-center justify-center text-vault-danger mx-auto text-xl">
              🗑️
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-vault-text">Permanently Delete Item?</h3>
              <p className="text-xs text-vault-muted leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-vault-text">"{permanentDeleteTarget.name}"</strong>? It will be removed from cloud storage and cannot be restored.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPermanentDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-vault-border bg-vault-surface text-vault-text hover:bg-vault-panel font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePermanentDelete}
                className="flex-1 py-2.5 rounded-xl bg-vault-danger text-white hover:bg-vault-danger/90 font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-vault-danger/20"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

