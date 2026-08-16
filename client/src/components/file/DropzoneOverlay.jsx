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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-vault-bg/90 backdrop-blur-md border-4 border-dashed border-vault-accent animate-pulse pointer-events-none select-none">
      <div className="text-center space-y-4 fade-in">
        <div className="w-20 h-20 rounded-3xl bg-vault-panel border border-vault-accent shadow-[0_0_50px_rgba(184,147,90,0.3)] flex items-center justify-center text-vault-accent mx-auto">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
            <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-vault-text tracking-tight">
          Drop file to upload into Vault
        </h2>
        
        <p className="text-xs font-mono text-vault-accent tracking-widest uppercase">
          REPOSITORIES / ILLUMINATED DROPZONE ACTIVE
        </p>
      </div>
    </div>
  );
}



