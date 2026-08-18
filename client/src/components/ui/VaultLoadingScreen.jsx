export default function VaultLoadingScreen({
  message = "Verifying vault access...",
  headerTag = "✦ VaultDrive Encrypted System ✦",
  footerTag = "End-to-End Secure Storage",
}) {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-vault-bg p-6 select-none font-sans overflow-hidden">
      {/* ── Ambient Background Glows ────────────────────────────────────────── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-vault-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-vault-accent/5 blur-3xl pointer-events-none" />

      {/* Top Header Label */}
      <div className="w-full flex items-center justify-center pt-4">
        <span className="text-[10px] font-mono tracking-widest text-vault-muted/70 uppercase">
          {headerTag}
        </span>
      </div>

      {/* Centerpiece: Animated Vault Emblem & Status */}
      <div className="flex flex-col items-center gap-6 max-w-xs w-full text-center relative z-10">
        
        {/* Animated Vault Lock Emblem with Orbital Rings */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          {/* Outer Rotating Dashed Ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-vault-accent/40 animate-[spin_8s_linear_infinite]" />
          
          {/* Inner Counter-Rotating Ring */}
          <div className="absolute inset-2 rounded-2xl border border-vault-accent/30 animate-[spin_12s_linear_infinite_reverse]" />

          {/* Center Vault Emblem Box */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-vault-panel to-vault-surface border border-vault-accent/60 shadow-[0_0_25px_rgba(184,147,90,0.25)] flex items-center justify-center">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-vault-accent" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Brand & Security Status Text */}
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-vault-text">
            Vault<span className="text-vault-accent">Drive</span>
          </h1>
          <p className="text-xs font-mono text-vault-muted flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-vault-accent animate-ping" />
            {message}
          </p>
        </div>

        {/* Glowing Progress Beam */}
        <div className="w-48 h-1 rounded-full bg-vault-surface border border-vault-border/60 overflow-hidden relative">
          <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-vault-accent to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />
        </div>

      </div>

      {/* Footer Security Badge */}
      <div className="pb-4 flex items-center gap-2 text-[11px] font-mono text-vault-muted/70">
        <svg className="w-3.5 h-3.5 text-vault-accent" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{footerTag}</span>
      </div>

    </div>
  );
}