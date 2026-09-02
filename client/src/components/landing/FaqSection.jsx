import { useState } from "react";

function ChevronDownIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const faqs = [
  {
    id: "01",
    q: "Is VaultDrive free to use?",
    a: "Yes! Every new account starts with free storage immediately. You can organize folders, upload multi-gigabyte files, and share links without entering any credit card or payment information."
  },
  {
    id: "02",
    q: "How does passcode-protected sharing work?",
    a: "When generating a share link, you can enable 'Passcode Protection' and assign a secret password. Anyone opening your link in their browser will simply enter the passcode before downloading or viewing the file."
  },
  {
    id: "03",
    q: "What happens if I delete a file by mistake?",
    a: "Deleted files move safely into your personal Trash folder. You can preview them, restore them back to their original folder with one click, or permanently purge them whenever you choose."
  },
  {
    id: "04",
    q: "Can I organize files in multiple levels of folders?",
    a: "Absolutely. VaultDrive supports infinite nested folder trees (e.g. Work > 2026 > Contracts > Taxes) with full breadcrumb navigation and instant search."
  },
  {
    id: "05",
    q: "Do recipients need an account to download shared files?",
    a: "No. When you share a public or password-protected link, recipients can download the file directly in their browser without creating an account or logging in."
  }
];

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="border-t border-vault-border/80 bg-vault-section-alt relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          {/* Left Column (5 Cols): Title & Context (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vault-border bg-vault-bg text-[10px] font-mono text-vault-muted mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-vault-accent" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-vault-text leading-tight">
              Your questions, <br className="hidden sm:inline" />
              our answers.
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-vault-muted leading-relaxed max-w-md">
              Everything you need to know about getting started, organizing files, and keeping your data safe in VaultDrive.
            </p>
          </div>

          {/* Right Column (7 Cols): Premium Accordion List */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-vault-bg border-vault-accent/50 shadow-[0_4px_30px_rgba(184,147,90,0.08)]"
                      : "bg-vault-faq-card border-vault-border/70 hover:border-vault-accent/30 hover:bg-vault-bg/80"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span className={`font-mono text-xs font-bold transition-colors shrink-0 ${isOpen ? "text-vault-accent" : "text-vault-muted/50"}`}>
                        {faq.id}
                      </span>
                      <span className={`text-xs sm:text-sm font-semibold transition-colors ${isOpen ? "text-vault-text" : "text-vault-muted-light hover:text-vault-text"}`}>
                        {faq.q}
                      </span>
                    </div>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-vault-accent/15 border-vault-accent/50 text-vault-accent rotate-180 shadow-[0_0_12px_rgba(184,147,90,0.2)]"
                        : "bg-vault-surface border-vault-border text-vault-muted"
                    }`}>
                      <ChevronDownIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 text-xs sm:text-sm text-vault-muted leading-relaxed border-t border-vault-border/40 pl-9 sm:pl-12">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
