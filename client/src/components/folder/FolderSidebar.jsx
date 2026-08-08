import { useState } from "react";
import { Link } from "react-router-dom";

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

export default function FolderSidebar({ folders = [], onSelectFolder }) {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tree = buildFolderTree(folders);

  if (!tree.length) return null;

  const renderNodes = (nodes) => (
    <div className="space-y-1 pl-2 text-xs font-mono">
      {nodes.map((folder) => {
        const isExpanded = expanded[folder.id];
        const hasChildren = folder.children && folder.children.length > 0;

        return (
          <div key={folder.id} className="space-y-1">
            <Link
              to={`/folder/${folder.id}`}
              onClick={() => onSelectFolder && onSelectFolder(folder.id)}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg text-vault-muted hover:text-vault-text hover:bg-vault-panel/40 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <svg className="w-4 h-4 text-vault-accent shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.75" />
                </svg>
                <span className="truncate">{folder.name}</span>
              </div>

              {hasChildren && (
                <button
                  type="button"
                  onClick={(e) => toggleExpand(folder.id, e)}
                  className="p-1 text-vault-muted hover:text-vault-text"
                >
                  {isExpanded ? "−" : "+"}
                </button>
              )}
            </Link>

            {/* Subfolders Tree */}
            {isExpanded && hasChildren && renderNodes(folder.children)}
          </div>
        );
      })}
    </div>
  );

  return (
    <div>
      <p className="px-3 text-[10px] font-mono tracking-widest text-vault-muted my-2">DIRECTORIES</p>
      {renderNodes(tree)}
    </div>
  );
}
