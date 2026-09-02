import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
      <div className="absolute inset-8 rounded-full bg-vault-accent/[0.035] blur-2xl" />

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
              transform: `rotate(${index * 30}deg) translateY(-122px)`,
              transformOrigin: "0 122px",
            }}
          />
        ))}
      </div>

      {/* Inner vault plate */}
      <div className="absolute inset-[44px] rounded-full bg-vault-surface border border-vault-border shadow-[inset_0_0_50px_rgba(0,0,0,0.5),0_20px_50px_rgba(0,0,0,0.35)]">
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
          <div className="relative w-20 h-20 xl:w-22 xl:h-22 rounded-2xl bg-vault-bg border border-vault-accent/40 shadow-[0_0_35px_rgba(184,147,90,0.08)] flex items-center justify-center">
            <div className="absolute top-[16px] w-6.5 h-5.5 rounded-t-full border-[3px] border-b-0 border-vault-accent opacity-90" />
            <div className="relative mt-3.5 w-10 h-8 rounded-lg bg-vault-panel border border-vault-accent/60 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-vault-accent shadow-[0_0_12px_rgba(184,147,90,0.7)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const { register, googleLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Pre-fill email if passed in URL query param (?email=...)
  useEffect(() => {
    const urlEmail = searchParams.get("email");
    if (urlEmail) {
      setForm((prev) => ({ ...prev, email: urlEmail }));
    }
  }, [searchParams]);

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

    setFormLoading(true);
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
      setFormLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setGoogleLoading(true);
      await googleLogin(credentialResponse.credential);
      addToast("Signed up with Google successfully!", "success");
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
    <div className="min-h-screen bg-vault-landing-bg text-vault-text font-sans flex relative selection:bg-vault-accent/30">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-grid-pattern opacity-60" />

      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">
        {/* ── LEFT PANEL: Sticky Vault Mechanism Showcase ────────────────────── */}
        <div className="hidden lg:flex flex-col justify-between p-8 xl:p-12 border-r border-vault-border bg-vault-bg/50 relative sticky top-0 h-screen overflow-hidden">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-vault-surface border border-vault-accent/40 flex items-center justify-center shadow-lg group-hover:border-vault-accent transition-colors">
              <LogoMark className="w-4.5 h-4.5 xl:w-5 xl:h-5 text-vault-accent" />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tight text-vault-text">VaultDrive</span>
          </Link>

          {/* Center Vault Lock Graphic */}
          <div className="flex flex-col items-center justify-center py-4 text-center my-auto">
            <VaultMechanism />

            <h2 className="text-xl xl:text-2xl font-bold tracking-tight text-vault-text leading-snug mt-5 mb-1.5">
              Create your personal vault.
            </h2>
            <p className="text-xs text-vault-muted leading-relaxed max-w-xs">
              Set up your private cloud storage workspace for your files and folder trees.
            </p>
          </div>

          {/* Footer Ticker */}
          <div className="text-xs font-mono text-vault-muted flex items-center justify-between">
            <span>VAULT STORAGE SYSTEM</span>
            <span className="flex items-center gap-1.5 text-vault-success">
              <span className="w-1.5 h-1.5 rounded-full bg-vault-success animate-pulse" /> ONLINE
            </span>
          </div>
        </div>

        {/* ── RIGHT PANEL: Form Container ───────────────────────────────────── */}
        <div className="flex flex-col items-center justify-start p-6 sm:p-10 lg:p-12 min-h-screen lg:h-screen lg:overflow-y-auto relative">
          <div className="w-full max-w-md my-auto py-4">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-vault-surface border border-vault-accent/40 flex items-center justify-center shadow-md">
                  <LogoMark className="w-4.5 h-4.5 text-vault-accent" />
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
                Set up your private cloud storage workspace.
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
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
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
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-vault-bg border border-vault-border text-vault-text text-sm placeholder:text-vault-muted/40 focus:border-vault-accent focus:outline-none transition-colors"
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
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-vault-bg border border-vault-border text-vault-text text-sm placeholder:text-vault-muted/40 focus:border-vault-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-vault-text">
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-vault-muted pointer-events-none">
                    <LockClosedIcon className="w-4 h-4" />
                  </span>
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    required
                    autoComplete="new-password"
                    className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-vault-bg border border-vault-border text-vault-text text-sm placeholder:text-vault-muted/40 focus:border-vault-accent focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-vault-muted hover:text-vault-text transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="register-submit"
                type="submit"
                disabled={formLoading}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-vault-landing-bg bg-gradient-to-r from-vault-accent to-vault-accent-hover hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg mt-2 cursor-pointer"
              >
                {formLoading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Terms and Privacy Consent */}
              <p className="text-center text-[11px] text-vault-muted mt-2.5 leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-vault-accent hover:underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-vault-accent hover:underline font-medium">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-vault-border" />
              <span className="text-xs text-vault-muted font-mono">or continue with</span>
              <div className="flex-1 h-px bg-vault-border" />
            </div>

            {/* Google OAuth Login Button */}
            <div className="flex justify-center w-full mb-4 overflow-hidden rounded-xl">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                shape="pill"
                size="large"
                text="continue_with"
              />
            </div>

            {/* Status line shown while backend is processing after Google OAuth */}
            {googleLoading && (
              <div className="flex items-center justify-center gap-2 mb-3 text-xs font-mono text-vault-accent">
                <svg className="w-3.5 h-3.5 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Verifying with server… (may take a moment)
              </div>
            )}



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

