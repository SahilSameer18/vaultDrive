import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="h-screen w-screen bg-[#14161A] text-[#E8E6E0] font-sans flex flex-col justify-between relative overflow-hidden selection:bg-[#B8935A]/30">
      
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: `linear-gradient(#2A2E37 1px, transparent 1px), linear-gradient(90deg, #2A2E37 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle 600px at 50% 50%, rgba(192, 101, 79, 0.08), transparent 80%)`
        }}
      />

      {/* Top Security Header */}
      <header className="relative z-10 border-b border-[#2A2E37] bg-[#14161A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-b from-[#1C1F26] to-[#14161A] border border-[#B8935A]/40 flex items-center justify-center shadow-lg transition-colors group-hover:border-[#B8935A]">
              <svg className="w-5 h-5 text-[#B8935A]" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-semibold text-base tracking-tight text-[#E8E6E0]">VaultDrive</span>
          </Link>

          <span className="px-2.5 py-0.5 text-[11px] font-mono text-[#C0654F] bg-[#C0654F]/10 border border-[#C0654F]/30 rounded-full">
            ERROR 404 // ROUTE_NOT_FOUND
          </span>
        </div>
      </header>

      {/* Main Content Card (Centered) */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg text-center fade-in">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C0654F]/30 bg-[#C0654F]/10 text-[#C0654F] text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C0654F] animate-pulse" />
            ACCESS DENIED
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#E8E6E0] mb-3">
            Requested Vault Route Not Found
          </h1>

          <p className="text-xs sm:text-sm text-[#8B8F99] leading-relaxed max-w-md mx-auto mb-6">
            The resource path you requested does not exist in this archive. It may have been moved, deleted, or never provisioned.
          </p>

          {/* Console Output Card */}
          <div className="rounded-2xl border border-[#2A2E37] bg-[#1C1F26] p-5 text-left font-mono text-xs shadow-2xl shadow-black/80 mb-6">
            <div className="flex items-center justify-between border-b border-[#2A2E37] pb-3 mb-3 text-[#8B8F99] text-[11px]">
              <span>VAULT_CONSOLE // DIAGNOSTIC</span>
              <span className="text-[#C0654F]">FAIL_404</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex gap-2 text-[#8B8F99]">
                <span className="text-[#6FA88A]">$</span> lookup_route --target current_path
              </div>
              <div className="flex gap-2 text-[#C0654F]">
                <span>✕</span> ERR_ROUTE_UNREGISTERED: Target resource unreachable.
              </div>
              <div className="flex gap-2 text-[#B8935A]">
                <span>→</span> Redirect recommendation: Return to vault dashboard.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/"
              className="px-6 py-3 rounded-xl text-xs font-mono font-semibold text-[#14161A] bg-gradient-to-r from-[#B8935A] to-[#C8A66B] hover:brightness-110 shadow-lg shadow-[#B8935A]/20 transition-all flex items-center gap-2"
            >
              RETURN TO SAFETY →
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl text-xs font-mono font-medium text-[#8B8F99] bg-[#181B21] border border-[#2A2E37] hover:border-[#B8935A]/50 hover:text-[#E8E6E0] transition-all"
            >
              LOGIN PORTAL
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#2A2E37] bg-[#14161A] py-4 text-center text-xs font-mono text-[#8B8F99]">
        VaultDrive Engine © 2027 • Encrypted Cloud Asset Repository
      </footer>

    </div>
  );
}