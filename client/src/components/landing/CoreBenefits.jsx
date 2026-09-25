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
            What's actually different <span className="text-silver-gradient">under the hood</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-vault-muted leading-relaxed max-w-[54ch]">
            Uploads go straight to storage, folders nest as deep as you want, and shared links can be locked behind a passcode.
          </p>
        </div>

        {/* ── Asymmetric Bento Architecture (2+1 Rhythm) ──────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">

          {/* Tile 1 (8 Cols): Direct-to-Cloud Upload Stream */}
          <div className="md:col-span-8 depth-vault-card rounded-2xl p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full blur-[70px] pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-vault-surface border border-white/[0.08] flex items-center justify-center text-white/70 shadow-sm">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/[0.06] text-[11px] text-emerald-400">
                  <LightningIcon className="w-3.5 h-3.5" /> Direct upload pipeline
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Uploads skip the middleman
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-vault-muted max-w-[55ch]">
                Your files go straight from your browser to cloud storage using a signed upload request — they never sit in our server's memory waiting to be relayed.
              </p>
            </div>

            {/* Upload flow indicator */}
            <div className="mt-8 p-3.5 rounded-xl bg-vault-bg/90 border border-white/[0.06] flex items-center gap-3 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-vault-text text-xs font-mono">Browser → Cloud storage, direct</span>
            </div>
          </div>

          {/* Tile 2 (4 Cols): Hierarchical Vault Taxonomy */}
          <div className="md:col-span-4 depth-vault-card rounded-2xl p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-vault-surface border border-white/[0.08] flex items-center justify-center text-vault-sky mb-6 shadow-sm">
                <FolderTreeIcon className="w-5 h-5" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Folders inside folders, no limit
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-vault-muted">
                Nest folders as deep as you need and jump back up the tree with breadcrumbs, or find what you need with search.
              </p>
            </div>

            {/* Visual Folder Tree Preview */}
            <div className="mt-8 p-3 rounded-xl bg-vault-bg/90 border border-white/[0.06] space-y-1.5 text-[11px] font-mono text-vault-muted">
              <div className="flex items-center gap-2 text-white/80">
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
              <div className="w-10 h-10 rounded-xl bg-vault-surface border border-white/[0.08] flex items-center justify-center text-white/70 mb-5 shadow-sm">
                <LockPasscodeIcon className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Share a file without handing over your folder
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-vault-muted max-w-[60ch]">
                Send a link, lock it with a passcode, set an expiry, and revoke it whenever you want. Whoever you send it to can download the file without creating an account.
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <div className="px-4 py-2 rounded-xl bg-vault-bg/90 border border-white/[0.12] text-xs text-white/80 flex items-center gap-2">
                <span>Passcode protection</span>
              </div>
              <span className="text-[11px] text-vault-muted/70">
                Revoke access anytime
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}