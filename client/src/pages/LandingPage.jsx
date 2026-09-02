import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import CoreBenefits from "../components/landing/CoreBenefits";
import ComparisonMatrix from "../components/landing/ComparisonMatrix";
import FaqSection from "../components/landing/FaqSection";
import LandingFooter from "../components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-vault-landing-bg text-vault-text selection:bg-vault-accent/30 selection:text-vault-text">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-grid-pattern opacity-60" />

      {/* Navigation Bar */}
      <LandingNavbar />

      <main className="relative z-10 pt-16 sm:pt-18">
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
