import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Helper function to build folder hierarchy tree from flat array
export function buildFolderTree(flatFolders = []) {
  const map = {};
  const roots = [];

  flatFolders.forEach((f) => {
    map[f.id] = { ...f, children: [] };
  });

  flatFolders.forEach((f) => {
    if (f.parentId && map[f.parentId]) {
      map[f.parentId].children.push(map[f.id]);
    } else {
      roots.push(map[f.id]);
    }
  });

  return roots;
}

export default function FolderSidebar({ folders = [], onSelectFolder, onRenameFolder, onDeleteFolder }) {
  const [expanded, setExpanded] = useState({});
  const location = useLocation();

  // Extract current folder ID from path /folder/:folderId
  const folderMatch = location.pathname.match(/\/folder\/([^/]+)/);
  const activeFolderId = folderMatch ? folderMatch[1] : null;

  // Auto-expand parent folders of active folder
  useEffect(() => {
    if (activeFolderId && folders.length > 0) {
      const activeFolder = folders.find((f) => f.id === activeFolderId);
      if (activeFolder && activeFolder.parentId) {
        let parentId = activeFolder.parentId;
        const newExpanded = {};
        while (parentId) {
          newExpanded[parentId] = true;
          const parent = folders.find((f) => f.id === parentId);
          parentId = parent ? parent.parentId : null;
        }
        setExpanded((prev) => ({ ...prev, ...newExpanded }));
      }
    }
  }, [activeFolderId, folders]);

  const toggleExpand = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRenameClick = (folder, e) => {
    e.preventDefault();
    e.stopPropagation();
    onRenameFolder && onRenameFolder(folder);
  };

  const handleDeleteClick = (folder, e) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteFolder && onDeleteFolder(folder);
  };

  const tree = buildFolderTree(folders);

  if (!tree.length) return null;

  const renderNodes = (nodes, depth = 0) => (
    <div className={`space-y-1 text-xs font-mono ${depth > 0 ? "pl-3.5 border-l border-vault-border/50 ml-2 mt-1" : ""}`}>
      {nodes.map((folder) => {
        const isActive = activeFolderId === folder.id;
        const isExpanded = expanded[folder.id];
        const hasChildren = folder.children && folder.children.length > 0;

        return (
          <div key={folder.id} className="space-y-1">
            <div
              className={`group flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? "bg-vault-panel text-vault-accent border border-vault-accent/40 font-semibold shadow-md"
                  : "text-vault-muted hover:text-vault-text hover:bg-vault-panel/60 border border-transparent"
              }`}
            >
              <Link
                to={`/folder/${folder.id}`}
                onClick={() => onSelectFolder && onSelectFolder(folder.id)}
                className="flex items-center gap-2 min-w-0 flex-1"
              >
                <svg
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-vault-accent" : "text-vault-muted"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.75" />
                </svg>
                <span className="truncate">{folder.name}</span>
              </Link>

              <div className="flex items-center gap-1 shrink-0">
                {/* SVG Pencil Edit Icon */}
                {onRenameFolder && (
                  <button
                    type="button"
                    onClick={(e) => handleRenameClick(folder, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-vault-muted hover:text-vault-accent transition-opacity"
                    title="Rename Folder"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.75" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.75" />
                    </svg>
                  </button>
                )}

                {/* SVG Trash Bin Icon */}
                {onDeleteFolder && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(folder, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-vault-muted hover:text-vault-danger transition-opacity"
                    title="Delete Folder"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}

                {hasChildren && (
                  <button
                    type="button"
                    onClick={(e) => toggleExpand(folder.id, e)}
                    className="p-1 rounded text-vault-muted hover:text-vault-text hover:bg-vault-surface transition-colors"
                  >
                    {isExpanded ? "−" : "+"}
                  </button>
                )}
              </div>
            </div>

            {/* Subfolders Tree */}
            {isExpanded && hasChildren && (
              <div className="animate-accordion-down overflow-hidden">
                {renderNodes(folder.children, depth + 1)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-2">
      <p className="px-3 text-[10px] font-mono tracking-widest text-vault-muted uppercase">
        DIRECTORIES
      </p>
      {renderNodes(tree)}
    </div>
  );
}
