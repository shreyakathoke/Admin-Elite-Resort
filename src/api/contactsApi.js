import api from "./api";

// ✅ GET all contacts (admin)
export async function adminFetchContacts() {
  const res = await api.get("/api/contact/admin/all");
  return res.data; // { contacts: [...] }
}

// ✅ DELETE a contact
export async function adminDeleteContact(contactId) {
  return api.delete(`/api/contact/admin/${contactId}`);
}