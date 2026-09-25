import { Link } from "react-router-dom";

function LogoMark({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function LandingNavbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[var(--theme-landing-bg)]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-2">
        {/* Brand Lockup */}
        <Link to="/" className="group flex items-center gap-2 sm:gap-3.5 focus-visible:outline-none shrink-0">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-b from-vault-panel to-vault-surface border border-vault-accent/35 flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.6)] group-hover:border-vault-accent/70 group-hover:shadow-[0_0_20px_rgba(197,160,89,0.25)] transition-all duration-300">
            <LogoMark className="w-4 h-4 text-vault-accent transition-transform duration-300 group-hover:scale-105" />
          </div>
          <span className="font-bold text-base sm:text-lg tracking-[-0.02em] text-vault-text group-hover:text-white transition-colors">
            VaultDrive
          </span>
        </Link>

        {/* Action Controls */}
        <nav className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          <Link
            to="/login"
            className="tactile-btn px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium tracking-wide text-vault-muted hover:text-vault-text hover:bg-white/[0.04] transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="tactile-btn inline-flex items-center justify-center px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-vault-accent hover:bg-vault-accent-hover text-vault-landing-bg text-xs sm:text-sm font-semibold tracking-tight shadow-[0_2px_14px_rgba(197,160,89,0.25)] hover:shadow-[0_4px_20px_rgba(197,160,89,0.35)] transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Create Vault</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
