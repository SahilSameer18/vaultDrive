import { useState } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [vaultLocked, setVaultLocked] = useState(true);
  const [dialAngle, setDialAngle] = useState(0);

  const rotateDial = () => {
    setDialAngle((prev) => prev + 45);
  };

  return (
    <div className="min-h-screen bg-[#14161A] text-[#E8E6E0] font-sans relative overflow-x-hidden selection:bg-[#B8935A]/30 selection:text-[#E8E6E0]">
      
      {/* ── Background Grid & Radial Vignette ─────────────────────────────── */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(#2A2E37 1px, transparent 1px), linear-gradient(90deg, #2A2E37 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle 800px at 50% -100px, rgba(184, 147, 90, 0.15), transparent 80%)`
        }}
      />

      {/* ── Top Navigation Bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#2A2E37] bg-[#14161A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-b from-[#1C1F26] to-[#14161A] border border-[#B8935A]/40 flex items-center justify-center shadow-lg shadow-black/50 group">
              <svg className="w-5 h-5 text-[#B8935A] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <span className="font-semibold text-base tracking-tight text-[#E8E6E0]">VaultDrive</span>
              <span className="hidden sm:inline-block ml-2.5 px-2 py-0.5 text-[10px] font-mono text-[#6FA88A] bg-[#6FA88A]/10 border border-[#6FA88A]/20 rounded">
                v1.0 ONLINE
              </span>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs font-mono text-[#8B8F99] hover:text-[#E8E6E0] transition-colors px-3 py-1.5"
            >
              [ LOGIN ]
            </Link>
            <Link
              to="/register"
              className="relative group overflow-hidden rounded-lg p-[1px] font-mono text-xs font-medium"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#B8935A] via-[#C8A66B] to-[#B8935A] rounded-lg transition-all duration-300 group-hover:opacity-90" />
              <span className="relative block px-4 py-2 bg-[#14161A] rounded-[7px] text-[#B8935A] group-hover:text-[#E8E6E0] group-hover:bg-transparent transition-all">
                INITIALIZE VAULT →
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        
        {/* Badge Banner */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#B8935A]/30 bg-[#181B21]/90 text-[#B8935A] text-xs font-mono tracking-wider shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8935A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B8935A]"></span>
            </span>
            BANK-GRADE ZERO-KNOWLEDGE ARCHIVE
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#E8E6E0] leading-[1.1] mb-6">
            The Fortified Digital Storage <br />
            <span className="bg-gradient-to-r from-[#B8935A] via-[#C8A66B] to-[#E8E6E0] bg-clip-text text-transparent">
              Engineered for absolute privacy.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#8B8F99] max-w-2xl mx-auto leading-relaxed font-sans">
            Store up to 100MB files in an isolated, cycle-guarded folder infrastructure. 
            Controlled sharing, instant media playback, and zero amateur shortcuts.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
          <Link
            to="/register"
            className="px-8 py-3.5 rounded-xl font-mono text-sm font-semibold text-[#14161A] bg-gradient-to-r from-[#B8935A] to-[#C8A66B] hover:brightness-110 shadow-lg shadow-[#B8935A]/20 transition-all flex items-center gap-2"
          >
            CREATE YOUR VAULT <span>→</span>
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-xl font-mono text-sm font-medium text-[#8B8F99] bg-[#1C1F26] border border-[#2A2E37] hover:border-[#B8935A] hover:text-[#E8E6E0] transition-all"
          >
            DEMO SIGN IN
          </Link>
        </div>

        {/* ── Interactive Vault Dial Visual Showcase ─────────────────────── */}
        <div className="relative max-w-4xl mx-auto rounded-2xl border border-[#2A2E37] bg-gradient-to-b from-[#1C1F26] to-[#14161A] p-8 shadow-2xl shadow-black/80 overflow-hidden">
          
          {/* Top Bar Header */}
          <div className="flex items-center justify-between border-b border-[#2A2E37] pb-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C0654F]" />
              <span className="w-3 h-3 rounded-full bg-[#B8935A]" />
              <span className="w-3 h-3 rounded-full bg-[#6FA88A]" />
              <span className="text-xs font-mono text-[#8B8F99] ml-2">VAULT_CONSOLE // PREVIEW</span>
            </div>
            <div className="text-xs font-mono text-[#6FA88A] bg-[#6FA88A]/10 border border-[#6FA88A]/30 px-3 py-1 rounded">
              STATUS: SECURED
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Left: Physical Dial Graphic */}
            <div className="flex flex-col items-center justify-center p-6 bg-[#181B21] rounded-xl border border-[#2A2E37] relative">
              <span className="text-[10px] font-mono text-[#8B8F99] mb-4 uppercase tracking-widest">
                [ Click Dial To Test Lock Mechanism ]
              </span>
              
              {/* Rotating Metallic Wheel */}
              <div 
                onClick={rotateDial}
                className="w-40 h-40 rounded-full border-4 border-[#2A2E37] bg-gradient-to-tr from-[#14161A] via-[#1C1F26] to-[#2A2E37] flex items-center justify-center cursor-pointer shadow-inner relative transition-transform duration-500 ease-out hover:scale-105"
                style={{ transform: `rotate(${dialAngle}deg)` }}
              >
                {/* Dial Ticks */}
                <div className="absolute inset-2 rounded-full border border-dashed border-[#B8935A]/40" />
                
                {/* Center Knob */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B8935A] to-[#14161A] border border-[#C8A66B] flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 rounded-full bg-[#14161A] border border-[#B8935A]" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setVaultLocked(!vaultLocked)}
                  className="px-4 py-2 rounded-lg font-mono text-xs border border-[#B8935A]/50 bg-[#B8935A]/10 text-[#B8935A] hover:bg-[#B8935A]/20 transition-all flex items-center gap-2"
                >
                  <span className={`w-2 h-2 rounded-full ${vaultLocked ? "bg-[#C0654F]" : "bg-[#6FA88A]"}`} />
                  VAULT LATCH: {vaultLocked ? "LOCKED" : "UNLOCKED"}
                </button>
              </div>
            </div>

            {/* Right: Mock Manifest Ledger */}
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#181B21] border border-[#2A2E37] space-y-2">
                <div className="text-[#8B8F99] flex justify-between">
                  <span>STORAGE UTILIZATION</span>
                  <span className="text-[#B8935A]">73.4 GB / 100 GB</span>
                </div>
                {/* Multi-segment Metallic Storage Bar */}
                <div className="w-full h-2 rounded-full bg-[#14161A] overflow-hidden flex border border-[#2A2E37]">
                  <div className="h-full bg-[#6FA88A]" style={{ width: '45%' }} title="Images" />
                  <div className="h-full bg-[#B8935A]" style={{ width: '25%' }} title="Videos" />
                  <div className="h-full bg-[#38BDF8]" style={{ width: '15%' }} title="Documents" />
                  <div className="h-full bg-[#8B8F99]" style={{ width: '10%' }} title="Archives" />
                </div>
                <div className="flex gap-4 text-[10px] text-[#8B8F99] pt-1">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#6FA88A]"/> Images</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#B8935A]"/> Videos</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#38BDF8]"/> Docs</span>
                </div>
              </div>

              {/* Sample Files List */}
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-[#181B21] border border-[#2A2E37] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[#6FA88A]">🖼️</span>
                    <div>
                      <div className="text-[#E8E6E0] font-medium">quarterly_report_2027.pdf</div>
                      <div className="text-[10px] text-[#8B8F99]">4.2 MB • PDF Document</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#6FA88A]/10 text-[#6FA88A] border border-[#6FA88A]/20">PUBLIC</span>
                </div>

                <div className="p-3 rounded-lg bg-[#181B21] border border-[#2A2E37] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[#B8935A]">🔒</span>
                    <div>
                      <div className="text-[#E8E6E0] font-medium">crypto_seed_backup.enc</div>
                      <div className="text-[10px] text-[#8B8F99]">1.1 MB • Encrypted Raw</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#C0654F]/10 text-[#C0654F] border border-[#C0654F]/20">PRIVATE</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* ── Feature Cards Section ─────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-[#2A2E37]">
        <div className="text-center mb-14">
          <p className="font-mono text-xs text-[#B8935A] tracking-widest uppercase mb-2">ARCHITECTURAL SPECIFICATIONS</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E8E6E0]">Engineered for Uncompromising Reliability</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#1C1F26] border border-[#2A2E37] hover:border-[#B8935A]/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-[#181B21] border border-[#2A2E37] flex items-center justify-center text-[#B8935A] group-hover:border-[#B8935A] transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#E8E6E0]">JWT Token Rotation</h3>
            <p className="text-xs text-[#8B8F99] leading-relaxed">
              OWASP-aligned authentication with bcrypt-hashed refresh tokens in HTTP-only cookies. Automatic silent session refresh.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#1C1F26] border border-[#2A2E37] hover:border-[#B8935A]/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-[#181B21] border border-[#2A2E37] flex items-center justify-center text-[#B8935A] group-hover:border-[#B8935A] transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#E8E6E0]">Cycle-Guarded Folders</h3>
            <p className="text-xs text-[#8B8F99] leading-relaxed">
              Ancestral algorithm tree verification prevents circular subfolder dependencies. Clean onDelete file nullification.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#1C1F26] border border-[#2A2E37] hover:border-[#B8935A]/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-[#181B21] border border-[#2A2E37] flex items-center justify-center text-[#B8935A] group-hover:border-[#B8935A] transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#E8E6E0]">Granular Sharing</h3>
            <p className="text-xs text-[#8B8F99] leading-relaxed">
              Generate 64-character hex public share tokens or grant targeted access to registered user accounts instantly.
            </p>
          </div>

        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#2A2E37] bg-[#14161A] py-8 text-center text-xs font-mono text-[#8B8F99]">
        VaultDrive Engine © 2027 • Encrypted Cloud Asset Repository
      </footer>

    </div>
  );
}
