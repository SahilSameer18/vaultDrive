import { useState } from "react";
import { Link } from "react-router-dom";

function SearchIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="m20 20-4.2-4.2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ImageIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <path d="m21 15-5-5L5 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileTextIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2.5 2.5 0 0 0-2.5 2.5v15A2.5 2.5 0 0 0 6 22h12a2.5 2.5 0 0 0 2.5-2.5V8.5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6.5h6.5M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="2.75" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="6" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="18" cy="19" r="2.75" stroke="currentColor" strokeWidth="1.75" />
      <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function FolderIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.2a2.5 2.5 0 0 1 1.77.73L12.2 7.5H18.5A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockClosedIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="10" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloudUploadIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12v9M16 16l-4-4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const sampleFiles = [
  { id: "1", name: "Tax_Return_2026.pdf", size: "4.2 MB", folder: "financial", type: "doc", date: "Updated 2h ago", status: "ENCRYPTED", statusClass: "border-vault-success/40 bg-vault-success/[0.08] text-vault-success" },
  { id: "2", name: "Executive_Vault_Keys.png", size: "8.4 MB", folder: "media", type: "image", date: "Updated Yesterday", status: "PASSCODE LINK", statusClass: "border-vault-accent/40 bg-vault-accent/[0.08] text-vault-accent" },
  { id: "3", name: "Q3_Strategic_Roadmap.pdf", size: "1.8 MB", folder: "work", type: "doc", date: "Updated 1d ago", status: "PRIVATE", statusClass: "border-vault-success/40 bg-vault-success/[0.08] text-vault-success" },
  { id: "4", name: "Architecture_Archive.zip", size: "128 MB", folder: "work", type: "archive", date: "Updated 3d ago", status: "HMAC SHARE", statusClass: "border-vault-sky/40 bg-vault-sky/[0.08] text-vault-sky" }
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
    <section className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 lg:pt-20 pb-16 sm:pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

        {/* ── Left Column (5 Cols): Typographic Hierarchy ──────────────── */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">

          {/* Cryptographic Telemetry Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-vault-accent/25 bg-vault-accent/[0.05] text-[10px] font-mono tracking-[0.16em] uppercase text-vault-accent mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-vault-accent animate-pulse-dot" />
            <span>ENCRYPTED VAULT ARCHITECTURE</span>
          </div>

          {/* Display Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.035em] leading-[1.1] text-white">
            Digital vault storage. <br />
            <span className="text-gold-gradient">
              Built for absolute privacy.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed text-vault-muted font-normal max-w-[46ch]">
            Client-side encryption, hierarchical folder nesting, and passcode-gated file distribution with zero server surveillance.
          </p>

          {/* Action CTAs: Clean Swiss Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-7 sm:mt-8 w-full sm:w-auto">
            <Link
              to="/register"
              className="tactile-btn inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-vault-accent hover:bg-vault-accent-hover text-vault-landing-bg text-sm font-semibold tracking-tight shadow-[0_2px_16px_rgba(197,160,89,0.25)] hover:shadow-[0_4px_24px_rgba(197,160,89,0.35)] transition-all cursor-pointer text-center"
            >
              <span>Create Free Vault</span>
            </Link>

            <Link
              to="/login"
              className="tactile-btn inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.18] text-sm font-medium tracking-tight text-white transition-all duration-200 text-center"
            >
              <span>Sign In</span>
            </Link>
          </div>

          {/* Trust Specs Strip */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-6 text-[10.5px] sm:text-[11px] font-mono tracking-wider text-vault-muted">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-vault-accent" /> 1GB High-Speed Storage
            </span>
            <span className="hidden sm:inline text-white/10">•</span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-vault-accent" /> Passcode Protection
            </span>
            <span className="hidden sm:inline text-white/10">•</span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-vault-accent" /> Direct HMAC Pipeline
            </span>
          </div>

        </div>

        {/* ── Right Column (7 Cols): Purpose-Built Hardware Security Console ── */}
        <div className="lg:col-span-7 w-full">
          <div className="relative depth-vault-xl rounded-2xl p-3.5 sm:p-6 text-left overflow-hidden">

            {/* Ambient Background Glow inside the card */}
            <div 
              className="absolute -top-24 -right-24 w-72 h-72 bg-vault-accent/[0.07] rounded-full blur-[80px] pointer-events-none" 
              aria-hidden="true" 
            />

            {/* Institutional Security Terminal Header (No fake Apple traffic lights) */}
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-4 mb-4 border-b border-white/[0.06] gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-md bg-vault-accent/15 border border-vault-accent/30 flex items-center justify-center text-vault-accent shrink-0">
                  <LockClosedIcon className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs font-mono font-medium tracking-wider text-vault-text">
                    VAULT_TERMINAL
                  </span>
                  <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/[0.08] text-[9px] font-mono text-emerald-400">
                    AES-256 ACTIVE
                  </span>
                </div>
              </div>

              {/* Fast Command Search Bar */}
              <div className="relative flex-1 sm:max-w-xs">
                <SearchIcon className="w-3.5 h-3.5 text-vault-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search encrypted files..."
                  className="w-full bg-vault-bg/90 border border-white/[0.08] focus:border-vault-accent/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-vault-text focus:outline-none placeholder-vault-muted/50 transition-colors"
                />
              </div>
            </div>

            {/* Segmented Filter Pills */}
            <div className="relative flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: "all", label: "All Items" },
                { id: "work", label: "Work Archive", hasFolder: true },
                { id: "financial", label: "Financial Records", hasFolder: true },
                { id: "media", label: "Encrypted Media", hasFolder: true }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedFolder(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer tactile-btn ${
                    selectedFolder === tab.id
                      ? "bg-vault-accent text-vault-landing-bg font-semibold shadow-[0_2px_10px_rgba(197,160,89,0.3)]"
                      : "bg-white/[0.03] border border-white/[0.06] text-vault-muted hover:text-vault-text hover:bg-white/[0.06]"
                  }`}
                >
                  {tab.hasFolder && <FolderIcon className="w-3 h-3 opacity-70" />}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Precision File Rows */}
            <div className="space-y-2 mb-4">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile?.id === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(isSelected ? null : file)}
                    className={`tactile-btn p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-white/[0.06] border-vault-accent/60 shadow-[0_0_20px_rgba(197,160,89,0.12)]"
                        : "bg-vault-surface/60 border-white/[0.06] hover:border-white/[0.14] hover:bg-vault-surface/90"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-vault-panel border border-white/[0.06] flex items-center justify-center shrink-0 shadow-sm">
                        {file.type === "image" ? (
                          <ImageIcon className="w-4 h-4 text-vault-accent" />
                        ) : file.type === "archive" ? (
                          <ShareIcon className="w-4 h-4 text-vault-sky" />
                        ) : (
                          <FileTextIcon className="w-4 h-4 text-vault-success" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-vault-text truncate group-hover:text-white">
                          {file.name}
                        </p>
                        <p className="text-[10px] font-mono text-vault-muted mt-0.5">
                          {file.size} <span className="text-white/20">•</span> {file.date}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono tracking-wider shrink-0 ${file.statusClass}`}
                    >
                      {file.status}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Selected File Security Inspection Drawer */}
            {selectedFile && (
              <div className="p-3.5 rounded-xl bg-vault-accent/[0.05] border border-vault-accent/35 mb-4 animate-fade-in-up flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldCheckIcon className="w-4 h-4 text-vault-accent shrink-0" />
                  <span className="text-vault-text truncate">
                    Payload: <strong className="text-white">{selectedFile.name}</strong>
                  </span>
                </div>
                <span className="text-vault-success text-[11px] shrink-0 font-medium ml-2">
                  PASSCODE VERIFIED
                </span>
              </div>
            )}

            {/* Storage Quota Telemetry Strip */}
            <div className="p-3 rounded-xl bg-vault-bg/80 border border-white/[0.06] flex items-center justify-between text-xs font-mono text-vault-muted">
              <div className="flex items-center gap-2">
                <CloudUploadIcon className="w-4 h-4 text-vault-accent" />
                <span>Cloud Node Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:block w-24 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <div className="w-[73%] h-full bg-gradient-to-r from-vault-accent to-vault-success rounded-full" />
                </div>
                <span className="text-vault-success font-semibold text-[11px]">73.4 / 100 GB</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
