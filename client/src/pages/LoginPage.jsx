import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";

function LogoMark({ className = "w-5 h-5" }) {

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
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
      <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function VaultMechanism() {
  return (
    <div className="relative w-[260px] h-[260px] xl:w-[300px] xl:h-[300px]">
      {/* Outer ambient glow */}
      <div className="absolute inset-8 rounded-full bg-[#B8935A]/[0.035] blur-2xl" />

      {/* Outer rotating ring */}
      <div
        className="absolute inset-2 rounded-full border border-[#B8935A]/20"
        style={{ animation: "vaultRotate 35s linear infinite" }}
      >
        <span className="absolute left-1/2 -top-1.5 w-3 h-3 -translate-x-1/2 rounded-full bg-[#B8935A] shadow-[0_0_14px_rgba(184,147,90,0.7)]" />
        <span className="absolute left-1/2 -bottom-1.5 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-[#2A2E37]" />
        <span className="absolute top-1/2 -left-1.5 w-1.5 h-1.5 -translate-y-1/2 rounded-full bg-[#2A2E37]" />
        <span className="absolute top-1/2 -right-1.5 w-1.5 h-1.5 -translate-y-1/2 rounded-full bg-[#2A2E37]" />
      </div>

      {/* Second ring */}
      <div
        className="absolute inset-7 rounded-full border border-[#2A2E37]"
        style={{ animation: "vaultRotateReverse 24s linear infinite" }}
      >
        <div className="absolute inset-4 rounded-full border border-dashed border-[#B8935A]/15" />
      </div>

      {/* Outer tick marks */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="absolute left-1/2 top-1/2 block w-px h-3 bg-[#2A2E37]"
            style={{
              transform: `rotate(${index * 30}deg) translateY(-122px)`,
              transformOrigin: "0 122px",
            }}
          />
        ))}
      </div>

      {/* Inner vault plate */}
      <div className="absolute inset-[44px] rounded-full bg-[#181B21] border border-[#2A2E37] shadow-[inset_0_0_50px_rgba(0,0,0,0.5),0_20px_50px_rgba(0,0,0,0.35)]">
        <div
          className="absolute inset-5 rounded-full border border-[#B8935A]/20"
          style={{ animation: "vaultRotateReverse 18s linear infinite" }}
        >
          <span className="absolute left-1/2 -top-1 w-2 h-2 -translate-x-1/2 rounded-full bg-[#B8935A]/70" />
          <span className="absolute left-1/2 -bottom-1 w-2 h-2 -translate-x-1/2 rounded-full bg-[#B8935A]/20" />
          <span className="absolute top-1/2 -left-1 w-2 h-2 -translate-y-1/2 rounded-full bg-[#B8935A]/20" />
          <span className="absolute top-1/2 -right-1 w-2 h-2 -translate-y-1/2 rounded-full bg-[#B8935A]/20" />
        </div>

        {/* Central lock */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-20 h-20 xl:w-22 xl:h-22 rounded-2xl bg-[#14161A] border border-[#B8935A]/40 shadow-[0_0_35px_rgba(184,147,90,0.08)] flex items-center justify-center">
            <div className="absolute top-[16px] w-6.5 h-5.5 rounded-t-full border-[3px] border-b-0 border-[#B8935A] opacity-90" />
            <div className="relative mt-3.5 w-10 h-8 rounded-lg bg-[#1C1F26] border border-[#B8935A]/60 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#B8935A] shadow-[0_0_12px_rgba(184,147,90,0.7)]" />
            </div>
          </div>
        </div>
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email/username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setLoading(true);
      await googleLogin(credentialResponse.credential);
      addToast("Signed in with Google successfully!", "success");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Google authentication failed";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In was cancelled or failed.");
    addToast("Google Sign-In was cancelled or failed.", "error");
  };


  return (
    <div className="min-h-screen bg-[#0C0D10] text-[#E8E6E0] font-sans flex relative selection:bg-[#B8935A]/30">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-grid-pattern opacity-60" />

      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">
        {/* ── LEFT PANEL: Sticky Vault Mechanism Showcase ────────────────────── */}
        <div className="hidden lg:flex flex-col justify-between p-8 xl:p-12 border-r border-[#2A2E37] bg-[#14161A]/50 relative sticky top-0 h-screen overflow-hidden">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-[#181B21] border border-[#B8935A]/40 flex items-center justify-center shadow-lg group-hover:border-[#B8935A] transition-colors">
              <LogoMark className="w-4.5 h-4.5 xl:w-5 xl:h-5 text-[#B8935A]" />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tight text-[#E8E6E0]">VaultDrive</span>
          </Link>

          {/* Center Vault Lock Graphic */}
          <div className="flex flex-col items-center justify-center py-4 text-center my-auto">
            <VaultMechanism />

            <h2 className="text-xl xl:text-2xl font-bold tracking-tight text-[#E8E6E0] leading-snug mt-5 mb-1.5">
              Welcome back to VaultDrive.
            </h2>
            <p className="text-xs text-[#8B8F99] leading-relaxed max-w-xs">
              Sign in to access your private storage workspace and files.
            </p>
          </div>

          {/* Footer Ticker */}
          <div className="text-xs font-mono text-[#8B8F99] flex items-center justify-between">
            <span>VAULT STORAGE SYSTEM</span>
            <span className="flex items-center gap-1.5 text-[#6FA88A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6FA88A] animate-pulse" /> ONLINE
            </span>
          </div>
        </div>

        {/* ── RIGHT PANEL: Form Container ───────────────────────────────────── */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 min-h-screen lg:h-screen lg:overflow-y-auto relative">
          <div className="w-full max-w-md my-auto py-4">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-[#181B21] border border-[#B8935A]/40 flex items-center justify-center shadow-md">
                  <LogoMark className="w-4.5 h-4.5 text-[#B8935A]" />
                </div>
                <span className="font-bold text-lg tracking-tight text-[#E8E6E0]">VaultDrive</span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#E8E6E0] mb-2">
                Sign in to Vault
              </h1>
              <p className="text-sm text-[#8B8F99]">
                Enter your credentials to access your private storage.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-[#C0654F]/10 border border-[#C0654F]/30 text-[#C0654F] text-xs font-mono">
                [ERROR] {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Identifier Input */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#E8E6E0]">
                  Email address or Username
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-[#8B8F99] pointer-events-none">
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
                    placeholder="you@example.com or username"
                    required
                    autoComplete="username"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#14161A] border border-[#2A2E37] text-[#E8E6E0] text-sm placeholder:text-[#8B8F99]/40 focus:border-[#B8935A] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#E8E6E0]">
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-[#8B8F99] pointer-events-none">
                    <LockClosedIcon className="w-4 h-4" />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#14161A] border border-[#2A2E37] text-[#E8E6E0] text-sm placeholder:text-[#8B8F99]/40 focus:border-[#B8935A] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-[#8B8F99] hover:text-[#E8E6E0] transition-colors cursor-pointer"
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
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-[#0C0D10] bg-gradient-to-r from-[#B8935A] to-[#C8A66B] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg mt-2 cursor-pointer"
              >
                {loading ? "Signing In..." : "Sign In to Vault"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#2A2E37]" />
              <span className="text-xs text-[#8B8F99] font-mono">or continue with</span>
              <div className="flex-1 h-px bg-[#2A2E37]" />
            </div>

            {/* Google OAuth Login Button */}
            <div className="flex justify-center w-full mb-6 overflow-hidden rounded-xl">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                shape="pill"
                size="large"
                text="continue_with"
              />
            </div>


            {/* Footer Link */}
            <p className="text-center text-sm text-[#8B8F99]">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#B8935A] font-medium hover:underline">
                Create one for free
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

