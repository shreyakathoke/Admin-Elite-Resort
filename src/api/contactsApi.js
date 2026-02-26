import api from "./api";

// ✅ GET all contacts for an admin
export async function adminFetchContacts(adminId) {
  const res = await api.get(`/api/contact/admin/all`);
  return res.data; // can be {contacts:[...]} or [...]
}

// ✅ DELETE a contact (only if your backend has this route)
export async function adminDeleteContact(contactId) {
  const res = await api.delete(`/api/contact/${contactId}`);
  return res.data;
}