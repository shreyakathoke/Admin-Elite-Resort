import api from "./api";

// ✅ Admin Login
export async function adminLogin(payload) {
  const res = await api.post("/api/auth/admin/login", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

// // ✅ Admin Logout
// export async function adminLogout() {
//   const res = await api.post("/api/admin/logout");
//   return res.data;
// }

// // ✅ Get Admin Profile / Check Session
// export async function adminMe() {
//   const res = await api.get("/api/admin/me");
//   return res.data;
// }

// // ✅ Dashboard needs rooms list
// export async function adminGetRooms() {
//   const res = await api.get("/api/admin/rooms");
//   return res.data;
// }

// // ✅ Dashboard needs all user profiles
// export async function adminGetAllProfiles() {
//   // IMPORTANT: set this to your real backend route
//   // Common options: "/api/profile/all" OR "/api/admin/users"
//   const res = await api.get("/api/profile/all");
//   return res.data;
// }