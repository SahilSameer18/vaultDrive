import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";
import { authApi } from "../api/auth.api";
import { filesApi } from "../api/files.api";
import { formatDate, formatBytes } from "../utils/formatters";

// ─── Deterministic avatar colour based on username ────────────────────────────
const AVATAR_COLOURS = [
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-violet-600",
];
function avatarGradient(username = "") {
  let hash = 0;
  for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLOURS[Math.abs(hash) % AVATAR_COLOURS.length];
}

// ─── Password strength helper ─────────────────────────────────────────────────
function passwordStrength(pw = "") {
  if (pw.length === 0) return null;
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pw);
  const score = [pw.length >= 8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (score <= 1) return { label: "Weak", colour: "bg-vault-danger", width: "w-1/4" };
  if (score === 2) return { label: "Fair", colour: "bg-amber-400", width: "w-2/4" };
  if (score === 3) return { label: "Good", colour: "bg-yellow-300", width: "w-3/4" };
  return { label: "Strong", colour: "bg-vault-success", width: "w-full" };
}

// ─── Reusable Card wrapper ────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return (
    <div className={`p-6 rounded-2xl border border-vault-border bg-vault-panel/70 space-y-5 ${className}`}>
      {children}
    </div>
  );
}

// ─── Card section heading ─────────────────────────────────────────────────────
function CardTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-2.5 pb-1 border-b border-vault-border/50">
      <span className="text-vault-accent">{icon}</span>
      <h3 className="text-sm font-bold text-vault-text">{children}</h3>
    </div>
  );
}

// ─── Eye toggle for password inputs ──────────────────────────────────────────
function EyeIcon({ visible }) {
  return visible ? (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ) : (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

// ─── Password input with eye toggle ──────────────────────────────────────────
function PasswordInput({ id, value, onChange, placeholder, disabled, autoComplete = "new-password" }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className="w-full bg-vault-surface border border-vault-border rounded-xl px-3.5 py-2.5 text-xs text-vault-text placeholder:text-vault-muted focus:outline-none focus:border-vault-accent/60 transition-colors pr-10 disabled:opacity-50"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-vault-muted hover:text-vault-text transition-colors cursor-pointer"
      >
        <EyeIcon visible={show} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // ── Edit Username state ───────────────────────────────────────────────────
  const [username, setUsername] = useState(user?.username || "");
  const [usernameError, setUsernameError] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);

  // ── Password state ────────────────────────────────────────────────────────
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  // ── Storage state ─────────────────────────────────────────────────────────
  const [storageStats, setStorageStats] = useState(null);
  const [storageLoading, setStorageLoading] = useState(true);

  // ── Logout ────────────────────────────────────────────────────────────────
  const [loggingOut, setLoggingOut] = useState(false);

  const QUOTA = 1 * 1024 * 1024 * 1024; // 1 GB

  useEffect(() => {
    filesApi.getStorageStats()
      .then((res) => setStorageStats(res.data.data))
      .catch(() => setStorageStats(null))
      .finally(() => setStorageLoading(false));
  }, []);

  // sync username field if context updates
  useEffect(() => {
    if (user?.username) setUsername(user.username);
  }, [user?.username]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const usernameChanged = username.trim() !== (user?.username || "");
  const usernameValid = /^[a-zA-Z0-9_]{3,30}$/.test(username.trim());
  const strength = passwordStrength(newPw);
  const gradient = avatarGradient(user?.username);
  const usedPct = storageStats
    ? Math.min(100, parseFloat(((storageStats.totalBytes / QUOTA) * 100).toFixed(1)))
    : 0;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSaveUsername = async () => {
    setUsernameError("");
    if (!usernameValid) {
      setUsernameError("3–30 chars, letters, numbers, and underscores only.");
      return;
    }
    setSavingUsername(true);
    try {
      const res = await authApi.updateProfile({ username: username.trim() });
      updateUser(res.data.data.user);
      addToast("Username updated successfully", "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update username";
      setUsernameError(msg);
    } finally {
      setSavingUsername(false);
    }
  };

  const handleSavePassword = async () => {
    setPwError("");
    if (newPw.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }
    if (user?.hasPassword && !currentPw) { setPwError("Please enter your current password."); return; }

    setSavingPw(true);
    try {
      const payload = { newPassword: newPw, confirmPassword: confirmPw };
      if (user?.hasPassword) payload.currentPassword = currentPw;

      const res = await authApi.changePassword(payload);
      addToast(res.data.message, "success");

      // If they just SET a password (OAuth user), update hasPassword in context
      if (!user?.hasPassword) {
        updateUser({ hasPassword: true });
      }

      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update password";
      setPwError(msg);
    } finally {
      setSavingPw(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(user?.email || "");
    addToast("Email copied to clipboard", "success");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 fade-in select-none">

      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div>
        <nav className="flex items-center gap-2 text-xs font-mono text-vault-muted mb-1">
          <Link to="/dashboard" className="text-vault-accent hover:underline">Home</Link>
          <span>/</span>
          <span className="text-vault-text font-semibold">Account Settings</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-vault-text">Account Settings</h1>
      </div>

      {/* ── 1 · Identity Banner ─────────────────────────────────────────── */}
      <div className="relative p-6 sm:p-8 rounded-2xl border border-vault-border bg-vault-panel overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-vault-accent/8 blur-3xl pointer-events-none" />

        {/* Avatar */}
        <div className="relative shrink-0">
          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-mono font-bold text-3xl shadow-2xl border border-white/10`}>
            {user?.username?.charAt(0)?.toUpperCase() || "V"}
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-vault-success border-2 border-vault-panel shadow-md" title="Active session" />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left min-w-0 space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-vault-text truncate">{user?.username || "—"}</h2>
          <p className="text-xs font-mono text-vault-muted truncate">{user?.email}</p>
          <p className="text-[11px] font-mono text-vault-muted pt-1">
            Member since {user?.createdAt ? formatDate(user.createdAt) : "—"}
          </p>
        </div>
      </div>

      {/* ── 2 · Edit Username ───────────────────────────────────────────── */}
      <Card>
        <CardTitle icon={
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }>Edit Profile</CardTitle>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono text-vault-muted mb-1.5" htmlFor="username-input">
              Username
            </label>
            <input
              id="username-input"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setUsernameError(""); }}
              placeholder="your_username"
              maxLength={30}
              className="w-full bg-vault-surface border border-vault-border rounded-xl px-3.5 py-2.5 text-xs text-vault-text placeholder:text-vault-muted focus:outline-none focus:border-vault-accent/60 transition-colors"
            />
            {usernameError && (
              <p className="text-[11px] text-vault-danger mt-1.5 font-mono">{usernameError}</p>
            )}
            <p className="text-[10px] text-vault-muted mt-1 font-mono">{username.length}/30 · letters, numbers, underscores</p>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-vault-muted mb-1.5" htmlFor="email-display">
              Email Address <span className="text-vault-muted/60">(read-only)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="email-display"
                type="email"
                value={user?.email || ""}
                readOnly
                className="flex-1 bg-vault-surface/50 border border-vault-border/60 rounded-xl px-3.5 py-2.5 text-xs text-vault-muted cursor-not-allowed"
              />
              <button
                type="button"
                onClick={copyEmail}
                className="p-2.5 rounded-xl border border-vault-border hover:border-vault-accent/50 text-vault-muted hover:text-vault-accent transition-colors cursor-pointer"
                title="Copy email"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.75"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveUsername}
            disabled={!usernameChanged || !usernameValid || savingUsername}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-vault-accent to-vault-accent-hover text-[#14161A] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
          >
            {savingUsername ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </Card>

      {/* ── 3 · Password Section ────────────────────────────────────────── */}
      <Card>
        <CardTitle icon={
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        }>{user?.hasPassword ? "Change Password" : "Set a Password"}</CardTitle>

        {!user?.hasPassword ? (
          /* ── Mode A: OAuth user — SET password ── */
          <div className="p-3.5 rounded-xl bg-blue-500/8 border border-blue-500/20 text-xs text-vault-muted mb-2">
            <p className="font-semibold text-vault-text mb-0.5">Add password login to your account</p>
            <p>You currently sign in with Google. Setting a password lets you also sign in with your email and password — both methods will work.</p>
          </div>
        ) : (
          /* ── Mode B: existing password — CHANGE ── */
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-vault-muted mb-1.5" htmlFor="current-pw">
                Current Password
              </label>
              <PasswordInput
                id="current-pw"
                value={currentPw}
                onChange={(e) => { setCurrentPw(e.target.value); setPwError(""); }}
                placeholder="Enter your current password"
                disabled={savingPw}
                autoComplete="current-password"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono text-vault-muted mb-1.5" htmlFor="new-pw">
              New Password
            </label>
            <PasswordInput
              id="new-pw"
              value={newPw}
              onChange={(e) => { setNewPw(e.target.value); setPwError(""); }}
              placeholder="Minimum 6 characters"
              disabled={savingPw}
            />
            {/* Strength bar */}
            {newPw.length > 0 && strength && (
              <div className="mt-2 space-y-1">
                <div className="h-1 w-full rounded-full bg-vault-surface overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.colour} ${strength.width}`} />
                </div>
                <p className={`text-[10px] font-mono font-semibold ${strength.label === "Weak" ? "text-vault-danger" : strength.label === "Strong" ? "text-vault-success" : "text-amber-400"}`}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-mono text-vault-muted mb-1.5" htmlFor="confirm-pw">
              Confirm New Password
            </label>
            <PasswordInput
              id="confirm-pw"
              value={confirmPw}
              onChange={(e) => { setConfirmPw(e.target.value); setPwError(""); }}
              placeholder="Re-enter new password"
              disabled={savingPw}
            />
            {confirmPw && newPw !== confirmPw && (
              <p className="text-[11px] text-vault-danger mt-1.5 font-mono">Passwords do not match</p>
            )}
          </div>

          {pwError && (
            <div className="p-3 rounded-xl bg-vault-danger/10 border border-vault-danger/30 text-vault-danger text-[11px] font-mono">
              {pwError}
            </div>
          )}

          <button
            type="button"
            onClick={handleSavePassword}
            disabled={savingPw || newPw.length < 6 || newPw !== confirmPw || (user?.hasPassword && !currentPw)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-vault-accent to-vault-accent-hover text-[#14161A] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
          >
            {savingPw ? "Saving…" : user?.hasPassword ? "Change Password" : "Set Password"}
          </button>

          {user?.hasPassword && (
            <p className="text-[10px] font-mono text-vault-muted">
              Changing your password will sign out all other active sessions.
            </p>
          )}
        </div>
      </Card>

      {/* ── 4 · Account Info + Storage side-by-side on md+ ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Account Info */}
        <Card>
          <CardTitle icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.75"/>
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          }>Account Info</CardTitle>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-vault-border/40">
              <span className="text-vault-muted font-mono">User ID</span>
              <span className="font-mono text-vault-muted text-[10px] truncate max-w-[140px]">{user?.id?.slice(0, 16)}…</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-vault-border/40">
              <span className="text-vault-muted font-mono">Email</span>
              <span className="font-semibold text-vault-text truncate max-w-[180px]">{user?.email || "—"}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-vault-muted font-mono">Member Since</span>
              <span className="font-semibold text-vault-text">{user?.createdAt ? formatDate(user.createdAt) : "—"}</span>
            </div>
          </div>
        </Card>

        {/* Storage Snapshot */}
        <Card>
          <CardTitle icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.75"/>
            </svg>
          }>Storage</CardTitle>

          {storageLoading ? (
            <div className="space-y-3">
              <div className="skeleton h-3 w-3/4 rounded" />
              <div className="skeleton h-2 w-full rounded-full" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          ) : storageStats ? (
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-vault-text">{formatBytes(storageStats.totalBytes)}</p>
                  <p className="text-[11px] font-mono text-vault-muted">of 1 GB used · {storageStats.fileCount} {storageStats.fileCount === 1 ? "file" : "files"}</p>
                </div>
                <span className="text-sm font-bold text-vault-accent">{usedPct}%</span>
              </div>

              <div className="h-2 w-full rounded-full bg-vault-surface border border-vault-border overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${usedPct > 90 ? "bg-vault-danger" : "bg-gradient-to-r from-vault-accent to-amber-400"}`}
                  style={{ width: `${Math.max(usedPct > 0 ? 2 : 0, usedPct)}%` }}
                />
              </div>

              <Link
                to="/storage"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-vault-accent hover:underline"
              >
                View full breakdown
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          ) : (
            <p className="text-xs text-vault-muted font-mono">Could not load storage stats.</p>
          )}
        </Card>
      </div>

      {/* ── 5 · Sign Out ────────────────────────────────────────────────── */}
      <Card>
        <CardTitle icon={
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }>Session</CardTitle>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-vault-muted">
            <p className="font-semibold text-vault-text mb-0.5">Current Session</p>
            <p className="font-mono text-[11px]">Secured via HttpOnly cookie · session active</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="shrink-0 px-5 py-2.5 rounded-xl border border-vault-danger/40 bg-vault-danger/10 text-vault-danger hover:bg-vault-danger hover:text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loggingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </Card>

    </div>
  );
}
