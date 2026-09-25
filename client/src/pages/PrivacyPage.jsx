import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingFooter from "../components/landing/LandingFooter";

const SECTIONS = [
  { id: "principle", title: "1. Core Privacy Principle" },
  { id: "collection", title: "2. Information We Collect" },
  { id: "handling", title: "3. Cryptographic Asset Transport" },
  { id: "passcodes", title: "4. Passcode & Access Gates" },
  { id: "rights", title: "5. User Rights & Data Purging" },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("principle");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--theme-bg)] text-[var(--color-vault-text)] selection:bg-vault-accent/30 selection:text-white font-sans overflow-x-hidden">
      
      {/* Background Architectural Grid & Subtle Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-25" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-vault-accent/[0.04] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--theme-bg)_85%)]" />
      </div>

      <LandingNavbar />

      <main className="relative z-10 pt-28 sm:pt-32 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="mb-10 sm:mb-14 pb-8 border-b border-[var(--theme-border)]">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/25">
              PRIVACY SPECIFICATION // DOC-PRIV-2026.8
            </span>
            <span className="px-2.5 py-1 rounded text-[10px] font-mono text-[var(--color-vault-muted)] bg-[var(--theme-surface)] border border-[var(--theme-border)]">
              ZERO TELEMETRY MONETIZATION
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-vault-text)]">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs sm:text-sm font-mono text-[var(--color-vault-muted)] flex items-center gap-2">
            <span>Effective: August 2026</span>
            <span>•</span>
            <span>Zero-Knowledge & User Sovereignty Standard</span>
          </p>
        </div>

        {/* Layout Grid: Sticky Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-14 items-start">
          
          {/* Sticky Quick Nav (Desktop) & Overflow Nav (Mobile) */}
          <aside className="lg:sticky lg:top-28 depth-vault-chassis rounded-xl p-4 sm:p-5 border border-[var(--theme-border)] bg-[var(--theme-surface)]/90 backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-vault-muted)] mb-3 pb-2 border-b border-[var(--theme-border)] flex items-center justify-between">
              <span>INDEX CLAUSES</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            
            <nav className="flex flex-col space-y-1">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  className={`text-left text-xs font-medium py-1.5 px-2.5 rounded-lg transition-all cursor-pointer ${
                    activeSection === sec.id
                      ? "text-vault-accent bg-vault-accent/10 font-semibold"
                      : "text-[var(--color-vault-muted)] hover:text-[var(--color-vault-text)] hover:bg-[var(--theme-panel)]"
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-[var(--theme-border)]">
              <Link
                to="/terms"
                className="text-xs font-mono text-vault-accent hover:underline flex items-center justify-between group"
              >
                <span>Terms of Service</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </aside>

          {/* Privacy Clauses Content */}
          <div className="space-y-12 text-xs sm:text-sm text-[var(--color-vault-muted-light)] leading-relaxed">
            
            <section id="principle" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-xs">§ 1.0</span> Core Privacy Principle
              </h2>
              <p>
                At VaultDrive, our operational philosophy is strictly non-custodial: <strong className="text-[var(--color-vault-text)]">your data belongs exclusively to you</strong>. We do not monetize your file assets, sell metadata telemetry, run tracking trackers, or inspect personal vaults for targeted commercial advertising.
              </p>
            </section>

            <section id="collection" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-xs">§ 2.0</span> Information We Collect
              </h2>
              <p>
                We collect only the bare minimum telemetry strictly necessary to execute high-performance cloud storage:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl depth-vault-card border border-[var(--theme-border)] bg-[var(--theme-panel)] space-y-1">
                  <div className="text-[10px] font-mono text-vault-accent uppercase tracking-wider font-semibold">
                    Identity & Auth
                  </div>
                  <p className="text-xs text-[var(--color-vault-muted)]">
                    Name, email address, and cryptographically salted password hashes (Bcrypt / Argon2). Plaintext passwords never touch our logs.
                  </p>
                </div>

                <div className="p-4 rounded-xl depth-vault-card border border-[var(--theme-border)] bg-[var(--theme-panel)] space-y-1">
                  <div className="text-[10px] font-mono text-vault-accent uppercase tracking-wider font-semibold">
                    Structural Metadata
                  </div>
                  <p className="text-xs text-[var(--color-vault-muted)]">
                    Byte sizes, MIME categories, and folder tree nodes required to render your directory hierarchy in the workspace console.
                  </p>
                </div>
              </div>
            </section>

            <section id="handling" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-xs">§ 3.0</span> Cryptographic Asset Transport
              </h2>
              <p>
                Payload transfers are piped directly across encrypted HTTPS/TLS 1.3 tunnels to dedicated cloud storage buckets. Data payloads at rest are shielded under institutional grade AES-256 ciphers.
              </p>

              {/* Callout box */}
              <div className="depth-vault-card rounded-xl p-4 sm:p-5 border border-emerald-500/30 bg-emerald-500/[0.03]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  STRICT ACCESS BOUNDARY ENFORCEMENT
                </div>
                <p className="text-xs text-[var(--color-vault-muted)] leading-relaxed">
                  Only your authenticated identity or recipients granted valid, unrevoked share tokens can trigger pre-signed decryption URIs.
                </p>
              </div>
            </section>

            <section id="passcodes" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-xs">§ 4.0</span> Passcode & Access Gates
              </h2>
              <p>
                When enabling passcode protection on shared documents, pre-signed stream URLs are withholding until the recipient supplies the cryptographic challenge passcode. Passcode checks are rate-limited to eliminate brute-force attack vectors.
              </p>
            </section>

            <section id="rights" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-xs">§ 5.0</span> User Rights & Data Purging
              </h2>
              <p>
                You retain complete sovereign governance over your storage volume. You may selectively restore items, empty trash blocks, or permanently close your account. Purge operations issue hard delete signals that completely obliterate the binary data blocks from storage infrastructure.
              </p>
            </section>

            {/* Bottom Navigation Ribbon */}
            <div className="pt-8 border-t border-[var(--theme-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/"
                className="text-xs sm:text-sm font-semibold text-vault-accent hover:underline flex items-center gap-1.5"
              >
                ← Return to Portal Homepage
              </Link>
              <Link
                to="/terms"
                className="text-xs sm:text-sm font-semibold text-[var(--color-vault-muted)] hover:text-[var(--color-vault-text)] flex items-center gap-1.5"
              >
                Inspect Terms of Service →
              </Link>
            </div>

          </div>

        </div>

      </main>

      <LandingFooter />

    </div>
  );
}
