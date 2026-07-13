const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

const ADMIN_TOKEN_KEY = "adminAuthToken";

function buildHeaders(customHeaders = {}, includeJsonContentType = true) {
  const headers = { ...customHeaders };

  if (includeJsonContentType && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload?.error
        ? payload.error
        : response.statusText || "Request failed";

    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export async function apiRequest(path, options = {}) {
  const { method = "GET", headers, body, isFormData = false } = options;

  const requestOptions = {
    method,
    headers: buildHeaders(headers, !isFormData),
    body,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, requestOptions);
  return parseResponse(response);
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export { API_BASE_URL };
