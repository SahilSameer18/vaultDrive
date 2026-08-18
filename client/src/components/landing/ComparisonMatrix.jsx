function LogoMark({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function ComparisonMatrix() {
  return (
    <section className="border-t border-[#2A2E37]/80 bg-[#0C0D10] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#2A2E37] bg-[#14161A] text-[10px] font-mono text-[#8B8F99] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>HOW WE COMPARE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#E8E6E0]">
            Why people choose <br />
            VaultDrive over generic drives.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#8B8F99] leading-relaxed">
            See how VaultDrive gives you greater privacy, direct speed, and true control over your files.
          </p>
        </div>

        {/* ── Mobile Mode Table (sm:hidden - Zero side-scroll, tailored for phone screens) ── */}
        <div className="sm:hidden rounded-2xl border border-[#2A2E37] bg-[#14161A] overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2A2E37] bg-[#181B21]/90 font-mono text-[10px] text-[#8B8F99]">
                <th className="py-3.5 px-3 font-semibold w-[32%]">CAPABILITY</th>
                <th className="py-3.5 px-3 font-bold text-[#B8935A] bg-[#B8935A]/[0.08] border-x border-[#2A2E37]/60 w-[34%]">
                  <div className="flex items-center gap-1.5">
                    <LogoMark className="w-3.5 h-3.5 text-[#B8935A] shrink-0" />
                    <span>VAULTDRIVE</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 font-semibold text-[#8B8F99]/80 w-[34%]">GENERIC CLOUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2E37]/60 text-xs font-sans">
              
              {/* Row 1 */}
              <tr className="hover:bg-[#181B21]/40 transition-colors">
                <td className="py-3.5 px-3 align-top">
                  <p className="font-bold text-[#E8E6E0] text-[11px] leading-tight">Upload Speed</p>
                  <p className="text-[10px] font-mono text-[#8B8F99] mt-0.5">Direct cloud</p>
                </td>
                <td className="py-3.5 px-3 bg-[#B8935A]/[0.04] border-x border-[#2A2E37]/60 align-top">
                  <div className="flex items-start gap-1">
                    <span className="text-emerald-400 font-bold text-xs">✓</span>
                    <div>
                      <span className="font-semibold text-emerald-300 text-[11px] leading-tight block">Direct-to-Cloud</span>
                      <span className="text-[10px] text-[#8B8F99] mt-0.5 block leading-tight">Zero server delays</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-[#8B8F99] align-top">
                  <div className="flex items-start gap-1">
                    <span className="text-rose-400 font-bold text-xs">✕</span>
                    <div>
                      <span className="font-medium text-[#8B8F99] text-[11px] leading-tight block">Server Buffering</span>
                      <span className="text-[10px] text-[#8B8F99]/60 mt-0.5 block leading-tight">Slow RAM bottlenecks</span>
                    </div>
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-[#181B21]/40 transition-colors">
                <td className="py-3.5 px-3 align-top">
                  <p className="font-bold text-[#E8E6E0] text-[11px] leading-tight">Account Security</p>
                  <p className="text-[10px] font-mono text-[#8B8F99] mt-0.5">Multi-device</p>
                </td>
                <td className="py-3.5 px-3 bg-[#B8935A]/[0.04] border-x border-[#2A2E37]/60 align-top">
                  <div className="flex items-start gap-1">
                    <span className="text-emerald-400 font-bold text-xs">✓</span>
                    <div>
                      <span className="font-semibold text-emerald-300 text-[11px] leading-tight block">Instant Signout</span>
                      <span className="text-[10px] text-[#8B8F99] mt-0.5 block leading-tight">Revokes all devices</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-[#8B8F99] align-top">
                  <div className="flex items-start gap-1">
                    <span className="text-rose-400 font-bold text-xs">✕</span>
                    <div>
                      <span className="font-medium text-[#8B8F99] text-[11px] leading-tight block">Delayed Invalidation</span>
                      <span className="text-[10px] text-[#8B8F99]/60 mt-0.5 block leading-tight">Stolen tokens linger</span>
                    </div>
                  </div>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-[#181B21]/40 transition-colors">
                <td className="py-3.5 px-3 align-top">
                  <p className="font-bold text-[#E8E6E0] text-[11px] leading-tight">Trash Recovery</p>
                  <p className="text-[10px] font-mono text-[#8B8F99] mt-0.5">Smart restore</p>
                </td>
                <td className="py-3.5 px-3 bg-[#B8935A]/[0.04] border-x border-[#2A2E37]/60 align-top">
                  <div className="flex items-start gap-1">
                    <span className="text-emerald-400 font-bold text-xs">✓</span>
                    <div>
                      <span className="font-semibold text-emerald-300 text-[11px] leading-tight block">Smart Re-link</span>
                      <span className="text-[10px] text-[#8B8F99] mt-0.5 block leading-tight">Auto-links to Root</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-[#8B8F99] align-top">
                  <div className="flex items-start gap-1">
                    <span className="text-rose-400 font-bold text-xs">✕</span>
                    <div>
                      <span className="font-medium text-[#8B8F99] text-[11px] leading-tight block">Broken Pointers</span>
                      <span className="text-[10px] text-[#8B8F99]/60 mt-0.5 block leading-tight">Lost parent path breaks</span>
                    </div>
                  </div>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-[#181B21]/40 transition-colors">
                <td className="py-3.5 px-3 align-top">
                  <p className="font-bold text-[#E8E6E0] text-[11px] leading-tight">Link Sharing</p>
                  <p className="text-[10px] font-mono text-[#8B8F99] mt-0.5">Guest download</p>
                </td>
                <td className="py-3.5 px-3 bg-[#B8935A]/[0.04] border-x border-[#2A2E37]/60 align-top">
                  <div className="flex items-start gap-1">
                    <span className="text-emerald-400 font-bold text-xs">✓</span>
                    <div>
                      <span className="font-semibold text-emerald-300 text-[11px] leading-tight block">Passcode Links</span>
                      <span className="text-[10px] text-[#8B8F99] mt-0.5 block leading-tight">Direct download, no signup</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-[#8B8F99] align-top">
                  <div className="flex items-start gap-1">
                    <span className="text-rose-400 font-bold text-xs">✕</span>
                    <div>
                      <span className="font-medium text-[#8B8F99] text-[11px] leading-tight block">Forced Signups</span>
                      <span className="text-[10px] text-[#8B8F99]/60 mt-0.5 block leading-tight">Requires full registration</span>
                    </div>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* ── Desktop Mode Table (hidden sm:block - Spacious full desktop matrix) ── */}
        <div className="hidden sm:block rounded-2xl border border-[#2A2E37] bg-[#14161A] overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#2A2E37] bg-[#181B21]/90 font-mono text-[11px] text-[#8B8F99]">
                <th className="py-4 px-5 sm:px-6 font-semibold w-1/3">CAPABILITY</th>
                <th className="py-4 px-5 sm:px-6 font-bold text-[#B8935A] bg-[#B8935A]/[0.06] border-x border-[#2A2E37]/60 w-1/3">
                  <div className="flex items-center gap-2">
                    <LogoMark className="w-4 h-4 text-[#B8935A]" />
                    <span>VAULTDRIVE</span>
                  </div>
                </th>
                <th className="py-4 px-5 sm:px-6 font-semibold text-[#8B8F99]/80 w-1/3">GENERIC CLOUD STORAGE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2E37]/60 text-xs sm:text-sm font-sans">
              
              <tr className="hover:bg-[#181B21]/40 transition-colors">
                <td className="py-4 px-5 sm:px-6">
                  <p className="font-bold text-[#E8E6E0]">Upload Speed & Reliability</p>
                  <p className="text-[11px] font-mono text-[#8B8F99] mt-0.5">Direct cloud streaming</p>
                </td>
                <td className="py-4 px-5 sm:px-6 bg-[#B8935A]/[0.04] border-x border-[#2A2E37]/60">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="font-semibold text-emerald-300">Direct-to-Cloud Uploads</span>
                  </div>
                  <p className="text-[11px] font-mono text-[#8B8F99] mt-1">Uploads stream directly to storage without server bottlenecks</p>
                </td>
                <td className="py-4 px-5 sm:px-6 text-[#8B8F99]">
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Slow Server Memory Buffering</span>
                  </div>
                  <p className="text-[11px] font-mono text-[#8B8F99]/60 mt-1">Files bottleneck through web servers before reaching storage</p>
                </td>
              </tr>

              <tr className="hover:bg-[#181B21]/40 transition-colors">
                <td className="py-4 px-5 sm:px-6">
                  <p className="font-bold text-[#E8E6E0]">Account Security</p>
                  <p className="text-[11px] font-mono text-[#8B8F99] mt-0.5">Session protection</p>
                </td>
                <td className="py-4 px-5 sm:px-6 bg-[#B8935A]/[0.04] border-x border-[#2A2E37]/60">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="font-semibold text-emerald-300">Instant Multi-Device Signout</span>
                  </div>
                  <p className="text-[11px] font-mono text-[#8B8F99] mt-1">Password changes immediately revoke all other logged-in devices</p>
                </td>
                <td className="py-4 px-5 sm:px-6 text-[#8B8F99]">
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Delayed Session Invalidation</span>
                  </div>
                  <p className="text-[11px] font-mono text-[#8B8F99]/60 mt-1">Stolen logins often stay active until token expiry</p>
                </td>
              </tr>

              <tr className="hover:bg-[#181B21]/40 transition-colors">
                <td className="py-4 px-5 sm:px-6">
                  <p className="font-bold text-[#E8E6E0]">Trash & Recovery</p>
                  <p className="text-[11px] font-mono text-[#8B8F99] mt-0.5">Folder safety</p>
                </td>
                <td className="py-4 px-5 sm:px-6 bg-[#B8935A]/[0.04] border-x border-[#2A2E37]/60">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="font-semibold text-emerald-300">Smart Parent Restore</span>
                  </div>
                  <p className="text-[11px] font-mono text-[#8B8F99] mt-1">Restored files safely re-link to Root if parent folder was deleted</p>
                </td>
                <td className="py-4 px-5 sm:px-6 text-[#8B8F99]">
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Lost / Broken Pointers</span>
                  </div>
                  <p className="text-[11px] font-mono text-[#8B8F99]/60 mt-1">Missing parent folders break restored file locations</p>
                </td>
              </tr>

              <tr className="hover:bg-[#181B21]/40 transition-colors">
                <td className="py-4 px-5 sm:px-6">
                  <p className="font-bold text-[#E8E6E0]">Link Sharing</p>
                  <p className="text-[11px] font-mono text-[#8B8F99] mt-0.5">Guest downloads</p>
                </td>
                <td className="py-4 px-5 sm:px-6 bg-[#B8935A]/[0.04] border-x border-[#2A2E37]/60">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="font-semibold text-emerald-300">Direct Passcode Links</span>
                  </div>
                  <p className="text-[11px] font-mono text-[#8B8F99] mt-1">Recipients download immediately with optional passcode lock</p>
                </td>
                <td className="py-4 px-5 sm:px-6 text-[#8B8F99]">
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Forced Account Signups</span>
                  </div>
                  <p className="text-[11px] font-mono text-[#8B8F99]/60 mt-1">Requires recipients to create an account before downloading</p>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
