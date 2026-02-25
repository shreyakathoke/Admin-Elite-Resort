import axios from "axios";

const RAW_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://resort-production.up.railway.app";

const BASE = RAW_BASE.replace(/\/+$/, "");

const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_auth");
      localStorage.removeItem("admin_email");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;