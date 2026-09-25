function LogoMark({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CheckIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const comparisonRows = [
  {
    capability: "File Uploads",
    spec: "How files reach storage",
    vaultTitle: "Straight to cloud storage",
    vaultDesc: "Files upload directly from your browser to storage using a signed request, skipping our servers entirely",
    genericTitle: "Routed through the server",
    genericDesc: "Files are held in the app server's memory before being forwarded to storage"
  },
  {
    capability: "Session Invalidation",
    spec: "Multi-device protection",
    vaultTitle: "Instant Global Revocation",
    vaultDesc: "Password changes immediately terminate every active JWT token across all devices",
    genericTitle: "Delayed Expiration",
    genericDesc: "Stolen sessions frequently persist until standard TTL expiration (often days)"
  },
  {
    capability: "Restoring from Trash",
    spec: "Undoing a delete",
    vaultTitle: "Folder structure stays intact",
    vaultDesc: "Restoring a deleted folder puts everything back exactly where it was, nested files included",
    genericTitle: "Flattened restores",
    genericDesc: "Restored files often land back in one root folder, so the original structure is lost"
  },
  {
    capability: "Sharing with Others",
    spec: "Guest file access",
    vaultTitle: "Passcode-protected links",
    vaultDesc: "Anyone with the link and passcode can download the file directly, no account needed",
    genericTitle: "Account required to download",
    genericDesc: "Recipients typically have to sign up for an account before they can download a shared file"
  }
];

export default function ComparisonMatrix() {
  return (
    <section className="relative border-t border-white/[0.06] bg-vault-landing-bg z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 lg:py-28">

        {/* Section Header */}
        <div className="max-w-2xl mb-10 sm:mb-16 text-left">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-white">
            How we stack up against a typical cloud drive
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-vault-muted leading-relaxed max-w-[54ch]">
            A few concrete differences in how uploads, restores, and sharing actually work.
          </p>
        </div>

        {/* ── Mobile Mode Stack (sm:hidden) — Native Vertical Spec Cards ── */}
        <div className="sm:hidden space-y-4 text-left">
          {comparisonRows.map((row, idx) => (
            <div key={idx} className="depth-vault-card rounded-2xl p-5 border border-white/[0.08] space-y-4">
              <div>
                <span className="text-xs text-vault-muted">
                  {row.spec}
                </span>
                <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                  {row.capability}
                </h3>
              </div>

              {/* VaultDrive Spec */}
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.12] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-vault-accent text-xs font-semibold">
                    <LogoMark className="w-3.5 h-3.5 text-vault-accent" />
                    <span>VaultDrive</span>
                  </div>
                  <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckIcon className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-xs font-semibold text-emerald-300">
                  {row.vaultTitle}
                </p>
                <p className="text-[11px] text-vault-muted leading-relaxed">
                  {row.vaultDesc}
                </p>
              </div>

              {/* Legacy Spec */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-vault-muted text-xs font-medium">
                    Other Cloud Storage
                  </span>
                  <span className="w-4 h-4 rounded bg-rose-500/15 text-rose-400/80 flex items-center justify-center">
                    <CrossIcon className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-xs font-medium text-vault-text/80">
                  {row.genericTitle}
                </p>
                <p className="text-[11px] text-vault-muted/70 leading-relaxed">
                  {row.genericDesc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tablet & Desktop Mode (hidden sm:block) — Institutional Table ── */}
        <div className="hidden sm:block depth-vault-chassis rounded-2xl overflow-hidden border border-white/[0.08]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-xs text-vault-muted">
                  <th className="py-4.5 px-6 font-semibold w-[30%]">
                    Specification
                  </th>
                  <th className="py-4.5 px-6 font-bold text-vault-accent bg-white/[0.03] border-x border-white/[0.1] w-[38%]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-vault-accent/15 border border-vault-accent/40 flex items-center justify-center">
                        <LogoMark className="w-3.5 h-3.5 text-vault-accent" />
                      </div>
                      <span>VaultDrive Spec</span>
                    </div>
                  </th>
                  <th className="py-4.5 px-6 font-semibold text-vault-muted/70 w-[32%]">
                    Other Cloud Storage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs sm:text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.015] transition-colors">
                    {/* Capability Column */}
                    <td className="py-5 px-6 align-top">
                      <p className="font-semibold text-white tracking-tight">{row.capability}</p>
                      <p className="text-xs text-vault-muted mt-1">
                        {row.spec}
                      </p>
                    </td>

                    {/* VaultDrive Column (Prominent) */}
                    <td className="py-5 px-6 bg-white/[0.02] border-x border-white/[0.08] align-top">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                          <CheckIcon className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <p className="font-semibold text-emerald-300 tracking-tight leading-snug">
                            {row.vaultTitle}
                          </p>
                          <p className="text-xs text-vault-muted mt-1 leading-relaxed">
                            {row.vaultDesc}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Legacy Column */}
                    <td className="py-5 px-6 align-top text-vault-muted">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400/80 shrink-0 mt-0.5">
                          <CrossIcon className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <p className="font-medium text-vault-muted/90 tracking-tight leading-snug">
                            {row.genericTitle}
                          </p>
                          <p className="text-xs text-vault-muted/60 mt-1 leading-relaxed">
                            {row.genericDesc}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
