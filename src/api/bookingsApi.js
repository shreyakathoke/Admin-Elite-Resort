import api from "./api";

/**
 * 8.6 Get All Bookings (Admin)
 * GET /api/admin/rooms/bookings
 */
export async function adminGetAllBookings() {
  const res = await api.get("/api/admin/rooms/bookings");
  return res.data;
}