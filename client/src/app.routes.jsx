import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import AppLayout from "./app.layout";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FolderPage from "./pages/FolderPage";
import SharedWithMePage from "./pages/SharedWithMePage";
import RecentActivityPage from "./pages/RecentActivityPage";
import PublicSharePage from "./pages/PublicSharePage";
import ProfilePage from "./pages/ProfilePage";
import TrashPage from "./pages/TrashPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Routes ────────────────────────────────────────────────── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/share/:shareToken" element={<PublicSharePage />} />

      {/* ── Protected Vault Routes (AppLayout Shell) ────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/folder/:folderId" element={<FolderPage />} />
          <Route path="/shared" element={<SharedWithMePage />} />
          <Route path="/recent" element={<RecentActivityPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/trash" element={<TrashPage />} />
        </Route>
      </Route>

      {/* Legacy Fallback Redirect */}
      <Route path="/app" element={<Navigate to="/dashboard" replace />} />

      {/* ── 404 Not Found ───────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
