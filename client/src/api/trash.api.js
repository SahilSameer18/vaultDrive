import api from "./axios";

export const trashApi = {
  // Fetch top-level trashed items & summary stats
  list: () => api.get("/trash"),

  // Fetch contents of a specific trashed folder (read-only inspection)
  getFolderById: (id) => api.get(`/trash/folder/${id}`),

  // Restore a file or folder from Trash
  restore: (id, type) => api.patch(`/trash/${id}/restore`, { type }),

  // Permanently delete a single item (destroys Cloudinary assets & DB record)
  deletePermanently: (id, type) => api.delete(`/trash/${id}?type=${type}`),

  // Empty entire trash (purges all trashed items and Cloudinary assets)
  emptyTrash: () => api.delete("/trash/empty"),
};



