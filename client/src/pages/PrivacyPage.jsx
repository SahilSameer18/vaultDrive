import { useEffect } from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingFooter from "../components/landing/LandingFooter";

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="relative min-h-screen bg-vault-landing-bg text-vault-text selection:bg-vault-accent/30 selection:text-vault-text">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-grid-pattern opacity-50" />

      <LandingNavbar />

      <main className="relative z-10 pt-28 sm:pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-8 text-left">
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-vault-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vault-border bg-vault-bg text-[10px] font-mono text-vault-muted mb-4">
            <span>DATA & PRIVACY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-vault-text">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-vault-muted">
            Last Updated: August 2026
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-xs sm:text-sm text-vault-muted-light leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-vault-text">1. Our Privacy Principle</h2>
            <p>
              At VaultDrive, our philosophy is simple: <strong className="text-vault-text">your data is yours alone</strong>. We do not monetize your personal files, sell your metadata, or run ad tracking networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-vault-text">2. Information We Collect</h2>
            <p>We only collect the minimal information necessary to deliver the cloud storage service:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-vault-muted">
              <li><strong>Account Information:</strong> Name, email address, and securely hashed passwords (using industry-standard bcrypt/crypto hashing).</li>
              <li><strong>File Metadata:</strong> File names, file sizes, mime types, and folder hierarchy paths to organize your vault.</li>
              <li><strong>Authentication Data:</strong> Secure refresh tokens and session identifiers used to keep you securely signed in across authorized devices.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-vault-text">3. How Your Files Are Handled</h2>
            <p>
              Uploads are transferred directly to cloud storage endpoints over encrypted HTTPS/TLS connections. Files are stored securely and are only accessible by your authenticated account or by individuals with whom you intentionally share a link.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-vault-text">4. Passcode-Protected Links</h2>
            <p>
              When you generate a passcode-protected share link, the link receiver must supply the exact passcode before download authorization is granted. Passcodes are verified server-side.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-vault-text">5. Your Rights & Data Deletion</h2>
            <p>
              You have full control over your data. You can delete individual files, empty your Trash, or delete your entire account at any time. When deleted, file objects are purged from storage.
            </p>
          </section>

        </div>

        {/* Back Link */}
        <div className="mt-14 pt-8 border-t border-vault-border flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-vault-accent hover:underline"
          >
            ← Back to Home
          </Link>
          <Link
            to="/terms"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-vault-muted hover:text-vault-text"
          >
            Read Terms of Service →
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
