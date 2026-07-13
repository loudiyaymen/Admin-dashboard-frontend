import { apiRequest } from "./apiClient";

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().slice(0, 16).replace("T", " ");
}

export function mapAlertToNotification(alert) {
  return {
    id: alert.alert_id,
    title: alert.alert_type || "General Alert",
    description: alert.message,
    sentAt: formatDateTime(alert.created_at || alert.starts_at),
    recipients: "All",
    type: "Push Notification",
  };
}

export async function fetchAlerts() {
  const result = await apiRequest("/alerts?limit=100");
  const alerts = Array.isArray(result?.data) ? result.data : [];
  return alerts.map(mapAlertToNotification);
}

export async function sendAlert(data) {
  return apiRequest("/alerts/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
