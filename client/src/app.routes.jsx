import { Routes, Route } from "react-router-dom";
import LandingPage    from "./pages/LandingPage";
import LoginPage      from "./pages/LoginPage";
import RegisterPage   from "./pages/RegisterPage";
import NotFoundPage   from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ui/ProtectedRoute";

// ── Lazy-loaded protected pages (Phase 2 & 3) ────────────────────────────────
// Uncomment as each phase is built:
// import { lazy, Suspense } from "react";
// const DashboardPage = lazy(() => import("../pages/DashboardPage"));
// const FolderPage    = lazy(() => import("../pages/FolderPage"));
// const SharePage     = lazy(() => import("../pages/SharePage"));

// Temporary placeholder for protected pages during Phase 1
function PlaceholderDashboard() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--color-bg)" }}>
      <p style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
        [ Dashboard — Phase 2 ]
      </p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ──────────────────────────────────────────────────────── */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Protected (nested under ProtectedRoute <Outlet />) ──────────── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"                element={<PlaceholderDashboard />} />
        <Route path="/dashboard/folder/:id"     element={<PlaceholderDashboard />} />
      </Route>

      {/* ── Public share page (Phase 3) ─────────────────────────────────── */}
      {/* <Route path="/share/:shareToken" element={<SharePage />} /> */}

      {/* ── 404 ─────────────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
