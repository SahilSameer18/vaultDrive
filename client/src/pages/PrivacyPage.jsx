import { useEffect } from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingFooter from "../components/landing/LandingFooter";

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0C0D10] text-[#E8E6E0] selection:bg-[#B8935A]/30 selection:text-[#E8E6E0]">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-grid-pattern opacity-50" />

      <LandingNavbar />

      <main className="relative z-10 pt-28 sm:pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-8 text-left">
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-[#2A2E37]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#2A2E37] bg-[#14161A] text-[10px] font-mono text-[#8B8F99] mb-4">
            <span>DATA & PRIVACY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#E8E6E0]">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-[#8B8F99]">
            Last Updated: August 2026
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-xs sm:text-sm text-[#C4C8D0] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#E8E6E0]">1. Our Privacy Principle</h2>
            <p>
              At VaultDrive, our philosophy is simple: <strong className="text-[#E8E6E0]">your data is yours alone</strong>. We do not monetize your personal files, sell your metadata, or run ad tracking networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#E8E6E0]">2. Information We Collect</h2>
            <p>We only collect the minimal information necessary to deliver the cloud storage service:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#8B8F99]">
              <li><strong>Account Information:</strong> Name, email address, and securely hashed passwords (using industry-standard bcrypt/crypto hashing).</li>
              <li><strong>File Metadata:</strong> File names, file sizes, mime types, and folder hierarchy paths to organize your vault.</li>
              <li><strong>Authentication Data:</strong> Secure refresh tokens and session identifiers used to keep you securely signed in across authorized devices.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#E8E6E0]">3. How Your Files Are Handled</h2>
            <p>
              Uploads are transferred directly to cloud storage endpoints over encrypted HTTPS/TLS connections. Files are stored securely and are only accessible by your authenticated account or by individuals with whom you intentionally share a link.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#E8E6E0]">4. Passcode-Protected Links</h2>
            <p>
              When you generate a passcode-protected share link, the link receiver must supply the exact passcode before download authorization is granted. Passcodes are verified server-side.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#E8E6E0]">5. Your Rights & Data Deletion</h2>
            <p>
              You have full control over your data. You can delete individual files, empty your Trash, or delete your entire account at any time. When deleted, file objects are purged from storage.
            </p>
          </section>

        </div>

        {/* Back Link */}
        <div className="mt-14 pt-8 border-t border-[#2A2E37] flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#B8935A] hover:underline"
          >
            ← Back to Home
          </Link>
          <Link
            to="/terms"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8B8F99] hover:text-[#E8E6E0]"
          >
            Read Terms of Service →
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
