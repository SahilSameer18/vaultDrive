function ShieldIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 8.07 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
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

export default function CoreBenefits() {
  return (
    <section className="border-t border-[#2A2E37]/80 bg-[#0E0F13] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#2A2E37] bg-[#14161A] text-[10px] font-mono text-[#8B8F99] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8935A]" />
            <span>CORE ADVANTAGES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#E8E6E0]">
            Everything you need to store <br />
            and share with confidence.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#8B8F99] leading-relaxed">
            Simple tools designed for privacy, organization, and effortless access anywhere.
          </p>
        </div>

        {/* 3 Core Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Benefit 1 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#14161A] border border-[#2A2E37] hover:border-[#B8935A]/50 transition-all duration-300 shadow-lg text-left group">
            <div className="w-11 h-11 rounded-xl bg-[#181B21] border border-[#2A2E37] flex items-center justify-center text-emerald-400 mb-5 group-hover:border-emerald-400/40 transition-colors">
              <ShieldIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#E8E6E0]">Private & Protected</h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#8B8F99]">
              Your files belong strictly to you. No ad tracking, no public indexing, and isolated private storage for every account.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#14161A] border border-[#2A2E37] hover:border-[#B8935A]/50 transition-all duration-300 shadow-lg text-left group">
            <div className="w-11 h-11 rounded-xl bg-[#181B21] border border-[#2A2E37] flex items-center justify-center text-[#B8935A] mb-5 group-hover:border-[#B8935A]/40 transition-colors">
              <FolderIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#E8E6E0]">Folders Inside Folders</h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#8B8F99]">
              Create nested directories to organize work projects, family vacations, and tax records so you can find any file in seconds.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#14161A] border border-[#2A2E37] hover:border-[#B8935A]/50 transition-all duration-300 shadow-lg text-left group">
            <div className="w-11 h-11 rounded-xl bg-[#181B21] border border-[#2A2E37] flex items-center justify-center text-[#38BDF8] mb-5 group-hover:border-[#38BDF8]/40 transition-colors">
              <ShareIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#E8E6E0]">Easy, Safe Sharing</h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#8B8F99]">
              Share direct download links with friends or colleagues. Add a private passcode whenever you want extra protection.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
