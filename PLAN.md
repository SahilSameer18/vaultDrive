# VaultDrive – Secure File Storage Service: Implementation Plan

## Overview

Build a **secure, production-quality file storage web app** (PERN stack) where authenticated users can upload, manage, and share files. Files up to **100MB** are stored on **Cloudinary** under an isolated `vaultDrive/<userId>/` folder. The app uses **PostgreSQL on Neon** via **Prisma ORM**, a **React + Vite** frontend with **TailwindCSS 4**, and an **Express.js** REST API backend.

---

## Design Decisions (Confirmed)

| Decision | Choice |
|----------|--------|
| File storage | **Cloudinary** – scoped to `vaultDrive/<userId>/` folder |
| Auth strategy | **JWT with refresh token rotation** in httpOnly cookies |
| Share links | **Active until manually revoked** by the owner |
| File types | **All file types allowed** (100MB max) |
| Email verification | **No** – register and log in immediately |
| Sharing | **Both** – public share link + share with specific registered users |
| Upload strategy | **Option 1** – Multer memory storage → server streams to Cloudinary |

---

## Cloudinary Isolation Strategy

All uploads will be scoped to a dedicated folder path per project, per user, and per file ID to avoid collisions:

```
cloudinary-account/
├── other-project-one/     ← untouched
├── other-project-two/     ← untouched
└── vaultDrive/            ← this project only
    ├── <userId-1>/
    │   ├── <fileId>-resume.pdf
    │   └── <fileId>-photo.jpg
    └── <userId-2>/
        └── <fileId>-video.mp4
```

The `public_id` will be `vaultDrive/<userId>/<fileId>-<originalFilename>`. Using the `fileId` prefix prevents two uploads with the same filename from overwriting each other. Deletion targets only this exact path.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + TailwindCSS 4 |
| Backend | Node.js + Express.js (ES Modules) |
| Database | PostgreSQL on Neon via Prisma ORM |
| File Storage | Cloudinary (`vaultDrive/<userId>/` scoped) |
| Auth | JWT access token (15min) + refresh token rotation (7d) in httpOnly cookies |
| Password | bcryptjs |
| Validation | Zod |
| File Upload | Multer (memory) → stream to Cloudinary |
| Routing (client) | react-router-dom |
| HTTP client | Axios with interceptors |

---

## Database Schema (Prisma Models)

### `User`
```prisma
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  username      String         @unique
  passwordHash  String
  avatarUrl     String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  files         File[]
  folders       Folder[]
  sharedWithMe  SharedFile[]
  refreshTokens RefreshToken[]
}
```

### `File`
```prisma
model File {
  id          String       @id @default(cuid())
  name        String
  size        Int
  mimeType    String
  url         String       // Cloudinary secure URL
  publicId    String       // Cloudinary public_id — vaultDrive/<userId>/<fileId>-<filename>
  isPublic    Boolean      @default(false)
  shareToken  String?      @unique  // random hex token — active until owner revokes
  folderId    String?
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  folder      Folder?      @relation(fields: [folderId], references: [id], onDelete: SetNull)  // SetNull so deleting a folder moves files to root
  sharedWith  SharedFile[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@index([userId])        // fast queries by owner
  @@index([folderId])      // fast queries by folder
}
```

### `Folder`
```prisma
model Folder {
  id        String   @id @default(cuid())
  name      String
  userId    String
  parentId  String?
  parent    Folder?  @relation("FolderTree", fields: [parentId], references: [id])
  children  Folder[] @relation("FolderTree")
  files     File[]
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])    // fast queries by owner
  @@index([parentId])  // fast tree traversal
}
```

### `SharedFile` (user-to-user sharing)
```prisma
model SharedFile {
  id        String   @id @default(cuid())
  fileId    String
  userId    String   // user it is shared WITH
  file      File     @relation(fields: [fileId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@unique([fileId, userId])  // prevents duplicate shares; composite index (fileId, userId)
  @@index([userId])           // needed for GET /files/shared-with-me — filter by userId alone
}
```

### `RefreshToken` (rotation-based, hashed storage)
```prisma
model RefreshToken {
  id          String   @id @default(cuid())
  tokenHash   String   @unique  // bcrypt hash of the actual token — never store plain text
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt   DateTime
  createdAt   DateTime @default(now())
}
```

> **Security note**: The raw refresh token is sent to the client in a httpOnly cookie. Only its bcrypt hash is stored in the DB. On `/refresh`, we verify the incoming token against the stored hash. If the DB leaks, no sessions are compromised.

---

## Proposed Changes

---

### Phase 1 – Database

#### [MODIFY] [schema.prisma](file:///c:/Users/HP/Desktop/vaultDrive/server/prisma/schema.prisma)
- Add all 5 models above
- Add `url` and `directUrl` to `datasource db`

Then run:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

vaultDrive/
├── REQUIREMENT.md
├── PLAN.md
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js
│   │   │   └── multer.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── file.controller.js
│   │   │   └── folder.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── rateLimit.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── file.routes.js
│   │   │   └── folder.routes.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── jwt.js
│   │   │   └── cloudinary.upload.js
│   │   ├── lib/
│   │   │   └── prisma.js
│   │   └── app.js
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
└── client/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── lib/
    │   │   └── api.js
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   └── SharePage.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── FileCard.jsx
    │   │   ├── FolderSidebar.jsx
    │   │   ├── UploadModal.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json


### Phase 2 – Server Infrastructure

#### [NEW] `server/src/config/cloudinary.js`
- Initialize Cloudinary SDK with env vars (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
- Export configured client

#### [NEW] `server/src/config/multer.js`
- Memory storage, 100MB file size limit, all file types allowed

#### [NEW] `server/src/utils/ApiResponse.js`
- Standardized `{ success: true, message, data }` response class

#### [NEW] `server/src/utils/ApiError.js`
- Custom error class with status code and `{ success: false, message, errors }` shape

#### [NEW] `server/src/utils/jwt.js`
- `generateAccessToken(userId)` → 15 min
- `generateRefreshToken(userId)` → 7 days
- `verifyAccessToken(token)`, `verifyRefreshToken(token)`

#### [NEW] `server/src/middlewares/auth.middleware.js`
- Read `accessToken` from cookie or `Authorization: Bearer` header
- Attach `req.user` to request
- Return `401` if invalid/expired

#### [NEW] `server/src/middlewares/error.middleware.js`
- Global Express error handler — always returns `{ success: false, message, errors }`

#### [NEW] `server/src/middlewares/rateLimit.middleware.js`
- Dedicated rate limiting module exporting `generalLimiter` (100 req/15m) and `authLimiter` (5 req/15m)

#### [NEW] `server/src/middlewares/validate.middleware.js`
- Zod schema validation middleware factory

#### [MODIFY] `server/src/app.js`
- Add: `helmet`, `cookie-parser`
- Configure CORS explicitly with `credentials: true` and whitelist `CLIENT_URL` — required for httpOnly cookie sharing in cross-origin dev setup
- Apply `generalLimiter` globally from `./middlewares/rateLimit.middleware.js`
- Mount all routes under `/api/v1`
- Register global error handler at the bottom

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,  // allows cookies to be sent cross-origin
}));

// General limiter
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(generalLimiter);

// Auth limiter — applied directly on auth router
export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
```

---

### Phase 3 – Auth API

**Endpoint design:**
```
POST /api/v1/auth/register    → create user, issue tokens        [authLimiter: 5/15min]
POST /api/v1/auth/login       → verify creds, issue tokens       [authLimiter: 5/15min]
POST /api/v1/auth/refresh     → rotate refresh token, issue new access token
POST /api/v1/auth/logout      → delete refresh token from DB, clear cookies
GET  /api/v1/auth/me          → return current user (no password)
```

**Refresh Token Rotation flow (with hashing):**
1. On login/register → generate raw token → hash it with bcrypt → save hash in DB → send raw token in httpOnly cookie
2. On `/refresh` → read raw token from cookie → bcrypt.compare against stored hash → **delete old hash** → issue new pair → save new hash
3. On `/logout` → find & delete token hash from DB → clear both cookies

#### [NEW] `server/src/controllers/auth.controller.js`
#### [NEW] `server/src/routes/auth.routes.js`

---

### Phase 4 – File API

**Endpoint design:**
```
POST   /api/v1/files/upload          → multipart, stream to Cloudinary, save metadata
GET    /api/v1/files                 → list own files (pagination, sort, filter by folder/type)
GET    /api/v1/files/:id             → access if: isPublic OR owner OR in SharedFile table
PATCH  /api/v1/files/:id             → rename, toggle public/private, move folder (owner only)
DELETE /api/v1/files/:id             → delete from Cloudinary + DB (owner only)
POST   /api/v1/files/:id/share-link  → generate shareToken (crypto.randomBytes hex), returns URL
DELETE /api/v1/files/:id/share-link  → revoke shareToken (set to null)
POST   /api/v1/files/:id/share-user  → share with a specific user by email/username
DELETE /api/v1/files/:id/share-user/:userId → unshare from a specific user
GET    /api/v1/files/shared-with-me  → list files shared with the current user
GET    /api/v1/share/:shareToken     → PUBLIC – access file by share token (no auth)
```

> **Authorization rule for `GET /files/:id`**: `isPublic === true` OR `file.userId === req.user.id` OR `SharedFile record exists for (fileId, req.user.id)`. Return `403` otherwise.

#### [NEW] `server/src/controllers/file.controller.js`
#### [NEW] `server/src/routes/file.routes.js`
#### [NEW] `server/src/utils/cloudinary.upload.js`
- `sanitizeFilename(filename)` — strips everything except alphanumerics, dots, and hyphens before using in the Cloudinary path:
  ```javascript
  // "my file/../evil.jpg" → "my-file----evil.jpg" → safe path component
  filename.replace(/[^a-zA-Z0-9.\-]/g, '-')
  ```
- `uploadToCloudinary(buffer, mimetype, userId, fileId, originalFilename)`:
  - Sanitizes filename: `sanitizeFilename(originalFilename)` → used only in `public_id`
  - Path: `vaultDrive/<userId>/<fileId>-<sanitizedFilename>`
  - The **raw `originalFilename`** is stored in the DB `name` field for display — never used in the path
  - Returns `{ url, publicId }`
- `deleteFromCloudinary(publicId)`

---

### Phase 5 – Folder API

```
POST   /api/v1/folders              → create folder
GET    /api/v1/folders              → list all folders for user (tree structure)
PATCH  /api/v1/folders/:id         → rename or move folder (with cycle guard)
DELETE /api/v1/folders/:id         → delete folder (see rules below)
```

> **Folder deletion rules**:
> - If folder has **subfolders** → return `400 Bad Request` with message `"Folder is not empty — delete or move subfolders first"`. This is a deliberate decision (not a raw Prisma Restrict error leaking to the client).
> - If folder has **files only** → files have `onDelete: SetNull` on the relation, so Prisma automatically sets their `folderId` to `null` (moves to root) on folder deletion.
>
> **Folder cycle guard**: Before moving a folder to a new parent, walk up the ancestor chain of the target parent. If the folder being moved appears in that chain, reject with `400 Bad Request — circular folder structure`.

#### [NEW] `server/src/controllers/folder.controller.js`
#### [NEW] `server/src/routes/folder.routes.js`

---

### Phase 6 – Frontend Auth

#### [NEW] `client/src/context/AuthContext.jsx`
- `user`, `isLoading` state
- `login()`, `register()`, `logout()` functions
- `useEffect` to call `/auth/me` on mount for session restore

#### [NEW] `client/src/lib/api.js`
- Axios instance pointed at backend
- Response interceptor: on 401 → call `/auth/refresh` → retry original request

#### [MODIFY] `client/src/main.jsx`
- Wrap in `<BrowserRouter>` and `<AuthProvider>`

#### [MODIFY] `client/src/App.jsx`
- Define routes: `/`, `/login`, `/register`, `/dashboard`, `/dashboard/folder/:id`, `/share/:shareToken`
- `<ProtectedRoute>` wrapper → redirects to `/login` if not authed

#### [NEW] `client/src/pages/LandingPage.jsx`
#### [NEW] `client/src/pages/LoginPage.jsx`
#### [NEW] `client/src/pages/RegisterPage.jsx`

---

### Phase 7 – Frontend Dashboard

#### [NEW] `client/src/pages/DashboardPage.jsx`
- File grid + list toggle view
- Folder sidebar navigation
- Upload button → opens `UploadModal`
- Search bar (filter by filename)
- Sort: name, date, size

#### [NEW] `client/src/components/FileCard.jsx`
- File icon/thumbnail by type, filename, size, date
- Badge: Public / Private
- Actions: rename, move, toggle visibility, copy share link, share with user, delete

#### [NEW] `client/src/components/UploadModal.jsx`
- Drag-and-drop zone (react-dropzone)
- Per-file progress bars (Axios `onUploadProgress`)
- Queued uploads list

#### [NEW] `client/src/components/FolderSidebar.jsx`
- Nested folder tree
- Create / rename / delete folder

#### [NEW] `client/src/components/Navbar.jsx`
- Logo, username, avatar, logout button

#### [NEW] `client/src/pages/SharePage.jsx`
- Public route `/share/:shareToken`
- Previews: images, videos, PDFs inline
- Download button for all other types

---

## Package Additions Needed

### Server
```bash
npm i bcryptjs jsonwebtoken cookie-parser helmet express-rate-limit zod cloudinary
```

### Client
```bash
npm i react-router-dom axios react-dropzone
```

---

## Verification Plan

### Automated (manual Postman/curl)
- Register → tokens in cookies ✅
- Login → tokens rotated ✅
- Token refresh → old token invalidated ✅
- Upload 5MB file → appears in Cloudinary under `vaultDrive/<userId>/` ✅
- Toggle file public → accessible via share link without auth ✅
- Revoke share link → link returns 404 ✅
- Share with specific user → appears in their "Shared with me" ✅
- Delete file → removed from Cloudinary and DB ✅

### Frontend
- Full auth flow: register → login → dashboard → upload → share → logout
- Drag-and-drop with live progress bars
- Responsive on mobile / tablet / desktop

---

## Implementation Order

| Phase | What | Est. Files |
|-------|------|-----------|
| **1** | Prisma schema + migrate + generate ✅ | 1 |
| **2** | Server utils, config, middleware infrastructure ✅ | 9 |
| **3** | Auth API (register, login, refresh, logout, me) | ~2 |
| **4** | File upload + management API | ~3 |
| **5** | Folder API | ~2 |
| **6** | Client: Auth context, Axios, routing, Login/Register pages | ~6 |
| **7** | Client: Dashboard, FileCard, UploadModal, FolderSidebar, SharePage | ~7 |
| **8** | Polish + README tradeoffs | – |

---

## Architecture Tradeoffs (to document in README)

### File Upload Strategy

We use **Option 1: Multer memory storage → server streams to Cloudinary**.

This keeps the implementation simple, the code readable, and is sufficient for this assignment at the graded scale.

**Known tradeoff**: For files approaching 100MB, the entire file is held in server RAM during the upload. Under concurrent heavy load this creates memory pressure and could cause the server to crash.

**Production alternative (Option 3 – Direct signed upload)**:
- Client requests a signed upload signature from the server (`POST /files/sign`)
- Server validates auth + params, returns `{ signature, timestamp, folder, api_key }` — **no file bytes touch the server**
- Client uploads directly to Cloudinary using chunked upload (6MB chunks via `upload_large`)
- Cloudinary returns `{ secure_url, public_id }` to client
- Client calls `POST /files/confirm` — server saves metadata to DB

This approach is infinitely scalable, provides real upload progress tracking, and handles flaky connections via resumable chunked uploads. It is what production apps use.


