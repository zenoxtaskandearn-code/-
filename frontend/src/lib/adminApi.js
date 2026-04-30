import { api } from "./api";

export const adminApi = {
  getDashboard: () => api.get("/admin/dashboard"),
  getWithdrawals: (params) => api.get("/admin/withdrawals", { params }),
  updateWithdrawal: (id, payload) => api.patch(`/admin/withdrawals/${id}`, payload),
  getUsers: () => api.get("/admin/users"),
  updateUserStatus: (id, payload) => api.patch(`/admin/users/${id}/status`, payload),
  getTasks: () => api.get("/admin/tasks"),
  createTask: (payload) => api.post("/admin/tasks", payload),
  updateTask: (id, payload) => api.patch(`/admin/tasks/${id}`, payload),
  deleteTask: (id) => api.delete(`/admin/tasks/${id}`),
  getCompletions: (params) => api.get("/admin/completions", { params }),
  reviewCompletion: (id, payload) => api.patch(`/admin/completions/${id}`, payload),
};
