import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useFolders } from "../hooks/useFolders";
import { useFiles } from "../hooks/useFiles";
import { useToast } from "../components/ui/Toast";
import { useSearch } from "../context/SearchContext";

import FileGrid from "../components/file/FileGrid";
import FileSkeleton from "../components/ui/FileSkeleton";
import UploadModal from "../components/file/UploadModal";
import ShareModal from "../components/file/ShareModal";
import FilePreviewModal from "../components/file/FilePreviewModal";
import CreateFolderModal from "../components/folder/CreateFolderModal";
import RenameFolderModal from "../components/folder/RenameFolderModal";
import DeleteConfirmModal from "../components/ui/DeleteConfirmModal";
import FileSortDropdown from "../components/file/FileSortDropdown";
import PaginationControls from "../components/ui/PaginationControls";

export default function DashboardPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { searchQuery, setSearchQuery } = useSearch();

  const [viewMode, setViewMode]               = useState("grid");
  const [isUploadOpen, setIsUploadOpen]       = useState(false);
  const [isFolderOpen, setIsFolderOpen]       = useState(false);
  const [shareFile, setShareFile]             = useState(null);
  const [previewFile, setPreviewFile]         = useState(null);
  const [renameFolderTarget, setRenameFolderTarget] = useState(null);
  const [deleteTarget, setDeleteTarget]       = useState(null);

  const { folders, loading: foldersLoading, fetchFolders, createFolder, renameFolder, deleteFolder } = useFolders(null);
  const { files, loading: filesLoading, sortBy, sortOrder, page, limit, pagination, setSortBy, setSortOrder, setPage, setLimit, fetchFiles, uploadFile, togglePrivacy, deleteFile, updateFileInState } = useFiles(null);

  useEffect(() => {
    fetchFolders(null);
    fetchFiles(null);

    const handleUploadEvent = () => {
      fetchFiles(null);
      fetchFolders(null);
    };

    window.addEventListener("vault:files-changed", handleUploadEvent);
    window.addEventListener("vault:file-uploaded", handleUploadEvent);
    return () => {
      window.removeEventListener("vault:files-changed", handleUploadEvent);
      window.removeEventListener("vault:file-uploaded", handleUploadEvent);
    };
  }, [fetchFolders, fetchFiles]);

  // Handlers
  const handleCreateFolder = async (name) => {
    try {
      await createFolder(name, null);
      addToast(`Folder "${name}" created`, "success");
      window.dispatchEvent(new CustomEvent("vault:files-changed"));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to create folder";
      addToast(msg, "error");
      throw err;
    }
  };

  const handleRenameFolder = async (folderId, newName) => {
    try {
      await renameFolder(folderId, newName);
      addToast(`Folder renamed to "${newName}"`, "success");
      window.dispatchEvent(new CustomEvent("vault:files-changed"));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to rename folder";
      addToast(msg, "error");
      throw err;
    }
  };

  const handleUploadFile = async (file, onProgress) => {
    try {
      await uploadFile(file, null, onProgress);
      addToast(`File "${file.name}" uploaded successfully`, "success");
      window.dispatchEvent(new CustomEvent("vault:files-changed"));
    } catch {
      addToast("File upload failed", "error");
      throw new Error("Upload failed");
    }
  };

  const handleTogglePrivacy = async (file) => {
    try {
      const updated = await togglePrivacy(file.id, file.isPublic);
      addToast(
        `File is now ${updated.isPublic ? "PUBLIC (Share link active)" : "PRIVATE"}`,
        updated.isPublic ? "success" : "info"
      );
      window.dispatchEvent(new CustomEvent("vault:files-changed"));
    } catch {
      addToast("Failed to update privacy status", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "file") {
      try {
        await deleteFile(deleteTarget.item.id);
        addToast("File deleted from vault", "info");
        window.dispatchEvent(new CustomEvent("vault:files-changed"));
      } catch {
        addToast("Failed to delete file", "error");
      }
    } else if (deleteTarget.type === "folder") {
      try {
        await deleteFolder(deleteTarget.item.id);
        addToast(`Folder "${deleteTarget.item.name}" deleted`, "info");
        window.dispatchEvent(new CustomEvent("vault:files-changed"));
      } catch {
        addToast("Failed to delete folder", "error");
      }
    }
  };

  const handleShareUpdate = (updatedFile) => {
    setShareFile(updatedFile);
    updateFileInState(updatedFile);
  };

  const isLoading = foldersLoading || filesLoading;
  const hasItems  = folders.length > 0 || files.length > 0;

  return (
    <div className="min-h-[calc(100vh-7rem)] flex flex-col justify-between fade-in select-none pb-2 space-y-6">
      
      {/* ── Header & Path ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-vault-border">
        <div>
          <nav className="flex items-center gap-2 text-xs font-mono text-vault-muted mb-1">
            <span className="text-vault-accent font-semibold">Home</span>
            <span>/</span>
            <span className="text-vault-text">
              {searchQuery ? `Search results for "${searchQuery}"` : "My Vault"}
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-vault-text">
            {searchQuery ? `Searching "${searchQuery}"` : `Welcome, ${user?.username || "Vault User"}`}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl border border-vault-border bg-vault-panel">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
                viewMode === "grid" ? "bg-vault-surface text-vault-accent shadow-sm" : "text-vault-muted hover:text-vault-text"
              }`}
              title="Grid View"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
                viewMode === "list" ? "bg-vault-surface text-vault-accent shadow-sm" : "text-vault-muted hover:text-vault-text"
              }`}
              title="List View"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Server-Side Sort Control Dropdown */}
          <FileSortDropdown
            sortBy={sortBy}
            sortOrder={sortOrder}
            onChangeSort={(by, order) => {
              setSortBy(by);
              setSortOrder(order);
            }}
          />

          {/* New Folder */}
          <button
            type="button"
            onClick={() => setIsFolderOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-vault-border bg-vault-panel text-xs font-semibold text-vault-text hover:border-vault-accent hover:text-vault-accent transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Folder
          </button>

          {/* Upload File Button */}
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold font-mono text-[#14161A] bg-gradient-to-r from-vault-accent to-vault-accent-hover hover:brightness-110 shadow-md transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Upload File
          </button>
        </div>
      </div>

      {/* ── Content Viewport ─────────────────────────────────────────────── */}
      {isLoading ? (
        <FileSkeleton count={8} viewMode={viewMode} />
      ) : hasItems ? (
        <FileGrid
          folders={folders}
          files={files}
          viewMode={viewMode}
          onTogglePrivacy={handleTogglePrivacy}
          onOpenShare={(file) => setShareFile(file)}
          onPreviewFile={(file) => setPreviewFile(file)}
          onDeleteFile={(fileId) => {
            const f = files.find((item) => item.id === fileId);
            setDeleteTarget({ type: "file", item: f || { id: fileId, name: "File" } });
          }}
          onRenameFolder={(folder) => setRenameFolderTarget(folder)}
          onDeleteFolder={(folder) => setDeleteTarget({ type: "folder", item: folder })}
        />
      ) : searchQuery ? (
        <div className="min-h-[350px] rounded-2xl border border-dashed border-vault-border bg-vault-panel/20 flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-vault-panel border border-vault-accent/30 flex items-center justify-center mb-4 shadow-xl text-vault-accent">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-vault-text mb-1">No matches found for "{searchQuery}"</h3>
          <p className="text-xs text-vault-muted max-w-sm mb-6">
            Check your spelling or search for another file or folder name across your repository.
          </p>

          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-vault-accent border border-vault-accent/40 hover:bg-vault-accent/10 transition-colors cursor-pointer"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="min-h-[400px] rounded-2xl border border-dashed border-vault-border bg-vault-panel/20 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-vault-panel border border-vault-accent/30 flex items-center justify-center mb-4 shadow-xl">
            <svg className="w-8 h-8 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-vault-text mb-1">Your Vault is Empty</h3>
          <p className="text-xs text-vault-muted max-w-sm mb-6">
            Upload files or create subfolders to start organizing your cloud storage repository.
          </p>

          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#14161A] bg-vault-accent hover:bg-vault-accent-hover transition-colors shadow-md"
          >
            Upload First File
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      <PaginationControls
        page={page}
        limit={limit}
        totalCount={pagination.totalCount}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {/* Modals */}
      <CreateFolderModal
        isOpen={isFolderOpen}
        onClose={() => setIsFolderOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

      <RenameFolderModal
        isOpen={!!renameFolderTarget}
        onClose={() => setRenameFolderTarget(null)}
        folder={renameFolderTarget}
        onRenameFolder={handleRenameFolder}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={deleteTarget?.type === "folder" ? "Delete Directory" : "Delete Asset"}
        description={
          deleteTarget?.type === "folder"
            ? "Are you sure you want to delete this folder? Files inside will be safely moved to root."
            : "Are you sure you want to permanently delete this asset from your vault?"
        }
        itemName={deleteTarget?.item?.name || ""}
        onConfirm={handleConfirmDelete}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadFile={handleUploadFile}
      />

      <ShareModal
        isOpen={!!shareFile}
        onClose={() => setShareFile(null)}
        file={shareFile}
        onShareUpdate={handleShareUpdate}
      />

      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />

    </div>
  );
}


