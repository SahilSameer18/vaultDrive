import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingFooter from "../components/landing/LandingFooter";

const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "security", title: "2. Account Security & Credentials" },
  { id: "ownership", title: "3. File Ownership & Zero-Access" },
  { id: "storage", title: "4. Storage Limits & Acceptable Use" },
  { id: "sharing", title: "5. Link Sharing & Access Control" },
  { id: "deletion", title: "6. Data Deletion & Trash Recovery" },
  { id: "modifications", title: "7. Modifications & Inquiries" },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("acceptance");

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
            <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider text-vault-accent bg-vault-accent/10 border border-vault-accent/25">
              LEGAL SPECIFICATION // DOC-TOS-2026.8
            </span>
            <span className="px-2.5 py-1 rounded text-[10px] font-mono text-[var(--color-vault-muted)] bg-[var(--theme-surface)] border border-[var(--theme-border)]">
              ENCRYPTION PROTOCOL COMPLIANT
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-vault-text)]">
            Terms of Service
          </h1>
          <p className="mt-3 text-xs sm:text-sm font-mono text-[var(--color-vault-muted)] flex items-center gap-2">
            <span>Effective: August 2026</span>
            <span>•</span>
            <span>Applicable to all VaultDrive clusters</span>
          </p>
        </div>

        {/* Layout Grid: Sticky Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-14 items-start">
          
          {/* Sticky Quick Nav (Desktop) & Overflow Nav (Mobile) */}
          <aside className="lg:sticky lg:top-28 depth-vault-chassis rounded-xl p-4 sm:p-5 border border-[var(--theme-border)] bg-[var(--theme-surface)]/90 backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-vault-muted)] mb-3 pb-2 border-b border-[var(--theme-border)] flex items-center justify-between">
              <span>TABLE OF CONTENTS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-vault-accent" />
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
                to="/privacy"
                className="text-xs font-mono text-vault-accent hover:underline flex items-center justify-between group"
              >
                <span>Privacy Policy</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </aside>

          {/* Legal Clauses Content */}
          <div className="space-y-12 text-xs sm:text-sm text-[var(--color-vault-muted-light)] leading-relaxed">
            
            <section id="acceptance" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-vault-accent font-mono text-xs">§ 1.0</span> Acceptance of Terms
              </h2>
              <p>
                By provisioning a vault repository, authenticating via OAuth or credentials, or interacting with VaultDrive APIs, you irrevocably agree to comply with and be governed by these Terms of Service. If you do not accept these provisions without reservation, access to VaultDrive services is strictly unauthorized.
              </p>
            </section>

            <section id="security" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-vault-accent font-mono text-xs">§ 2.0</span> Account Security & Credentials
              </h2>
              <p>
                You maintain exclusive responsibility for preserving the confidential integrity of your credentials, multi-factor tokens, and session authorizations. Any activity originating from authenticated sessions associated with your cryptographic identifiers will be attributed to your account.
              </p>
              
              {/* Callout box */}
              <div className="depth-vault-card rounded-xl p-4 sm:p-5 border border-vault-accent/30 bg-vault-accent/[0.03]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-vault-accent font-semibold mb-1 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  AUTOMATED MULTI-DEVICE SESSION INVALIDATION
                </div>
                <p className="text-xs text-[var(--color-vault-muted)] leading-relaxed">
                  Upon executing a password modification or explicit security reset, VaultDrive triggers an instantaneous cryptographic revocation of all active JWT refresh pairs across every authorized device.
                </p>
              </div>
            </section>

            <section id="ownership" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-vault-accent font-mono text-xs">§ 3.0</span> File Ownership & Zero-Access
              </h2>
              <p>
                <strong className="text-[var(--color-vault-text)]">You retain 100% unilateral ownership of all encrypted binary assets</strong>, documents, media streams, and structural hierarchy data deposited into VaultDrive. VaultDrive claims zero copyright, licensing, or commercial distribution claims over user content.
              </p>
              <p>
                Under our architecture, VaultDrive systems never scan, parse, construct commercial profiles, or sell private data or metadata payloads for advertising or AI machine learning ingest.
              </p>
            </section>

            <section id="storage" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-vault-accent font-mono text-xs">§ 4.0</span> Storage Limits & Acceptable Use
              </h2>
              <p>
                Storage quotas are allocated according to your verified tier specification (such as 1GB quota baseline). Users agree not to abuse infrastructure, and strictly refrain from:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[var(--color-vault-muted)]">
                <li>Injecting malicious bytecode, ransomware payloads, trojans, or exploit toolkits.</li>
                <li>Transmitting or hosting unlawful content or unauthorized distribution of third-party copyrighted intellectual property.</li>
                <li>Executing Denial-of-Service attacks, automated endpoint crawling, or attempting to breach hardware security limits.</li>
              </ul>
            </section>

            <section id="sharing" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-vault-accent font-mono text-xs">§ 5.0</span> Link Sharing & Access Control
              </h2>
              <p>
                VaultDrive grants you sovereign control over share tokens and secondary passcode protection barriers. You are exclusively responsible for controlling the distribution of generated links, setting expiration thresholds, and distributing passcodes to designated recipients.
              </p>
            </section>

            <section id="deletion" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-vault-accent font-mono text-xs">§ 6.0</span> Data Deletion & Trash Recovery
              </h2>
              <p>
                Deleted objects transition to an isolated Trash partition where they remain restorable at the user’s discretion. Upon initiating an explicit permanent purge or emptying Trash, the underlying storage blocks and database references are irreversibly destroyed.
              </p>
            </section>

            <section id="modifications" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-vault-accent font-mono text-xs">§ 7.0</span> Modifications & Inquiries
              </h2>
              <p>
                These legal parameters may be modified periodically to reflect protocol iterations or statutory regulations. Continued authorization of your account following revision broadcasts constitutes acceptance of amended policies.
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
                to="/privacy"
                className="text-xs sm:text-sm font-semibold text-[var(--color-vault-muted)] hover:text-[var(--color-vault-text)] flex items-center gap-1.5"
              >
                Inspect Privacy Policy →
              </Link>
            </div>

          </div>

        </div>

      </main>

      <LandingFooter />

    </div>
  );
}
