import { api } from "./api";

export const userApi = {
  getDashboard: () => api.get("/user/dashboard"),
  getTasks: (params) => api.get("/user/tasks", { params }),
  getTaskById: (taskId) => api.get(`/user/tasks/${taskId}`),
  startTask: (taskId) => api.post(`/user/tasks/${taskId}/start`),
  completeTask: (taskId, formData) => api.post(`/user/tasks/${taskId}/complete`, formData),
  getHistory: () => api.get("/user/history"),
  getWallet: () => api.get("/user/wallet"),
  createWithdrawal: (formData) => api.post("/user/withdrawals", formData),
  updateProfile: (payload) => api.patch("/user/profile", payload),
  getSettings: () => api.get("/user/settings"),
  updateSettings: (payload) => api.patch("/user/settings", payload),
  getReferralStats: () => api.get("/referral/stats"),
  changePassword: (payload) => api.post("/auth/change-password", payload),
};
