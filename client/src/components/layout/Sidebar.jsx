import { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { filesApi } from "../../api/files.api";
import { foldersApi } from "../../api/folders.api";
import { formatBytes } from "../../utils/formatters";
import { getFileCategory } from "../../utils/fileIcons";
import FolderSidebar from "../folder/FolderSidebar";
import RenameFolderModal from "../folder/RenameFolderModal";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";

export default function Sidebar({ onCloseMobileMenu }) {
  const [allFolders, setAllFolders] = useState([]);
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [stats, setStats] = useState({
    totalBytes: 0,
    categories: {
      image: 0,
      media: 0,
      doc: 0,
      archive: 0,
    },
  });

  const loadStatsAndFolders = useCallback(async () => {
    try {
      // 1. Fetch all user folders (no parentId filter) for directory tree
      const folderRes = await foldersApi.list(null);
      setAllFolders(folderRes.data.data.folders || []);

      // 2. Fetch all user files for storage breakdown
      const res = await filesApi.list(null);
      const files = res.data.data.files || [];

      let total = 0;
      const cats = { image: 0, media: 0, doc: 0, archive: 0 };

      files.forEach((f) => {
        const size = f.size || 0;
        total += size;

        const category = getFileCategory(f.mimeType);
        if (category === "image") {
          cats.image += size;
        } else if (category === "video" || category === "audio") {
          cats.media += size;
        } else if (category === "pdf" || category === "document") {
          cats.doc += size;
        } else {
          cats.archive += size;
        }
      });

      setStats({
        totalBytes: total,
        categories: cats,
      });
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    loadStatsAndFolders();

    // Listen for file and folder changes to refresh directory tree and storage breakdown
    window.addEventListener("vault:files-changed", loadStatsAndFolders);
    window.addEventListener("vault:file-uploaded", loadStatsAndFolders);

    return () => {
      window.removeEventListener("vault:files-changed", loadStatsAndFolders);
      window.removeEventListener("vault:file-uploaded", loadStatsAndFolders);
    };
  }, [loadStatsAndFolders]);

  const handleRenameSubmit = async (folderId, newName) => {
    await foldersApi.update(folderId, { name: newName });
    window.dispatchEvent(new CustomEvent("vault:files-changed"));
  };

  const handleDeleteSubmit = async () => {
    if (!deleteTarget) return;
    await foldersApi.delete(deleteTarget.id);
    window.dispatchEvent(new CustomEvent("vault:files-changed"));
  };

  // Compute category percentages proportional to current totalBytes
  const total = stats.totalBytes || 1;
  const imagePct   = (stats.categories.image / total) * 100;
  const mediaPct   = (stats.categories.media / total) * 100;
  const docPct     = (stats.categories.doc / total) * 100;
  const archivePct = (stats.categories.archive / total) * 100;

  return (
    <aside className="w-64 border-r border-vault-border bg-vault-bg flex flex-col justify-between h-full select-none overflow-y-auto">
      
      {/* ── Top Section: Primary Navigation & Folder Directories ──────── */}
      <div className="p-4 space-y-5">
        
        {/* Repository Header Tag */}
        <div className="px-3 pt-2">
          <p className="text-[10px] font-mono tracking-widest text-vault-muted">
            VAULT REPOSITORY
          </p>
        </div>

        {/* Core Navigation Links */}
        <nav className="space-y-1">
          <NavLink
            to="/dashboard"
            onClick={onCloseMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? "bg-vault-panel text-vault-accent border border-vault-accent/30 font-semibold"
                  : "text-vault-muted hover:text-vault-text hover:bg-vault-panel/50"
              }`
            }
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.75" />
            </svg>
            My Vault
          </NavLink>

          <NavLink
            to="/shared"
            onClick={onCloseMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? "bg-vault-panel text-vault-accent border border-vault-accent/30 font-semibold"
                  : "text-vault-muted hover:text-vault-text hover:bg-vault-panel/50"
              }`
            }
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.75" />
              <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
              <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.75" />
              <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" stroke="currentColor" strokeWidth="1.75" />
            </svg>
            Shared with Me
          </NavLink>

          <NavLink
            to="/recent"
            onClick={onCloseMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? "bg-vault-panel text-vault-accent border border-vault-accent/30 font-semibold"
                  : "text-vault-muted hover:text-vault-text hover:bg-vault-panel/50"
              }`
            }
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            Recent Activity
          </NavLink>
        </nav>

        {/* Dynamic Interactive Directory Folder Tree */}
        {allFolders.length > 0 && (
          <div className="pt-2 border-t border-vault-border/60">
            <FolderSidebar
              folders={allFolders}
              onSelectFolder={onCloseMobileMenu}
              onRenameFolder={(folder) => setRenameTarget(folder)}
              onDeleteFolder={(folder) => setDeleteTarget(folder)}
            />
          </div>
        )}

      </div>

      {/* ── Bottom Section: Proportional Storage Breakdown Bar ─────────── */}
      <div className="p-4 border-t border-vault-border bg-vault-panel/40 shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] font-mono tracking-widest text-vault-muted">STORAGE USED</span>
          <span className="text-[10px] font-mono text-vault-accent font-semibold">
            {formatBytes(stats.totalBytes)} used
          </span>
        </div>

        {/* Proportional 6px Multi-Category Metallic Bar */}
        <div className="h-[6px] rounded-full bg-vault-surface border border-vault-border overflow-hidden flex mb-3.5 shadow-inner">
          {stats.totalBytes > 0 ? (
            <>
              {imagePct > 0 && (
                <div
                  className="h-full bg-[#6FA88A] transition-all duration-300"
                  style={{ width: `${imagePct}%` }}
                  title={`Images: ${formatBytes(stats.categories.image)}`}
                />
              )}
              {mediaPct > 0 && (
                <div
                  className="h-full bg-[#B8935A] transition-all duration-300"
                  style={{ width: `${mediaPct}%` }}
                  title={`Media: ${formatBytes(stats.categories.media)}`}
                />
              )}
              {docPct > 0 && (
                <div
                  className="h-full bg-[#38BDF8] transition-all duration-300"
                  style={{ width: `${docPct}%` }}
                  title={`Docs: ${formatBytes(stats.categories.doc)}`}
                />
              )}
              {archivePct > 0 && (
                <div
                  className="h-full bg-[#8B8F99] transition-all duration-300"
                  style={{ width: `${archivePct}%` }}
                  title={`Archives: ${formatBytes(stats.categories.archive)}`}
                />
              )}
            </>
          ) : (
            <div className="h-full w-full bg-vault-surface" />
          )}
        </div>

        {/* Category Legend */}
        <div className="grid grid-cols-2 gap-y-2 text-[9px] font-mono text-vault-muted">
          <span className="flex items-center gap-1.5" title={formatBytes(stats.categories.image)}>
            <span className="w-2 h-2 rounded-full bg-[#6FA88A]" /> Images
          </span>
          <span className="flex items-center gap-1.5" title={formatBytes(stats.categories.media)}>
            <span className="w-2 h-2 rounded-full bg-[#B8935A]" /> Video & Audio
          </span>
          <span className="flex items-center gap-1.5" title={formatBytes(stats.categories.doc)}>
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> Docs & PDFs
          </span>
          <span className="flex items-center gap-1.5" title={formatBytes(stats.categories.archive)}>
            <span className="w-2 h-2 rounded-full bg-[#8B8F99]" /> Archives & Other
          </span>
        </div>
      </div>

      <RenameFolderModal
        isOpen={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        folder={renameTarget}
        onRenameFolder={handleRenameSubmit}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Directory"
        description="Are you sure you want to delete this folder? Files inside will be safely moved to root."
        itemName={deleteTarget?.name || ""}
        onConfirm={handleDeleteSubmit}
      />

    </aside>
  );
}
