import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";

export default function Topbar({ onToggleMobileMenu }) {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

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

  // Keyboard shortcut (⌘K or Ctrl+K) to focus search bar
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMobileSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      setSearchQuery("");
      setMobileSearchOpen(false);
      searchInputRef.current?.blur();
    }
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
    {/* ── Full-screen logout overlay via portal ──────────────────────────── */}
    {loggingOut && createPortal(
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md select-none">
        <div className="flex flex-col items-center gap-5 p-10 rounded-2xl border border-vault-border bg-vault-panel shadow-2xl">
          {/* Animated lock icon */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-vault-accent/30 border-t-vault-accent animate-spin" />
            <svg className="w-6 h-6 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-vault-text">Signing out</p>
            <p className="text-xs font-mono text-vault-muted">Locking your vault…</p>
          </div>
        </div>
      </div>,
      document.body
    )}
    <header className="border-b border-vault-border bg-vault-bg/90 backdrop-blur-xl sticky top-0 z-30 select-none">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
        
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

        {/* ── Center: Desktop Search Input Bar ─────────────────────────────── */}
        <div className="hidden md:flex items-center max-w-md w-full mx-6 relative">
          <span className="absolute left-3.5 text-vault-muted pointer-events-none">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search files and folders..."
            className="w-full pl-10 pr-12 py-2 rounded-xl bg-vault-panel border border-vault-border text-vault-text text-xs placeholder:text-vault-muted/40 focus:border-vault-accent focus:outline-none transition-colors"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-vault-muted hover:text-vault-text text-xs"
            >
              ✕
            </button>
          ) : (
            <kbd className="absolute right-3 px-1.5 py-0.5 rounded border border-vault-border bg-vault-surface text-[10px] font-mono text-vault-muted pointer-events-none">
              ⌘K
            </kbd>
          )}
        </div>



        {/* ── Right: Mobile Search Toggle & User Identity ─────────────────── */}
        <div className="flex items-center gap-3" ref={menuRef}>
          
          {/* Mobile Search Bar Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg border border-vault-border bg-vault-panel text-vault-muted hover:text-vault-text hover:border-vault-accent transition-colors"
            aria-label="Toggle Mobile Search"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

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
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-vault-border bg-vault-panel shadow-2xl p-1.5 z-50 animate-scale-up">
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
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-vault-danger hover:bg-vault-danger/10 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loggingOut ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Signing out…
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Lock & Logout
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ── Mobile Expandable Glassmorphic Search Bar Drawer ─────────────── */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 py-3 border-t border-[#B8935A]/30 bg-[#14161A]/95 backdrop-blur-2xl shadow-[0_16px_35px_rgba(0,0,0,0.7)] animate-fade-in relative space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-2.5 text-[#B8935A] pointer-events-none">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
                  <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search files, folders & shared assets..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#0C0D10] border border-[#2A2E37] text-[#E8E6E0] text-xs placeholder:text-[#8B8F99]/50 focus:border-[#B8935A] focus:ring-2 focus:ring-[#B8935A]/20 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 w-4.5 h-4.5 rounded-full bg-[#2A2E37] text-[#8B8F99] hover:text-[#E8E6E0] flex items-center justify-center text-[10px] transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setMobileSearchOpen(false);
              }}
              className="text-xs font-semibold text-[#8B8F99] hover:text-[#B8935A] transition-colors px-2 py-2"
            >
              Cancel
            </button>
          </div>

          {/* Quick Filter Tag Chips for Mobile Search */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
            <span className="text-[10px] font-mono text-[#8B8F99]/60 shrink-0">FILTER:</span>
            {["All", "Images", "Docs", "Videos", "Folders"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  if (tag === "All") setSearchQuery("");
                  else setSearchQuery(tag.toLowerCase());
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium shrink-0 transition-all cursor-pointer ${
                  searchQuery.toLowerCase() === tag.toLowerCase() || (tag === "All" && !searchQuery)
                    ? "bg-[#B8935A]/20 border-[#B8935A] text-[#B8935A]"
                    : "bg-[#181B21] border-[#2A2E37] text-[#8B8F99] hover:border-[#B8935A]/40 hover:text-[#E8E6E0]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}


    </header>
    </>
  );
}

