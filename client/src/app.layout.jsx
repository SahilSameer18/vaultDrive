import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Topbar from "./components/layout/Topbar";
import Sidebar from "./components/layout/Sidebar";
import DropzoneOverlay from "./components/file/DropzoneOverlay";
import { filesApi } from "./api/files.api";
import { useToast } from "./components/ui/Toast";

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { addToast } = useToast();

  // Extract folderId from URL if user is inside /folder/:folderId
  const folderMatch = location.pathname.match(/\/folder\/([^/]+)/);
  const currentFolderId = folderMatch ? folderMatch[1] : null;

  const handleDroppedFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (currentFolderId) formData.append("folderId", currentFolderId);

      await filesApi.upload(formData);
      addToast(`File "${file.name}" uploaded successfully`, "success");
      // Broadcast custom event so Sidebar and Active Page refresh state
      window.dispatchEvent(new CustomEvent("vault:files-changed"));
      window.dispatchEvent(new CustomEvent("vault:file-uploaded"));
    } catch {
      addToast("File upload failed", "error");
    }
  };


  return (
    <div className="h-screen w-screen bg-vault-bg text-vault-text flex flex-col overflow-hidden font-sans selection:bg-vault-accent/30">
      
      {/* Whole-page Drag & Drop Overlay */}
      <DropzoneOverlay onFileDropped={handleDroppedFile} />

      {/* ── Top Navigation Bar ───────────────────────────────────────────── */}
      <Topbar onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />

      {/* ── Body: Sidebar + Main Content Viewport ────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Desktop Sidebar (Permanent) */}
        <div className="hidden lg:block h-full">
          <Sidebar />
        </div>

        {/* Mobile Drawer Overlay (Slide in on mobile toggle) */}
        <div
          className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sliding Drawer */}
          <div
            className={`relative w-64 max-w-[80vw] h-full bg-vault-bg shadow-2xl z-10 transition-transform duration-300 ease-out ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar onCloseMobileMenu={() => setMobileMenuOpen(false)} />
          </div>
        </div>

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
