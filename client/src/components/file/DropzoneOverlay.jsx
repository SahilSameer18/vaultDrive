import { useEffect, useState } from "react";

export default function DropzoneOverlay({ onFileDropped }) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let dragCounter = 0;

    function handleDragEnter(e) {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files")) {
        setIsDragging(true);
      }
    }

    function handleDragLeave(e) {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDragging(false);
      }
    }

    function handleDragOver(e) {
      e.preventDefault();
    }

    function handleDrop(e) {
      e.preventDefault();
      dragCounter = 0;
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0 && onFileDropped) {
        onFileDropped(files);
      }
    }

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [onFileDropped]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-[var(--theme-bg)]/85 backdrop-blur-md pointer-events-none select-none">
      <div className="absolute inset-4 sm:inset-8 border-2 border-dashed border-[var(--theme-accent)]/80 rounded-3xl shadow-[0_0_80px_rgba(197,160,89,0.2)] animate-pulse" />
      
      <div className="relative z-10 text-center space-y-4 max-w-md p-8 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)]/95 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-accent)]/50 shadow-[0_0_40px_rgba(197,160,89,0.3)] flex items-center justify-center text-[var(--theme-accent)] mx-auto animate-bounce">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[var(--theme-text)] tracking-tight">
          Release to Ingest into Vault
        </h2>
        
        <p className="text-[10px] font-mono text-[var(--theme-accent)] tracking-widest uppercase">
          AUTOMATIC SECURE ENCRYPTION PIPELINE ACTIVE
        </p>
      </div>
    </div>
  );
}
