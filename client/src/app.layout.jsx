import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Topbar from "./components/layout/Topbar";
import Sidebar from "./components/layout/Sidebar";
import DropzoneOverlay from "./components/file/DropzoneOverlay";
import { useToast } from "./components/ui/Toast";
import {
  createQueueItems,
  processUploadBatch,
  MAX_BATCH_FILES,
  MAX_FILE_SIZE_BYTES,
} from "./utils/uploadQueue";

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { addToast } = useToast();

  // Extract folderId from URL if user is inside /folder/:folderId
  const folderMatch = location.pathname.match(/\/folder\/([^/]+)/);
  const currentFolderId = folderMatch ? folderMatch[1] : null;

  const handleDroppedFiles = (filesList) => {
    if (!filesList || filesList.length === 0) return;

    const filesArray = Array.from(filesList).slice(0, MAX_BATCH_FILES);
    const validFiles = [];

    for (const f of filesArray) {
      if (f.size > MAX_FILE_SIZE_BYTES) {
        addToast(`"${f.name}" exceeds 100MB limit`, "error");
      } else {
        validFiles.push(f);
      }
    }

    if (validFiles.length === 0) return;

    const queueItems = createQueueItems(validFiles);
    addToast(`Uploading batch of ${validFiles.length} ${validFiles.length === 1 ? "file" : "files"}...`, "info");

    processUploadBatch(queueItems, currentFolderId, {
      onBatchComplete: (summary) => {
        window.dispatchEvent(new CustomEvent("vault:files-changed"));
        window.dispatchEvent(new CustomEvent("vault:file-uploaded"));

        if (summary.failed === 0) {
          addToast(`All ${summary.completed} files uploaded successfully!`, "success");
        } else {
          addToast(`${summary.completed} uploaded, ${summary.failed} failed`, "warning");
        }
      },
    });
  };

  return (
    <div className="h-screen w-screen bg-vault-bg text-vault-text flex flex-col overflow-hidden font-sans selection:bg-vault-accent/30">
      
      {/* Whole-page Drag & Drop Overlay */}
      <DropzoneOverlay onFileDropped={handleDroppedFiles} />

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
            className={`relative w-72 sm:w-80 max-w-[85vw] h-full bg-vault-panel border-r border-vault-border shadow-2xl z-10 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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

