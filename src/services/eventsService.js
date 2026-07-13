import { apiRequest } from "./apiClient";

function toUiEvent(event) {
  const date = event.event_date ? new Date(event.event_date) : null;
  const validDate = date && !Number.isNaN(date.getTime()) ? date : null;
  const dateText = validDate ? validDate.toISOString().slice(0, 10) : "-";
  const timeText = validDate ? validDate.toISOString().slice(11, 16) : "-";

  return {
    id: event.id,
    title: event.title,
    schedule: `${dateText} at ${timeText}`,
    location: event.location_node_id || event.campus_id || "Campus",
    capacity: null,
    registeredLabel: null,
    type: event.host_type || "Event",
    date: dateText,
    time: timeText,
    eventFee: "No fee",
    details: "",
    coverImage: null,
    participants: [],
    isApproved: Boolean(event.is_approved),
    raw: event,
  };
}

export async function fetchEvents() {
  const result = await apiRequest("/events?limit=100&offset=0");
  const events = Array.isArray(result?.data) ? result.data : [];
  return events.map(toUiEvent);
}

export async function fetchCampuses() {
  const result = await apiRequest("/campuses");
  const campuses = Array.isArray(result?.data) ? result.data : [];
  return campuses;
}

export async function createEvent(payload) {
  const created = await apiRequest("/events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return toUiEvent(created);
}

export async function updateEvent(id, payload) {
  const updated = await apiRequest(`/events/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return toUiEvent(updated);
}
