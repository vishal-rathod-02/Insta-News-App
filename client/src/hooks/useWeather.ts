import { useState, useEffect, useCallback } from "react";

export interface HourlyWeather {
  time: string;
  hour: string;
  temp: number;
  conditionCode: number;
  condition: string;
  rainProb: number;
  isDay: boolean;
}

export interface DailyWeather {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  conditionCode: number;
  condition: string;
  rainProb: number;
  uvIndex: number;
}

export interface WeatherData {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  temperature: number; // in Celsius
  feelsLike: number; // in Celsius
  condition: string;
  conditionCode: number;
  isDay: boolean;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  rainProbability: number;
  pressure: number;
  aqi: number;
  aqiStatus: string;
  aqiColor: string;
  sunrise: string;
  sunset: string;
  smartAdvice: string;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}

export interface CitySearchResult {
  id: number;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export const getWeatherCondition = (code: number): string => {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog & mist";
  if (code >= 51 && code <= 55) return "Light drizzle";
  if (code >= 56 && code <= 57) return "Freezing drizzle";
  if (code >= 61 && code <= 65) return "Rain showers";
  if (code >= 66 && code <= 67) return "Freezing rain";
  if (code >= 71 && code <= 75) return "Snowfall";
  if (code === 77) return "Snow grains";
  if (code >= 80 && code <= 82) return "Heavy rain showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Partly cloudy";
};

const getAQIInfo = (aqiValue: number) => {
  if (aqiValue <= 50) {
    return { status: "Good", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
  }
  if (aqiValue <= 100) {
    return { status: "Moderate", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" };
  }
  if (aqiValue <= 150) {
    return { status: "Unhealthy for Sensitive Groups", color: "text-orange-400 bg-orange-500/10 border-orange-500/30" };
  }
  if (aqiValue <= 200) {
    return { status: "Unhealthy", color: "text-red-400 bg-red-500/10 border-red-500/30" };
  }
  if (aqiValue <= 300) {
    return { status: "Very Unhealthy", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
  }
  return { status: "Hazardous", color: "text-rose-500 bg-rose-500/20 border-rose-500/40" };
};

const generateSmartAdvice = (
  conditionCode: number,
  temp: number,
  rainProb: number,
  uvIndex: number,
  aqi: number
): string => {
  if (conditionCode >= 95) {
    return "⚡ Thunderstorm alert: Keep outdoor activities minimal and stay indoors during peak storms.";
  }
  if (rainProb >= 60 || (conditionCode >= 61 && conditionCode <= 82)) {
    return "🌧️ High chance of rain today: Don't forget your umbrella and plan for evening commutes.";
  }
  if (aqi > 150) {
    return "😷 Poor Air Quality (AQI " + aqi + "): Sensitive individuals should wear a mask for outdoor activities.";
  }
  if (uvIndex >= 8) {
    return "☀️ Very High UV Index (" + uvIndex + "): Use SPF 30+ sunscreen and stay hydrated in peak sunlight.";
  }
  if (temp >= 36) {
    return "🔥 Scorching heat today (" + temp + "°C): Stay well-hydrated and avoid direct midday sun.";
  }
  if (temp <= 8) {
    return "❄️ Chilly weather today (" + temp + "°C): Dress warmly in thermal layers when stepping out.";
  }
  if (rainProb >= 30) {
    return "🌦️ Slight chance of scattered drizzle: Keep a light jacket handy just in case.";
  }
  return "✨ Pleasant & clear conditions: Great weather to be out and enjoy the day!";
};

const SAVED_CITIES_STORAGE_KEY = "instanews:saved_weather_cities_v3";

export const DEFAULT_INDIAN_CITIES: CitySearchResult[] = [
  { id: 1, name: "New Delhi", country: "India", latitude: 28.6139, longitude: 77.2090 },
  { id: 2, name: "Mumbai", country: "India", latitude: 19.0760, longitude: 72.8777 },
  { id: 3, name: "Bengaluru", country: "India", latitude: 12.9716, longitude: 77.5946 },
  { id: 4, name: "Kolkata", country: "India", latitude: 22.5726, longitude: 88.3639 },
  { id: 5, name: "Chennai", country: "India", latitude: 13.0827, longitude: 80.2707 },
  { id: 6, name: "Hyderabad", country: "India", latitude: 17.3850, longitude: 78.4867 },
  { id: 7, name: "Ahmedabad", country: "India", latitude: 23.0225, longitude: 72.5714 },
  { id: 8, name: "Pune", country: "India", latitude: 18.5204, longitude: 73.8567 },
  { id: 9, name: "Jaipur", country: "India", latitude: 26.9124, longitude: 75.7873 },
  { id: 10, name: "Lucknow", country: "India", latitude: 26.8467, longitude: 80.9462 },
  { id: 11, name: "Chandigarh", country: "India", latitude: 30.7333, longitude: 76.7794 },
  { id: 12, name: "Kochi", country: "India", latitude: 9.9312, longitude: 76.2673 },
];

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"C" | "F">(() => {
    return (localStorage.getItem("instanews:weather_unit") as "C" | "F") || "C";
  });

  const [savedCities, setSavedCities] = useState<CitySearchResult[]>(() => {
    try {
      // Clear legacy storage keys if present
      localStorage.removeItem("instanews:saved_weather_cities");
      localStorage.removeItem("instanews:saved_weather_cities_v2");

      const saved = localStorage.getItem(SAVED_CITIES_STORAGE_KEY);
      if (saved) {
        const parsed: CitySearchResult[] = JSON.parse(saved);
        // Strictly keep Indian cities only
        const indianOnly = parsed.filter(
          (c) =>
            (c.country && c.country.toLowerCase().includes("india")) ||
            DEFAULT_INDIAN_CITIES.some((d) => d.name.toLowerCase() === c.name.toLowerCase())
        );
        if (indianOnly.length > 0) return indianOnly;
      }
      return DEFAULT_INDIAN_CITIES;
    } catch {
      return DEFAULT_INDIAN_CITIES;
    }
  });

  const toggleUnit = () => {
    setUnit((prev) => {
      const next = prev === "C" ? "F" : "C";
      localStorage.setItem("instanews:weather_unit", next);
      return next;
    });
  };

  const convertTemp = useCallback((celsius: number): number => {
    if (unit === "F") {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  }, [unit]);

  const toggleFavoriteCity = (city: CitySearchResult) => {
    setSavedCities((prev) => {
      const exists = prev.some((c) => c.name.toLowerCase() === city.name.toLowerCase());
      const updated = exists
        ? prev.filter((c) => c.name.toLowerCase() !== city.name.toLowerCase())
        : [...prev, { ...city, country: "India" }];
      try {
        localStorage.setItem(SAVED_CITIES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // storage ignored
      }
      return updated;
    });
  };

  const fetchWeather = useCallback(async (lat: number, lon: number, cityStr: string, countryStr?: string) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch Forecast from Open-Meteo
      const forecastPromise = fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,weather_code,precipitation_probability,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm&timezone=auto`
      ).then((r) => r.json());

      // 2. Fetch Air Quality from Open-Meteo
      const aqiPromise = fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10`
      ).then((r) => r.json()).catch(() => null);

      const [forecastData, aqiData] = await Promise.all([forecastPromise, aqiPromise]);

      if (!forecastData || !forecastData.current) {
        throw new Error("Invalid forecast data received");
      }

      const current = forecastData.current;
      const hourlyData = forecastData.hourly;
      const dailyData = forecastData.daily;

      // Extract next 24 hours starting from current time
      const currentTimeStr = current.time;
      let startIndex = 0;
      if (hourlyData && hourlyData.time) {
        const foundIndex = hourlyData.time.findIndex((t: string) => t >= currentTimeStr);
        startIndex = foundIndex !== -1 ? foundIndex : 0;
      }

      const hourlyList: HourlyWeather[] = (hourlyData?.time || [])
        .slice(startIndex, startIndex + 24)
        .map((timeStr: string, idx: number) => {
          const actualIndex = startIndex + idx;
          const dateObj = new Date(timeStr);
          const hourLabel = idx === 0 ? "Now" : dateObj.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });

          return {
            time: timeStr,
            hour: hourLabel,
            temp: Math.round(hourlyData.temperature_2m[actualIndex]),
            conditionCode: hourlyData.weather_code[actualIndex],
            condition: getWeatherCondition(hourlyData.weather_code[actualIndex]),
            rainProb: Math.round(hourlyData.precipitation_probability[actualIndex] || 0),
            isDay: Boolean(hourlyData.is_day[actualIndex]),
          };
        });

      // Extract 7-day forecast
      const dailyList: DailyWeather[] = (dailyData?.time || []).slice(0, 7).map((timeStr: string, i: number) => {
        const dateObj = new Date(timeStr + "T00:00:00");
        const dayLabel = i === 0 ? "Today" : dateObj.toLocaleDateString("en-US", { weekday: "short" });

        return {
          date: timeStr,
          dayName: dayLabel,
          maxTemp: Math.round(dailyData.temperature_2m_max[i]),
          minTemp: Math.round(dailyData.temperature_2m_min[i]),
          conditionCode: dailyData.weather_code[i],
          condition: getWeatherCondition(dailyData.weather_code[i]),
          rainProb: Math.round(dailyData.precipitation_probability_max?.[i] || 0),
          uvIndex: Math.round(dailyData.uv_index_max?.[i] || 0),
        };
      });

      const aqiValue = Math.round(aqiData?.current?.us_aqi || 42);
      const aqiInfo = getAQIInfo(aqiValue);

      const sunriseStr = dailyData?.sunrise?.[0]
        ? new Date(dailyData.sunrise[0]).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
        : "06:00 AM";

      const sunsetStr = dailyData?.sunset?.[0]
        ? new Date(dailyData.sunset[0]).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
        : "06:30 PM";

      const currentTemp = Math.round(current.temperature_2m);
      const currentRainProb = Math.round(dailyData?.precipitation_probability_max?.[0] || 0);
      const currentUV = Math.round(dailyData?.uv_index_max?.[0] || 5);

      const advice = generateSmartAdvice(
        current.weather_code,
        currentTemp,
        currentRainProb,
        currentUV,
        aqiValue
      );

      setWeather({
        city: cityStr,
        country: countryStr,
        latitude: lat,
        longitude: lon,
        temperature: currentTemp,
        feelsLike: Math.round(current.apparent_temperature || currentTemp),
        condition: getWeatherCondition(current.weather_code),
        conditionCode: current.weather_code,
        isDay: Boolean(current.is_day),
        high: Math.round(dailyData?.temperature_2m_max?.[0] || currentTemp + 2),
        low: Math.round(dailyData?.temperature_2m_min?.[0] || currentTemp - 4),
        humidity: Math.round(current.relative_humidity_2m || 50),
        windSpeed: Math.round(current.wind_speed_10m || 10),
        windDirection: Math.round(current.wind_direction_10m || 0),
        uvIndex: currentUV,
        rainProbability: currentRainProb,
        pressure: Math.round(current.surface_pressure || 1013),
        aqi: aqiValue,
        aqiStatus: aqiInfo.status,
        aqiColor: aqiInfo.color,
        sunrise: sunriseStr,
        sunset: sunsetStr,
        smartAdvice: advice,
        hourly: hourlyList,
        daily: dailyList,
      });

      setLoading(false);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError("Failed to load weather data.");
      setLoading(false);
    }
  }, []);

  const searchCities = async (query: string): Promise<CitySearchResult[]> => {
    if (!query || query.trim().length < 2) return [];
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`
      );
      if (!res.ok) return [];
      const data = await res.json();
      return (data.results || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        country: item.country || "",
        countryCode: item.country_code || "",
        admin1: item.admin1 || "",
        latitude: item.latitude,
        longitude: item.longitude,
      }));
    } catch {
      return [];
    }
  };

  const getCityFromCoords = async (lat: number, lon: number): Promise<{ city: string; country?: string }> => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await res.json();
      return {
        city: data.city || data.locality || data.principalSubdivision || "Current Location",
        country: data.countryName,
      };
    } catch {
      return { city: "Current Location" };
    }
  };

  const loadCurrentLocationWeather = useCallback(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const { city, country } = await getCityFromCoords(latitude, longitude);
          fetchWeather(latitude, longitude, city, country);
        },
        () => {
          // Fallback to New Delhi
          fetchWeather(28.6139, 77.2090, "New Delhi", "India");
        },
        { timeout: 8000 }
      );
    } else {
      fetchWeather(28.6139, 77.2090, "New Delhi", "India");
    }
  }, [fetchWeather]);

  useEffect(() => {
    loadCurrentLocationWeather();
  }, [loadCurrentLocationWeather]);

  return {
    weather,
    loading,
    error,
    unit,
    toggleUnit,
    convertTemp,
    fetchWeather,
    searchCities,
    loadCurrentLocationWeather,
    savedCities,
    toggleFavoriteCity,
    getWeatherCondition,
  };
};

export default useWeather;
