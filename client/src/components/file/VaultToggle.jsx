/**
 * Physical Metallic Vault Latch Toggle Switch
 * Renders PRIVATE (titanium/champagne locked) or PUBLIC (emerald unlocked) security status
 */
export default function VaultToggle({ isPublic, onToggle, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      title={isPublic ? "Public link active — click to lock private" : "Private — click to enable public share link"}
      className={`group relative inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border text-[9px] sm:text-[10px] font-mono tracking-widest uppercase transition-all duration-200 select-none ${
        isPublic
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_12px_rgba(52,211,153,0.12)]"
          : "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text-muted)] hover:border-[var(--theme-accent)]/40 hover:text-[var(--theme-text)]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"}`}
    >
      {/* Indicator Diode */}
      <span
        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
          isPublic
            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"
            : "bg-[var(--theme-text-muted)]/50 group-hover:bg-[var(--theme-accent)]"
        }`}
      />

      {/* Status Text */}
      <span className="font-semibold">{isPublic ? "PUBLIC" : "PRIVATE"}</span>

      {/* Physical Latch Lock Icon */}
      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-current transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none">
        {isPublic ? (
          <path d="M7 11V7a5 5 0 0 1 9.9-1M3 11h18v10H3V11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M7 11V7a5 5 0 0 1 10 0v4M3 11h18v10H3V11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
