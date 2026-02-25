import api from "./api";

/**
 * Admin Rooms API
 * Backend routes:
 * POST   /api/admin/rooms
 * GET    /api/admin/rooms
 * GET    /api/admin/rooms/:id
 * PUT    /api/admin/rooms/:id
 * DELETE /api/admin/rooms/:id
 */

// ✅ Create Room
export async function createRoom(payload) {
  const res = await api.post("/api/admin/rooms", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

// ✅ Update Room
export async function updateRoom(roomId, payload) {
  const res = await api.put(`/api/admin/rooms/${roomId}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

// ✅ Delete Room
export async function deleteRoom(roomId) {
  const res = await api.delete(`/api/admin/rooms/${roomId}`);
  return res.data;
}

// ✅ Get All Rooms
export async function adminGetAllRooms() {
  const res = await api.get("/api/admin/rooms");
  return res.data;
}

// ✅ Get Room by ID
export async function getRoomById(roomId) {
  const res = await api.get(`/api/admin/rooms/${roomId}`);
  return res.data;
}

/**
 * ✅ Optional: Keep your previous admin* exports also (safe)
 * If somewhere else you already used adminAddRoom/adminUpdateRoom etc.
 */

export const adminAddRoom = createRoom;
export const adminUpdateRoom = updateRoom;
export const adminDeleteRoom = deleteRoom;
export const adminGetRoomById = getRoomById;