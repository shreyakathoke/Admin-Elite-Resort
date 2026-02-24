import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://resort-production.up.railway.app",
  // withCredentials: true, // ✅ remove for JWT-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

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