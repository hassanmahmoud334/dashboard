import axios from "axios";

const KEY = import.meta.env.VITE_OPENWEATHER_KEY;
const BASE = "https://api.openweathermap.org/data/2.5/weather";

if (!KEY) {
  console.warn("OpenWeatherMap API key is missing. Please add VITE_OPENWEATHER_KEY to your .env file");
}

export const fetchWeatherByCity = async (city: string) => {
  if (!KEY) {
    throw new Error("API key not configured");
  }

  if (!city.trim()) {
    throw new Error("Please enter a city name");
  }

  try {
    const { data } = await axios.get(BASE, {
      params: { 
        q: city.trim(), 
        appid: KEY, 
        units: "metric" 
      },
      timeout: 10000
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Invalid API key");
    } else if (error.response?.status === 404) {
      throw new Error("City not found");
    } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error("Failed to fetch weather data");
    }
  }
};

export const fetchWeatherByCoords = async (lat: number, lon: number) => {
  if (!KEY) {
    throw new Error("API key not configured");
  }

  try {
    const { data } = await axios.get(BASE, {
      params: { 
        lat, 
        lon, 
        appid: KEY, 
        units: "metric" 
      },
      timeout: 10000
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Invalid API key");
    } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error("Failed to fetch weather data");
    }
  }
};