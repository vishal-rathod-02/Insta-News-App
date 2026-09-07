import { getApiUrl } from "../../../utils/apiConfig";

interface DashboardPreferencesResponse {
  success: boolean;
  data?: {
    savedCategories?: string[];
    bookmarkedArticles?: any[];
  };
}

/**
 * Fetch user preferences (categories) using either Clerk Bearer token or legacy userId
 */
export const fetchDashboardPreferences = async (
  userId?: string,
  token?: string | null,
): Promise<string[]> => {
  const headers: Record<string, string> = {};
  let endpoint = `/api/preferences/me`;

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (userId) {
    endpoint = `/api/preferences/${userId}`;
  } else {
    return [];
  }

  const response = await fetch(getApiUrl(endpoint), { headers });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard preferences.");
  }

  const data = (await response.json()) as DashboardPreferencesResponse;
  return data.data?.savedCategories ?? [];
};

/**
 * Save user preferred categories using either Clerk Bearer token or legacy userId
 */
export const saveDashboardPreferences = async (
  categories: string[],
  userId?: string,
  token?: string | null,
): Promise<void> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  let endpoint = `/api/preferences/me/categories`;

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (userId) {
    endpoint = `/api/preferences/${userId}/categories`;
  } else {
    throw new Error("No authorization token or user ID provided");
  }

  const response = await fetch(getApiUrl(endpoint), {
    method: "POST",
    headers,
    body: JSON.stringify({ categories }),
  });

  if (!response.ok) {
    throw new Error("Failed to save dashboard preferences.");
  }
};
