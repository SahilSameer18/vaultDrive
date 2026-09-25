import { useState } from "react";

function ChevronDownIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const faqs = [
  {
    id: "01",
    q: "Is VaultDrive completely free to get started?",
    a: "Yes. Every new account receives free high-speed cloud storage immediately. You can organize nested directories, upload large payloads, and distribute passcode-protected links without providing a payment card."
  },
  {
    id: "02",
    q: "How does passcode-gated link authorization work?",
    a: "When generating a share URL, you can enable Passcode Gate and assign a secret passphrase. The recipient's browser presents a cryptographic challenge; upon entering the correct passcode, the file decrypts and streams directly."
  },
  {
    id: "03",
    q: "How does safe trash recovery protect accidental deletions?",
    a: "Deletions move into an isolated Trash container. Unlike generic storage providers that dump restored items into a flat root folder, VaultDrive reconstructs the exact nested folder hierarchy with permissions fully preserved."
  },
  {
    id: "04",
    q: "Are recursive, deeply nested folder structures supported?",
    a: "Yes. VaultDrive supports infinite hierarchical nesting (e.g., Vault > Enterprise > Fiscal_2026 > Tax_Returns) with zero depth limit and instant breadcrumb navigation."
  },
  {
    id: "05",
    q: "Do link recipients need to create an account to download?",
    a: "No. Authorized links permit direct browser-to-cloud downloads without signups, tracking cookies, or promotional interstitials."
  }
];

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState(0); // First FAQ open by default for immediate engagement

  return (
    <section className="relative border-t border-white/[0.06] bg-vault-section-alt z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-24 lg:py-28 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* Left Column (5 Cols): Editorial Title (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 text-left">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-white">
              Questions. <br />
              <span className="text-gold-gradient">Directly answered.</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-vault-muted leading-relaxed max-w-[44ch]">
              Technical transparency regarding encryption guarantees, access control, and account governance.
            </p>
          </div>

          {/* Right Column (7 Cols): Depth-Engineered Accordion List */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "depth-vault-chassis border-vault-accent/40 shadow-[0_4px_32px_rgba(197,160,89,0.12)]"
                      : "bg-vault-surface/40 border-white/[0.06] hover:border-white/[0.14] hover:bg-vault-surface/70"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="tactile-btn w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3.5 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span className={`font-mono text-xs font-semibold tracking-wider transition-colors shrink-0 ${isOpen ? "text-vault-accent" : "text-vault-muted/40"}`}>
                        {faq.id}
                      </span>
                      <span className={`text-xs sm:text-base font-semibold tracking-tight transition-colors ${isOpen ? "text-white" : "text-vault-text hover:text-white"}`}>
                        {faq.q}
                      </span>
                    </div>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-vault-accent/20 border-vault-accent/50 text-vault-accent rotate-180 shadow-[0_0_12px_rgba(197,160,89,0.25)]"
                        : "bg-white/[0.03] border-white/[0.08] text-vault-muted"
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
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 text-xs sm:text-sm text-vault-muted leading-relaxed border-t border-white/[0.05] pl-4 sm:pl-12">
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
