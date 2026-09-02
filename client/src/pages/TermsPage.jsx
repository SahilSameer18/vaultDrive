import { useEffect } from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingFooter from "../components/landing/LandingFooter";

export default function TermsPage() {
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
            <span>LEGAL & POLICIES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-vault-text">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-vault-muted">
            Last Updated: August 2026
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-xs sm:text-sm text-vault-muted-light leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-vault-text">1. Acceptance of Terms</h2>
            <p>
              By accessing or using VaultDrive, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-vault-text">2. Account Security & Responsibilities</h2>
            <p>
              When you create an account, you are responsible for maintaining the confidentiality of your credentials and password. You agree to notify us immediately of any unauthorized access to your account.
            </p>
            <p>
              VaultDrive provides multi-device session revocation. When you change your password, all existing active login sessions across devices are invalidated.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-vault-text">3. Your Files & Content Ownership</h2>
            <p>
              <strong className="text-vault-text">You retain 100% ownership of all files, documents, and media</strong> uploaded to VaultDrive. We do not claim any intellectual property rights over your content.
            </p>
            <p>
              VaultDrive does not scan, index, sell, or profile your private files for advertising purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-vault-text">4. Storage Limits & Acceptable Use</h2>
            <p>
              Each standard account includes a designated storage quota (such as 1GB on the standard tier). You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-vault-muted">
              <li>Upload malicious code, viruses, or software intended to harm systems.</li>
              <li>Engage in illegal distribution of copyrighted material.</li>
              <li>Attempt to circumvent service limits, rate limiters, or authentication mechanisms.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-vault-text">5. Link Sharing & Access Control</h2>
            <p>
              VaultDrive provides tools to share links publicly or protected with a passcode. You are solely responsible for distributing your share links and passcodes to intended recipients.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-vault-text">6. Data Deletion & Trash Recovery</h2>
            <p>
              When you delete a file, it moves to your Trash folder where it can be restored. When you permanently delete a file or empty your Trash, the underlying storage records are irreversibly deleted from our systems.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-vault-text">7. Modifications & Inquiries</h2>
            <p>
              We may periodically update these Terms to reflect improvements in our architecture or legal compliance. Continued use of VaultDrive signifies acceptance of updated terms.
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
            to="/privacy"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-vault-muted hover:text-vault-text"
          >
            Read Privacy Policy →
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
