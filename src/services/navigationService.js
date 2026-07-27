import { apiRequest } from "./apiClient";

export async function fetchNavigationRooms() {
  const result = await apiRequest("/navigation/rooms?limit=1000&offset=0");
  return {
    rooms: Array.isArray(result?.data) ? result.data : [],
    meta: result?.meta || { total: 0, limit: 1000, offset: 0 },
  };
}

export async function fetchNavigationGraphs() {
  const result = await apiRequest("/navigation/graphs");
  return Array.isArray(result?.data) ? result.data : [];
}

export async function updateNavigationRoom(roomId, payload) {
  const result = await apiRequest(
    `/navigation/rooms/${encodeURIComponent(roomId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return result?.data || null;
}
