import {
  API_BASE_URL,
  apiRequest,
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from "./apiClient";

export async function loginAdmin({ username, password }) {
  const isHttp = /^http:\/\//i.test(API_BASE_URL);
  const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(
    API_BASE_URL,
  );

  if (import.meta.env.PROD && isHttp && !isLocal) {
    throw new Error(
      "Insecure API endpoint. Login is blocked because HTTPS is required.",
    );
  }

  const result = await apiRequest("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (result?.token) {
    setAdminToken(result.token);
  }

  return result;
}

export async function logoutAdmin() {
  try {
    if (getAdminToken()) {
      await apiRequest("/admin/logout", { method: "POST" });
    }
  } finally {
    clearAdminToken();
  }
}

export async function getAdminCredentials() {
  return apiRequest("/admin/credentials");
}

export function hasAdminToken() {
  return Boolean(getAdminToken());
}
