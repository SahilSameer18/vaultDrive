/**
 * Physical Metallic Vault Latch Toggle Switch
 * Renders PRIVATE (amber/red) or PUBLIC (emerald/green) security latch status
 */
export default function VaultToggle({ isPublic, onToggle, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      title={isPublic ? "Public link active — click to lock private" : "Private — click to enable public share link"}
      className={`group relative inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[10px] font-mono tracking-wider transition-all select-none ${
        isPublic
          ? "border-vault-success/40 bg-vault-success/10 text-vault-success hover:bg-vault-success/20"
          : "border-vault-border bg-vault-surface/60 text-vault-muted hover:border-vault-accent/50 hover:text-vault-text"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {/* Indicator Dot */}
      <span
        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
          isPublic
            ? "bg-vault-success shadow-[0_0_8px_rgba(111,168,138,0.8)]"
            : "bg-vault-muted"
        }`}
      />

      {/* Latch Status Text */}
      <span>{isPublic ? "PUBLIC" : "PRIVATE"}</span>

      {/* Small Latch Lock Icon */}
      <svg className="w-3 h-3 text-current" viewBox="0 0 24 24" fill="none">
        {isPublic ? (
          <path d="M7 11V7a5 5 0 0 1 9.9-1M3 11h18v10H3V11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M7 11V7a5 5 0 0 1 10 0v4M3 11h18v10H3V11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
