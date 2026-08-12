import api from "./axios";

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  googleLogin: (idToken) => api.post("/auth/google", { idToken }),
  demoLogin: () => api.post("/auth/demo-login"),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  refresh: () => api.post("/auth/refresh"),
};
