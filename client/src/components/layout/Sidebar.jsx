import { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();
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
    try {
      const deletedId = deleteTarget.id;
      const targetParentId = deleteTarget.parentId;

      await foldersApi.delete(deletedId);
      window.dispatchEvent(new CustomEvent("vault:files-changed"));

      // Extract current active folder ID from URL /folder/:activeFolderId
      const folderMatch = location.pathname.match(/\/folder\/([^/]+)/);
      const activeFolderId = folderMatch ? folderMatch[1] : null;

      if (activeFolderId) {
        let isCurrentOrDescendant = activeFolderId === deletedId;
        if (!isCurrentOrDescendant && allFolders.length > 0) {
          let curr = allFolders.find((f) => f.id === activeFolderId);
          while (curr && curr.parentId) {
            if (curr.parentId === deletedId) {
              isCurrentOrDescendant = true;
              break;
            }
            curr = allFolders.find((f) => f.id === curr.parentId);
          }
        }

        if (isCurrentOrDescendant) {
          const destination = targetParentId ? `/folder/${targetParentId}` : "/dashboard";
          navigate(destination, { replace: true });
        }
      }
    } catch {
      // Handled silently or toast
    } finally {
      setDeleteTarget(null);
    }
  };

  // Compute category percentages proportional to 1 GB total quota (1,073,741,824 bytes)
  const TOTAL_QUOTA_BYTES = 1 * 1024 * 1024 * 1024;
  const imagePct   = (stats.categories.image / TOTAL_QUOTA_BYTES) * 100;
  const mediaPct   = (stats.categories.media / TOTAL_QUOTA_BYTES) * 100;
  const docPct     = (stats.categories.doc / TOTAL_QUOTA_BYTES) * 100;
  const archivePct = (stats.categories.archive / TOTAL_QUOTA_BYTES) * 100;

  return (
    <aside className="w-64 border-r border-vault-border bg-vault-bg flex flex-col justify-between h-full select-none overflow-y-auto">
      
      {/* ── Top Section: Primary Navigation & Folder Directories ──────── */}
      <div className="p-4 space-y-5">
        
        {/* Brand Header — Mobile only (since desktop topbar already shows VaultDrive brand) */}
        <div className="px-3 pt-2 pb-1 flex items-center gap-2.5 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-vault-surface border border-vault-accent/40 flex items-center justify-center shadow-md shrink-0">
            <svg className="w-4.5 h-4.5 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-base tracking-tight text-vault-text">VaultDrive</h2>
            <p className="text-[9px] font-mono tracking-widest text-vault-muted">VAULT REPOSITORY</p>
          </div>
        </div>

        {/* Desktop Repository Tag */}
        <div className="px-3 pt-2 hidden lg:block">
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
            {formatBytes(stats.totalBytes)} / 1 GB
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
