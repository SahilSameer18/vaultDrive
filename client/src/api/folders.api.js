import api from "./axios";

export const foldersApi = {
  create: (data) => api.post("/folders", data), // data is { name, parentId }
  list: (parentId = null) => {
    const params = {};
    if (parentId) params.parentId = parentId;
    return api.get("/folders", { params });
  },
  getById: (id) => api.get(`/folders/${id}`),
  update: (id, data) => api.patch(`/folders/${id}`, data),
  delete: (id) => api.delete(`/folders/${id}`),
};
