import { apiRequest } from "./apiClient";

export async function fetchBuildings() {
  try {
    const result = await apiRequest("/buildings");
    return Array.isArray(result?.data) ? result.data : [];
  } catch (error) {
    console.error("Error fetching buildings:", error);
    return [];
  }
}

export async function fetchCampuses() {
  try {
    const result = await apiRequest("/campuses");
    return Array.isArray(result?.data) ? result.data : [];
  } catch (error) {
    console.error("Error fetching campuses:", error);
    return [];
  }
}
