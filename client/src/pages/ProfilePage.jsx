import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatters";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  // App Preference Toggles
  const [defaultView, setDefaultView] = useState("grid");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [autoPrivate, setAutoPrivate] = useState(true);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in select-none pb-12">
      
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-4 border-b border-vault-border">
        <div>
          <nav className="flex items-center gap-2 text-xs font-mono text-vault-muted mb-1">
            <Link to="/dashboard" className="text-vault-accent hover:underline">Home</Link>
            <span>/</span>
            <span className="text-vault-text font-semibold">Account Settings</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-vault-text">
            Account Profile
          </h1>
        </div>

        <span className="px-3 py-1 rounded-full bg-vault-success/15 border border-vault-success/30 text-vault-success font-mono text-xs font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-vault-success animate-pulse" />
          Active Session
        </span>
      </div>

      {/* ── User Overview Banner ─────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-2xl border border-vault-border bg-vault-panel/80 backdrop-blur-xl shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-vault-accent/10 blur-3xl pointer-events-none" />

        {/* User Initials Avatar */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-vault-surface to-vault-panel border-2 border-vault-accent/60 flex items-center justify-center text-vault-accent font-mono font-bold text-3xl shadow-2xl">
            {user?.username?.charAt(0)?.toUpperCase() || "V"}
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-vault-success border-2 border-vault-panel shadow-md" title="Active" />
        </div>

        {/* User Details */}
        <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-vault-text truncate">
                {user?.username || "Vault User"}
              </h2>
              <p className="text-xs font-mono text-vault-muted mt-0.5 truncate">
                {user?.email || "user@vaultdrive.com"}
              </p>
            </div>

            <span className="px-3.5 py-1.5 rounded-xl bg-vault-accent/15 border border-vault-accent/40 text-xs font-semibold text-vault-accent w-fit mx-auto sm:mx-0 flex items-center gap-1.5">
              <span>✦</span> Vault Starter Plan
            </span>
          </div>

          <p className="text-xs text-vault-muted pt-1">
            Member since {user?.createdAt ? formatDate(user.createdAt) : "August 2026"}
          </p>
        </div>
      </div>

      {/* ── App Preferences & Active Session ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* App Preferences Card */}
        <div className="p-6 rounded-2xl border border-vault-border bg-vault-panel/60 space-y-4">
          <h3 className="text-sm font-bold text-vault-text flex items-center gap-2">
            <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.75" />
            </svg>
            Vault Preferences
          </h3>

          <div className="space-y-3">
            {/* Preferred Layout */}
            <div className="flex items-center justify-between py-2 border-b border-vault-border/40">
              <div>
                <p className="text-xs font-semibold text-vault-text">Default View Mode</p>
                <p className="text-[10px] text-vault-muted">Choose your default layout when opening directories</p>
              </div>
              <div className="flex items-center p-0.5 rounded-lg border border-vault-border bg-vault-surface">
                <button
                  type="button"
                  onClick={() => setDefaultView("grid")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    defaultView === "grid" ? "bg-vault-panel text-vault-accent shadow-sm" : "text-vault-muted"
                  }`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setDefaultView("list")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    defaultView === "list" ? "bg-vault-panel text-vault-accent shadow-sm" : "text-vault-muted"
                  }`}
                >
                  List
                </button>
              </div>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between py-2 border-b border-vault-border/40">
              <div>
                <p className="text-xs font-semibold text-vault-text">In-App Share Notifications</p>
                <p className="text-[10px] text-vault-muted">Receive alerts when someone shares files with you</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifs((prev) => !prev)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  emailNotifs ? "bg-vault-accent" : "bg-vault-surface border border-vault-border"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-0.5 left-0.5 transition-transform ${
                    emailNotifs ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Default Privacy */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-semibold text-vault-text">Private Upload Default</p>
                <p className="text-[10px] text-vault-muted">Keep newly uploaded files private by default</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoPrivate((prev) => !prev)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  autoPrivate ? "bg-vault-accent" : "bg-vault-surface border border-vault-border"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-0.5 left-0.5 transition-transform ${
                    autoPrivate ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Active Session & Device Card */}
        <div className="p-6 rounded-2xl border border-vault-border bg-vault-panel/60 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-vault-text flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
                <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
              Active Device Session
            </h3>

            <div className="p-3.5 rounded-xl border border-vault-border/60 bg-vault-surface/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-vault-accent/15 border border-vault-accent/30 flex items-center justify-center text-vault-accent">
                  💻
                </div>
                <div>
                  <p className="text-xs font-semibold text-vault-text">Current Web Browser Session</p>
                  <p className="text-[10px] font-mono text-vault-muted">Logged in via Secured HttpOnly Cookies</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-vault-success font-semibold px-2 py-0.5 rounded bg-vault-success/15 border border-vault-success/30">
                ACTIVE NOW
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full py-2.5 px-4 rounded-xl border border-vault-danger/40 bg-vault-danger/10 text-vault-danger hover:bg-vault-danger hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loggingOut ? "Signing out…" : "Sign Out of Account"}
          </button>
        </div>

      </div>

    </div>
  );
}
