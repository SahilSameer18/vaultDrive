import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFolders } from "../hooks/useFolders";
import { useFiles } from "../hooks/useFiles";
import { useToast } from "../components/ui/Toast";

import FolderBreadcrumb from "../components/folder/FolderBreadcrumb";
import FileGrid from "../components/file/FileGrid";
import FileSkeleton from "../components/ui/FileSkeleton";
import UploadModal from "../components/file/UploadModal";
import ShareModal from "../components/file/ShareModal";
import CreateFolderModal from "../components/folder/CreateFolderModal";

export default function FolderPage() {
  const { folderId } = useParams();
  const { addToast } = useToast();

  const [viewMode, setViewMode]               = useState("grid");
  const [isUploadOpen, setIsUploadOpen]       = useState(false);
  const [isFolderOpen, setIsFolderOpen]       = useState(false);
  const [shareFile, setShareFile]             = useState(null);

  const { folders, breadcrumbs, loading: foldersLoading, fetchFolders, createFolder } = useFolders(folderId);
  const { files, loading: filesLoading, fetchFiles, uploadFile, togglePrivacy, deleteFile, updateFileInState } = useFiles(folderId);

  useEffect(() => {
    fetchFolders(folderId);
    fetchFiles(folderId);

    const handleUploadEvent = () => {
      fetchFiles(folderId);
      fetchFolders(folderId);
    };

    window.addEventListener("vault:file-uploaded", handleUploadEvent);
    return () => window.removeEventListener("vault:file-uploaded", handleUploadEvent);
  }, [folderId, fetchFolders, fetchFiles]);

  // Handlers
  const handleCreateFolder = async (name) => {
    try {
      await createFolder(name, folderId);
      addToast(`Subfolder "${name}" created`, "success");
    } catch {
      addToast("Failed to create subfolder", "error");
    }
  };

  const handleUploadFile = async (file, onProgress) => {
    try {
      await uploadFile(file, folderId, onProgress);
      addToast(`File "${file.name}" uploaded to folder`, "success");
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

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await deleteFile(fileId);
      addToast("File deleted from vault", "info");
      window.dispatchEvent(new CustomEvent("vault:files-changed"));
    } catch {
      addToast("Failed to delete file", "error");
    }
  };

  const handleShareUpdate = (updatedFile) => {
    setShareFile(updatedFile);
    updateFileInState(updatedFile);
  };

  const isLoading = foldersLoading || filesLoading;
  const hasItems  = folders.length > 0 || files.length > 0;

  return (
    <div className="space-y-6 fade-in select-none">
      
      {/* ── Header & Path ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-vault-border">
        <div>
          <FolderBreadcrumb breadcrumbs={breadcrumbs} />
          <h1 className="text-2xl font-bold tracking-tight text-vault-text mt-1">
            {breadcrumbs[breadcrumbs.length - 1]?.name || "Directory Contents"}
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

          {/* New Subfolder */}
          <button
            type="button"
            onClick={() => setIsFolderOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-vault-border bg-vault-panel text-xs font-semibold text-vault-text hover:border-vault-accent hover:text-vault-accent transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Subfolder
          </button>

          {/* Upload to this Folder */}
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

      {/* ── Directory Content List ───────────────────────────────────────── */}
      {isLoading ? (
        <FileSkeleton count={8} viewMode={viewMode} />
      ) : hasItems ? (
        <FileGrid
          folders={folders}
          files={files}
          viewMode={viewMode}
          onTogglePrivacy={handleTogglePrivacy}
          onOpenShare={(file) => setShareFile(file)}
          onDeleteFile={handleDeleteFile}
        />
      ) : (
        <div className="min-h-[300px] rounded-2xl border border-dashed border-vault-border bg-vault-panel/20 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-vault-panel border border-vault-accent/30 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.75" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-vault-text">This folder is empty</h3>
          <p className="text-xs text-vault-muted mt-1 mb-4">Upload files or create subfolders to populate this directory.</p>

          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#14161A] bg-vault-accent hover:bg-vault-accent-hover transition-colors shadow-md"
          >
            Upload File Here
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateFolderModal
        isOpen={isFolderOpen}
        onClose={() => setIsFolderOpen(false)}
        onCreateFolder={handleCreateFolder}
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

    </div>
  );
}
