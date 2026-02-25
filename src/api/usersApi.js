import api from "./api";

export async function fetchUsers({ search = "" } = {}) {
  const res = await api.get("/api/admin/users", {
    params: search ? { search } : {},
  });
  return res.data; // expected: { users: [...] } OR [...]
}

export async function deleteUserApi(id) {
  const res = await api.delete(`/api/admin/users/${id}`);
  return res.data;
}