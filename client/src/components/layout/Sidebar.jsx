import { NavLink } from "react-router-dom";

export default function Sidebar({ onCloseMobileMenu }) {
  return (
    <aside className="w-64 border-r border-vault-border bg-vault-bg flex flex-col justify-between h-full select-none">
      
      {/* ── Top Section: Actions & Primary Nav ───────────────────────────── */}
      <div className="p-4 space-y-6">
        
        {/* Quick Action Button */}
        <button
          type="button"
          className="w-full py-3 px-4 rounded-xl text-xs font-semibold font-mono text-[#14161A] bg-gradient-to-r from-vault-accent to-vault-accent-hover hover:brightness-110 shadow-lg shadow-vault-accent/10 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          UPLOAD FILE
        </button>

        {/* Core Navigation Links */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-mono tracking-widest text-vault-muted mb-2">
            REPOSITORY
          </p>

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

      </div>

      {/* ── Bottom Section: Storage Allocation Visualizer ───────────────── */}
      <div className="p-4 border-t border-vault-border bg-vault-panel/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono tracking-wider text-vault-muted">STORAGE ALLOCATION</span>
          <span className="text-[10px] font-mono text-vault-accent">12.4 MB / 100 MB</span>
        </div>

        {/* Multi-category Progress Bar */}
        <div className="h-2 rounded-full bg-vault-surface border border-vault-border overflow-hidden flex mb-3">
          <div className="h-full bg-vault-success" style={{ width: "20%" }} title="Images" />
          <div className="h-full bg-vault-accent" style={{ width: "15%" }} title="Videos" />
          <div className="h-full bg-vault-sky" style={{ width: "10%" }} title="Documents" />
          <div className="h-full bg-vault-muted" style={{ width: "5%" }} title="Archives" />
        </div>

        {/* Category Legend */}
        <div className="grid grid-cols-2 gap-y-1 text-[9px] font-mono text-vault-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-vault-success" /> Images
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-vault-accent" /> Video & Audio
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-vault-sky" /> Documents
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-vault-muted" /> Archives
          </span>
        </div>
      </div>

    </aside>
  );
}
