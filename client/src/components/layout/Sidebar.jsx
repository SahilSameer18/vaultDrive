import { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation, Link, useNavigate } from "react-router-dom";
import { filesApi } from "../../api/files.api";
import { foldersApi } from "../../api/folders.api";
import { useAuth } from "../../context/AuthContext";
import { formatBytes } from "../../utils/formatters";
import FolderSidebar from "../folder/FolderSidebar";
import RenameFolderModal from "../folder/RenameFolderModal";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";

const TOTAL_QUOTA_BYTES = 1 * 1024 * 1024 * 1024; // 1 GB Quota

export default function Sidebar({ onCloseMobileMenu }) {
  const { user } = useAuth();
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [allFolders, setAllFolders] = useState([]);
  const [totalStorageBytes, setTotalStorageBytes] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const loadStatsAndFolders = useCallback(async () => {
    try {
      // 1. Fetch user directory tree
      const folderRes = await foldersApi.list(null);
      setAllFolders(folderRes.data.data.folders || []);

      // 2. Fetch lightweight aggregated storage stats from database
      const statsRes = await filesApi.getStorageStats();
      const statsData = statsRes.data.data;
      setTotalStorageBytes(statsData.totalBytes || 0);
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    loadStatsAndFolders();

    // Listen for file and folder changes to refresh directory tree and storage bar
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
          navigate("/dashboard");
        }
      }
    } finally {
      setDeleteTarget(null);
    }
  };

  const usedPercentage = Math.min(
    100,
    parseFloat(((totalStorageBytes / TOTAL_QUOTA_BYTES) * 100).toFixed(1))
  );

  return (
    <aside className="w-full lg:w-64 border-r border-vault-border bg-vault-panel/30 flex flex-col justify-between h-full select-none">
      
      {/* ── Top Section: Nav Links & Folder Tree ───────────────────────── */}
      <div className="p-3.5 space-y-4 overflow-y-auto flex-1">
        
        {/* Mobile Drawer Header with Logo & Touch Close Target */}
        <div className="flex items-center justify-between pb-3 border-b border-vault-border/60 lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-vault-surface border border-vault-accent/40 flex items-center justify-center shadow-md">
              <svg className="w-4.5 h-4.5 text-vault-accent" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-vault-text">VaultDrive</span>
              <p className="text-[10px] font-mono text-vault-muted leading-none mt-0.5">Personal Cloud</p>
            </div>
          </div>

          {onCloseMobileMenu && (
            <button
              type="button"
              onClick={onCloseMobileMenu}
              className="p-2 rounded-xl border border-vault-border bg-vault-surface text-vault-muted hover:text-vault-text transition-colors cursor-pointer"
              aria-label="Close navigation menu"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile User Quick Info Pill */}
        <Link
          to="/profile"
          onClick={onCloseMobileMenu}
          className="flex lg:hidden items-center gap-2.5 p-2.5 rounded-xl bg-vault-surface/60 border border-vault-border/60 hover:border-vault-accent/50 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-vault-accent/15 border border-vault-accent/40 flex items-center justify-center text-vault-accent font-mono font-bold text-xs">
            {user?.username?.charAt(0)?.toUpperCase() || "V"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-vault-text truncate">{user?.username || "Vault User"}</p>
            <p className="text-[10px] font-mono text-vault-muted truncate">{user?.email}</p>
          </div>
          <svg className="w-3.5 h-3.5 text-vault-muted" viewBox="0 0 24 24" fill="none">
            <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* Core Navigation Links */}
        <nav className="space-y-1">
          <NavLink
            to="/dashboard"
            onClick={onCloseMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-vault-panel text-vault-accent border border-vault-accent/30 font-semibold shadow-sm"
                  : "text-vault-muted hover:text-vault-text hover:bg-vault-panel/50 border border-transparent"
              }`
            }
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.75" />
            </svg>
            My Vault
          </NavLink>

          <NavLink
            to="/shared"
            onClick={onCloseMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-vault-panel text-vault-accent border border-vault-accent/30 font-semibold shadow-sm"
                  : "text-vault-muted hover:text-vault-text hover:bg-vault-panel/50 border border-transparent"
              }`
            }
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
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
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-vault-panel text-vault-accent border border-vault-accent/30 font-semibold shadow-sm"
                  : "text-vault-muted hover:text-vault-text hover:bg-vault-panel/50 border border-transparent"
              }`
            }
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            Recent Activity
          </NavLink>

          <NavLink
            to="/trash"
            onClick={onCloseMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-vault-panel text-vault-accent border border-vault-accent/30 font-semibold shadow-sm"
                  : "text-vault-muted hover:text-vault-text hover:bg-vault-panel/50 border border-transparent"
              }`
            }
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Trash Bin
          </NavLink>
        </nav>

        {/* Directory Folder Tree */}
        {allFolders.length > 0 && (
          <div className="pt-3 border-t border-vault-border/50">
            <FolderSidebar
              folders={allFolders}
              onSelectFolder={onCloseMobileMenu}
              onRenameFolder={(folder) => setRenameTarget(folder)}
              onDeleteFolder={(folder) => setDeleteTarget(folder)}
            />
          </div>
        )}

      </div>

      {/* ── Bottom Section: Sleek Storage Card (Clickable to /storage) ─ */}
      <Link
        to="/storage"
        onClick={onCloseMobileMenu}
        className="p-3.5 border-t border-vault-border bg-vault-panel/40 hover:bg-vault-panel/70 transition-colors shrink-0 space-y-2 block group cursor-pointer"
        title="View Storage Breakdown"
      >
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-vault-muted group-hover:text-vault-text transition-colors font-medium">Storage Used</span>
          <span className="text-vault-accent font-semibold flex items-center gap-1">
            {formatBytes(totalStorageBytes)} <span className="text-vault-muted font-normal">/ 1 GB</span>
            <svg className="w-3 h-3 text-vault-muted group-hover:text-vault-accent group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24" fill="none">
              <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {/* Sleek Gradient Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-vault-surface border border-vault-border overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-vault-accent to-amber-400 transition-all duration-300 rounded-full group-hover:brightness-110"
            style={{ width: `${Math.max(1, usedPercentage)}%` }}
            title={`${usedPercentage}% used`}
          />
        </div>
      </Link>

      {/* Rename Folder Modal */}
      <RenameFolderModal
        isOpen={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        folder={renameTarget}
        onRenameFolder={handleRenameSubmit}
      />

      {/* Delete / Move to Trash Folder Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Move Folder to Trash"
        description="Are you sure you want to move this folder to Trash? All subfolders and files inside will be moved to Trash together and can be restored anytime."
        itemName={deleteTarget?.name || ""}
        confirmText="Move to Trash"
        onConfirm={handleDeleteSubmit}
      />

    </aside>
  );
}
