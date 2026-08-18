import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import VaultLoadingScreen from "./VaultLoadingScreen";

/**
 * Wraps protected routes using React Router's nested <Outlet /> pattern.
 * Shows a custom premium VaultDrive loading screen while session is being verified.
 * Redirects to /login if unauthenticated.
 */
export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <VaultLoadingScreen />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}



