const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

/**
 * Returns full API URL with environment VITE_API_BASE_URL prefix in production
 */
export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
};
