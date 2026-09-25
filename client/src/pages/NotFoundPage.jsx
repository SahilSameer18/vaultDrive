import { Link } from "react-router-dom";

function ArchitecturalOfflineVault() {
  // Generate crisp radial ticks mathematically in SVG coordinates (cx=130, cy=130)
  const ticks = [];
  const totalTicks = 24;
  for (let i = 0; i < totalTicks; i++) {
    // Intentionally omit ticks 5, 6, 17, 18 to visually symbolize a severed/broken circuit
    if (i === 5 || i === 6 || i === 17 || i === 18) continue;
    const angle = (i * 360) / totalTicks;
    const rad = (angle * Math.PI) / 180;
    const rInner = 104;
    const rOuter = 114;
    const x1 = 130 + rInner * Math.cos(rad);
    const y1 = 130 + rInner * Math.sin(rad);
    const x2 = 130 + rOuter * Math.cos(rad);
    const y2 = 130 + rOuter * Math.sin(rad);
    ticks.push({ x1, y1, x2, y2, id: i });
  }

  return (
    <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] mx-auto select-none">
      {/* Ambient warning photon glow */}
      <div className="absolute inset-4 rounded-full bg-rose-500/[0.08] blur-[40px] pointer-events-none" />

      <svg
        viewBox="0 0 260 260"
        className="w-full h-full relative z-10 drop-shadow-[0_12px_36px_rgba(0,0,0,0.5)]"
        fill="none"
      >
        <defs>
          <radialGradient id="dialGrad404" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--theme-panel)" />
            <stop offset="80%" stopColor="var(--theme-surface)" />
            <stop offset="100%" stopColor="var(--theme-bg)" />
          </radialGradient>
          <linearGradient id="roseAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        {/* Outer security perimeter ring */}
        <circle
          cx="130"
          cy="130"
          r="124"
          stroke="var(--theme-border)"
          strokeWidth="1"
          strokeDasharray="3 6"
        />

        {/* Severed orbital ring segment */}
        <path
          d="M 130 10 A 120 120 0 0 1 250 130"
          stroke="url(#roseAccentGrad)"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />

        {/* Ticks array */}
        {ticks.map((t) => (
          <line
            key={t.id}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="var(--theme-border)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}

        {/* Main Vault Plate */}
        <circle
          cx="130"
          cy="130"
          r="92"
          fill="url(#dialGrad404)"
          stroke="var(--theme-border)"
          strokeWidth="1.5"
        />

        {/* Inner concentric warning ring */}
        <circle
          cx="130"
          cy="130"
          r="74"
          stroke="#f43f5e"
          strokeWidth="1"
          strokeOpacity="0.25"
          strokeDasharray="4 4"
        />

        {/* Central Escutcheon Housing */}
        <rect
          x="94"
          y="94"
          width="72"
          height="72"
          rx="18"
          fill="var(--theme-bg)"
          stroke="var(--theme-border)"
          strokeWidth="1.5"
        />

        {/* Sprung / Fractured Shackle */}
        <path
          d="M 116 94 V 78 C 116 70 122 64 130 64 C 138 64 144 70 144 78"
          stroke="#f43f5e"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Red Warning Isolation Icon */}
        <circle cx="130" cy="130" r="14" fill="#f43f5e" fillOpacity="0.12" />
        <path
          d="M 124 124 L 136 136 M 136 124 L 124 136"
          stroke="#f43f5e"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Status Callout Nodes */}
        <circle cx="130" cy="14" r="3" fill="#f43f5e" />
        <circle cx="130" cy="246" r="2.5" fill="var(--color-vault-muted)" fillOpacity="0.4" />
      </svg>

      {/* Sub-label */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--theme-surface)] border border-rose-500/30 text-xs text-rose-400 whitespace-nowrap shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
        Not Found
      </div>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full bg-[var(--theme-bg)] text-[var(--color-vault-text)] font-sans flex flex-col justify-between relative overflow-x-hidden selection:bg-vault-accent/30 selection:text-white">
      
      {/* Background Grid & Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-25" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-rose-500/[0.04] blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--theme-bg)_85%)]" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]/80 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-accent rounded-lg p-1">
            <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface)] border border-vault-accent/40 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-[var(--color-vault-text)]">VaultDrive</span>
              <span className="text-xs text-[var(--color-vault-muted)]">Page Not Found</span>
            </div>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            404
          </span>
        </div>
      </header>

      {/* Main Exception Viewport */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full max-w-3xl grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-14 items-center">
          
          <ArchitecturalOfflineVault />

          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-vault-text)] leading-tight">
              Page not found.
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-[var(--color-vault-muted)] leading-relaxed max-w-md mx-auto lg:mx-0">
              The page you're looking for doesn't exist or may have moved.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-7">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold text-white bg-vault-accent hover:bg-vault-accent-hover shadow-lg shadow-vault-accent/20 transition-all flex items-center justify-center gap-2 tactile-btn active:scale-98"
              >
                Back to Dashboard
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-medium text-[var(--color-vault-muted)] bg-[var(--theme-surface)] border border-[var(--theme-border)] hover:border-vault-accent hover:text-[var(--color-vault-text)] transition-all flex items-center justify-center active:scale-98"
              >
                Homepage
              </Link>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--theme-border)] bg-[var(--theme-bg)] py-4 text-center text-xs text-[var(--color-vault-muted)]">
        © 2026 VaultDrive
      </footer>

    </div>
  );
}
