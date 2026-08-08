import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function VaultMechanism() {
  return (
    <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]">
      {/* Outer ambient glow */}
      <div className="absolute inset-8 rounded-full bg-vault-accent/[0.035] blur-3xl" />

      {/* Outer rotating ring */}
      <div
        className="absolute inset-2 rounded-full border border-vault-accent/20"
        style={{ animation: "vaultRotate 35s linear infinite" }}
      >
        <span className="absolute left-1/2 -top-1.5 w-3 h-3 -translate-x-1/2 rounded-full bg-vault-accent shadow-[0_0_14px_rgba(184,147,90,0.7)]" />
        <span className="absolute left-1/2 -bottom-1.5 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-vault-border" />
        <span className="absolute top-1/2 -left-1.5 w-1.5 h-1.5 -translate-y-1/2 rounded-full bg-vault-border" />
        <span className="absolute top-1/2 -right-1.5 w-1.5 h-1.5 -translate-y-1/2 rounded-full bg-vault-border" />
      </div>

      {/* Second ring */}
      <div
        className="absolute inset-7 rounded-full border border-vault-border"
        style={{ animation: "vaultRotateReverse 24s linear infinite" }}
      >
        <div className="absolute inset-4 rounded-full border border-dashed border-vault-accent/15" />
      </div>

      {/* Outer tick marks */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="absolute left-1/2 top-1/2 block w-px h-3 bg-vault-border"
            style={{
              transform: `rotate(${index * 30}deg) translateY(-132px)`,
              transformOrigin: "0 132px",
            }}
          />
        ))}
      </div>

      {/* Inner vault plate */}
      <div className="absolute inset-[48px] rounded-full bg-vault-surface border border-vault-border shadow-[inset_0_0_50px_rgba(0,0,0,0.5),0_20px_50px_rgba(0,0,0,0.35)]">
        <div
          className="absolute inset-5 rounded-full border border-vault-accent/20"
          style={{ animation: "vaultRotateReverse 18s linear infinite" }}
        >
          <span className="absolute left-1/2 -top-1 w-2 h-2 -translate-x-1/2 rounded-full bg-vault-accent/70" />
          <span className="absolute left-1/2 -bottom-1 w-2 h-2 -translate-x-1/2 rounded-full bg-vault-accent/20" />
          <span className="absolute top-1/2 -left-1 w-2 h-2 -translate-y-1/2 rounded-full bg-vault-accent/20" />
          <span className="absolute top-1/2 -right-1 w-2 h-2 -translate-y-1/2 rounded-full bg-vault-accent/20" />
        </div>

        {/* Central lock */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-22 h-22 rounded-2xl bg-vault-bg border border-vault-accent/40 shadow-[0_0_35px_rgba(184,147,90,0.08)] flex items-center justify-center">
            <div className="absolute top-[18px] w-7 h-6 rounded-t-full border-[3px] border-b-0 border-vault-accent opacity-90" />
            <div className="relative mt-4 w-11 h-9 rounded-lg bg-vault-panel border border-vault-accent/60 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-vault-accent shadow-[0_0_12px_rgba(184,147,90,0.7)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate      = useNavigate();

  const [form, setForm]       = useState({ username: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msgs = err.response?.data?.errors;
      setError(
        Array.isArray(msgs) && msgs.length > 0
          ? msgs[0].message
          : err.response?.data?.message || "Registration failed. Please check input fields."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vault-bg text-vault-text font-sans flex relative selection:bg-vault-accent/30">
      
      {/* Subtle Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10 z-0"
        style={{
          backgroundImage: `linear-gradient(#2A2E37 1px, transparent 1px), linear-gradient(90deg, #2A2E37 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">
        
        {/* ── LEFT PANEL: Vault Mechanism Showcase ─────────────────────────── */}
        <div className="hidden lg:flex flex-col justify-between p-10 xl:p-14 border-r border-vault-border bg-gradient-to-br from-vault-panel/60 via-vault-bg/70 to-vault-bg backdrop-blur-xl relative">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <div className="w-10 h-10 rounded-xl bg-vault-surface border border-vault-accent/40 flex items-center justify-center shadow-lg group-hover:border-vault-accent transition-colors">
              <svg className="w-5 h-5 text-vault-accent" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-vault-text">VaultDrive</span>
          </Link>

          {/* Center Vault Lock Graphic */}
          <div className="flex flex-col items-center justify-center py-6 text-center my-auto">
            <VaultMechanism />

            <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-vault-text leading-snug mt-6 mb-2">
              Create your personal vault.
            </h2>
            <p className="text-xs text-vault-muted leading-relaxed max-w-xs">
              Provision an isolated, encrypted workspace for your files and folder trees.
            </p>
          </div>

          {/* Footer */}
          <div className="text-xs font-mono text-vault-muted/60 flex items-center justify-between">
            <span>PROVISIONING SYSTEM</span>
            <span className="flex items-center gap-1.5 text-vault-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-vault-accent animate-pulse" /> READY
            </span>
          </div>

        </div>

        {/* ── RIGHT PANEL: Direct Form (No Inner Card - PrepStack Style) ───── */}
        <div className="flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 min-h-screen relative">
          
          {/* Form Container (No card border/background) */}
          <div className="w-full max-w-md my-auto fade-in">
            
            {/* Mobile Brand Header (Visible only on mobile/tablet screens) */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-vault-surface border border-vault-accent/40 flex items-center justify-center shadow-md">
                  <svg className="w-4.5 h-4.5 text-vault-accent" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                    <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
                  </svg>
                </div>
                <span className="font-bold text-lg tracking-tight text-vault-text">VaultDrive</span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-vault-text mb-2">
                Create account
              </h1>
              <p className="text-sm text-vault-muted">
                Set up your personal cloud storage workspace.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-vault-danger/10 border border-vault-danger/30 text-vault-danger text-xs font-mono">
                [ERROR] {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-vault-text">
                  Username
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-vault-muted pointer-events-none">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </span>
                  <input
                    id="register-username"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    required
                    autoComplete="username"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-vault-surface border border-vault-border text-vault-text text-sm placeholder:text-vault-muted/40 focus:border-vault-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-vault-text">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-vault-muted pointer-events-none">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-vault-surface border border-vault-border text-vault-text text-sm placeholder:text-vault-muted/40 focus:border-vault-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-vault-text">
                  Master Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-vault-muted pointer-events-none">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    id="register-password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    required
                    autoComplete="new-password"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-vault-surface border border-vault-border text-vault-text text-sm placeholder:text-vault-muted/40 focus:border-vault-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="register-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-[#14161A] bg-gradient-to-r from-vault-accent to-vault-accent-hover hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg mt-2"
              >
                {loading ? "Provisioning Vault..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-8">
              <div className="flex-1 h-px bg-vault-border" />
              <span className="text-xs text-vault-muted font-mono">or</span>
              <div className="flex-1 h-px bg-vault-border" />
            </div>

            {/* Footer Link */}
            <p className="text-center text-sm text-vault-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-vault-accent font-medium hover:underline">
                Sign in
              </Link>
            </p>

          </div>

        </div>

      </div>

      <style>{`
        @keyframes vaultRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes vaultRotateReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>

    </div>
  );
}
