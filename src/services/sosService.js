import { apiRequest } from "./apiClient";

export function mapSosToUi(event) {
  return {
    id: event.sos_event_id,
    time: event.created_at
      ? new Date(event.created_at).toISOString().slice(0, 16).replace("T", " ")
      : "-",
    status: event.status || "unknown",
  };
}

export async function fetchSosEvents() {
  const result = await apiRequest("/sos?limit=100&offset=0");
  const rows = Array.isArray(result?.data) ? result.data : [];
  return rows.map(mapSosToUi);
}
