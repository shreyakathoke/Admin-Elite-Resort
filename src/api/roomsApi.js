import api from "./api";

/**
 * Admin Rooms API (based on your Spring controller)
 * POST   /api/admin/rooms
 * PUT    /api/admin/rooms/{id}
 * DELETE /api/admin/rooms/{id}
 * GET    /api/admin/rooms/getallRooms   ✅ (your controller)
 * GET    /api/admin/rooms/{id}
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

// ✅ Get All Rooms (Spring controller uses /getallRooms)
export async function getAdminRooms() {
  const res = await api.get("/api/admin/rooms/getallRooms");
  return res.data;
}

// ✅ Get Room by ID
export async function getRoomById(roomId) {
  const res = await api.get(`/api/admin/rooms/${roomId}`);
  return res.data;
}

/* -------------------------------------------------------
 ✅ Aliases (so any component name will work)
-------------------------------------------------------- */

export const adminAddRoom = createRoom;
export const adminUpdateRoom = updateRoom;
export const adminDeleteRoom = deleteRoom;
export const adminGetRoomById = getRoomById;

// Many files use this name
export const adminGetAllRooms = getAdminRooms;

// For your Rooms.jsx imports
export const deleteAdminRoom = deleteRoom;