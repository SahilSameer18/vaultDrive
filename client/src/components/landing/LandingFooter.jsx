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

export default function LandingFooter() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-vault-footer-bg text-left z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-white/[0.06]">

          {/* Brand Column (6 Cols) */}
          <div className="md:col-span-6 space-y-3.5">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-vault-surface border border-vault-accent/40 flex items-center justify-center shadow-sm">
                <LogoMark className="w-3.5 h-3.5 text-vault-accent" />
              </div>
              <span className="font-bold text-base tracking-tight text-white">VaultDrive</span>
            </Link>
            <p className="text-xs text-vault-muted leading-relaxed max-w-sm">
              Private cloud storage with nested folders, passcode-protected share links, and direct uploads to secure storage.
            </p>
          </div>

          {/* Architecture Column (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-semibold text-vault-text">
              Architecture
            </p>
            <ul className="space-y-2 text-xs text-vault-muted font-normal">
              <li>Direct-to-Cloud Uploads</li>
              <li>Passcode-Protected Links</li>
              <li>Folder Trash & Restore</li>
              <li>HTTPS Encrypted Transfer</li>
            </ul>
          </div>

          {/* Navigation Column (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-semibold text-vault-text">
              Access
            </p>
            <ul className="space-y-2 text-xs text-vault-muted font-normal">
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

        {/* Bottom Metadata Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-4 text-xs text-vault-muted/60 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 text-[11px]">
            <Link to="/terms" className="hover:text-vault-text transition-colors">Terms of Service</Link>
            <span className="text-white/10">•</span>
            <Link to="/privacy" className="hover:text-vault-text transition-colors">Privacy Policy</Link>
            <span className="text-white/10">•</span>
            <span>© 2026 VaultDrive</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
