import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import AppLayout from "./app.layout";
import VaultLoadingScreen from "./components/ui/VaultLoadingScreen";

// ─── Primary Entry Pages (Eagerly Loaded for Instant, Zero-Flash Render) ─────
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FolderPage from "./pages/FolderPage";

// ─── Secondary / Heavy / Infrequently Visited Pages (Loaded On-Demand) ───────
const StoragePage = lazy(() => import("./pages/StoragePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const TrashPage = lazy(() => import("./pages/TrashPage"));
const SharedWithMePage = lazy(() => import("./pages/SharedWithMePage"));
const SharedByMePage = lazy(() => import("./pages/SharedByMePage"));
const RecentActivityPage = lazy(() => import("./pages/RecentActivityPage"));
const PublicSharePage = lazy(() => import("./pages/PublicSharePage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<VaultLoadingScreen message="Decrypting vault workspace..." />}>
      <Routes>
        {/* ── Public Routes ────────────────────────────────────────────────── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/share/:shareToken" element={<PublicSharePage />} />

        {/* ── Protected Vault Routes (AppLayout Shell) ────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/folder/:folderId" element={<FolderPage />} />
            <Route path="/shared" element={<SharedWithMePage />} />
            <Route path="/shared-by-me" element={<SharedByMePage />} />
            <Route path="/recent" element={<RecentActivityPage />} />
            <Route path="/storage" element={<StoragePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/trash" element={<TrashPage />} />
          </Route>
        </Route>

        {/* Legacy Fallback Redirect */}
        <Route path="/app" element={<Navigate to="/dashboard" replace />} />

        {/* ── 404 Not Found ───────────────────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

