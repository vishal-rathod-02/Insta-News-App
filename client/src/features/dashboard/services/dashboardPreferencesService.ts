interface DashboardPreferencesResponse {
  success: boolean;
  data?: {
    savedCategories?: string[];
  };
}

export const fetchDashboardPreferences = async (userId: string) => {
  const response = await fetch(`/api/preferences/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard preferences.");
  }

  const data = (await response.json()) as DashboardPreferencesResponse;
  return data.data?.savedCategories ?? [];
};

export const saveDashboardPreferences = async (
  userId: string,
  categories: string[],
) => {
  const response = await fetch(`/api/preferences/${userId}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categories }),
  });

  if (!response.ok) {
    throw new Error("Failed to save dashboard preferences.");
  }
};
