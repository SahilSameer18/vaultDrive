import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  return (
    <div className="space-y-6 fade-in">
      
      {/* ── Header & Breadcrumbs ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-vault-border">
        <div>
          {/* Breadcrumb Path */}
          <nav className="flex items-center gap-2 text-xs font-mono text-vault-muted mb-1">
            <span className="text-vault-accent font-semibold">Home</span>
            <span>/</span>
            <span className="text-vault-text">My Vault</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-vault-text">
            Welcome, {user?.username || "Vault User"}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl border border-vault-border bg-vault-panel">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
                viewMode === "grid" ? "bg-vault-surface text-vault-accent shadow-sm" : "text-vault-muted hover:text-vault-text"
              }`}
              title="Grid View"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
                viewMode === "list" ? "bg-vault-surface text-vault-accent shadow-sm" : "text-vault-muted hover:text-vault-text"
              }`}
              title="List View"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* New Folder Button */}
          <button
            type="button"
            className="px-3.5 py-2 rounded-xl border border-vault-border bg-vault-panel text-xs font-semibold text-vault-text hover:border-vault-accent hover:text-vault-accent transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Folder
          </button>
        </div>
      </div>

      {/* ── Vault Repository Workspace (Empty State Placeholder) ─────────── */}
      <div className="min-h-[400px] rounded-2xl border border-dashed border-vault-border bg-vault-panel/20 flex flex-col items-center justify-center p-8 text-center">
        
        {/* Animated Vault Latch Seal */}
        <div className="w-16 h-16 rounded-2xl bg-vault-panel border border-vault-accent/30 flex items-center justify-center mb-4 shadow-xl">
          <svg className="w-8 h-8 text-vault-accent" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1.5" fill="currentColor" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-vault-text mb-1">Your Vault is Ready</h3>
        <p className="text-xs text-vault-muted max-w-sm mb-6">
          Upload files or create folders to start organizing your encrypted cloud repository.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#14161A] bg-vault-accent hover:bg-vault-accent-hover transition-colors shadow-md"
          >
            Upload First File
          </button>
        </div>

      </div>

    </div>
  );
}
