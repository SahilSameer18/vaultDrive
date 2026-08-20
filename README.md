# 🛡️ VaultDrive

> A cloud storage web application built with React, Node.js, Express, PostgreSQL (Prisma), and Cloudinary. Includes soft-delete trash recovery with restore fallbacks, JWT authentication with token rotation, server-side search, multi-field sorting, pagination, nested folder trees with cycle guards, public share links, and direct presigned uploads.

[![Live Application](https://img.shields.io/badge/Live--Demo-Vercel-B8935A?style=for-the-badge&logo=vercel&logoColor=14161A)](https://vaultdrive-s.vercel.app)
[![API Backend](https://img.shields.io/badge/API--Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=14161A)](https://vaultdrive-pjca.onrender.com/api/v1)
![Author](https://img.shields.io/badge/Author-Sahil--Sameer-181717?style=for-the-badge&logo=github)
![Security](https://img.shields.io/badge/Security-Google--OAuth--2.0--%7C--JWT-00C853?style=for-the-badge&logo=google)
![Tech Stack](https://img.shields.io/badge/Stack-React--19--|--Node--|--Prisma--7-61DAFB?style=for-the-badge&logo=react&logoColor=14161A)
![Database](https://img.shields.io/badge/Database-Neon--PostgreSQL-4169E1?style=for-the-badge&logo=postgresql)
![Storage](https://img.shields.io/badge/Storage-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary)

---

## 👨‍💻 Developer & Links

- **Developer**: **Sahil Sameer** ([@SahilSameer18](https://github.com/SahilSameer18))
- **Frontend (Live)**: [https://vaultdrive-s.vercel.app](https://vaultdrive-s.vercel.app)
- **Backend API**: [https://vaultdrive-pjca.onrender.com](https://vaultdrive-pjca.onrender.com)

---

## 📐 Architecture

```mermaid
flowchart TD
    subgraph Client ["Frontend (React 19 + Vite + Tailwind CSS — Vercel)"]
        UI["React SPA Views & Trash Page"]
        AXIOS["Axios Interceptor\n(Token Refresh Queue)"]
        GOOGLE_SDK["@react-oauth/google"]
        STORE["Auth & Search Context"]
        PORTAL["React Portals\n(Modals & Previews)"]
        PAGINATION["Pagination Controls"]
        SORT_DROPDOWN["Dynamic 6-Field Sort Dropdown"]
        UI --> AXIOS
        UI --> GOOGLE_SDK
        AXIOS --> STORE
        UI --> PORTAL
        UI --> PAGINATION
        UI --> SORT_DROPDOWN
    end

    subgraph Server ["Backend (Node.js + Express REST API — Render)"]
        HELMET["Helmet (Security Headers)"]
        PROXY["Proxy Trust\n(trust proxy = 1)"]
        AUTH_MW["Rate Limiters\n(login, register, general)"]
        GOOGLE_VERIFIER["Google Token Verifier\n(google-auth-library)"]
        VALIDATOR["Zod Payload Validator"]
        CONTROLLER["Controllers\n(Auth, File, Folder, Trash)"]
        TRASH_ENGINE["Soft-Delete & Trash Engine\n(Recursive Trashing & Smart Parent Fallback)"]
        NOTIF_SVC["Notification Engine"]
        CYCLE_GUARD["Folder Cycle Guard"]

        HELMET --> PROXY
        PROXY --> AUTH_MW
        AUTH_MW --> GOOGLE_VERIFIER
        GOOGLE_VERIFIER --> VALIDATOR
        VALIDATOR --> CONTROLLER
        CONTROLLER --> TRASH_ENGINE
        CONTROLLER --> NOTIF_SVC
        CONTROLLER --> CYCLE_GUARD
    end

    subgraph Infrastructure ["Cloud Infrastructure"]
        PRISMA["Prisma 7 ORM"]
        NEON[("Neon PostgreSQL\n(User, OAuthAccount, File, Folder, SharedFile, Notification)")]
        CLOUDINARY[("Cloudinary Asset Storage")]

        PRISMA --> NEON
        CONTROLLER --> PRISMA
        CONTROLLER --> CLOUDINARY
    end

    GOOGLE_SDK -->|ID Token Auth| GOOGLE_VERIFIER
    AXIOS -->|HTTPS + JWT / HttpOnly Cookie| HELMET
```

---

## ✨ Features

### 🗑️ Soft Delete & Trash Recovery
- **Recursive Soft Delete**: Deleting a folder updates `deletedAt` timestamps across the folder and all descendant subfolders and files in a single transaction.
- **Hierarchical View**: The `/trash` route lists top-level trashed items. Nested files and subfolders remain grouped inside their parent folder card.
- **Folder Inspection**: Trashed folders can be opened in read-only mode to view contents.
- **Smart Restore**: Restoring a folder restores all contained subfolders and files. Restoring an individual file whose parent is missing or trashed automatically re-parents to **Root (`/dashboard`)**.
- **Permanent Purge**: Single-item deletion and "Empty Trash" destroy assets on Cloudinary and hard-delete rows in PostgreSQL.

### 🔍 Server-Side Search & Multi-Field Sorting
- **PostgreSQL Search**: Case-insensitive text search using Prisma `contains` (`mode: "insensitive"`).
- **6 Sorting Modes**: Database-level sorting by `createdAt` (Newest/Oldest), `name` (A–Z / Z–A), `size` (Largest/Smallest), and `mimeType`.
- **Global Search**: Search queries apply across the entire vault regardless of directory depth.

### 📄 Server-Side Pagination
- **Database Pagination**: Uses `skip` and `take` query parameters, returning pagination envelopes (`page`, `limit`, `totalCount`, `totalPages`).
- **UI Controls**: Items-per-page selector (`10`, `20`, `50`, `100`), page navigation buttons, and auto-hiding when content fits on a single page.

### 🔐 Authentication & Session Management
- **Dual-Token System**: 15-minute access tokens and 7-day refresh tokens stored as bcrypt hashes in PostgreSQL, delivered via `httpOnly` secure cookies.
- **Google OAuth 2.0**: ID token verification via `google-auth-library` with relational `OAuthAccount` schema.
- **Token Rotation**: Axios interceptor handles `401 Unauthorized` responses and queues concurrent requests during token refresh.
- **Rate Limiting**: Auth endpoints limited to 10 requests per 15 minutes; global API limited to 500 requests per 15 minutes.

### 📁 Folder & Workspace Navigation
- **Collapsible Desktop Sidebar (`Ctrl + B`)**: Dual-mode navigation allowing users to toggle between full view (`w-64`) and compact icon-only mode (`w-[72px]`), gaining ~200px of screen real estate with persistent `localStorage` memory and `Ctrl+B` keyboard shortcut.
- **Directory Tree**: Sidebar directory navigation with expandable nodes, active state tracking, and branch lines.
- **Nested Hierarchy**: Support for arbitrary folder nesting with breadcrumb navigation.
- **Single-Query Breadcrumbs**: Breadcrumb paths built from a single indexed database query and in-memory map.
- **Cycle Prevention**: Ancestor check prevents moving a folder into one of its own descendants.
- **Mobile-First Touch Ergonomics**: Full-width card layout on phones with 1-touch folder actions (Rename & Move to Trash always visible on mobile, smooth hover on desktop).

### ⚡ Upload Pipeline & Multi-File Batching
- **Direct Presigned HMAC Uploads**: Direct browser-to-Cloudinary uploads using HMAC SHA-256 signatures (`sign-upload` → Cloudinary → `confirm-upload`). Server does not buffer file bytes in memory.
- **Multi-File Batch Queue**: Select up to 10 files at once with controlled 2-stream concurrency worker queue, individual `AbortController` cancellation, and drag-and-drop queue reordering.
- **Chunked Uploads**: Slices files ≥10MB into chunks with exponential backoff retries.
- **1 GB Storage Quota**: Backend enforces quota checks before issuing signatures and on upload confirmation.
- **Visibility Toggle**: Switches files between `PRIVATE` and `PUBLIC`.
- **Drag-and-Drop**: Whole-page drag-and-drop overlay with batch file detection.

### 🔔 Sharing & Permissions Management
- **"Shared with Me" Dashboard (`/shared`)**: Dedicated view for all files shared with the user by other VaultDrive accounts.
- **"Shared by Me" Dashboard (`/shared-by-me`)**: Dedicated management dashboard for all files shared outward by the user—featuring `PUBLIC LINK` badges (with 1-click **Copy Link**) and `SHARED WITH N USERS` badges with quick access to permissions, preview, and access revocation.
- **Public Share Links**: 64-character hex share tokens for unauthenticated access at `/share/:shareToken`.
- **User-to-User Sharing**: Share files directly with registered users by username or email.
- **Access Guards**: Public links and shared-with-me access are suspended while a file is in Trash.
- **Notifications**: Alerts for `FILE_SHARED`, `ACCESS_REVOKED`, and `STORAGE_WARNING` (at 80% quota usage).

### 🧹 Automatic Token Lifecycle & Database Cleanup
- **Render-Optimized Startup Sweeper**: Automatically executes global expired refresh token cleanup on server boot, handling Render Free Tier sleep/wake cycles with 0 manual intervention.
- **Continuous 24-Hour Schedule**: Scheduled maintenance interval for active server sessions.
- **In-Session Pruning**: Authenticating sessions (login, register, Google OAuth, token refresh) prune stale tokens for that user before generating new tokens.

### 👁️ Inline Multi-Format Media & Document Previews
- **Rich In-Browser Media Previews**: React portal overlays for Images (`.png`, `.jpg`, `.webp`, `.svg`, `.gif`), HTML5 Videos (`.mp4`, `.webm`, `.mov`), and Audio (`.mp3`, `.wav`, `.ogg`).
- **Interactive Document Previews**: Embedded PDF reader and Google Docs Viewer integration for Microsoft Office files (`.docx`, `.xlsx`, `.pptx`, `.csv`, `.doc`, `.xls`, `.ppt`).
- **Dark Code & Text Reader**: Syntax-friendly preview for code and text files (`.js`, `.jsx`, `.ts`, `.tsx`, `.html`, `.css`, `.json`, `.txt`, `.md`, `.py`, `.java`).

### 🏷️ File Renaming with Extension Protection
- **Extension Isolation**: Dedicated renaming interface splits filename into editable base name and locked extension badge, preventing accidental corruption of file type associations upon download.
- **In-Place Reactivity**: State updates in-place across directory trees without requiring full page refetches.

### 👤 Account Profile & Security Management
- **Custom Profile Pictures & Avatars**: Upload custom avatar images (`.png`, `.jpg`, `.webp` up to 5MB) directly to Cloudinary from `/profile` (`PATCH /api/v1/auth/avatar`), sync Google profile photos automatically for OAuth users, or revert to initial letter monograms anytime.
- **Server-Side Avatar Guards**: Backend validates `mimeType` against strict static image formats (`image/jpeg`, `image/png`, `image/webp`), caps avatar signatures at 5MB, and rate limits avatar changes to **4 uploads per 1 hour**.
- **Global `<UserAvatar />` Component**: Reusable circular avatar with automatic fallback to gold-accent monogram badges if an image fails to load.
- **Profile Updates**: Direct username modification (`PATCH /api/v1/auth/profile`) with real-time uniqueness validation.
- **Dual-Mode Password Security**: Google OAuth users can set a password to enable hybrid (Google + Email/Password) login. Existing password users must verify their current password via bcrypt before updating (`PATCH /api/v1/auth/change-password`).
- **Session Revocation**: Changing a password automatically purges all active refresh tokens in the database, signing out all other active devices.

### 📊 Storage & Analytics Dashboard
- **Visual Analytics Page (`/storage`)**: Category highlight cards (Documents, Images, Media, Other Files), circular SVG donut ring chart, and free space indicators.
- **High-Performance SQL Aggregation**: Dedicated `GET /api/v1/files/storage-stats` calculates quota and category breakdown directly inside PostgreSQL via raw SQL `GROUP BY` aggregations, replacing in-memory file loops.
- **Smooth Skeleton Loader**: Tailored `<StorageSkeleton />` matching page geometry to eliminate layout shifts on initial data load.

### 🛡️ Unified Golden Vault Loading System
- **Orbital Vault Mechanism**: Full-screen animation featuring rotating orbital rings, 3D glassmorphic emblem, and status beams.
- **Universal Loading Consistency**: Standardized with custom contextual messages across:
  - **App Boot / Route Authorization** (*"Verifying vault access..."*)
  - **Session Logout** (*"Locking your vault…"*)
  - **Public File Decryption** (*"Decrypting shared vault file…"*)

### 📜 Modular Landing Page & Legal Compliance
- **Decoupled Architecture**: Landing page modularized into 6 focused subcomponents (`LandingNavbar`, `HeroSection`, `CoreBenefits`, `ComparisonMatrix`, `FaqSection`, `LandingFooter`).
- **Legal Compliance**: Full dark-mode **Terms of Service** (`/terms`) and **Privacy Policy** (`/privacy`) pages with legal consent integration on user registration.
- **Route Navigation Helper**: `ScrollToTop` ensures instant top-of-page rendering when navigating between marketing, legal, and application pages.

### 🌐 SEO, PWA & Search Privacy
- **Search Metadata**: Open Graph, Twitter Cards, and Schema.org `SoftwareApplication` structured JSON-LD for rich social share previews.
- **Search Bot Privacy (`robots.txt`)**: Allows search engines to index public landing pages while explicitly blocking crawlers from private user vaults, folders, and shared file tokens.
- **PWA Mobile Manifest**: Supports standalone mobile installation with custom golden vault brand favicon and dark `#14161A` theme.

---

## 🛡️ Security Implementation

| Layer | Implementation Details |
| :--- | :--- |
| **HTTP Headers** | `helmet()` with CSP whitelisting `self` and `https://res.cloudinary.com`. HSTS enabled in production. |
| **Authentication** | Dual-token JWT; refresh tokens stored as bcrypt hashes. Access token delivered exclusively via HttpOnly secure cookie (no JSON body exposure). |
| **Token Lifecycle Cleanup** | Global expired token sweep on server boot (for Render sleep cycles), continuous 24h interval, and per-user stale token purge on session auth. |
| **Session Invalidation**| Password changes purge all existing refresh token records for the user across all devices. |
| **Trash Access Guard** | Public share links, shared-with-me, and permanent delete endpoints return `404` for non-trashed or unauthorized assets. |
| **Input Sanitization** | `sanitizeFilename()` strips path traversal and invalid characters before upload. |
| **Payload Validation** | Zod schemas validate request body, query, and params via shared middleware. |
| **Access Control (IDOR)** | `file.userId === req.user.id` verified on mutating operations. |
| **Sharing Authorization** | Three-tier check: owner → public (`isPublic`) → shared (`SharedFile` record). |
| **Cycle Guard** | Iterative traversal blocks circular folder moves. |
| **Rate Limiting** | Auth routes: 10 req/15min · Global API: 500 req/15min via `express-rate-limit`. |
| **XSS Prevention** | Text previews capped at 10KB inside `<pre>`; no `dangerouslySetInnerHTML`. |
| **Cookies** | `httpOnly: true`, `secure: true`, `sameSite: none` for cross-domain auth. |

---

## 🏗️ Engineering Decisions

| Area | Choice | Reason |
| :--- | :--- | :--- |
| **Trash Handling** | Soft delete via `deletedAt` timestamp | Prevents accidental data loss and keeps trashed items grouped |
| **Restore Fallback** | Re-parent to root if parent folder is missing | Prevents orphaned references to deleted directories |
| **Refresh Tokens** | Bcrypt hash in database | Database breach does not expose usable refresh tokens |
| **401 Handling** | Queue-based Axios interceptor | Prevents multiple concurrent refresh calls |
| **Uploads** | Direct presigned HMAC to Cloudinary | Bypasses server memory; supports chunked large uploads |
| **Search & Sort** | PostgreSQL indexes and query parameters | Offloads sorting and filtering from browser runtime |
| **Breadcrumbs** | Single query with in-memory map | Eliminates sequential N+1 queries per folder level |

---

## 🛠️ Technology Stack

| Component | Tech |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router DOM v7, Axios, Tailwind CSS v4 |
| **Backend** | Node.js, Express v5, Helmet, express-rate-limit |
| **ORM** | Prisma 7 + `@prisma/adapter-pg` |
| **Database** | Neon PostgreSQL |
| **Storage** | Cloudinary SDK |
| **Auth** | JSON Web Token, BcryptJS, Google Auth Library |
| **Validation** | Zod v3 |

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- Neon PostgreSQL database
- Cloudinary account

### 1. Clone & Install

```bash
git clone https://github.com/SahilSameer18/vaultDrive.git
cd vaultDrive

# Install dependencies
cd server && npm install
cd ../client && npm install
```

### 2. Environment Variables

**`server/.env`**:
```env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://user:pass@ep-pooler.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-direct.region.aws.neon.tech/neondb?sslmode=require"

ACCESS_TOKEN_SECRET="your-access-token-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

CLIENT_URL="http://localhost:5173"
```

**`client/.env`**:
```env
VITE_API_URL="http://localhost:3000/api/v1"
```

### 3. Database Migration

```bash
cd server
npx prisma db push
npx prisma generate
```

### 4. Run Development Servers

**Server**:
```bash
cd server && npm run dev
```

**Client**:
```bash
cd client && npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register new account |
| `POST` | `/api/v1/auth/login` | Public | Login with email/username + password |
| `POST` | `/api/v1/auth/google` | Public | Authenticate Google OAuth ID Token |
| `POST` | `/api/v1/auth/refresh` | Public | Rotate refresh token, issue access token |
| `POST` | `/api/v1/auth/logout` | 🔒 Protected | Revoke token and clear cookies |
| `GET` | `/api/v1/auth/me` | 🔒 Protected | Get current user profile |
| `PATCH` | `/api/v1/auth/profile` | 🔒 Protected | Update profile username |
| `PATCH` | `/api/v1/auth/avatar` | 🔒 Protected | Update or remove profile picture avatar |
| `PATCH` | `/api/v1/auth/change-password` | 🔒 Protected | Set or change password with verification |

### Folders

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/folders` | 🔒 Protected | List active folders (`?parentId=root` for root) |
| `GET` | `/api/v1/folders/:id` | 🔒 Protected | Get folder details, subfolders, and breadcrumbs |
| `POST` | `/api/v1/folders` | 🔒 Protected | Create folder (`{ name, parentId? }`) |
| `PATCH` | `/api/v1/folders/:id` | 🔒 Protected | Rename or move folder |
| `DELETE` | `/api/v1/folders/:id` | 🔒 Protected | Move folder and contents to Trash |

### Files

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/files` | 🔒 Protected | List files (`?folderId`, `?search`, `?sortBy`, `?sortOrder`, `?page`, `?limit`) |
| `GET` | `/api/v1/files/storage-stats` | 🔒 Protected | Get aggregated storage quota and category breakdown from database |
| `POST` | `/api/v1/files/sign-upload` | 🔒 Protected | Request HMAC signature for Cloudinary upload |
| `POST` | `/api/v1/files/confirm-upload` | 🔒 Protected | Confirm upload and save file metadata |
| `GET` | `/api/v1/files/:id` | 🔒 Protected | Get file by ID |
| `PATCH` | `/api/v1/files/:id` | 🔒 Protected | Rename file or update properties |
| `DELETE` | `/api/v1/files/:id` | 🔒 Protected | Move file to Trash |
| `GET` | `/api/v1/files/shared-with-me` | 🔒 Protected | List files shared with current user |
| `GET` | `/api/v1/files/shared-by-me` | 🔒 Protected | List files shared outward by current user (public or with specific users) |
| `GET` | `/api/v1/files/share/:shareToken` | Public | Access file via public share token |
| `POST` | `/api/v1/files/:id/share-link` | 🔒 Protected | Generate public share link |
| `DELETE` | `/api/v1/files/:id/share-link` | 🔒 Protected | Revoke public share link |
| `GET` | `/api/v1/files/:id/share-user` | 🔒 Protected | List users with explicit access |
| `POST` | `/api/v1/files/:id/share-user` | 🔒 Protected | Share file with user |
| `DELETE` | `/api/v1/files/:id/share-user/:targetUserId` | 🔒 Protected | Revoke user access |

### Trash & Recovery

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/trash` | 🔒 Protected | List top-level trashed items and stats |
| `GET` | `/api/v1/trash/folder/:id` | 🔒 Protected | Inspect trashed folder contents |
| `PATCH` | `/api/v1/trash/:id/restore` | 🔒 Protected | Restore item with parent fallback |
| `DELETE` | `/api/v1/trash/:id` | 🔒 Protected | Permanently delete item |
| `DELETE` | `/api/v1/trash/empty` | 🔒 Protected | Empty trash and reclaim storage quota |

### Notifications

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/notifications` | 🔒 Protected | Get user notifications and unread count |
| `PATCH` | `/api/v1/notifications/read-all` | 🔒 Protected | Mark all notifications as read |
| `PATCH` | `/api/v1/notifications/:id/read` | 🔒 Protected | Mark single notification as read |
| `DELETE` | `/api/v1/notifications/:id` | 🔒 Protected | Delete notification record |

---

## 🗄️ Database Schema

```
User
 ├── files[]          (one-to-many, active & trashed)
 ├── folders[]        (one-to-many, active & trashed)
 ├── sharedFiles[]    (files shared with this user)
 ├── notifications[]  (recipient notifications)
 ├── refreshTokens[]  (bcrypt-hashed, multi-device)
 └── oauthAccounts[]  (multi-provider OAuth bindings)

OAuthAccount
 └── user             (linked user account)

File
 ├── user             (owner)
 ├── folder?          (optional parent — null = root)
 ├── sharedWith[]     (SharedFile records)
 └── deletedAt?       (soft-delete timestamp — null = active, timestamp = in Trash)

Folder
 ├── user             (owner)
 ├── parent?          (self-referential — null = root)
 ├── children[]       (nested subfolders)
 └── deletedAt?       (soft-delete timestamp — null = active, timestamp = in Trash)

SharedFile
 ├── file             (what is shared)
 └── user             (who it's shared with)

Notification
 ├── user             (recipient)
 └── actor?           (sender/triggering user)
```

---

## 📜 License & Copyright

Designed and engineered by **Sahil Sameer** ([@SahilSameer18](https://github.com/SahilSameer18)).
