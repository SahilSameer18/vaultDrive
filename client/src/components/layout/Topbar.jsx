import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import NotificationDropdown from "./NotificationDropdown";
import VaultLoadingScreen from "../ui/VaultLoadingScreen";
import UserAvatar from "../ui/UserAvatar";

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
          <VaultLoadingScreen
            message="Signing out…"
            headerTag="Signing Out"
            footerTag="You've been signed out."
          />,
          document.body
        )}

      <header className="border-b border-[var(--theme-border)] bg-[var(--theme-surface)]/85 backdrop-blur-2xl sticky top-0 z-30 select-none">
        <div className="h-14 sm:h-16 px-3.5 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* ── When Mobile Search is Active: Full-Width Search Header ───────── */}
          {mobileSearchOpen ? (
            <div className="flex items-center gap-2 w-full animate-fade-in md:hidden">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-[var(--color-vault-muted)]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  ref={mobileSearchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search repository..."
                  autoFocus
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-[var(--theme-panel)] border border-vault-accent/50 text-[var(--color-vault-text)] text-xs placeholder:text-[var(--color-vault-muted)]/50 focus:outline-none shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-[var(--color-vault-muted)] hover:text-[var(--color-vault-text)] text-xs"
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
                className="px-3 py-2 rounded-xl text-xs font-medium text-[var(--color-vault-muted)] hover:text-[var(--color-vault-text)] bg-[var(--theme-panel)] border border-[var(--theme-border)] shrink-0 cursor-pointer"
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
                  className="lg:hidden p-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)] text-[var(--color-vault-muted)] hover:text-[var(--color-vault-text)] hover:border-white/20 transition-colors cursor-pointer"
                  aria-label="Toggle Navigation Menu"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Brand Logo */}
                <Link to="/dashboard" className="flex items-center gap-2.5 group" title="VaultDrive">
                  <div className="w-8 h-8 rounded-xl bg-[var(--theme-panel)] border border-vault-accent/40 flex items-center justify-center shadow-md group-hover:border-vault-accent transition-transform group-hover:scale-105">
                    <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="font-bold text-sm text-[var(--color-vault-text)] apple-headline">VaultDrive</span>
                    <span className="text-xs text-[var(--color-vault-muted)] apple-caption">Cloud Storage</span>
                  </div>
                </Link>
              </div>

              {/* Center: Desktop Recessed Search Deck */}
              <div className="hidden md:flex items-center max-w-md w-full relative">
                <span className="absolute left-3.5 text-[var(--color-vault-muted)] pointer-events-none">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
                    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  ref={desktopSearchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search repository files and folders..."
                  className="w-full pl-10 pr-12 py-2 rounded-xl bg-[var(--theme-panel)] border border-[var(--theme-border)] text-[var(--color-vault-text)] text-xs placeholder:text-[var(--color-vault-muted)]/50 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 transition-all shadow-inner apple-body"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 text-[var(--color-vault-muted)] hover:text-[var(--color-vault-text)] text-xs cursor-pointer p-1 touch-target-44"
                  >
                    ✕
                  </button>
                ) : (
                  <kbd className="absolute right-2.5 px-1.5 py-0.5 rounded border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[9px] font-mono text-[var(--color-vault-muted)] pointer-events-none shadow-sm apple-caption font-semibold">
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
                  className="md:hidden p-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)] text-[var(--color-vault-muted)] hover:text-[var(--color-vault-text)] hover:border-white/20 transition-colors cursor-pointer touch-target-44"
                  aria-label="Search files"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Notifications Dropdown */}
                <NotificationDropdown />

                {/* User Avatar Menu Trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 p-1 pl-1 pr-1.5 sm:pr-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)] hover:border-white/20 transition-all cursor-pointer group"
                    aria-label="User Account Menu"
                  >
                    {/* User Avatar Circle */}
                    <UserAvatar user={user} size="sm" />

                    {/* Subtle Dropdown Chevron */}
                    <svg
                      className={`w-3.5 h-3.5 text-[var(--color-vault-muted)] group-hover:text-[var(--color-vault-text)] transition-transform duration-200 ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl depth-vault-chassis border border-[var(--theme-border)] bg-[var(--theme-surface)]/95 backdrop-blur-2xl shadow-2xl p-2 z-50 animate-scale-up origin-top-right">
                      {/* User Info Header Card */}
                      <div className="p-3 rounded-xl depth-vault-card border border-[var(--theme-border)] bg-[var(--theme-panel)] mb-2 flex items-center gap-3">
                        <UserAvatar user={user} size="md" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[var(--color-vault-text)] truncate">{user?.username}</p>
                          <p className="text-[10px] text-[var(--color-vault-muted)] truncate mt-0.5">{user?.email}</p>
                        </div>
                      </div>

                      {/* Navigation Items */}
                      <div className="space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[var(--color-vault-text)] hover:bg-[var(--theme-panel)] transition-colors flex items-center gap-2.5 cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-[var(--color-vault-muted)]" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          Account & Security Settings
                        </Link>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2.5 cursor-pointer"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
