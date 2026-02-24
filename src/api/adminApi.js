import api from "./api";

export const adminLogin = async (payload) => {
  // baseURL already has /api
  const res = await api.post("/auth/admin/login", payload);
  return res.data;
};