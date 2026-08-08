# VaultDrive – Frontend Plan

## Theme: "Bank Vault" (not generic SaaS)

### Palette
| Token | Hex | Use |
|---|---|---|
| Background | `#14161A` | App background (graphite) |
| Surface | `#181B21` | Recessed surfaces, inputs, nested cards |
| Panel | `#1C1F26` | Main cards, sidebar, modals |
| Border | `#2A2E37` | Dividers, card outlines |
| Accent (brass) | `#B8935A` | Buttons, links, active states, vault toggle |
| Accent Hover | `#C8A66B` | Hover states for buttons & interactive elements |
| Text primary | `#E8E6E0` | Headings, body |
| Text muted | `#8B8F99` | Secondary text, metadata labels |
| Success | `#6FA88A` | Muted sage green (not neon) |
| Danger | `#C0654F` | Muted terracotta-red |

### Typography
- **UI/headings**: Inter or Geist (geometric grotesk)
- **File metadata** (size, date, type, mimetype): JetBrains Mono — gives file listings a "manifest/ledger" feel
- Type scale: 12 / 14 / 16 / 20 / 28 / 36px, weights 400/500/600 only (no 700+, keeps it disciplined)

### Layout
```
┌─────────┬──────────────────────────────┐
│ Sidebar │ Topbar: search + upload btn   │
│ (folder ├──────────────────────────────┤
│  tree)  │ File grid (card = mono meta)  │
│         │                                │
└─────────┴──────────────────────────────┘
Mobile: sidebar collapses into drawer (hamburger in topbar)
```

### Signature element
**Vault Toggle** — the public/private switch is styled like a physical latch/lock icon flipping, not a generic iOS-style toggle. This is the one visual detail that should feel deliberately designed.

### Responsiveness rules
- Mobile (<640px): single column file list, drawer nav, upload button becomes FAB
- Tablet (640–1024px): 2-col file grid, collapsible sidebar
- Desktop (>1024px): persistent sidebar, 3–4 col file grid

---

## Standout Features (confirmed)
1. Auto session restore via `/auth/me` on app load
2. Axios interceptor: 401 → silent `/auth/refresh` → retry original request
3. Drag & drop anywhere on dashboard (not just inside modal)
4. Live per-file upload progress bars (`onUploadProgress`)
5. Inline preview for images/video/PDF
6. Skeleton loading (shimmer, not spinners)
7. Mobile-first, fully responsive
8. Optimistic UI updates (rename/delete/toggle-public) with rollback on error
9. Toast notifications with Undo action

---

## Folder Structure

```
client/src/
├── api/
│   ├── axios.js              # instance + 401 interceptor (refresh & retry)
│   ├── auth.api.js
│   ├── files.api.js
│   └── folders.api.js
├── context/
│   └── AuthContext.jsx       # session restore on mount
├── hooks/
│   ├── useFiles.js
│   ├── useFolders.js
│   └── useUpload.js          # progress state, queue, drag-drop logic
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx         # Main layout wrapper (Topbar, Sidebar, MobileDrawer, Outlet)
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   └── MobileDrawer.jsx
│   ├── files/
│   │   ├── FileCard.jsx
│   │   ├── FileGrid.jsx
│   │   ├── FilePreviewModal.jsx
│   │   ├── ShareModal.jsx
│   │   └── VaultToggle.jsx
│   ├── upload/
│   │   ├── UploadModal.jsx
│   │   ├── UploadProgressBar.jsx
│   │   └── DropzoneOverlay.jsx
│   ├── folders/
│   │   ├── FolderSidebar.jsx
│   │   ├── FolderBreadcrumb.jsx
│   │   └── CreateFolderModal.jsx
│   ├── skeletons/
│   │   ├── FileCardSkeleton.jsx
│   │   └── FolderTreeSkeleton.jsx
│   └── ui/
│       ├── Toast.jsx
│       └── ProtectedRoute.jsx
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── FolderPage.jsx        # /dashboard/folder/:id
│   ├── SharePage.jsx         # /share/:shareToken (public)
│   └── NotFoundPage.jsx      # Custom 404 page
├── utils/
│   ├── formatters.js         # File size (e.g. 10.4 MB), date formatting
│   └── fileIcons.jsx         # Dynamic file type icons (PDF, Image, Video, Zip, Doc)
├── routes/
│   └── AppRoutes.jsx         # centralized route definitions
├── App.jsx
├── main.jsx
└── index.css
```

---

## AppRoutes.jsx (routing plan)

```jsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import FolderPage from "../pages/FolderPage";
import SharePage from "../pages/SharePage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "../components/ui/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/share/:shareToken" element={<SharePage />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/folder/:id" element={<FolderPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

`App.jsx` stays thin:
```jsx
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
```

`ProtectedRoute` uses `<Outlet />` (nested-route pattern) rather than wrapping each page individually — cleaner than repeating the wrapper per route.

---

## Build order
1. `api/axios.js` (interceptor — everything depends on it)
2. `AuthContext.jsx` + `ProtectedRoute.jsx`
3. Login/Register pages
4. `AppRoutes.jsx` + `App.jsx`
5. Dashboard shell (Sidebar, Topbar, MobileDrawer)
6. File grid + FileCard + skeletons
7. Upload flow (Dropzone, Modal, progress bars)
8. Preview modal, SharePage
9. Polish: toasts, optimistic updates, responsiveness pass

## detailed phases -

### 🛡️ Frontend Phase 1: Core Foundation, Theme & Auth Infrastructure
Goal: Establish the Bank Vault design tokens, Axios API layer with 401 refresh interceptor, AuthContext with session restore, route guards, and Auth pages.

Theme & Design Tokens (client/src/index.css):

Configure Tailwind 4 CSS variables & theme tokens for the Bank Vault palette:
#14161A (Background - graphite)
#181B21 (Surface - recessed inputs/cards)
#1C1F26 (Panel - main cards/sidebar)
#2A2E37 (Border - outlines)
#B8935A (Accent - brass)
#C8A66B (Accent Hover - brightened brass)
#E8E6E0 (Text primary - headings/body)
#8B8F99 (Text muted - metadata labels)
#6FA88A (Success - muted sage green)
#C0654F (Danger - muted terracotta red)
Import & configure Inter (UI) and JetBrains Mono (metadata) font families.
API Layer (client/src/api/):

axios.js: Axios instance with baseURL, withCredentials: true, and an interceptor that catches 401 Unauthorized → calls /api/v1/auth/refresh → retries original request seamlessly.
auth.api.js: Requests for login, register, logout, getMe, refresh.
files.api.js: Requests for upload, list, getById, update, delete, shareLink, revokeShareLink, shareUser, unshareUser, sharedWithMe, getByShareToken.
folders.api.js: Requests for create, list, getById, update, delete.
Auth Context & Route Guard (client/src/context/ & client/src/components/ui/):

AuthContext.jsx: Auth state (user, isLoading, login, register, logout, auto-checkAuth on mount via /auth/me).
ProtectedRoute.jsx: <Outlet /> nested route guard redirecting unauthenticated users to /login.
Auth Pages & App Router (client/src/pages/ & client/src/routes/):

LoginPage.jsx & RegisterPage.jsx styled in Bank Vault aesthetic with error alerts.
LandingPage.jsx: Hero landing page with feature cards and CTAs.
AppRoutes.jsx & App.jsx: Complete route setup (/, /login, /register, /dashboard, /share/:shareToken).

### 📂 Frontend Phase 2: Application Shell, Folder Tree & Navigation
Goal: Build the responsive Bank Vault layout shell, Topbar search, Sidebar folder tree, Toast notification system, and custom data hooks.

Custom Data Hooks (client/src/hooks/):

useFolders.js: Folder state, tree navigation, folder creation, renaming, moving, and deletion.
useFiles.js: File list state, search filter, sorting, pagination, and optimistic updates.
Toast System & Utilities (client/src/components/ui/ & client/src/utils/):

Toast.jsx: Notification popups with support for Undo actions.
formatters.js & fileIcons.jsx: File size formatting (e.g. 10.4 MB), dates, and dynamic file type icons.
Layout Shell Components (client/src/components/layout/ & client/src/components/folders/):

Topbar.jsx: Brand header, instant search bar, thin brass storage progress bar (e.g., 73 GB / 100 GB with metallic fill bar), user profile dropdown, and mobile menu trigger.
Sidebar.jsx: Persistent left navigation with storage stats, quick links (All Files, Shared with Me), and folder tree.
MobileDrawer.jsx: Mobile slide-over navigation drawer.
FolderSidebar.jsx & FolderBreadcrumb.jsx: Folder tree list and dynamic breadcrumb trail (Home / Projects / Mockups).
CreateFolderModal.jsx: Modal for creating root or nested folders.
FolderPage.jsx: Folder view page for /dashboard/folder/:id.

### 🔐 Frontend Phase 3: File Workspace, Vault Toggle & Modals
Goal: Build the file grid/list workspace, signature VaultToggle component, FileCard with JetBrains Mono metadata, Skeleton loaders, and action modals.

Signature Component (client/src/components/files/VaultToggle.jsx):

Physical heavy latch/lock flip switch for toggling public/private access with 120–180ms rotation, metallic brass gradient, inset shadow, and custom cubic-bezier easing ([LOCKED] <-> [UNLOCKED]).
Skeleton Shimmers (client/src/components/skeletons/):

FileCardSkeleton.jsx & FolderTreeSkeleton.jsx: Shimmer placeholder states during data fetching.
File Workspace (client/src/components/files/):

FileCard.jsx: Card with file thumbnail, raw filename, JetBrains Mono metadata (size, date, type), public/private status badge, VaultToggle, and context menu (rename, move, share, delete). Empty state displays vault-themed copy: "Your vault is empty. Upload your first file to begin securing your digital assets."
FileGrid.jsx: Container supporting Grid and List/Table view modes with vault-themed empty state handling.
Action Modals (client/src/components/files/):

ShareModal.jsx: Share link generator (with copy-to-clipboard) and user-to-user email/username sharing form.
FilePreviewModal.jsx: Inline media preview modal for Images, Videos, and PDFs, with direct download button for raw files.
DashboardPage.jsx: Main application workspace assembling all layout, grid, and modal components.

### 🚀 Frontend Phase 4: Drag & Drop Upload Engine, Public Share Page & Final Polish
Goal: Implement screen-wide drag & drop upload, live progress bars, public share page, optimistic updates with rollback, and full mobile responsiveness pass.

Upload Engine (client/src/hooks/useUpload.js & client/src/components/upload/):

useUpload.js: Upload queue state & per-file progress tracking via Axios onUploadProgress.
DropzoneOverlay.jsx: Screen-wide drag-over overlay triggerable anywhere on the dashboard.
UploadModal.jsx & UploadProgressBar.jsx: Active upload floating panel with per-file brass progress bars.
Public Share Page (client/src/pages/SharePage.jsx):

Public view for /share/:shareToken — previews image/video/PDF inline, displays JetBrains Mono file metadata, and provides a direct download button.
Optimistic Updates & Final Polish:

Instant UI feedback for rename, delete, and public toggle with state rollback if API call fails.
Full viewport responsiveness check (Mobile <640px, Tablet 640–1024px, Desktop >1024px).
NotFoundPage.jsx custom 404 view.

---

### ✨ Extras & Standout UX Features (The 2027 Trademark Polish)

we will do this if time will be left and all the web app features are working, it is for last.

1. **`⌘ + K` Command Palette (`CommandPalette.jsx`)**:
   - Raycast/Linear style command overlay allowing instant searching, uploading, folder creation, navigation, and view toggling via keyboard shortcut.
2. **Instant QR Code Generator (`ShareModal.jsx`)**:
   - Auto-generates an SVG QR code for active public share links (`qrcode.react`), allowing evaluators to scan their desktop screen directly with a mobile camera.
3. **Multi-Category Storage Breakdown Bar (`Sidebar.jsx`)**:
   - Multi-colored 6px metallic bar in the sidebar displaying storage distribution by file category (Sage `#6FA88A` Images, Brass `#B8935A` Media, Sky Blue `#38BDF8` Docs, Slate `#8B8F99` Archives).
4. **1-Click Demo Login (`LoginPage.jsx`)**:
   - `[ Fill Demo Credentials ]` button on the login screen for seamless single-click testing.

