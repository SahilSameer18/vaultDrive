import axios from "axios";
import api from "./axios";

export const filesApi = {
  // Request HMAC signature for Cloudinary direct upload
  getSignUpload: (data) => api.post("/files/sign-upload", data),

  // Confirm completed Cloudinary upload and save record to DB
  confirmUpload: (data) => api.post("/files/confirm-upload", data),

  // Perform direct Cloudinary upload (single for <10MB, chunked for ≥10MB)
  uploadDirectToCloudinary: async (file, folderId = null, onUploadProgress = null, signal = null) => {
    // 1. Get presigned HMAC upload parameters from backend
    const signRes = await api.post("/files/sign-upload", {
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      folderId: folderId || null,
    }, { signal });

    const { signature, timestamp, apiKey, cloudName, folder, publicId } =
      signRes.data.data;

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks
    let cloudinaryData = null;

    if (file.size < 10 * 1024 * 1024) {
      // ── Single Direct Signed Upload (<10MB) ──────────────────────────────────
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);
      formData.append("public_id", publicId);

      const res = await axios.post(uploadUrl, formData, {
        signal,
        onUploadProgress: (e) => {
          if (onUploadProgress && e.total) {
            const percent = Math.round((e.loaded * 100) / e.total);
            onUploadProgress({ loaded: e.loaded, total: e.total, percent });
          }
        },
      });
      cloudinaryData = res.data;
    } else {
      // ── Chunked Direct Signed Upload (≥10MB) ─────────────────────────────────
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const uniqueUploadId = `uq_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      let uploadedBytes = 0;

      for (let i = 0; i < totalChunks; i++) {
        if (signal?.aborted) throw new Error("Upload aborted");

        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder);
        formData.append("public_id", publicId);

        let chunkRes = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
          try {
            chunkRes = await axios.post(uploadUrl, formData, {
              signal,
              headers: {
                "X-Unique-Upload-Id": uniqueUploadId,
                "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
              },
              onUploadProgress: (e) => {
                if (onUploadProgress) {
                  const currentLoaded = Math.min(uploadedBytes + e.loaded, file.size);
                  const percent = Math.round((currentLoaded * 100) / file.size);
                  onUploadProgress({ loaded: currentLoaded, total: file.size, percent });
                }
              },
            });
            break; // Success! Exit retry loop
          } catch (err) {
            if (signal?.aborted) throw err;
            attempts++;
            if (attempts >= maxAttempts) throw err;
            // Exponential backoff delay (1s, 2s) before retrying same chunk
            await new Promise((res) => setTimeout(res, attempts * 1000));
          }
        }

        uploadedBytes += end - start;
        if (i === totalChunks - 1) {
          cloudinaryData = chunkRes.data;
        }
      }
    }

    // 2. Confirm upload with backend metadata store
    const confirmRes = await filesApi.confirmUpload({
      name: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      resourceType: cloudinaryData.resource_type || "image",
      url: cloudinaryData.secure_url,
      publicId: cloudinaryData.public_id,
      folderId: folderId || null,
    });

    return confirmRes;
  },

  list: (folderId = "root", extraParams = {}) => {
    const params = { ...extraParams };
    if (folderId) params.folderId = folderId;
    return api.get("/files", { params });
  },

  getById: (id) => api.get(`/files/${id}`),
  update: (id, data) => api.patch(`/files/${id}`, data),
  delete: (id) => api.delete(`/files/${id}`),

  // Sharing — links
  generateShareLink: (id) => api.post(`/files/${id}/share-link`),
  revokeShareLink: (id) => api.delete(`/files/${id}/share-link`),

  // Sharing — user-to-user
  getSharedUsers: (id) => api.get(`/files/${id}/share-user`),
  shareWithUser: (id, data) => api.post(`/files/${id}/share-user`, data),
  unshareWithUser: (id, targetUserId) =>
    api.delete(`/files/${id}/share-user/${targetUserId}`),

  // Storage stats (aggregated lightweight quota)
  getStorageStats: () => api.get("/files/storage-stats"),

  // Views
  getSharedWithMe: () => api.get("/files/shared-with-me"),
  getSharedByMe: () => api.get("/files/shared-by-me"),
  getByShareToken: (shareToken) => api.get(`/files/share/${shareToken}`),
};

