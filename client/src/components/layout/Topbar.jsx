import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import NotificationDropdown from "./NotificationDropdown";

export default function Topbar({ onToggleMobileMenu }) {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

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
        if (window.innerWidth < 768) {
          setMobileSearchOpen(true);
          setTimeout(() => mobileSearchRef.current?.focus(), 60);
        } else {
          desktopSearchRef.current?.focus();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      setSearchQuery("");
      setMobileSearchOpen(false);
      desktopSearchRef.current?.blur();
      mobileSearchRef.current?.blur();
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
      {loggingOut &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md select-none">
            <div className="flex flex-col items-center gap-5 p-8 sm:p-10 rounded-2xl border border-vault-border bg-vault-panel shadow-2xl">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
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

      <header className="border-b border-vault-border bg-vault-bg/95 backdrop-blur-xl sticky top-0 z-30 select-none">
        <div className="h-14 sm:h-16 px-3.5 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* ── When Mobile Search is Active: Full-Width Search Header ───────── */}
          {mobileSearchOpen ? (
            <div className="flex items-center gap-2 w-full animate-fade-in md:hidden">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-vault-muted">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  ref={mobileSearchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search files and folders..."
                  autoFocus
                  className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-vault-panel border border-vault-accent/60 text-vault-text text-xs placeholder:text-vault-muted/50 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2 text-vault-muted hover:text-vault-text text-xs"
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
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-vault-muted hover:text-vault-text bg-vault-panel border border-vault-border shrink-0 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              {/* ── Normal Header Content ──────────────────────────────────── */}
              {/* Left: Mobile Hamburger & Brand */}
              <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                {/* Mobile Hamburger Toggle */}
                <button
                  type="button"
                  onClick={onToggleMobileMenu}
                  className="lg:hidden p-2 rounded-xl border border-vault-border bg-vault-panel/80 text-vault-muted hover:text-vault-text hover:border-vault-accent transition-colors cursor-pointer"
                  aria-label="Toggle Navigation Menu"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Brand Logo (Minimal icon-only badge on mobile, full text on desktop) */}
                <Link to="/dashboard" className="flex items-center gap-2 group" title="VaultDrive">
                  <div className="w-8 h-8 rounded-xl bg-vault-surface border border-vault-accent/40 flex items-center justify-center shadow-md group-hover:border-vault-accent transition-colors">
                    <svg className="w-4.5 h-4.5 text-vault-accent" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="hidden lg:inline font-bold text-base tracking-tight text-vault-text">VaultDrive</span>
                </Link>
              </div>

              {/* Center: Desktop Search Input */}
              <div className="hidden md:flex items-center max-w-md w-full relative">
                <span className="absolute left-3.5 text-vault-muted pointer-events-none">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  ref={desktopSearchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search files and folders..."
                  className="w-full pl-10 pr-12 py-2 rounded-xl bg-vault-panel/80 border border-vault-border text-vault-text text-xs placeholder:text-vault-muted/50 focus:border-vault-accent focus:outline-none transition-colors"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 text-vault-muted hover:text-vault-text text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                ) : (
                  <kbd className="absolute right-3 px-1.5 py-0.5 rounded border border-vault-border bg-vault-surface text-[10px] font-mono text-vault-muted pointer-events-none">
                    ⌘K
                  </kbd>
                )}
              </div>

              {/* Right: Actions (Mobile Search Button, Notifications, Avatar) */}
              <div className="flex items-center gap-2 sm:gap-2.5" ref={menuRef}>
                
                {/* Mobile Search Icon Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileSearchOpen(true);
                    setTimeout(() => mobileSearchRef.current?.focus(), 60);
                  }}
                  className="md:hidden p-2 rounded-xl border border-vault-border bg-vault-panel/80 text-vault-muted hover:text-vault-text hover:border-vault-accent transition-colors cursor-pointer"
                  aria-label="Search files"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Notifications Dropdown */}
                <NotificationDropdown />

                {/* User Avatar Menu Trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 p-1 pl-1 pr-1.5 sm:pr-2 rounded-xl border border-vault-border bg-vault-panel/80 hover:border-vault-accent/60 transition-all cursor-pointer group"
                    aria-label="User Account Menu"
                  >
                    {/* User Avatar Circle */}
                    <div className="w-7 h-7 rounded-lg bg-vault-accent/15 border border-vault-accent/40 flex items-center justify-center text-vault-accent font-mono font-bold text-xs shadow-sm">
                      {user?.username?.charAt(0)?.toUpperCase() || "V"}
                    </div>

                    {/* Subtle Dropdown Chevron */}
                    <svg
                      className={`w-3.5 h-3.5 text-vault-muted group-hover:text-vault-text transition-transform duration-200 ${
                        profileOpen ? "rotate-180 text-vault-accent" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-vault-border bg-vault-panel/95 backdrop-blur-xl shadow-2xl p-2 z-50 animate-scale-up">
                      {/* User Info Header Card */}
                      <div className="p-3 rounded-xl bg-vault-surface/60 border border-vault-border/50 mb-2">
                        <p className="text-xs font-bold text-vault-text truncate">{user?.username}</p>
                        <p className="text-[10px] font-mono text-vault-muted truncate mt-0.5">{user?.email}</p>
                      </div>

                      {/* Navigation Items */}
                      <div className="space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-vault-text hover:bg-vault-surface hover:text-vault-accent transition-colors flex items-center gap-2.5 cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75" />
                            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="1.75" />
                          </svg>
                          Account Settings
                        </Link>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-vault-danger hover:bg-vault-danger/10 transition-colors flex items-center gap-2.5 cursor-pointer"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

        </div>
      </header>
    </>
  );
}
