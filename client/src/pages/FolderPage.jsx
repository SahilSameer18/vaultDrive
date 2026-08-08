import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFolders } from "../hooks/useFolders";
import { useFiles } from "../hooks/useFiles";
import FolderBreadcrumb from "../components/folder/FolderBreadcrumb";
import CreateFolderModal from "../components/folder/CreateFolderModal";
import { FileCategoryIcon } from "../utils/fileIcons";
import { formatBytes } from "../utils/formatters";

export default function FolderPage() {
  const { folderId } = useParams();
  const { folders, breadcrumbs, loading: foldersLoading, fetchFolders, createFolder } = useFolders(folderId);
  const { files, loading: filesLoading, fetchFiles } = useFiles(folderId);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  useEffect(() => {
    fetchFolders(folderId);
    fetchFiles(folderId);
  }, [folderId, fetchFolders, fetchFiles]);

  const handleCreateFolder = async (name) => {
    await createFolder(name, folderId);
  };

  const isLoading = foldersLoading || filesLoading;

  return (
    <div className="space-y-6 fade-in">
      
      {/* Header & Path */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-vault-border">
        <div>
          <FolderBreadcrumb breadcrumbs={breadcrumbs} />
          <h1 className="text-2xl font-bold tracking-tight text-vault-text mt-1">
            Directory Contents
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFolderModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-vault-border bg-vault-panel text-xs font-semibold text-vault-text hover:border-vault-accent hover:text-vault-accent transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Subfolder
          </button>
        </div>
      </div>

      {/* Directory Content List */}
      {isLoading ? (
        <div className="py-12 flex items-center justify-center text-xs font-mono text-vault-muted">
          <span className="w-2 h-2 rounded-full bg-vault-accent animate-ping mr-2" />
          Loading directory contents...
        </div>
      ) : !folders.length && !files.length ? (
        <div className="min-h-[300px] rounded-2xl border border-dashed border-vault-border bg-vault-panel/20 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-vault-panel border border-vault-accent/30 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.75" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-vault-text">This folder is empty</h3>
          <p className="text-xs text-vault-muted mt-1">Upload files or create subfolders to populate this directory.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Folders List */}
          {folders.length > 0 && (
            <div>
              <p className="text-[10px] font-mono tracking-wider text-vault-muted mb-3">SUBFOLDERS ({folders.length})</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {folders.map((f) => (
                  <div key={f.id} className="p-3.5 rounded-xl border border-vault-border bg-vault-panel hover:border-vault-accent/40 transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-vault-accent shrink-0" viewBox="0 0 24 24" fill="none">
                      <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.75" />
                    </svg>
                    <span className="text-xs font-medium text-vault-text truncate">{f.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files List */}
          {files.length > 0 && (
            <div>
              <p className="text-[10px] font-mono tracking-wider text-vault-muted mb-3">FILES ({files.length})</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {files.map((file) => (
                  <div key={file.id} className="p-3.5 rounded-xl border border-vault-border bg-vault-panel hover:border-vault-accent/40 transition-colors flex items-center gap-3">
                    <FileCategoryIcon mimetype={file.mimeType} className="w-5 h-5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-vault-text truncate">{file.name}</p>
                      <p className="text-[10px] font-mono text-vault-muted mt-0.5">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <CreateFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

    </div>
  );
}
