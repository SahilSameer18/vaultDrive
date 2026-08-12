# 🛡️ VaultDrive — Enterprise Cloud Asset Repository

> A high-performance, secure cloud storage web application designed for modern asset management. Featuring JWT refresh token rotation, unlimited nested folder trees, interactive sidebar directory tree navigation, 64-character public share tokens, real-time drag-and-drop uploads, and inline media previews.

[![Live Application](https://img.shields.io/badge/Live--Demo-Vercel--App-B8935A?style=for-the-badge&logo=vercel&logoColor=14161A)](https://vaultdrive-s.vercel.app)
[![API Backend](https://img.shields.io/badge/API--Backend-Render--Cloud-46E3B7?style=for-the-badge&logo=render&logoColor=14161A)](https://vaultdrive-pjca.onrender.com/api/v1)
![Author](https://img.shields.io/badge/Author-Sahil--Sameer-181717?style=for-the-badge&logo=github)
![Security](https://img.shields.io/badge/Security-Google--OAuth--2.0--%7C--JWT-00C853?style=for-the-badge&logo=google)
![Tech Stack](https://img.shields.io/badge/Stack-React--19--|--Node--|--Prisma--7-61DAFB?style=for-the-badge&logo=react&logoColor=14161A)
![Database](https://img.shields.io/badge/Database-Neon--PostgreSQL-4169E1?style=for-the-badge&logo=postgresql)
![Storage](https://img.shields.io/badge/Cloud-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary)

---

## ⚡ 1-Click Reviewer Quick Start

Testing VaultDrive is instant! No registration or password typing is required:
1. Open the [Live Application](https://vaultdrive-s.vercel.app).
2. Click **`⚡ 1-Click Demo Access`** on the Landing, Login, or Register page.
3. You are instantly logged into a pre-populated workspace with sample folders and file controls.


---

## 👨‍💻 Developer & Live Links

- **Developer**: **Sahil Sameer** ([@SahilSameer18](https://github.com/SahilSameer18))
- **🌐 Live Application (Frontend)**: [https://vaultdrive-s.vercel.app](https://vaultdrive-s.vercel.app)
- **⚙️ API Health Check**: [https://vaultdrive-pjca.onrender.com](https://vaultdrive-pjca.onrender.com)

---

## 📐 System Architecture

```mermaid
flowchart TD
    subgraph Client ["Frontend (React 19 + Vite + Tailwind CSS v4 — Vercel)"]
        UI["React SPA Components"]
        AXIOS["Axios Interceptor\n(Auto Access Token Refresh)"]
        GOOGLE_SDK["@react-oauth/google\n(Google Sign-In SDK)"]
        STORE["Auth Context & Search Context"]
        PORTAL["React Portals\n(File Preview & Custom Modals)"]
        UI --> AXIOS
        UI --> GOOGLE_SDK
        AXIOS --> STORE
        UI --> PORTAL
    end

    subgraph Server ["Backend (Node.js + Express REST API — Render)"]
        HELMET["Helmet (HTTP Security Headers)"]
        PROXY["Proxy Trust\n(trust proxy = 1)"]
        AUTH_MW["Split Rate Limiters\n(generalLimiter, loginLimiter, registerLimiter)"]
        GOOGLE_VERIFIER["Google Token Verifier\n(google-auth-library)"]
        VALIDATOR["Zod Payload Validator"]
        CONTROLLER["Auth Controllers\n(Google OAuth 2.0 & 1-Click Demo Access)"]
        CYCLE_GUARD["Folder Cycle Guard"]
        MULTER["Multer Memory Buffer"]

        HELMET --> PROXY
        PROXY --> AUTH_MW
        AUTH_MW --> GOOGLE_VERIFIER
        GOOGLE_VERIFIER --> VALIDATOR
        VALIDATOR --> CONTROLLER
        CONTROLLER --> CYCLE_GUARD
        CONTROLLER --> MULTER
    end

    subgraph Infrastructure ["Cloud Infrastructure & Persistence"]
        PRISMA["Prisma 7 ORM"]
        NEON[("Neon PostgreSQL\n(User, OAuthAccount, File, Folder, SharedFile)")]
        CLOUDINARY[("Cloudinary Asset Cloud\n(Secure File Storage)")]

        PRISMA --> NEON
        MULTER --> CLOUDINARY
        CONTROLLER --> PRISMA
    end

    GOOGLE_SDK -->|ID Token Auth| GOOGLE_VERIFIER
    AXIOS -->|HTTPS + JWT / HttpOnly Cookie| HELMET
```



---

## ✨ Key Features

### 🔐 Authentication & Session Security
- **Dual-Token System**: 15-minute access tokens + 7-day refresh tokens stored as **bcrypt hashes** (not plaintext) in Neon PostgreSQL, sent via `httpOnly` secure cookies.
- **Silent Token Rotation**: Axios interceptor automatically catches `401 Unauthorized` responses and queues concurrent requests while refreshing — preventing refresh token race conditions.
- **HTTP Security Headers**: [Helmet.js](https://helmetjs.github.io/) enforces `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Strict-Transport-Security` in production.
- **OWASP Rate Limiting**: Auth endpoints limited to 5 req/15min; global API limited to 100 req/15min.

### 📁 Advanced Nested Folder & Directory Engine
- **Interactive Sidebar Directory Tree**: Dynamic expandable tree (`FolderSidebar.jsx`) with active directory highlighting and auto-expanding hierarchy branches.
- **Unlimited Nesting**: Create subfolders inside subfolders with full breadcrumb navigation (`Home / Projects / 2027`).
- **Folder Cycle Guard**: Algorithmic ancestry traversal prevents setting a folder's descendant as its parent.
- **Safe Deletion Cascade**: Deleting a folder moves all its files to root (`folderId → null`) rather than deleting them — intentional data integrity decision.

### ⚡ Cloud File Management & Storage
- **100MB File Uploads**: Upload images, videos, audio, PDFs, archives, and code files with real-time percentage progress bar.
- **Whole-Page Drag & Drop Overlay**: Counter-tracked drag listener detects file drags and shows an illuminated full-screen dropzone.
- **Public / Private Toggle**: `VaultToggle.jsx` switches each file between `PRIVATE` and `PUBLIC` with instant visual feedback.
- **Multi-Category Storage Breakdown**: Live color-coded storage distribution bar in the sidebar (Images / Video & Audio / Docs & PDFs / Archives).
- **Global Live Search**: Real-time search bar in the topbar filtering files and folders instantly.

### 🔗 Granular Share Management
- **Public Share Links**: Generate and revoke 64-character hex share tokens. Public page (`/share/:shareToken`) is accessible without authentication.
- **User-to-User Sharing**: Grant file access to specific registered users by email or username.
- **Composite Unique Guard**: `fileId + userId` constraint prevents duplicate share entries.

### 👁️ Inline Media Previews
- **React Portal Overlay** (`createPortal → document.body`) for correct z-index stacking.
- **Keyboard `Esc` Shortcut** for instant dismissal.
- Multi-format support: 🖼️ Images · 🎥 Videos · 🎵 Audio · 📄 PDFs · 💻 Code & Text files

---

## 🛡️ Security Implementation

| Security Layer | How VaultDrive Implements It |
| :--- | :--- |
| **HTTP Security Headers** | `helmet()` with custom CSP: whitelists only `self` + `https://res.cloudinary.com` for media, scripts, frames. HSTS enforced in production. |
| **Authentication** | Dual-token JWT; refresh tokens stored as bcrypt hashes (cost 12) — a DB breach does not expose valid tokens. |
| **Input Sanitization** | `sanitizeFilename()` strips path traversal sequences and illegal characters before Cloudinary upload. |
| **Payload Validation** | Zod schemas on all request bodies, query params, and route params via a shared `validate()` middleware. |
| **Access Control (IDOR)** | `file.userId === req.user.id` ownership check on every mutating route. |
| **Shared File Access** | Three-tier check: owner → public (`isPublic`) → shared (`SharedFile` record) before allowing file access. |
| **Self-Share Prevention** | Controller rejects share requests where `targetUser.id === req.user.id`. |
| **Folder Cycle Prevention** | Iterative ancestor traversal blocks any folder from becoming its own descendant. |
| **Rate Limiting** | Auth routes: 5 req/15min · Global API: 100 req/15min (via `express-rate-limit`). |
| **XSS** | React escapes JSX by default; text file previews capped at 10KB inside `<pre>` — no `dangerouslySetInnerHTML`. |
| **Cookie Security** | `httpOnly: true`, `secure: true`, `sameSite: none` in production for cross-domain cookie delivery. |

---

## 🏗️ Key Engineering Decisions

| Decision | What Was Chosen | Why |
| :--- | :--- | :--- |
| **Refresh token storage** | bcrypt hash in DB (never plaintext) | A database breach doesn't expose usable refresh tokens |
| **Concurrent 401 handling** | Queue-based Axios interceptor | Prevents multiple simultaneous refresh storms in SPAs |
| **Folder deletion** | `SetNull` cascade (files → root) | Deleting a folder should not destroy user files |
| **Upload pipeline** | Multer memory buffer → Cloudinary stream | Zero disk I/O; clean DX; progress tracking via Axios |
| **File preview** | `createPortal(document.body)` | Correct z-index stacking regardless of parent stacking context |
| **Drag-and-drop** | `dragCounter` pattern on `window` | Prevents flickering when cursor moves over child elements |
| **Share URL construction** | Uses `CLIENT_URL` env variable | Ensures share links point to the frontend page, not the backend API |
| **Tree building** | Client-side `buildFolderTree()` from flat array | Single API call; O(n) build; no recursive DB queries needed |

---

## ⚖️ Architecture Tradeoffs

### File Upload Strategy — Multer Memory Buffering

**How it works**: Client sends multipart form data → Multer buffers file bytes in server RAM → bytes streamed directly to Cloudinary.

**Why chosen**: Zero disk setup, clean DX for evaluators, direct upload progress via Axios `onUploadProgress`.

**Known tradeoff**: Under concurrent heavy load (multiple simultaneous 100MB uploads), server RAM usage spikes temporarily.

**Production alternative — Direct Signed Uploads**:
1. Client requests a signed upload URL from server (`POST /files/sign`)
2. Server validates auth and returns a Cloudinary signature
3. Client uploads **directly from browser to Cloudinary** (zero bytes touch the app server)
4. Client confirms upload by calling `POST /files/confirm` to persist metadata to PostgreSQL

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router DOM v7, Axios, Tailwind CSS v4 |
| **Backend** | Node.js, Express v5, Helmet, express-rate-limit |
| **ORM** | Prisma 7 + `@prisma/adapter-pg` (Neon serverless adapter) |
| **Database** | Neon PostgreSQL (pooled + direct connections) |
| **File Storage** | Cloudinary SDK (images, video, audio, raw) |
| **Auth** | JSON Web Token + BcryptJS |
| **Validation** | Zod v3 |
| **Upload** | Multer (memory storage) |
| **Fonts** | Inter (sans) + JetBrains Mono (monospace) via Google Fonts |

---

## 🚀 Local Installation & Setup

### Prerequisites
- **Node.js** v18 or higher
- **Cloudinary** account (free tier is sufficient)
- **Neon PostgreSQL** database (free tier works — requires both a pooled `DATABASE_URL` and a direct `DIRECT_URL`)

### 1. Clone & Install

```bash
git clone https://github.com/SahilSameer18/vaultDrive.git
cd vaultDrive

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment Variables

**Server** — create `server/.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Neon PostgreSQL (Prisma)
# Pooled URL — used for all application queries
DATABASE_URL="postgresql://user:pass@ep-cool-name-pooler.region.aws.neon.tech/neondb?sslmode=require"
# Direct URL — used for migrations only
DIRECT_URL="postgresql://user:pass@ep-cool-name.region.aws.neon.tech/neondb?sslmode=require"

# JWT — use long random strings (min 32 characters)
ACCESS_TOKEN_SECRET="your-super-secret-access-token-key-min-32-chars"
REFRESH_TOKEN_SECRET="your-super-secret-refresh-token-key-min-32-chars"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Frontend URL (used to build public share links)
CLIENT_URL="http://localhost:5173"
```

**Client** — create `client/.env`:

```env
VITE_API_URL="http://localhost:3000/api/v1"
```

> **Where to get credentials:**
> - Neon: [neon.tech](https://neon.tech) → create project → copy both connection strings from the "Connection Details" panel
> - Cloudinary: [cloudinary.com](https://cloudinary.com) → Dashboard → copy Cloud Name, API Key, API Secret

### 3. Database Setup

```bash
cd server

# Run migrations (creates all tables)
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### 4. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# → http://localhost:3000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# → http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register new account |
| `POST` | `/api/v1/auth/login` | Public | Login with email/username + password |
| `POST` | `/api/v1/auth/google` | Public | Authenticate Google OAuth 2.0 ID Token |
| `POST` | `/api/v1/auth/demo-login` | Public | 1-Click Demo Login for instant reviewer testing |
| `POST` | `/api/v1/auth/refresh` | Public | Rotate refresh token, issue new access token |
| `POST` | `/api/v1/auth/logout` | 🔒 Protected | Revoke refresh token and clear cookies |
| `GET` | `/api/v1/auth/me` | 🔒 Protected | Get current authenticated user |


### Folders

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/folders` | 🔒 Protected | List folders (`?parentId=root` for root level) |
| `GET` | `/api/v1/folders/:id` | 🔒 Protected | Get folder with subfolders + breadcrumb path |
| `POST` | `/api/v1/folders` | 🔒 Protected | Create folder or subfolder (`{ name, parentId? }`) |
| `PATCH` | `/api/v1/folders/:id` | 🔒 Protected | Rename or move folder (cycle-guard enforced) |
| `DELETE` | `/api/v1/folders/:id` | 🔒 Protected | Delete folder — subfolders cascade, files move to root |

### Files

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/files` | 🔒 Protected | List files (`?folderId`, `?search`, `?sortBy`, `?page`, `?limit`) |
| `POST` | `/api/v1/files/upload` | 🔒 Protected | Upload file (multipart/form-data, max 100MB) |
| `GET` | `/api/v1/files/:id` | 🔒 Protected | Get single file by ID (owner/shared/public check) |
| `DELETE` | `/api/v1/files/:id` | 🔒 Protected | Permanently delete file from Cloudinary + DB |
| `GET` | `/api/v1/files/shared-with-me` | 🔒 Protected | List files shared directly with the current user |
| `GET` | `/api/v1/files/share/:shareToken` | Public | Access public file via share token |
| `POST` | `/api/v1/files/:id/share-link` | 🔒 Protected | Generate 64-char public share token |
| `DELETE` | `/api/v1/files/:id/share-link` | 🔒 Protected | Revoke public share token |
| `POST` | `/api/v1/files/:id/share-user` | 🔒 Protected | Share file with user by email or username |

### Request/Response Format

All responses follow a unified envelope:

```json
// Success
{ "success": true, "message": "...", "data": { ... } }

// Error
{ "success": false, "message": "...", "errors": [ ... ] }
```

---

## 🗄️ Database Schema

```
User
 ├── files[]          (one-to-many)
 ├── folders[]        (one-to-many)
 ├── sharedFiles[]    (files shared with this user)
 ├── refreshTokens[]  (bcrypt-hashed, multi-device)
 └── oauthAccounts[]  (multi-provider OAuth bindings: Google, GitHub, etc.)

OAuthAccount
 └── user             (linked user account)

File
 ├── user             (owner)
 ├── folder?          (optional parent — null = root)
 └── sharedWith[]     (SharedFile records)

Folder
 ├── user             (owner)
 ├── parent?          (self-referential — null = root)
 └── children[]       (nested subfolders)

SharedFile
 ├── file             (what is shared)
 └── user             (who it's shared with)
```

---

## ⚠️ Known Limitations

| Limitation | Notes |
| :--- | :--- |
| **Single file upload** | UploadModal handles one file at a time |
| **Memory upload** | 100MB files are buffered in server RAM before streaming to Cloudinary — see Architecture Tradeoffs above |
| **No automated tests** | Unit and integration test coverage is a planned addition |

---

## 📜 License & Copyright

Designed and engineered by **Sahil Sameer** ([@SahilSameer18](https://github.com/SahilSameer18)).




