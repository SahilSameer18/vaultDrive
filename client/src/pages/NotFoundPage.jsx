import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--color-bg)" }}
    >
      <div
        className="w-16 h-16 flex items-center justify-center rounded-2xl mb-6"
        style={{ background: "var(--color-panel)", border: "1px solid var(--color-border)" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="var(--color-accent)" strokeWidth="1.5"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="12" y1="15" x2="12" y2="18" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      <p
        className="text-xs font-medium mb-2 tracking-widest"
        style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}
      >
        404 — ACCESS DENIED
      </p>
      <h1 className="text-xl font-semibold mb-3" style={{ color: "var(--color-text)" }}>
        This vault does not exist
      </h1>
      <p className="text-xs max-w-xs mb-8" style={{ color: "var(--color-muted)" }}>
        The file or page you requested could not be found. It may have been moved or never existed.
      </p>

      <Link
        id="not-found-home"
        to="/"
        className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
        style={{ background: "var(--color-accent)", color: "#14161A" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-accent)")}
      >
        Return to safety
      </Link>
    </div>
  );
}
