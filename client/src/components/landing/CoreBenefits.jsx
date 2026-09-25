function ShieldCheckIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderTreeIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.2a2.5 2.5 0 0 1 1.77.73L12.2 7.5H18.5A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 13h8M8 16h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function LockPasscodeIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="10" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="9" cy="15.5" r="1" fill="currentColor" />
      <circle cx="12" cy="15.5" r="1" fill="currentColor" />
      <circle cx="15" cy="15.5" r="1" fill="currentColor" />
    </svg>
  );
}

function LightningIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CoreBenefits() {
  return (
    <section className="relative border-t border-white/[0.06] bg-vault-section-alt/80 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-18 sm:py-28 text-left">

        {/* Section Headline */}
        <div className="max-w-2xl mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-white">
            Architectural security. <br />
            <span className="text-silver-gradient">Engineered for absolute privacy.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-vault-muted leading-relaxed max-w-[54ch]">
            Every layer is isolated to ensure zero-knowledge storage, cryptographic link authorization, and lightning-fast direct throughput.
          </p>
        </div>

        {/* ── Asymmetric Bento Architecture (2+1 Rhythm) ──────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">

          {/* Tile 1 (8 Cols): Direct-to-Cloud Upload Stream */}
          <div className="md:col-span-8 depth-vault-card rounded-2xl p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-vault-accent/[0.04] rounded-full blur-[70px] pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-vault-surface border border-white/[0.08] flex items-center justify-center text-vault-accent shadow-sm">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/[0.06] text-[10px] font-mono tracking-wider text-emerald-400">
                  <LightningIcon className="w-3.5 h-3.5" /> DIRECT HMAC PIPELINE
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Zero-Knowledge Direct Uploads
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-vault-muted max-w-[55ch]">
                Your files bypass web application servers entirely. Direct HMAC signatures stream your encrypted payload straight to hardened object storage clusters without RAM buffer bottlenecks.
              </p>
            </div>

            {/* Visual Stream Telemetry Mock */}
            <div className="mt-8 p-3.5 rounded-xl bg-vault-bg/90 border border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                <span className="text-vault-text text-[11px]">Browser Client ➔ Encrypted Storage Vault</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-vault-muted">
                <span>LATENCY: <strong className="text-white">0.08ms</strong></span>
                <span>STATUS: <strong className="text-emerald-400">STREAM ACTIVE</strong></span>
              </div>
            </div>
          </div>

          {/* Tile 2 (4 Cols): Hierarchical Vault Taxonomy */}
          <div className="md:col-span-4 depth-vault-card rounded-2xl p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-vault-surface border border-white/[0.08] flex items-center justify-center text-vault-sky mb-6 shadow-sm">
                <FolderTreeIcon className="w-5 h-5" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Deep Nested Trees
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-vault-muted">
                Create recursive, unlimited folder depths with instant breadcrumb traversal and sub-millisecond search indexing.
              </p>
            </div>

            {/* Visual Folder Tree Preview */}
            <div className="mt-8 p-3 rounded-xl bg-vault-bg/90 border border-white/[0.06] space-y-1.5 text-[11px] font-mono text-vault-muted">
              <div className="flex items-center gap-2 text-vault-accent">
                <span>📁 Vault_Root</span>
              </div>
              <div className="flex items-center gap-2 pl-3 text-vault-text/80">
                <span>↳ 📁 Fiscal_2026</span>
              </div>
              <div className="flex items-center gap-2 pl-6 text-emerald-400">
                <span>↳ 🔒 Private_Contracts</span>
              </div>
            </div>
          </div>

          {/* Tile 3 (12 Cols): Passcode Shield & Link Gate */}
          <div className="md:col-span-12 depth-vault-card rounded-2xl p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden group">
            <div className="max-w-2xl">
              <div className="w-10 h-10 rounded-xl bg-vault-surface border border-white/[0.08] flex items-center justify-center text-vault-accent mb-5 shadow-sm">
                <LockPasscodeIcon className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Passcode-Gated File Sharing
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-vault-muted max-w-[60ch]">
                Distribute direct download links with password challenges, time-decay expiration, and instant cryptographic kill switches. Recipients never need an account to retrieve authorized files.
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <div className="px-4 py-2 rounded-xl bg-vault-bg/90 border border-vault-accent/30 text-xs font-mono text-vault-accent flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-vault-accent animate-pulse-dot" />
                <span>PBKDF2 PASSCODE SHIELD</span>
              </div>
              <span className="text-[11px] font-mono text-vault-muted/70">
                Instant Revocation Guaranteed
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}