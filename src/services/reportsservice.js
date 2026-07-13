import { apiRequest } from "./apiClient";

function toUiStatus(status) {
  if (status === "resolved") return "Resolved";
  return "Open";
}

function toUiCategory(type) {
  switch (type) {
    case "lost_item":
      return "Lost item";
    case "safety_concern":
      return "Incident";
    case "sexual_violence":
      return "Incident";
    case "damaged_vehicle":
      return "Incident";
    default:
      return type || "Incident";
  }
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().slice(0, 16).replace("T", " ");
}

export function mapReportToUi(report) {
  return {
    reportId: report.id,
    title: report.description || "Report",
    location: report.campus_id || "Unknown campus",
    category: toUiCategory(report.type),
    status: toUiStatus(report.status),
    submissionDateTime: formatDateTime(report.created_at),
    reporter: {
      name: report.user_id || "Anonymous",
      email: "Anonymous",
    },
    details: {
      incidentDetails: report.description || "-",
      location: report.campus_id || "-",
      dateOfIncident: formatDateTime(report.created_at).split(" ")[0],
      timeOfIncident: formatDateTime(report.created_at).split(" ")[1] || "-",
    },
    attachments: [],
  };
}

export async function fetchReports() {
  const result = await apiRequest("/reports?limit=100");
  const reports = Array.isArray(result?.data) ? result.data : [];
  return reports.map(mapReportToUi);
}

export async function resolveReport(reportId) {
  const updated = await apiRequest(`/reports/${reportId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "resolved" }),
  });

  return mapReportToUi(updated);
}
