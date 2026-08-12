import api from "./axios";

export const filesApi = {
  upload: (formData, onUploadProgress) =>
    api.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    }),
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
  shareWithUser: (id, data) => api.post(`/files/${id}/share-user`, data),
  unshareWithUser: (id, targetUserId) =>
    api.delete(`/files/${id}/share-user/${targetUserId}`),

  // Views
  getSharedWithMe: () => api.get("/files/shared-with-me"),
  getByShareToken: (shareToken) => api.get(`/files/share/${shareToken}`),
};
