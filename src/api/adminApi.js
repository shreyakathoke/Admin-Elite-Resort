import api from "./api";

export const adminGetRooms = async () => {
  const res = await api.get("/api/admin/rooms");
  return res.data;
};

export const adminGetAllProfiles = async () => {
  const res = await api.get("/api/profile/all");
  return res.data;
};