import api from "./api"; // ✅ api.js must be in same folder: src/api/api.js

export async function fetchUsers({ search = "" } = {}) {
  const res = await api.get("/admin/users", {
    params: search ? { search } : {},
  });
  return res.data; // supports {users:[...]} OR [...]
}

export async function deleteUserApi(userId) {
  const res = await api.delete(`/admin/delete/${userId}`);
  return res.data;
}