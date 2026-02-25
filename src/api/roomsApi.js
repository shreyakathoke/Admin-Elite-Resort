import api from "./api";

// Build FormData for create/update (supports image upload)
function buildRoomFormData(payload) {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    fd.append(k, v);
  });
  return fd;
}

export async function createRoom({ roomNumber, type, pricePerNight, capacity, available, description, image }) {
  const fd = buildRoomFormData({
    roomNumber,
    type,
    pricePerNight: String(pricePerNight),
    capacity: String(capacity),
    available: String(available),
    description,
    image, // file
  });

  const res = await api.post("/api/admin/rooms", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateRoom(id, { roomNumber, type, pricePerNight, capacity, available, description, image }) {
  const fd = buildRoomFormData({
    roomNumber,
    type,
    pricePerNight: String(pricePerNight),
    capacity: String(capacity),
    available: String(available),
    description,
    image, // optional
  });

  const res = await api.put(`/api/admin/rooms/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function getRoomById(id) {
  const res = await api.get(`/api/admin/rooms/${id}`);
  return res.data;
}

export async function deleteRoom(id) {
  const res = await api.delete(`/api/admin/rooms/${id}`);
  return res.data;
}