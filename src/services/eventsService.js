import { apiRequest, API_BASE_URL } from "./apiClient";

function resolveImageUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const origin = API_BASE_URL.replace(/\/api\/v1$/, "");
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${origin}${normalizedPath}`;
}

function toLocalDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toLocalTimeInput(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function toUiEvent(event) {
  const date = event.event_date ? new Date(event.event_date) : null;
  const validDate = date && !Number.isNaN(date.getTime()) ? date : null;
  const dateText = validDate ? toLocalDateInput(validDate) : "-";
  const timeText = validDate ? toLocalTimeInput(validDate) : "-";

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

  const participants = Array.isArray(event.participants)
    ? event.participants.map((participant) => ({
        id:
          (participant.event_id || participant.eventId) &&
          (participant.device_id || participant.deviceId)
            ? `${participant.event_id || participant.eventId}:${participant.device_id || participant.deviceId}`
            : participant.device_id || participant.deviceId,
        deviceId: participant.device_id || participant.deviceId || "",
        name:
          participant.name ||
          participant.device_id ||
          participant.deviceId ||
          "Guest",
        email: participant.email || "",
        joinedAt: participant.joined_at || participant.joinedAt || null,
      }))
    : [];

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
    registeredLabel: `${participants.length} registered`,
    type: event.event_type || event.host_type || "Event",
    date: dateText,
    time: timeText,
    eventFee:
      typeof event.fee_cents === "number"
        ? `$${(event.fee_cents / 100).toFixed(2)}`
        : "No fee",
    details: event.description || "",
    coverImage: resolveImageUrl(event.event_image_url),
    registrationStartDate: validStart ? toLocalDateInput(validStart) : dateText,
    registrationStartTime: validStart ? toLocalTimeInput(validStart) : timeText,
    registrationEndDate: validEnd ? toLocalDateInput(validEnd) : dateText,
    registrationEndTime: validEnd ? toLocalTimeInput(validEnd) : timeText,
    url: event.event_url || "",
    participants,
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

export async function drawEventWinner(id) {
  const result = await apiRequest(`/events/${id}/drawWinner`, {
    method: "POST",
  });

  return result;
}
