import api from "./axios";

export const foldersApi = {
  create: (data) => api.post("/folders", data), // data is { name, parentId }
  list: (parentId = null) =>
    api.get("/folders", { params: parentId ? { parentId } : {} }),
  getById: (id) => api.get(`/folders/${id}`),
  update: (id, data) => api.patch(`/folders/${id}`, data),
  delete: (id) => api.delete(`/folders/${id}`),
};
