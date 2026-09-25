import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";

function LogoMark({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function EyeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeOffIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
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

function VaultMechanism() {
  return (
    <div className="relative w-64 h-64 xl:w-72 xl:h-72 flex items-center justify-center select-none overflow-hidden rounded-full">
      {/* Ambient photon glow */}
      <div className="absolute inset-8 rounded-full bg-vault-accent/[0.08] blur-2xl pointer-events-none" />

      {/* Vector Precision Dial (Strictly Contained within ViewBox) */}
      <svg className="w-full h-full" viewBox="0 0 280 280" fill="none">
        {/* Outer boundary */}
        <circle cx="140" cy="140" r="136" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* 12 Chronograph ticks mathematically bound to r=124 to r=132 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 140 + 124 * Math.cos(angle);
          const y1 = 140 + 124 * Math.sin(angle);
          const x2 = 140 + 132 * Math.cos(angle);
          const y2 = 140 + 132 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 3 === 0 ? "rgba(197,160,89,0.5)" : "rgba(255,255,255,0.18)"}
              strokeWidth={i % 3 === 0 ? "1.5" : "1"}
            />
          );
        })}

        {/* Rotating outer gear ring */}
        <g style={{ animation: "vaultRotate 40s linear infinite", transformOrigin: "140px 140px" }}>
          <circle cx="140" cy="140" r="115" stroke="rgba(197, 160, 89, 0.25)" strokeWidth="1.5" strokeDasharray="6 8" />
          <circle cx="140" cy="25" r="4.5" fill="#C5A059" filter="drop-shadow(0 0 8px rgba(197,160,89,0.8))" />
          <circle cx="140" cy="255" r="2.5" fill="rgba(255,255,255,0.25)" />
          <circle cx="25" cy="140" r="2.5" fill="rgba(255,255,255,0.25)" />
          <circle cx="255" cy="140" r="2.5" fill="rgba(255,255,255,0.25)" />
        </g>

        {/* Reverse rotating dashed ring */}
        <g style={{ animation: "vaultRotateReverse 28s linear infinite", transformOrigin: "140px 140px" }}>
          <circle cx="140" cy="140" r="92" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="140" cy="48" r="3" fill="rgba(197,160,89,0.5)" />
        </g>

        {/* Inner Solid Bevel Ring */}
        <circle cx="140" cy="140" r="76" fill="#14171E" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        <circle cx="140" cy="140" r="64" stroke="rgba(197, 160, 89, 0.2)" strokeWidth="1" strokeDasharray="3 5" style={{ animation: "vaultRotate 20s linear infinite", transformOrigin: "140px 140px" }} />
      </svg>

      {/* Central Solid Milled Titanium Core */}
      <div className="absolute w-15 h-15 xl:w-16 xl:h-16 rounded-xl bg-vault-panel border border-vault-accent/40 shadow-[0_0_20px_rgba(197,160,89,0.18)] flex items-center justify-center">
        <LockClosedIcon className="w-6 h-6 text-vault-accent" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);
    try {
      await login(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email/username or password.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setGoogleLoading(true);
      await googleLogin(credentialResponse.credential);
      addToast("Signed in with Google successfully!", "success");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Google authentication failed";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In was cancelled or failed.");
    addToast("Google Sign-In was cancelled or failed.", "error");
  };

  return (
    <div className="min-h-screen bg-vault-landing-bg text-vault-text font-sans flex relative selection:bg-vault-accent/30 selection:text-vault-text overflow-x-hidden">
      {/* ── Atmospheric Canopy ─────────────────────────────────────────── */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-vault-accent/[0.06] to-transparent rounded-full blur-[120px] pointer-events-none z-0" 
        aria-hidden="true" 
      />
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" 
        aria-hidden="true" 
      />

      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">

        {/* ── LEFT PANEL: Swiss Vault Dial Showcase (Desktop Only) ─────── */}
        <div className="hidden lg:flex flex-col justify-between p-8 xl:p-12 border-r border-white/[0.06] bg-vault-bg/60 relative sticky top-0 h-screen overflow-hidden">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 w-fit group focus-visible:outline-none">
            <div className="w-9 h-9 rounded-xl bg-vault-surface border border-vault-accent/35 flex items-center justify-center shadow-lg group-hover:border-vault-accent transition-colors">
              <LogoMark className="w-4.5 h-4.5 text-vault-accent" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">VaultDrive</span>
          </Link>

          {/* Central Mechanism Showcase */}
          <div className="flex flex-col items-center justify-center py-4 text-center my-auto">
            <VaultMechanism />

            <h2 className="text-xl xl:text-2xl font-bold tracking-tight text-white leading-snug mt-6 mb-1.5">
              Welcome back to VaultDrive.
            </h2>
            <p className="text-xs text-vault-muted leading-relaxed max-w-xs font-normal">
              Sign in to access your private cloud storage workspace.
            </p>
          </div>

          {/* Status Footer */}
          <div className="text-xs text-vault-muted text-center">
            Encrypted storage
          </div>
        </div>

        {/* ── RIGHT PANEL: Precision Authentication Vault Form ─────────── */}
        <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen lg:h-screen lg:overflow-y-auto relative">
          <div className="w-full max-w-[410px] my-auto py-2">

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-6">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-xl bg-vault-surface border border-vault-accent/40 flex items-center justify-center shadow-md">
                  <LogoMark className="w-4 h-4 text-vault-accent" />
                </div>
                <span className="font-bold text-base tracking-tight text-white">VaultDrive</span>
              </Link>
            </div>

            {/* Card Frame */}
            <div className="depth-vault-chassis rounded-2xl p-5 sm:p-7 border border-white/[0.08] shadow-2xl">
              {/* Heading */}
              <div className="mb-5 text-left">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Access Vault
                </h1>
                <p className="mt-1 text-xs text-vault-muted leading-relaxed font-normal">
                  Enter your credentials to unlock your workspace.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                {/* Identifier Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-vault-text">
                    Email Address or Username
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-vault-muted pointer-events-none">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <input
                      id="login-identifier"
                      type="text"
                      name="identifier"
                      value={form.identifier}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      autoComplete="username"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-vault-surface/80 border border-white/[0.08] text-white text-xs sm:text-sm placeholder:text-vault-muted/40 focus:border-vault-accent focus:ring-1 focus:ring-vault-accent/40 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-vault-text">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-vault-muted pointer-events-none">
                      <LockClosedIcon className="w-4 h-4" />
                    </span>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your master password"
                      required
                      autoComplete="current-password"
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-vault-surface/80 border border-white/[0.08] text-white text-xs sm:text-sm placeholder:text-vault-muted/40 focus:border-vault-accent focus:ring-1 focus:ring-vault-accent/40 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-vault-muted hover:text-vault-text transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="login-submit"
                  type="submit"
                  disabled={formLoading}
                  className="tactile-btn w-full mt-1.5 py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-vault-landing-bg bg-vault-accent hover:bg-vault-accent-hover shadow-[0_2px_14px_rgba(197,160,89,0.25)] hover:shadow-[0_4px_22px_rgba(197,160,89,0.35)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {formLoading ? "Signing In..." : "Sign In to Vault"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-xs text-vault-muted">Or</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              {/* Google OAuth Login */}
              <div className="flex justify-center w-full overflow-hidden rounded-xl">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text="continue_with"
                />
              </div>

              {googleLoading && (
                <div className="flex items-center justify-center gap-2 mt-2 text-xs text-vault-muted">
                  <svg className="w-3.5 h-3.5 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>Verifying OAuth token...</span>
                </div>
              )}

              {/* Footer Switch */}
              <p className="text-center text-xs text-vault-muted mt-4">
                Don't have a vault yet?{" "}
                <Link to="/register" className="text-vault-accent font-medium hover:underline">
                  Create one free
                </Link>
              </p>
            </div>

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
