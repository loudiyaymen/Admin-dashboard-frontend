import { apiRequest } from "./apiClient.js";

export async function fetchDashboardMetrics() {
  return apiRequest("/analytics/dashboard/metrics");
}

export async function fetchResolutionRates() {
  return apiRequest("/analytics/resolution-rates");
}

export async function fetchActivityOverview() {
  return apiRequest("/analytics/activity-overview");
}

export async function fetchActiveUsersTrend() {
  return apiRequest("/analytics/active-users-trend");
}

export async function fetchReportDistribution() {
  return apiRequest("/analytics/report-distribution");
}

export async function fetchAlertMetrics() {
  return apiRequest("/analytics/alert-metrics");
}
