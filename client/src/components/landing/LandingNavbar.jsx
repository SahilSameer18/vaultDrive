import { Link } from "react-router-dom";

function LogoMark({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function LandingNavbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-vault-border/50 bg-vault-landing-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-18 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5 sm:gap-3.5">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-vault-panel to-vault-bg border border-vault-accent/40 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:border-vault-accent transition-all duration-300">
            <LogoMark className="w-4 h-4 sm:w-5 sm:h-5 text-vault-accent" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base sm:text-lg tracking-tight text-vault-text">VaultDrive</span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-vault-success/30 bg-vault-success/[0.08] text-[9px] font-mono font-medium tracking-wider text-vault-success">
              <span className="w-1.5 h-1.5 rounded-full bg-vault-success" /> NODE ONLINE
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/login"
            className="relative group overflow-hidden rounded-xl p-[1px] shadow-lg shadow-black/40"
          >
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-vault-accent via-vault-text to-vault-accent opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center justify-center px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-[11px] bg-vault-bg text-xs sm:text-sm font-semibold tracking-wide text-vault-text group-hover:bg-vault-panel transition-all duration-200">
              <span>Sign In</span>
            </span>
          </Link>
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-vault-accent to-vault-accent-hover text-vault-landing-bg text-xs sm:text-sm font-semibold tracking-wide shadow-[0_4px_20px_rgba(184,147,90,0.22)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12" />
            <span>Create Vault</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
