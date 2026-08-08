import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ onToggleMobileMenu }) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-vault-border bg-vault-bg/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      
      {/* ── Left: Mobile Toggle & Brand ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg border border-vault-border bg-vault-panel text-vault-muted hover:text-vault-text hover:border-vault-accent transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>

        {/* Brand Link */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-vault-surface border border-vault-accent/40 flex items-center justify-center shadow-md group-hover:border-vault-accent transition-colors">
            <svg className="w-4.5 h-4.5 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight text-vault-text">VaultDrive</span>
        </Link>
      </div>

      {/* ── Center: Search Input Bar ─────────────────────────────────────── */}
      <div className="hidden md:flex items-center max-w-md w-full mx-6 relative">
        <span className="absolute left-3.5 text-vault-muted pointer-events-none">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search files and folders..."
          className="w-full pl-10 pr-12 py-2 rounded-xl bg-vault-panel border border-vault-border text-vault-text text-xs placeholder:text-vault-muted/40 focus:border-vault-accent focus:outline-none transition-colors"
        />
        <kbd className="absolute right-3 px-1.5 py-0.5 rounded border border-vault-border bg-vault-surface text-[10px] font-mono text-vault-muted pointer-events-none">
          ⌘K
        </kbd>
      </div>

      {/* ── Right: User Identity & Profile Dropdown ──────────────────────── */}
      <div className="flex items-center gap-3" ref={menuRef}>
        
        {/* User Identity Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-vault-border bg-vault-panel hover:border-vault-accent/60 transition-all cursor-pointer"
          >
            {/* Avatar Circle */}
            <div className="w-7 h-7 rounded-lg bg-vault-accent/15 border border-vault-accent/40 flex items-center justify-center text-vault-accent font-mono font-bold text-xs">
              {user?.username?.charAt(0)?.toUpperCase() || "V"}
            </div>
            
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-vault-text leading-none">{user?.username || "User"}</p>
              <p className="text-[10px] font-mono text-vault-muted leading-none mt-1 truncate max-w-[120px]">
                {user?.email || "user@vault.com"}
              </p>
            </div>

            <svg
              className={`w-3.5 h-3.5 text-vault-muted transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-vault-border bg-vault-panel shadow-2xl p-1.5 z-50 fade-in">
              <div className="px-3 py-2 border-b border-vault-border mb-1">
                <p className="text-xs font-semibold text-vault-text">{user?.username}</p>
                <p className="text-[10px] font-mono text-vault-muted truncate mt-0.5">{user?.email}</p>
              </div>

              <div className="py-1">
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-vault-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-vault-success" />
                  AUTHENTICATED
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-vault-danger hover:bg-vault-danger/10 transition-colors flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lock & Logout
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
