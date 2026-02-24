import api from "./api";

export const adminLogin = async (payload) => {
  // payload = { email, password }
  const res = await api.post("/api/auth/admin/login", payload);
  return res.data; // expected: { token, admin: { email, role } }
};