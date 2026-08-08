import api from "./axios";

export const foldersApi = {
  create: (data) => api.post("/folders", data),
  list: () => api.get("/folders"),
  getById: (id) => api.get(`/folders/${id}`),
  update: (id, data) => api.patch(`/folders/${id}`, data),
  delete: (id) => api.delete(`/folders/${id}`),
};
