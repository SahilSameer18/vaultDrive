import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Wraps protected routes using React Router's nested <Outlet /> pattern.
 * Shows a vault-themed loading screen while session is being verified.
 * Redirects to /login if unauthenticated.
 */
export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-vault-bg">
        <div className="flex flex-col items-center gap-3">
          {/* Pulsing vault seal */}
          <div className="w-10 h-10 rounded-full border-2 border-vault-accent bg-vault-panel animate-pulse" />
          <p className="text-xs font-mono text-vault-muted">
            Verifying vault access...
          </p>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
