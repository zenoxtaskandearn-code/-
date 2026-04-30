import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("zenox_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const saveAuth = ({ token, user }) => {
  if (token) localStorage.setItem("zenox_access_token", token);
  if (user) localStorage.setItem("zenox_user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("zenox_access_token");
  localStorage.removeItem("zenox_user");
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("zenox_user");
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
};

export const getStoredToken = () => localStorage.getItem("zenox_access_token");
