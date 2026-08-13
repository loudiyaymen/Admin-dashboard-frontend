import {
  apiRequest,
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from "./apiClient";

export async function loginAdmin({ username, password }) {
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
