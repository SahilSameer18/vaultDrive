import { useState } from "react";
import { Link } from "react-router-dom";

function SearchIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.75" />
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ImageIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <path d="m21 15-5-5L5 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileTextIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function LockClosedIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function CloudUploadIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12v9M16 16l-4-4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const sampleFiles = [
  { id: "1", name: "Tax_Return_2026.pdf", size: "4.2 MB", folder: "financial", type: "doc", date: "Updated 2h ago", status: "PRIVATE", color: "#6FA88A" },
  { id: "2", name: "family_vacation_photo.png", size: "8.4 MB", folder: "media", type: "image", date: "Updated Yesterday", status: "PASSCODE LINK", color: "#B8935A" },
  { id: "3", name: "Q3_Product_Roadmap.pdf", size: "1.8 MB", folder: "work", type: "doc", date: "Updated 1d ago", status: "PRIVATE", color: "#6FA88A" },
  { id: "4", name: "project_presentation.zip", size: "128 MB", folder: "work", type: "archive", date: "Updated 3d ago", status: "PUBLIC LINK", color: "#38BDF8" }
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);

  const filteredFiles = sampleFiles.filter((file) => {
    const matchesFolder = selectedFolder === "all" || file.folder === selectedFolder;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 lg:pt-20 pb-16 sm:pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left Column (5 Cols): Headline & Clean CTA Buttons */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          
          {/* Ticker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#2A2E37] bg-[#14161A] text-[10px] font-mono text-[#8B8F99] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6FA88A]" />
            <span>STORAGE SYSTEM // ACTIVE</span>
          </div>

          {/* Display Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.06] text-[#E8E6E0]">
            Vault-grade cloud storage. <br />
            <span className="bg-gradient-to-r from-[#B8935A] via-[#D8B478] to-[#E8E6E0] bg-clip-text text-transparent">
              Built for control.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#8B8F99]">
            VaultDrive provides private storage, nested folder trees, and passcode-protected public file sharing.
          </p>

          {/* Clean Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8 w-full sm:w-auto">
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#B8935A] to-[#C8A66B] text-[#0C0D10] text-sm font-semibold tracking-wide shadow-[0_10px_35px_rgba(184,147,90,0.22)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12" />
              <span>Get Started Free</span>
            </Link>

            <Link
              to="/login"
              className="relative group overflow-hidden rounded-xl p-[1px] shadow-lg shadow-black/40"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#B8935A] via-[#E8E6E0] to-[#B8935A] opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center justify-center px-6 py-3.5 rounded-[11px] bg-[#14161A] text-sm font-semibold tracking-wide text-[#E8E6E0] group-hover:bg-[#1C1F26] transition-all duration-200">
                <span>Sign In</span>
              </span>
            </Link>
          </div>

          {/* Trust Specs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 text-[11px] font-mono text-[#8B8F99]">
            <span>✓ 1GB Free Storage</span>
            <span className="hidden sm:inline">•</span>
            <span>✓ Password Protection</span>
          </div>

        </div>

        {/* Right Column (7 Cols): Live Interactive Workspace Side-by-Side */}
        <div className="lg:col-span-7 w-full">
          <div className="relative rounded-2xl border border-[#2A2E37] bg-[#181B21] p-4 sm:p-6 shadow-2xl text-left overflow-hidden">
            
            {/* Header Control Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-4 mb-4 border-b border-[#2A2E37] gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C0654F]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B8935A]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6FA88A]" />
                </div>
                <span className="ml-2 text-xs font-mono font-medium text-[#E8E6E0] truncate">
                  VaultDrive Workspace
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 sm:max-w-xs">
                <SearchIcon className="w-3.5 h-3.5 text-[#8B8F99] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files & folders..."
                  className="w-full bg-[#14161A] border border-[#2A2E37] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#E8E6E0] focus:outline-none placeholder-[#8B8F99]/60"
                />
              </div>
            </div>

            {/* Interactive Folder Filter Buttons */}
            <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedFolder("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  selectedFolder === "all"
                    ? "bg-[#B8935A] text-[#0C0D10] font-semibold"
                    : "bg-[#14161A] border border-[#2A2E37] text-[#8B8F99] hover:text-[#E8E6E0]"
                }`}
              >
                All Files
              </button>
              <button
                type="button"
                onClick={() => setSelectedFolder("work")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  selectedFolder === "work"
                    ? "bg-[#B8935A] text-[#0C0D10] font-semibold"
                    : "bg-[#14161A] border border-[#2A2E37] text-[#8B8F99] hover:text-[#E8E6E0]"
                }`}
              >
                📁 Work Projects
              </button>
              <button
                type="button"
                onClick={() => setSelectedFolder("financial")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  selectedFolder === "financial"
                    ? "bg-[#B8935A] text-[#0C0D10] font-semibold"
                    : "bg-[#14161A] border border-[#2A2E37] text-[#8B8F99] hover:text-[#E8E6E0]"
                }`}
              >
                📁 Financial
              </button>
              <button
                type="button"
                onClick={() => setSelectedFolder("media")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  selectedFolder === "media"
                    ? "bg-[#B8935A] text-[#0C0D10] font-semibold"
                    : "bg-[#14161A] border border-[#2A2E37] text-[#8B8F99] hover:text-[#E8E6E0]"
                }`}
              >
                📁 Media
              </button>
            </div>

            {/* File List */}
            <div className="space-y-2 mb-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(selectedFile?.id === file.id ? null : file)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedFile?.id === file.id
                      ? "bg-[#1C1F26] border-[#B8935A]"
                      : "bg-[#14161A] border-[#2A2E37] hover:border-[#B8935A]/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#181B21] border border-[#2A2E37] flex items-center justify-center shrink-0">
                      {file.type === "image" ? (
                        <ImageIcon className="w-4 h-4 text-[#B8935A]" />
                      ) : file.type === "archive" ? (
                        <ShareIcon className="w-4 h-4 text-[#38BDF8]" />
                      ) : (
                        <FileTextIcon className="w-4 h-4 text-[#6FA88A]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#E8E6E0] truncate">{file.name}</p>
                      <p className="text-[10px] font-mono text-[#8B8F99]">{file.size} • {file.date}</p>
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded border text-[9px] font-mono shrink-0"
                    style={{
                      borderColor: `${file.color}40`,
                      backgroundColor: `${file.color}15`,
                      color: file.color
                    }}
                  >
                    {file.status}
                  </span>
                </div>
              ))}
            </div>

            {/* File Inspection Drawer */}
            {selectedFile && (
              <div className="p-3 rounded-xl bg-[#181B21] border border-[#B8935A]/50 mb-4 animate-fade-in-up flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <LockClosedIcon className="w-4 h-4 text-[#B8935A]" />
                  <span className="text-[#E8E6E0]">Selected: {selectedFile.name}</span>
                </div>
                <span className="text-[#6FA88A]">Ready for sharing</span>
              </div>
            )}

            {/* Status Bar */}
            <div className="p-3 rounded-xl bg-[#14161A] border border-[#2A2E37] flex items-center justify-between text-xs font-mono text-[#8B8F99]">
              <div className="flex items-center gap-2">
                <CloudUploadIcon className="w-4 h-4 text-[#B8935A]" />
                <span>Cloud Storage Connected</span>
              </div>
              <span className="text-[#6FA88A]">73.4 / 100 GB</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
