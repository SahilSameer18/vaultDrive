import { Link } from "react-router-dom";

function BrokenVaultIllustration() {
  return (
    <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] mx-auto">
      {/* Ambient warning glow */}
      <div className="absolute inset-6 rounded-full bg-vault-danger/[0.06] blur-[50px]" />

      {/* Outer ring — stalled, off-axis */}
      <div
        className="absolute inset-1 rounded-full border border-vault-danger/25"
        style={{ transform: "rotate(12deg)" }}
      >
        <span className="absolute left-1/2 -top-1 w-2 h-2 -translate-x-1/2 rounded-full bg-vault-danger shadow-[0_0_12px_rgba(192,101,79,0.6)]" />
        <span className="absolute left-1/2 -bottom-1 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-vault-border" />
      </div>

      {/* Tick ring, a few teeth missing to read as "damaged" */}
      <div className="absolute inset-3">
        {Array.from({ length: 20 }).map((_, i) => {
          if (i % 7 === 0) return null;
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 w-px h-2.5 rounded-full bg-vault-border"
              style={{
                transform: `rotate(${i * 18}deg) translateY(-96px)`,
                transformOrigin: "0 96px",
              }}
            />
          );
        })}
      </div>

      {/* Main plate */}
      <div className="absolute inset-[42px] rounded-full bg-vault-surface border border-vault-border shadow-[inset_0_0_40px_rgba(0,0,0,0.6),0_20px_50px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-4 rounded-full border border-vault-danger/20" />

        {/* Cracked dial + open shackle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[76px] h-[76px] rounded-2xl border border-vault-danger/50 bg-vault-bg flex items-center justify-center shadow-[0_0_28px_rgba(192,101,79,0.1)]">
            {/* Shackle, sprung open */}
            <div
              className="absolute top-[14px] w-6 h-6 rounded-t-full border-[3px] border-b-0 border-vault-danger/70"
              style={{ transform: "translateX(6px) rotate(18deg)" }}
            />
            <div className="relative mt-4 w-9 h-8 rounded-lg bg-vault-panel border border-vault-danger/50 flex items-center justify-center">
              <span className="text-vault-danger text-[10px] font-mono font-bold">×</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status pill */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-vault-danger shadow-[0_0_6px_rgba(192,101,79,0.6)]" />
        <span className="text-[8px] font-mono tracking-[0.15em] text-vault-danger">
          MECHANISM OFFLINE
        </span>
      </div>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full bg-vault-bg text-vault-text font-sans flex flex-col relative overflow-hidden selection:bg-vault-accent/30">
      {/* Background grid + vignette, matching Landing/Login treatment */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12] bg-grid-pattern" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-vault-danger/[0.035] blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--color-vault-bg)_90%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-vault-border bg-vault-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-vault-surface border border-vault-accent/40 flex items-center justify-center shadow-lg transition-colors group-hover:border-vault-accent">
              <svg className="w-5 h-5 text-vault-accent" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="font-semibold text-base tracking-tight text-vault-text">VaultDrive</span>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono text-vault-danger bg-vault-danger/10 border border-vault-danger/30 rounded-full">
            <span className="w-1 h-1 rounded-full bg-vault-danger" />
            ERROR 404 / ROUTE_NOT_FOUND
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 sm:px-6 py-14">
        <div className="w-full max-w-3xl grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-14 items-center fade-in">
          <BrokenVaultIllustration />

          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-vault-danger/30 bg-vault-danger/10 text-vault-danger text-[10px] font-mono tracking-[0.12em] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-vault-danger animate-pulse" />
              ACCESS DENIED
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-vault-text leading-tight">
              This vault door<br className="hidden lg:block" /> doesn't exist.
            </h1>

            <p className="mt-4 text-sm text-vault-muted leading-relaxed max-w-md mx-auto lg:mx-0">
              The path you requested isn't registered in this repository. It may have been moved, deleted, or never provisioned.
            </p>

            {/* Console diagnostic strip */}
            <div className="mt-6 rounded-xl border border-vault-border bg-vault-panel p-4 text-left font-mono text-[11px] shadow-xl shadow-black/40">
              <div className="flex items-center justify-between border-b border-vault-border pb-2.5 mb-2.5 text-vault-muted text-[10px] tracking-wider">
                <span>VAULT_CONSOLE // DIAGNOSTIC</span>
                <span className="text-vault-danger">FAIL_404</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex gap-2 text-vault-muted">
                  <span className="text-vault-success">$</span> lookup_route --target current_path
                </div>
                <div className="flex gap-2 text-vault-danger">
                  <span>✕</span> ERR_ROUTE_UNREGISTERED
                </div>
                <div className="flex gap-2 text-vault-accent">
                  <span>→</span> redirecting recommendation: /dashboard
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center lg:items-stretch justify-center lg:justify-start gap-3 mt-7">
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl text-xs font-mono font-semibold text-vault-bg bg-gradient-to-r from-vault-accent to-vault-accent-hover hover:brightness-110 shadow-lg shadow-vault-accent/15 transition-all flex items-center justify-center gap-2"
              >
                RETURN TO VAULT
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl text-xs font-mono font-medium text-vault-muted bg-vault-surface border border-vault-border hover:border-vault-accent hover:text-vault-text transition-all flex items-center justify-center"
              >
                LOGIN PORTAL
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-vault-border bg-vault-bg py-4 text-center text-[10px] font-mono tracking-wider text-vault-muted">
        VAULTDRIVE ENGINE © 2027 · ENCRYPTED CLOUD ASSET REPOSITORY
      </footer>
    </div>
  );
}
