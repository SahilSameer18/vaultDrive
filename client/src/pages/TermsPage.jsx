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
            <span className="px-2.5 py-1 rounded text-xs text-[var(--color-vault-muted)] bg-white/[0.04] border border-white/[0.08]">
              Terms of Service
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-vault-text)]">
            Terms of Service
          </h1>
          <p className="mt-3 text-xs sm:text-sm font-mono text-[var(--color-vault-muted)] flex items-center gap-2">
            <span>Last updated: August 2026</span>
          </p>
        </div>

        {/* Layout Grid: Sticky Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-14 items-start">
          
          {/* Sticky Quick Nav (Desktop) & Overflow Nav (Mobile) */}
          <aside className="lg:sticky lg:top-28 depth-vault-chassis rounded-xl p-4 sm:p-5 border border-[var(--theme-border)] bg-[var(--theme-surface)]/90 backdrop-blur-xl">
            <div className="text-xs text-[var(--color-vault-muted)] mb-3 pb-2 border-b border-[var(--theme-border)] flex items-center justify-between">
              <span>Table of Contents</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
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
                <span className="text-[var(--color-vault-muted)] font-mono text-xs">§ 1.0</span> Acceptance of Terms
              </h2>
              <p>
                By creating an account, signing in via Google, or otherwise using VaultDrive, you agree to these Terms of Service. If you do not accept these terms, please do not use VaultDrive.
              </p>
            </section>

            <section id="security" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-[var(--color-vault-muted)] font-mono text-xs">§ 2.0</span> Account Security & Credentials
              </h2>
              <p>
                You're responsible for keeping your account credentials and active sessions confidential. Any activity from an authenticated session on your account will be attributed to you.
              </p>

              {/* Callout box */}
              <div className="depth-vault-card rounded-xl p-4 sm:p-5 border border-white/[0.08] bg-white/[0.03]">
                <div className="text-xs text-[var(--color-vault-muted)] font-semibold mb-1 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Session Security
                </div>
                <p className="text-xs text-[var(--color-vault-muted)] leading-relaxed">
                  Changing your password immediately signs you out of all other devices.
                </p>
              </div>
            </section>

            <section id="ownership" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-[var(--color-vault-muted)] font-mono text-xs">§ 3.0</span> File Ownership & Zero-Access
              </h2>
              <p>
                <strong className="text-[var(--color-vault-text)]">You own the files you upload</strong> to VaultDrive, including documents, media, and folder structures. VaultDrive claims no ownership, licensing, or distribution rights over your content.
              </p>
              <p>
                We don't sell your data or files for advertising or AI training.
              </p>
            </section>

            <section id="storage" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-[var(--color-vault-muted)] font-mono text-xs">§ 4.0</span> Storage Limits & Acceptable Use
              </h2>
              <p>
                Every account gets 1GB of storage. You agree not to misuse the service, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[var(--color-vault-muted)]">
                <li>Uploading malware or malicious code.</li>
                <li>Transmitting or hosting unlawful content or unauthorized copyrighted material.</li>
                <li>Attempting denial-of-service attacks, automated scraping, or attempting to bypass storage or security limits.</li>
              </ul>
            </section>

            <section id="sharing" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-[var(--color-vault-muted)] font-mono text-xs">§ 5.0</span> Link Sharing & Access Control
              </h2>
              <p>
                VaultDrive grants you sovereign control over share tokens and secondary passcode protection barriers. You are exclusively responsible for controlling the distribution of generated links, setting expiration thresholds, and distributing passcodes to designated recipients.
              </p>
            </section>

            <section id="deletion" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-[var(--color-vault-muted)] font-mono text-xs">§ 6.0</span> Data Deletion & Trash Recovery
              </h2>
              <p>
                Deleted files move to Trash, where you can restore them at your discretion. Once you permanently delete a file or empty Trash, the file and its records are permanently removed.
              </p>
            </section>

            <section id="modifications" className="scroll-mt-28 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-vault-text)] flex items-center gap-2">
                <span className="text-[var(--color-vault-muted)] font-mono text-xs">§ 7.0</span> Modifications & Inquiries
              </h2>
              <p>
                We may update these terms from time to time. Continued use of your account after changes are published means you accept the updated terms.
              </p>
            </section>

            {/* Bottom Navigation Ribbon */}
            <div className="pt-8 border-t border-[var(--theme-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/"
                className="text-xs sm:text-sm font-semibold text-vault-accent hover:underline flex items-center gap-1.5"
              >
                ← Back to Home
              </Link>
              <Link
                to="/privacy"
                className="text-xs sm:text-sm font-semibold text-[var(--color-vault-muted)] hover:text-[var(--color-vault-text)] flex items-center gap-1.5"
              >
                View Privacy Policy →
              </Link>
            </div>

          </div>

        </div>

      </main>

      <LandingFooter />

    </div>
  );
}
