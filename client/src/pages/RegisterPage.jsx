import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msgs = err.response?.data?.errors;
      setError(
        Array.isArray(msgs) && msgs.length > 0
          ? msgs[0].message
          : err.response?.data?.message || "Registration failed. Please verify input fields."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#14161A] text-[#E8E6E0] font-sans flex relative selection:bg-[#B8935A]/30">
      
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: `linear-gradient(#2A2E37 1px, transparent 1px), linear-gradient(90deg, #2A2E37 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">
        
        {/* ── LEFT PANEL: Minimal & Clean Showcase ─────────────────────────── */}
        <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 border-r border-[#2A2E37] bg-gradient-to-b from-[#1C1F26]/70 to-[#14161A] backdrop-blur-xl relative">
          
          {/* Top Brand Logo */}
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <div className="w-10 h-10 rounded-xl bg-[#181B21] border border-[#B8935A]/40 flex items-center justify-center shadow-lg group-hover:border-[#B8935A] transition-colors">
              <svg className="w-5 h-5 text-[#B8935A]" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-[#E8E6E0]">VaultDrive</span>
          </Link>

          {/* Center Minimal Feature Callout */}
          <div className="my-auto py-12 max-w-md">
            <span className="inline-block px-3 py-1 rounded-md bg-[#B8935A]/10 border border-[#B8935A]/30 text-[#B8935A] text-xs font-mono mb-6">
              PROVISIONING SYSTEM
            </span>

            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-[#E8E6E0] leading-snug mb-6">
              Initialize your personal zero-knowledge storage repository.
            </h2>

            {/* Clean Minimal List */}
            <div className="space-y-5 text-sm text-[#8B8F99]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#6FA88A] shrink-0" />
                <span>Isolated User Namespace (`vaultDrive/&lt;userId&gt;/`)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#B8935A] shrink-0" />
                <span>64-Character Hex Public Share Link Generator</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#38BDF8] shrink-0" />
                <span>Instant Mobile SVG QR Code Sharing</span>
              </div>
            </div>
          </div>

          {/* Bottom Badge */}
          <div className="text-xs font-mono text-[#8B8F99]">
            VaultDrive Security Engine © 2027
          </div>

        </div>

        {/* ── RIGHT PANEL: Spacious & Prominent Auth Form ───────────────────── */}
        <div className="flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 min-h-screen">
          
          <div className="w-full max-w-md fade-in my-auto">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-[#E8E6E0] mb-2">Create Your Vault</h1>
              <p className="text-sm text-[#8B8F99]">Register to start securing your digital assets</p>
            </div>

            {/* Form Container */}
            <div className="p-8 sm:p-10 rounded-2xl bg-[#1C1F26] border border-[#2A2E37] shadow-2xl shadow-black/80">
              
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-[#C0654F]/10 border border-[#C0654F]/30 text-[#C0654F] text-xs font-mono">
                  [ERROR] {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[#E8E6E0] mb-2">
                    Username
                  </label>
                  <input
                    id="register-username"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="vaultmaster"
                    required
                    autoComplete="username"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#181B21] border border-[#2A2E37] text-[#E8E6E0] text-sm placeholder-[#8B8F99]/40 focus:border-[#B8935A] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#E8E6E0] mb-2">
                    Email Address
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#181B21] border border-[#2A2E37] text-[#E8E6E0] text-sm placeholder-[#8B8F99]/40 focus:border-[#B8935A] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#E8E6E0] mb-2">
                    Master Password
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#181B21] border border-[#2A2E37] text-[#E8E6E0] text-sm placeholder-[#8B8F99]/40 focus:border-[#B8935A] focus:outline-none transition-colors"
                  />
                </div>

                <button
                  id="register-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 mt-2 rounded-xl text-sm font-semibold text-[#14161A] bg-gradient-to-r from-[#B8935A] to-[#C8A66B] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {loading ? "Provisioning Vault..." : "Create Vault"}
                </button>
              </form>
            </div>

            {/* Footer Link */}
            <p className="text-center text-sm text-[#8B8F99] mt-8">
              Already have a vault?{" "}
              <Link to="/login" className="text-[#B8935A] font-medium hover:underline">
                Sign in
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
