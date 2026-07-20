import { apiRequest, API_BASE_URL } from "./apiClient";

function resolveImageUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const origin = API_BASE_URL.replace(/\/api\/v1$/, "");
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${origin}${normalizedPath}`;
}

function toUiEvent(event) {
  const date = event.event_date ? new Date(event.event_date) : null;
  const validDate = date && !Number.isNaN(date.getTime()) ? date : null;
  const dateText = validDate ? validDate.toISOString().slice(0, 10) : "-";
  const timeText = validDate ? validDate.toISOString().slice(11, 16) : "-";

  const registrationStart = event.registration_start_at
    ? new Date(event.registration_start_at)
    : null;
  const registrationEnd = event.registration_end_at
    ? new Date(event.registration_end_at)
    : null;
  const validStart =
    registrationStart && !Number.isNaN(registrationStart.getTime())
      ? registrationStart
      : null;
  const validEnd =
    registrationEnd && !Number.isNaN(registrationEnd.getTime())
      ? registrationEnd
      : null;

  return {
    id: event.id,
    title: event.title,
    schedule: `${dateText} at ${timeText}`,
    location:
      event.location_text ||
      event.location_node?.name ||
      event.location_node_id ||
      event.campus?.name ||
      event.campus_id ||
      "Campus",
    capacity: event.is_unlimited
      ? "Unlimited"
      : event.max_participants
        ? `${event.max_participants} max`
        : null,
    registeredLabel: null,
    type: event.event_type || event.host_type || "Event",
    date: dateText,
    time: timeText,
    eventFee:
      typeof event.fee_cents === "number"
        ? `$${(event.fee_cents / 100).toFixed(2)}`
        : "No fee",
    details: event.description || "",
    coverImage: resolveImageUrl(event.event_image_url),
    registrationStartDate: validStart
      ? validStart.toISOString().slice(0, 10)
      : dateText,
    registrationStartTime: validStart
      ? validStart.toISOString().slice(11, 16)
      : timeText,
    registrationEndDate: validEnd
      ? validEnd.toISOString().slice(0, 10)
      : dateText,
    registrationEndTime: validEnd
      ? validEnd.toISOString().slice(11, 16)
      : timeText,
    url: event.event_url || "",
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
  const hasImage = payload?.eventImage instanceof File;
  const body = hasImage ? new FormData() : JSON.stringify(payload);

  if (hasImage) {
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "eventImage") return;
      if (value === undefined || value === null) return;
      body.append(key, String(value));
    });
    body.append("eventImage", payload.eventImage);
  }

  const created = await apiRequest("/events", {
    method: "POST",
    body,
    isFormData: hasImage,
  });
  return toUiEvent(created);
}

export async function updateEvent(id, payload) {
  const hasImage = payload?.eventImage instanceof File;
  const body = hasImage ? new FormData() : JSON.stringify(payload);

  if (hasImage) {
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "eventImage") return;
      if (value === undefined || value === null) return;
      body.append(key, String(value));
    });
    body.append("eventImage", payload.eventImage);
  }

  const updated = await apiRequest(`/events/${id}`, {
    method: "PATCH",
    body,
    isFormData: hasImage,
  });
  return toUiEvent(updated);
}
