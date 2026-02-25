import api from "./api";

// 8.1 Add Room
export async function adminAddRoom(payload) {
  // payload = { roomNumber, type, pricePerNight, capacity, available }
  const res = await api.post("/api/admin/rooms", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

// 8.2 Update Room
export async function adminUpdateRoom(roomId, payload) {
  const res = await api.put(`/api/admin/rooms/${roomId}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

// 8.3 Delete Room
export async function adminDeleteRoom(roomId) {
  const res = await api.delete(`/api/admin/rooms/${roomId}`);
  return res.data;
}

// 8.4 Get All Rooms (Admin)
export async function adminGetAllRooms() {
  const res = await api.get("/api/admin/rooms");
  return res.data;
}

// 8.5 Get Room by ID (Admin)
export async function adminGetRoomById(roomId) {
  const res = await api.get(`/api/admin/rooms/${roomId}`);
  return res.data;
}