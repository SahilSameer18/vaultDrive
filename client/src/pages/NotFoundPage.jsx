import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="h-screen w-screen bg-vault-bg text-vault-text font-sans flex flex-col justify-between relative overflow-hidden selection:bg-vault-accent/30">
      
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: `linear-gradient(#2A2E37 1px, transparent 1px), linear-gradient(90deg, #2A2E37 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Top Security Header */}
      <header className="relative z-10 border-b border-vault-border bg-vault-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-vault-surface border border-vault-accent/40 flex items-center justify-center shadow-lg transition-colors group-hover:border-vault-accent">
              <svg className="w-5 h-5 text-vault-accent" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-semibold text-base tracking-tight text-vault-text">VaultDrive</span>
          </Link>

          <span className="px-2.5 py-0.5 text-[11px] font-mono text-vault-danger bg-vault-danger/10 border border-vault-danger/30 rounded-full">
            ERROR 404 // ROUTE_NOT_FOUND
          </span>
        </div>
      </header>

      {/* Main Content Card (Centered) */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg text-center fade-in">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-vault-danger/30 bg-vault-danger/10 text-vault-danger text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-vault-danger animate-pulse" />
            ACCESS DENIED
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-vault-text mb-3">
            Requested Vault Route Not Found
          </h1>

          <p className="text-xs sm:text-sm text-vault-muted leading-relaxed max-w-md mx-auto mb-6">
            The resource path you requested does not exist in this archive. It may have been moved, deleted, or never provisioned.
          </p>

          {/* Console Output Card */}
          <div className="rounded-2xl border border-vault-border bg-vault-panel p-5 text-left font-mono text-xs shadow-2xl shadow-black/80 mb-6">
            <div className="flex items-center justify-between border-b border-vault-border pb-3 mb-3 text-vault-muted text-[11px]">
              <span>VAULT_CONSOLE // DIAGNOSTIC</span>
              <span className="text-vault-danger">FAIL_404</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex gap-2 text-vault-muted">
                <span className="text-vault-success">$</span> lookup_route --target current_path
              </div>
              <div className="flex gap-2 text-vault-danger">
                <span>✕</span> ERR_ROUTE_UNREGISTERED: Target resource unreachable.
              </div>
              <div className="flex gap-2 text-vault-accent">
                <span>→</span> Redirect recommendation: Return to vault dashboard.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl text-xs font-mono font-semibold text-[#14161A] bg-vault-accent hover:bg-vault-accent-hover shadow-lg shadow-vault-accent/20 transition-all flex items-center gap-2"
            >
              RETURN TO SAFETY →
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl text-xs font-mono font-medium text-vault-muted bg-vault-surface border border-vault-border hover:border-vault-accent hover:text-vault-text transition-all"
            >
              LOGIN PORTAL
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-vault-border bg-vault-bg py-4 text-center text-xs font-mono text-vault-muted">
        VaultDrive Engine © 2027 • Encrypted Cloud Asset Repository
      </footer>

    </div>
  );
}