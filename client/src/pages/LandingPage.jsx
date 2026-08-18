import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import CoreBenefits from "../components/landing/CoreBenefits";
import ComparisonMatrix from "../components/landing/ComparisonMatrix";
import FaqSection from "../components/landing/FaqSection";
import LandingFooter from "../components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0C0D10] text-[#E8E6E0] selection:bg-[#B8935A]/30 selection:text-[#E8E6E0]">
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


