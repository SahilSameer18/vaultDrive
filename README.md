# 🛡️ VaultDrive — Enterprise Cloud Asset Repository

> A high-performance, secure cloud storage web application designed for modern asset management. Featuring JWT refresh token rotation, unlimited nested folder trees, interactive sidebar directory tree navigation, 64-character public share tokens, real-time drag-and-drop uploads, and inline media previews.

![Author](https://img.shields.io/badge/Author-Sahil%20Sameer-gold?style=for-the-badge&logo=github)
![Security](https://img.shields.io/badge/Security-JWT%20Refresh%20Rotation-emerald?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20Node%20%7C%20Express%20%7C%20Prisma%207-blue?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-indigo?style=for-the-badge)
![Storage](https://img.shields.io/badge/Cloud-Cloudinary-orange?style=for-the-badge)

---

## 👨‍💻 Developer Information

- **Developer**: **Sahil Sameer** ([@SahilSameer18](https://github.com/SahilSameer18))
- **Repository**: [https://github.com/SahilSameer18/vaultDrive](https://github.com/SahilSameer18/vaultDrive)

---

## 📐 System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Frontend (React 19 + Vite + Tailwind CSS)"]
        UI["React SPA Components"]
        AXIOS["Axios Interceptor\n(Auto Access Token Refresh)"]
        STORE["Auth Context & Search Context"]
        PORTAL["React Portals\n(File Preview & Custom Modals)"]
        UI --> AXIOS
        AXIOS --> STORE
        UI --> PORTAL
    end

    subgraph Server ["Backend (Node.js + Express REST API)"]
        AUTH_MW["Authentication & Rate Limiter"]
        VALIDATOR["Zod Payload Validator"]
        CONTROLLER["File & Folder Controllers"]
        CYCLE_GUARD["Folder Cycle Guard"]
        MULTER["Multer Memory Buffer"]

        AUTH_MW --> VALIDATOR
        VALIDATOR --> CONTROLLER
        CONTROLLER --> CYCLE_GUARD
        CONTROLLER --> MULTER
    end

    subgraph Infrastructure ["Cloud Infrastructure & Persistence"]
        PRISMA["Prisma 7 ORM"]
        NEON[("Neon PostgreSQL\n(User, File, Folder, SharedFile)")]
        CLOUDINARY[("Cloudinary Asset Cloud\n(Secure File Storage)")]

        PRISMA --> NEON
        MULTER --> CLOUDINARY
        CONTROLLER --> PRISMA
    end

    AXIOS <-->|HTTPS + JWT / HttpOnly Cookie| AUTH_MW
```

---

## ✨ Key Features

### 🔐 Authentication & Session Security
- **Dual-Token System**: 15-minute access tokens + 7-day refresh tokens stored as bcrypt hashes in Neon PostgreSQL, sent via `httpOnly` secure cookies (`ACCESS_TOKEN_SECRET` & `REFRESH_TOKEN_SECRET`).
- **Silent Token Rotation**: Axios interceptor automatically catches `401 Unauthorized` responses and refreshes access tokens without user interruption.
- **OWASP Rate Limiting**: Express rate limiters protect authentication and upload endpoints from brute-force attacks.

### 📁 Advanced Nested Folder & Directory Engine
- **Interactive Sidebar Directory Tree**: Dynamic expandable tree (`FolderSidebar.jsx`) in the sidebar with active directory highlighting and auto-expanding hierarchy branches.
- **Directory Renaming & Management**: Custom dark glassmorphism modal (`RenameFolderModal.jsx`) for renaming directories (`PATCH /folders/:id`).
- **Unlimited Nesting**: Create subfolders inside subfolders with full breadcrumb navigation up to root (`Home / Projects / 2027`).
- **Server-Side Ancestry Verification**: Dynamic SQL recursive parent retrieval constructs full breadcrumb chains.
- **Folder Cycle Guard**: Algorithmic cycle check prevents setting a folder's child or descendent as its parent.

### ⚡ Cloud File Management & Storage
- **100MB File Uploads**: Upload images, videos, audio, PDFs, archives, and code files with real-time percentage progress bar (`Axios onUploadProgress`).
- **Whole-Page Drag & Drop Overlay**: Counter-tracked drag listener detects when files enter the window and opens a glowing illuminated dropzone overlay.
- **Physical Metallic Vault Switch**: Toggle file security between `PRIVATE` and `PUBLIC` with an animated metallic brass latch (`VaultToggle.jsx`).
- **Multi-Category Storage Breakdown**: Live color-coded storage distribution bar in the sidebar tracking Images, Video & Audio, Docs & PDFs, and Archives & Code.
- **Global Live Search Input**: Real-time search bar in the topbar (`SearchContext.jsx`) filtering files and directories instantly across all pages.

### 🔗 Granular Share Management
- **Public Share Links**: Generate and revoke 64-character hex share tokens (`/share/:shareToken`).
- **User-to-User Sharing**: Grant access to specific registered users by email or username with composite unique constraint guards (`fileId_userId`).
- **Public Share Access Page**: Dedicated public access page (`/share/:shareToken`) allowing unauthenticated visitors to view and download shared files.

### 👁️ React Portal Inline Media Preview & Custom Modals
- **React Portal Overlay**: Rendered directly in `document.body` via `createPortal` for perfect centering and screen overlay (`z-[99999]`).
- **Keyboard `Esc` Shortcut**: Instant keyboard dismissal from anywhere on the page.
- **Custom Hazard Confirmation Modal**: `DeleteConfirmModal.jsx` replaces ugly native browser alert popups with a styled dark hazard modal.
- Multi-format preview support:
  - 🖼️ **Images**: Responsive image inspector (`<img />`)
  - 🎥 **Videos**: HTML5 video player (`<video controls />`)
  - 🎵 **Audio**: HTML5 audio player (`<audio controls />`)
  - 📄 **PDFs**: Embedded document inspector (`<iframe />`)
  - 💻 **Code & Text**: Code viewer with 10KB safe streaming (`<pre><code>`)

---

## 🛡️ OWASP Security Compliance Checklist

| OWASP Security Rule | Implementation in VaultDrive |
| :--- | :--- |
| **Authentication & Session** | Dual-Token JWT architecture; refresh tokens stored as bcrypt hashes; `SameSite=Lax` in dev, `SameSite=None; Secure` in production for cross-domain cookie delivery. |
| **Input Sanitization** | `sanitizeFilename()` strips path traversal sequences (`../`, `..\`) and illegal characters (`< > : " / \ \| ? *`). |
| **Payload Validation** | Strict Zod validation schemas on all request bodies, query params, and route params. |
| **Cross-Site Scripting (XSS)** | Text file previews capped at 10KB with standard HTML entity escaping inside `<pre>` containers. |
| **Access Control (IDOR)** | Owner validation checks (`file.userId === req.user.id`) enforced on all mutating routes (`PATCH`, `DELETE`). |
| **Folder Cycle Prevention** | Ancestral traversal algorithm verifies no folder can become a subfolder of its own descendent. |

---

## ⚖️ Architecture Tradeoffs

### File Upload Strategy

We implemented **Multer Memory Buffering (Server Streaming)**:

- **How it works**: Client sends multipart form data to Express server $\rightarrow$ Multer buffers file bytes in RAM $\rightarrow$ Server streams bytes directly to Cloudinary using `cloudinary.uploader.upload_stream`.
- **Why selected**: Extremely clean developer experience, zero setup friction for evaluators, and direct progress tracking via Axios.
- **Known Tradeoff**: Under heavy concurrent load or with multiple simultaneous 100MB uploads, server RAM usage spikes temporarily.

#### Production Scale Alternative (Direct Signed Uploads)
1. **Client Signature Request**: Client requests an upload signature (`POST /api/v1/files/sign`).
2. **Server Validation**: Server validates auth & file size limit $\rightarrow$ returns signed timestamp & signature.
3. **Direct Cloudinary Upload**: Client uploads directly from browser to Cloudinary via 6MB chunked resumable upload (`upload_large`). **Zero file bytes touch the application server.**
4. **Metadata Confirmation**: Client calls `POST /api/v1/files/confirm` to save metadata to Neon PostgreSQL.

---

## 🛠️ Technology Stack

### Backend Stack
- **Node.js** & **Express v5**
- **Prisma 7 ORM** + `@prisma/adapter-pg`
- **Neon PostgreSQL** (Cloud Database - Pooled `DATABASE_URL` & Direct `DIRECT_URL`)
- **Cloudinary SDK** (Media Storage)
- **JSONWebToken** & **BcryptJS**
- **Zod v3** (Schema Validation)
- **Multer** (Multipart Upload Parser)

### Frontend Stack
- **React 19** + **Vite 8**
- **React Router DOM v7**
- **Axios** (API Client)
- **Tailwind CSS v4**
- **Google Fonts** (Inter & JetBrains Mono)

---

## 🚀 Local Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- Cloudinary Account (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
- PostgreSQL Database URL (Pooled `DATABASE_URL` and Direct `DIRECT_URL` for Neon)

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/SahilSameer18/vaultDrive.git
cd vaultDrive

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables Configuration

Create a `.env` file in `server/`:
```env
PORT=3000
NODE_ENV=development

# Database Connections (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@ep-cool-name-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require"

# JWT Secrets (Dual-Token Rotation)
ACCESS_TOKEN_SECRET="your-super-secret-access-token-key-min-32-chars"
REFRESH_TOKEN_SECRET="your-super-secret-refresh-token-key-min-32-chars"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

CLIENT_URL="http://localhost:5173"
```

Create a `.env` file in `client/`:
```env
VITE_API_URL="http://localhost:3000/api/v1"
```

### 3. Database Migration & Prisma Setup
```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run Development Servers

In Terminal 1 (Server):
```bash
cd server
npm run dev
```

In Terminal 2 (Client):
```bash
cd client
npm run dev
```

Access the application at `http://localhost:5173`.

---

## 🛠️ API Reference Table

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register new account & set HTTP-only refresh cookie |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & issue dual tokens |
| `POST` | `/api/v1/auth/refresh` | Public | Rotate refresh token & issue new access token |
| `POST` | `/api/v1/auth/logout` | Protected | Clear authentication cookies & revoke refresh token |
| `GET` | `/api/v1/auth/me` | Protected | Fetch current authenticated user identity |
| `GET` | `/api/v1/folders` | Protected | List root or nested folders (`?parentId=root`) |
| `POST` | `/api/v1/folders` | Protected | Create new folder/subfolder |
| `PATCH` | `/api/v1/folders/:id` | Protected | Rename folder (`{ name }`) |
| `DELETE` | `/api/v1/folders/:id` | Protected | Safe folder deletion (moves child files to root) |
| `GET` | `/api/v1/files` | Protected | List files (`?folderId=root` for root files) |
| `POST` | `/api/v1/files/upload` | Protected | Upload file (multipart/form-data) |
| `DELETE` | `/api/v1/files/:id` | Protected | Delete file permanently from Cloudinary & DB |
| `POST` | `/api/v1/files/:id/share-link` | Protected | Generate 64-char public share token |
| `DELETE` | `/api/v1/files/:id/share-link` | Protected | Revoke public share token |
| `POST` | `/api/v1/files/:id/share-user` | Protected | Share file with user (`{ targetIdentifier }`) |
| `GET` | `/api/v1/files/shared-with-me` | Protected | List files shared directly with user |
| `GET` | `/api/v1/files/share/:shareToken` | Public | Access public file details via token |

---

## 📜 License & Copyright

Designed and engineered by **Sahil Sameer** ([@SahilSameer18](https://github.com/SahilSameer18)).



