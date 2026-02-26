import api from "./api";

/**
 * Admin Rooms API (Spring controller)
 * POST   /api/admin/rooms
 * PUT    /api/admin/rooms/{id}
 * DELETE /api/admin/rooms/{id}
 * GET    /api/admin/rooms/getallRooms
 * GET    /api/admin/rooms/{id}
 *
 * Image Upload (S3)
 * POST   /api/images/upload
 * Headers: Authorization: Bearer <ADMIN_JWT_TOKEN>
 * Content-Type: multipart/form-data
 * FormData: file=<File>
 * Response: "https://s3.amazonaws.com/bucket/images/filename.jpg"
 */

/* -------------------------------------------------------
 ✅ IMAGE UPLOAD API (S3)
-------------------------------------------------------- */

/**
 * Upload image to S3 via backend
 * @param {File} file
 * @returns {Promise<string>} uploaded image url
 */
export async function uploadImageToS3(file) {
  const fd = new FormData();
  fd.append("file", file); // ✅ must be "file"

  const res = await api.post("/api/images/upload", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Backend returns plain string url OR {url/imageUrl}
  if (typeof res.data === "string") return res.data;
  return res.data?.url || res.data?.imageUrl || res.data?.data?.url;
}

/* -------------------------------------------------------
 ✅ ROOMS CRUD (ADMIN)
-------------------------------------------------------- */

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
 ✅ Aliases (so any component import name will work)
-------------------------------------------------------- */

export const adminAddRoom = createRoom;
export const adminUpdateRoom = updateRoom;
export const adminDeleteRoom = deleteRoom;
export const adminGetRoomById = getRoomById;

// Many files use this name
export const adminGetAllRooms = getAdminRooms;

// For your Rooms.jsx imports
export const deleteAdminRoom = deleteRoom;