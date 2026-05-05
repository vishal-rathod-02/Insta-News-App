import { useState, useEffect } from "react";

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  high: number;
  low: number;
  daily: {
    date: string;
    maxTemp: number;
    minTemp: number;
    conditionCode: number;
  }[];
}

const getWeatherCondition = (code: number) => {
  if (code === 0) return "Clear sky";
  if (code === 1 || code === 2 || code === 3) return "Partly cloudy";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 71 && code <= 75) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
};

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async (lat: number, lon: number, cityStr: string) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=auto`);
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();
        
        if (isMounted) {
          const dailyData = data.daily.time.slice(0, 7).map((time: string, i: number) => ({
            date: time,
            maxTemp: Math.round(data.daily.temperature_2m_max[i]),
            minTemp: Math.round(data.daily.temperature_2m_min[i]),
            conditionCode: data.daily.weather_code[i]
          }));

          setWeather({
            city: cityStr,
            temperature: Math.round(data.current.temperature_2m),
            condition: getWeatherCondition(data.current.weather_code),
            high: Math.round(data.daily.temperature_2m_max[0]),
            low: Math.round(data.daily.temperature_2m_min[0]),
            daily: dailyData
          });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch weather data.");
          setLoading(false);
        }
      }
    };

    const getCityName = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const data = await res.json();
        return data.city || data.locality || data.principalSubdivision || "Unknown Location";
      } catch {
        return "Local Weather";
      }
    };

    const handleSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const city = await getCityName(latitude, longitude);
      fetchWeather(latitude, longitude, city);
    };

    const handleError = () => {
      // Fallback to New Delhi
      fetchWeather(28.6139, 77.2090, "New Delhi");
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, { timeout: 10000 });
    } else {
      handleError();
    }

    return () => { isMounted = false; };
  }, []);

  return { weather, loading, error, getWeatherCondition };
};
