import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./components/layout/Topbar";
import Sidebar from "./components/layout/Sidebar";

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-vault-bg text-vault-text flex flex-col overflow-hidden font-sans selection:bg-vault-accent/30">
      
      {/* ── Top Navigation Bar ───────────────────────────────────────────── */}
      <Topbar onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />

      {/* ── Body: Sidebar + Main Content Viewport ────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Desktop Sidebar (Permanent) */}
        <div className="hidden lg:block h-full">
          <Sidebar />
        </div>

        {/* Mobile Drawer Overlay (Slide in on mobile toggle) */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sliding Drawer */}
            <div className="relative w-64 max-w-[80vw] h-full bg-vault-bg shadow-2xl z-10">
              <Sidebar onCloseMobileMenu={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-y-auto bg-vault-bg p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
}
