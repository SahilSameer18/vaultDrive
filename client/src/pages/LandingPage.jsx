import { useState } from "react";
import { Link } from "react-router-dom";

function LogoMark({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VaultIllustration({ locked }) {
  return (
    <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px]">
      {/* Ambient glow */}
      <div className="absolute inset-12 rounded-full bg-[#B8935A]/[0.035] blur-[60px]" />

      {/* Outer technical ring */}
      <div
        className="absolute inset-1 rounded-full border border-[#B8935A]/20"
        style={{ animation: "landingVaultSpin 40s linear infinite" }}
      >
        <span className="absolute left-1/2 -top-1 w-2.5 h-2.5 -translate-x-1/2 rounded-full bg-[#B8935A] shadow-[0_0_14px_rgba(184,147,90,0.65)]" />
        <span className="absolute left-1/2 -bottom-1 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-[#2A2E37]" />
        <span className="absolute top-1/2 -left-1 w-1.5 h-1.5 -translate-y-1/2 rounded-full bg-[#2A2E37]" />
        <span className="absolute top-1/2 -right-1 w-1.5 h-1.5 -translate-y-1/2 rounded-full bg-[#2A2E37]" />
      </div>

      {/* Technical tick ring */}
      <div className="absolute inset-3">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className={`absolute left-1/2 top-1/2 w-px rounded-full ${
              index % 3 === 0 ? "h-3 bg-[#B8935A]/35" : "h-1.5 bg-[#2A2E37]"
            }`}
            style={{
              transform: `rotate(${index * 15}deg) translateY(-166px)`,
              transformOrigin: "0 166px",
            }}
          />
        ))}
      </div>

      {/* Middle rotating ring */}
      <div
        className="absolute inset-8 rounded-full border border-[#2A2E37]"
        style={{ animation: "landingVaultReverse 25s linear infinite" }}
      >
        <div className="absolute inset-4 rounded-full border border-dashed border-[#B8935A]/15" />
        <span className="absolute left-1/2 -top-1 w-2 h-2 -translate-x-1/2 rounded-full bg-[#6FA88A] shadow-[0_0_9px_rgba(111,168,138,0.6)]" />
      </div>

      {/* Main plate */}
      <div className="absolute inset-[58px] rounded-full bg-[#181B21] border border-[#2A2E37] shadow-[inset_0_0_50px_rgba(0,0,0,0.6),0_30px_70px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-5 rounded-full border border-[#B8935A]/20" />

        {/* Vault spokes */}
        <div className="absolute inset-0">
          <span className="absolute left-1/2 top-1/2 w-[72px] h-px -translate-x-1/2 bg-[#2A2E37]" />
          <span className="absolute left-1/2 top-1/2 w-px h-[72px] -translate-x-1/2 -translate-y-1/2 bg-[#2A2E37]" />
        </div>

        {/* Central lock */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`relative w-[92px] h-[92px] rounded-2xl border flex items-center justify-center transition-all duration-500 ${
              locked
                ? "border-[#B8935A]/50 bg-[#14161A] shadow-[0_0_35px_rgba(184,147,90,0.08)]"
                : "border-[#6FA88A]/50 bg-[#14161A] shadow-[0_0_35px_rgba(111,168,138,0.1)]"
            }`}
          >
            <div
              className={`absolute top-[19px] w-8 h-7 rounded-t-full border-[3px] border-b-0 transition-colors duration-500 ${
                locked ? "border-[#B8935A]" : "border-[#6FA88A]"
              }`}
            />
            <div
              className={`relative mt-5 w-12 h-10 rounded-lg border flex items-center justify-center transition-all duration-500 ${
                locked ? "bg-[#1C1F26] border-[#B8935A]/60" : "bg-[#1C1F26] border-[#6FA88A]/60"
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  locked
                    ? "bg-[#B8935A] shadow-[0_0_12px_rgba(184,147,90,0.7)]"
                    : "bg-[#6FA88A] shadow-[0_0_12px_rgba(111,168,138,0.7)]"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            locked ? "bg-[#B8935A] shadow-[0_0_7px_rgba(184,147,90,0.6)]" : "bg-[#6FA88A] shadow-[0_0_7px_rgba(111,168,138,0.6)]"
          }`}
        />
        <span
          className={`text-[8px] font-mono tracking-[0.18em] ${
            locked ? "text-[#B8935A]" : "text-[#6FA88A]"
          }`}
        >
          {locked ? "VAULT LOCKED" : "VAULT OPEN"}
        </span>
      </div>
    </div>
  );
}

function StorageBar() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-mono tracking-wider text-[#8B8F99]">STORAGE ALLOCATION</span>
        <span className="text-[9px] font-mono text-[#B8935A]">73.4 / 100 GB</span>
      </div>
      <div className="h-2 rounded-full bg-[#14161A] border border-[#2A2E37] overflow-hidden flex">
        <div className="h-full bg-[#6FA88A]" style={{ width: "45%" }} />
        <div className="h-full bg-[#B8935A]" style={{ width: "25%" }} />
        <div className="h-full bg-[#38BDF8]" style={{ width: "15%" }} />
        <div className="h-full bg-[#8B8F99]" style={{ width: "10%" }} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
        <span className="flex items-center gap-1.5 text-[9px] font-mono text-[#8B8F99]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6FA88A]" /> MEDIA
        </span>
        <span className="flex items-center gap-1.5 text-[9px] font-mono text-[#8B8F99]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8935A]" /> VIDEO
        </span>
        <span className="flex items-center gap-1.5 text-[9px] font-mono text-[#8B8F99]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" /> DOCUMENTS
        </span>
      </div>
    </div>
  );
}

function FileRow({ type, name, meta, status }) {
  const statusStyles =
    status === "PRIVATE"
      ? "text-[#C0654F] bg-[#C0654F]/10 border-[#C0654F]/20"
      : "text-[#6FA88A] bg-[#6FA88A]/10 border-[#6FA88A]/20";

  const iconColor =
    type === "document"
      ? "text-[#38BDF8]"
      : type === "secure"
      ? "text-[#B8935A]"
      : "text-[#6FA88A]";

  return (
    <div className="group flex items-center justify-between gap-4 p-3 rounded-xl bg-[#181B21] border border-[#2A2E37] hover:border-[#B8935A]/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 shrink-0 rounded-lg bg-[#14161A] border border-[#2A2E37] flex items-center justify-center ${iconColor}`}>
          {type === "secure" ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="1.5" rx="2" />
              <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-[#E8E6E0]">{name}</p>
          <p className="mt-0.5 text-[9px] font-mono text-[#8B8F99]">{meta}</p>
        </div>
      </div>
      <span className={`shrink-0 px-2 py-1 rounded-md border text-[8px] font-mono tracking-wider ${statusStyles}`}>
        {status}
      </span>
    </div>
  );
}

function FeatureIcon({ children }) {
  return (
    <div className="w-11 h-11 rounded-xl bg-[#181B21] border border-[#2A2E37] flex items-center justify-center text-[#B8935A] group-hover:border-[#B8935A]/60 group-hover:bg-[#B8935A]/[0.04] transition-all duration-300">
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [vaultLocked, setVaultLocked] = useState(true);
  const [dialAngle, setDialAngle] = useState(0);

  const rotateDial = () => {
    setDialAngle((prev) => prev + 45);
  };

  const toggleVault = () => {
    setVaultLocked((prev) => !prev);
    setDialAngle((prev) => prev + 45);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#14161A] text-[#E8E6E0]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `
              linear-gradient(#2A2E37 1px, transparent 1px),
              linear-gradient(90deg, #2A2E37 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-[420px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[#B8935A]/[0.045] blur-[140px]" />
        <div className="absolute -bottom-[500px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#38BDF8]/[0.012] blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#14161A_92%)]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#2A2E37] bg-[#14161A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-b from-[#1C1F26] to-[#14161A] border border-[#B8935A]/35 flex items-center justify-center shadow-lg shadow-black/30 group-hover:border-[#B8935A]/70 transition-all duration-300">
              <LogoMark className="w-5 h-5 text-[#B8935A]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-semibold text-base tracking-tight text-[#E8E6E0]">VaultDrive</span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#6FA88A]/20 bg-[#6FA88A]/[0.06] text-[8px] font-mono tracking-wider text-[#6FA88A]">
                  <span className="w-1 h-1 rounded-full bg-[#6FA88A]" /> ONLINE
                </span>
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link to="/login" className="px-2 sm:px-3 py-2 text-[10px] sm:text-xs font-mono text-[#8B8F99] hover:text-[#E8E6E0] transition-colors">
              [ LOGIN ]
            </Link>
            <Link to="/register" className="group relative overflow-hidden rounded-lg p-px">
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#B8935A] via-[#C8A66B] to-[#B8935A]" />
              <span className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-[7px] bg-[#14161A] text-[9px] sm:text-[10px] font-mono tracking-wider text-[#B8935A] group-hover:bg-transparent group-hover:text-[#14161A] transition-all duration-200">
                <span className="hidden sm:inline">INITIALIZE VAULT</span>
                <span className="sm:hidden">REGISTER</span>
                <ArrowIcon />
              </span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-5 sm:px-6 pt-16 sm:pt-20 lg:pt-24 pb-20">
          <div className="flex justify-center mb-7">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#B8935A]/25 bg-[#181B21]/80 shadow-inner">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-[#B8935A] opacity-50 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[#B8935A]" />
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.14em] text-[#B8935A]">
                PRIVATE STORAGE / SECURE BY DESIGN
              </span>
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-[2.7rem] sm:text-6xl lg:text-7xl font-semibold tracking-[-0.045em] leading-[1.02] text-[#E8E6E0]">
              Your files deserve<br />
              <span className="bg-gradient-to-r from-[#B8935A] via-[#C8A66B] to-[#E8E6E0] bg-clip-text text-transparent">
                a vault, not a folder.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto mt-7 text-sm sm:text-base lg:text-lg leading-7 text-[#8B8F99]">
              VaultDrive gives your files a private storage environment built around controlled access, secure sessions, structured folders, and effortless sharing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
              <Link
                to="/register"
                className="group w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#B8935A] to-[#C8A66B] text-[#14161A] text-xs font-mono font-semibold tracking-wider shadow-[0_12px_35px_rgba(184,147,90,0.14)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                CREATE YOUR VAULT
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#1C1F26] border border-[#2A2E37] text-[#8B8F99] text-xs font-mono tracking-wider hover:border-[#B8935A]/60 hover:text-[#E8E6E0] transition-all flex items-center justify-center"
              >
                ACCESS EXISTING VAULT
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-10 text-[8px] sm:text-[9px] font-mono tracking-wider text-[#8B8F99]">
            <span className="flex items-center gap-2"><span className="text-[#6FA88A]">✓</span> SECURE SESSIONS</span>
            <span className="hidden sm:block w-px h-3 bg-[#2A2E37]" />
            <span className="flex items-center gap-2"><span className="text-[#6FA88A]">✓</span> CONTROLLED SHARING</span>
            <span className="hidden sm:block w-px h-3 bg-[#2A2E37]" />
            <span className="flex items-center gap-2"><span className="text-[#6FA88A]">✓</span> STRUCTURED STORAGE</span>
          </div>
        </section>

        {/* Console Showcase */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6 pb-24">
          <div className="relative rounded-2xl border border-[#2A2E37] bg-gradient-to-b from-[#1C1F26] to-[#14161A] shadow-[0_35px_100px_rgba(0,0,0,0.45)] overflow-hidden">
            <div className="h-12 px-4 sm:px-5 border-b border-[#2A2E37] flex items-center justify-between bg-[#14161A]/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C0654F]" />
                <span className="w-2 h-2 rounded-full bg-[#B8935A]" />
                <span className="w-2 h-2 rounded-full bg-[#6FA88A]" />
                <span className="ml-2 text-[8px] sm:text-[9px] font-mono tracking-[0.14em] text-[#8B8F99]">
                  VAULT_CONSOLE / LIVE PREVIEW
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6FA88A] shadow-[0_0_7px_rgba(111,168,138,0.6)]" />
                <span className="hidden sm:inline text-[8px] font-mono tracking-wider text-[#6FA88A]">SYSTEM READY</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[430px] flex flex-col items-center justify-center p-7 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#2A2E37] bg-[#181B21]/40">
                <div className="absolute top-5 left-5 text-[8px] font-mono tracking-[0.16em] text-[#8B8F99]/60">PHYSICAL SECURITY MODEL</div>
                <VaultIllustration locked={vaultLocked} />

                <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={rotateDial}
                    className="px-4 py-2.5 rounded-lg border border-[#2A2E37] bg-[#14161A] text-[9px] font-mono tracking-wider text-[#8B8F99] hover:border-[#B8935A]/50 hover:text-[#E8E6E0] transition-all"
                  >
                    ROTATE DIAL
                  </button>
                  <button
                    type="button"
                    onClick={toggleVault}
                    className={`px-4 py-2.5 rounded-lg border text-[9px] font-mono tracking-wider transition-all flex items-center gap-2 ${
                      vaultLocked
                        ? "border-[#B8935A]/40 bg-[#B8935A]/[0.06] text-[#B8935A] hover:bg-[#B8935A]/10"
                        : "border-[#6FA88A]/40 bg-[#6FA88A]/[0.06] text-[#6FA88A] hover:bg-[#6FA88A]/10"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${vaultLocked ? "bg-[#B8935A]" : "bg-[#6FA88A]"}`} />
                    {vaultLocked ? "UNLOCK VAULT" : "LOCK VAULT"}
                  </button>
                </div>
                <p className="mt-4 text-center text-[8px] font-mono text-[#8B8F99]/50">INTERACTIVE SECURITY DEMONSTRATION</p>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-start justify-between mb-7">
                  <div>
                    <p className="text-[9px] font-mono tracking-[0.16em] text-[#B8935A]">VAULT MANIFEST</p>
                    <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-[#E8E6E0]">Everything under control.</h2>
                  </div>
                  <div className="px-2.5 py-1 rounded-md border border-[#6FA88A]/20 bg-[#6FA88A]/[0.06] text-[8px] font-mono tracking-wider text-[#6FA88A]">
                    SECURED
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#181B21] border border-[#2A2E37]">
                  <StorageBar />
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono tracking-[0.14em] text-[#8B8F99]">RECENT OBJECTS</span>
                    <span className="text-[8px] font-mono text-[#2A2E37]">02 / 128</span>
                  </div>
                  <div className="space-y-2">
                    <FileRow type="document" name="quarterly_report_2027.pdf" meta="4.2 MB  •  DOCUMENT" status="SHARED" />
                    <FileRow type="secure" name="vault_backup.enc" meta="1.1 MB  •  ENCRYPTED" status="PRIVATE" />
                    <FileRow type="document" name="project_archive.zip" meta="284 MB  •  ARCHIVE" status="PRIVATE" />
                  </div>
                </div>

                <div className="grid grid-cols-3 mt-6 pt-5 border-t border-[#2A2E37]">
                  <div>
                    <p className="text-[8px] font-mono text-[#8B8F99]">FILES</p>
                    <p className="mt-1 text-sm font-semibold text-[#E8E6E0]">128</p>
                  </div>
                  <div className="border-x border-[#2A2E37] px-4">
                    <p className="text-[8px] font-mono text-[#8B8F99]">SHARES</p>
                    <p className="mt-1 text-sm font-semibold text-[#E8E6E0]">06</p>
                  </div>
                  <div className="pl-4">
                    <p className="text-[8px] font-mono text-[#8B8F99]">STATUS</p>
                    <p className="mt-1 text-sm font-semibold text-[#6FA88A]">SECURE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-[#2A2E37]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 py-20 sm:py-24">
            <div className="max-w-2xl mb-12">
              <p className="text-[9px] font-mono tracking-[0.18em] text-[#B8935A]">ARCHITECTURAL SPECIFICATIONS</p>
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#E8E6E0]">
                Built around control.<br />
                Not convenience alone.
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#8B8F99]">
                VaultDrive treats your storage like infrastructure: structured, observable, and deliberately protected.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="group p-6 sm:p-7 rounded-2xl bg-[#1C1F26] border border-[#2A2E37] hover:border-[#B8935A]/40 transition-all duration-300">
                <FeatureIcon>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </FeatureIcon>
                <p className="mt-6 text-[9px] font-mono tracking-[0.14em] text-[#B8935A]">01 / ACCESS</p>
                <h3 className="mt-2 text-lg font-semibold text-[#E8E6E0]">Controlled authentication</h3>
                <p className="mt-3 text-xs leading-6 text-[#8B8F99]">
                  Token rotation, protected sessions, HTTP-only cookies, and deliberate authentication boundaries keep access under control.
                </p>
              </div>

              <div className="group p-6 sm:p-7 rounded-2xl bg-[#1C1F26] border border-[#2A2E37] hover:border-[#B8935A]/40 transition-all duration-300">
                <FeatureIcon>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M3 7V5a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </FeatureIcon>
                <p className="mt-6 text-[9px] font-mono tracking-[0.14em] text-[#B8935A]">02 / STRUCTURE</p>
                <h3 className="mt-2 text-lg font-semibold text-[#E8E6E0]">Structured file systems</h3>
                <p className="mt-3 text-xs leading-6 text-[#8B8F99]">
                  Organize assets into nested folders with safeguards against circular relationships and broken parent-child structures.
                </p>
              </div>

              <div className="group p-6 sm:p-7 rounded-2xl bg-[#1C1F26] border border-[#2A2E37] hover:border-[#B8935A]/40 transition-all duration-300">
                <FeatureIcon>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" />
                    <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </FeatureIcon>
                <p className="mt-6 text-[9px] font-mono tracking-[0.14em] text-[#B8935A]">03 / SHARING</p>
                <h3 className="mt-2 text-lg font-semibold text-[#E8E6E0]">Granular sharing</h3>
                <p className="mt-3 text-xs leading-6 text-[#8B8F99]">
                  Share individual assets deliberately, whether through public links or targeted access for registered users.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-[#2A2E37]">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 py-20 sm:py-24 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-[#181B21] border border-[#B8935A]/30 flex items-center justify-center text-[#B8935A]">
              <LogoMark className="w-5 h-5" />
            </div>
            <p className="mt-7 text-[9px] font-mono tracking-[0.18em] text-[#B8935A]">YOUR STORAGE / YOUR CONTROL</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-[#E8E6E0]">Ready to lock it down?</h2>
            <p className="max-w-lg mx-auto mt-4 text-sm leading-6 text-[#8B8F99]">
              Create your private vault and start organizing your files inside a storage environment built around controlled access.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#B8935A] to-[#C8A66B] text-[#14161A] text-xs font-mono font-semibold tracking-wider shadow-[0_12px_35px_rgba(184,147,90,0.14)] hover:brightness-110 transition-all"
            >
              INITIALIZE YOUR VAULT
              <ArrowIcon />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#2A2E37] bg-[#14161A]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoMark className="w-4 h-4 text-[#B8935A]" />
            <span className="text-[9px] font-mono tracking-wider text-[#8B8F99]">VAULTDRIVE</span>
          </div>

          <p className="text-[8px] font-mono tracking-wider text-[#8B8F99]/60 text-center">
            PRIVATE STORAGE PLATFORM
            <span className="mx-2 text-[#2A2E37]">•</span>
            SECURE NODE ONLINE
          </p>

          <span className="text-[8px] font-mono text-[#8B8F99]/50">© 2027</span>
        </div>
      </footer>

      <style>{`
        @keyframes landingVaultSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes landingVaultReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
