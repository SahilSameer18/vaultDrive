import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import CoreBenefits from "../components/landing/CoreBenefits";
import ComparisonMatrix from "../components/landing/ComparisonMatrix";
import FaqSection from "../components/landing/FaqSection";
import LandingFooter from "../components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-vault-landing-bg text-vault-text selection:bg-vault-accent/30 selection:text-vault-text">
      {/* ── Atmospheric Lighting & Depth Canvas ────────────────────────── */}
      {/* Top Vault Illumination: subtle champagne photon beam at hero apex */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] sm:w-[1200px] h-[500px] bg-gradient-to-b from-vault-accent/[0.07] via-vault-accent/[0.015] to-transparent rounded-full blur-[120px] pointer-events-none z-0" 
        aria-hidden="true" 
      />

      {/* Precision Engineered Grid with Vignette Mask (prevents harsh grid lines) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" 
        aria-hidden="true" 
      />

      {/* Atmospheric Perimeter Vignette */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(5,6,8,0.75)_100%)]" 
        aria-hidden="true" 
      />

      {/* ── Navigation Bar (Floating Precision Deck) ───────────────────── */}
      <LandingNavbar />

      <main className="relative z-10 pt-16 sm:pt-20">
        {/* Hero Section */}
        <HeroSection />

        {/* Core Advantages */}
        <CoreBenefits />

        {/* Comparison Matrix Table */}
        <ComparisonMatrix />

        {/* FAQ Accordion Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
