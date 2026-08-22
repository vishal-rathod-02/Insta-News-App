
import { getApiUrl } from "../utils/apiConfig";

export const getCarouselNews = async (
  country: string,
  limit: number = 15
) => {

  const response = await fetch(
    getApiUrl(`/api/news/carousel/${country}?limit=${limit}`)
  );

  if (!response.ok) {
    
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Carousel fetch failed");
  }

  return data.data;
};