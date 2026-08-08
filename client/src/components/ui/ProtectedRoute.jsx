import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Wraps protected routes using React Router's nested <Outlet /> pattern.
 * Shows nothing while session is being restored (isLoading = true).
 * Redirects to /login if unauthenticated.
 */
export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Prevent flash of login page while /auth/me is in-flight
    return (
      <div className="flex h-screen items-center justify-center"
           style={{ background: "var(--color-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          {/* Pulsing vault seal */}
          <div
            className="w-10 h-10 rounded-full border-2 animate-pulse"
            style={{ borderColor: "var(--color-accent)", background: "var(--color-panel)" }}
          />
          <p className="text-xs" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
            Verifying vault access...
          </p>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
