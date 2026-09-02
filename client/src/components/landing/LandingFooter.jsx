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

export default function LandingFooter() {
  return (
    <footer className="border-t border-vault-border/80 bg-vault-footer-bg text-left relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-14 pb-8 sm:pb-10">

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-vault-border/50">

          {/* Brand Column (6 Cols) */}
          <div className="md:col-span-6 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-vault-surface border border-vault-accent/40 flex items-center justify-center">
                <LogoMark className="w-3.5 h-3.5 text-vault-accent" />
              </div>
              <span className="font-bold text-base tracking-tight text-vault-text">VaultDrive</span>
            </Link>
            <p className="text-xs text-vault-muted leading-relaxed max-w-sm">
              Personal cloud storage with nested folder organization, passcode-protected link sharing, and safe trash recovery.
            </p>
          </div>

          {/* Features Column (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-[11px] font-mono font-semibold tracking-wider text-vault-text uppercase">Features</p>
            <ul className="space-y-2 text-xs text-vault-muted">
              <li>Nested Folder Trees</li>
              <li>Passcode Link Sharing</li>
              <li>Smart Trash Restore</li>
              <li>Direct Cloud Uploads</li>
            </ul>
          </div>

          {/* Quick Links Column (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-[11px] font-mono font-semibold tracking-wider text-vault-text uppercase">Account</p>
            <ul className="space-y-2 text-xs text-vault-muted">
              <li>
                <Link to="/login" className="hover:text-vault-accent transition-colors">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-vault-accent transition-colors">Create Account</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-vault-accent transition-colors">Workspace</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-vault-muted/60">
          <span>© 2026 VaultDrive. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-vault-muted transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-vault-muted transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/login" className="hover:text-vault-muted transition-colors">Sign In</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}



