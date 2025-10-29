import { useState } from "react";
import { fetchWeatherByCity, fetchWeatherByCoords } from "../api/weather";

type Weather = {
  name: string;
  main: { temp: number; humidity: number; feels_like: number };
  weather: { description: string; icon: string; main: string }[];
  wind: { speed: number };
  sys: { country: string };
};

export default function WeatherCard() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);

  const search = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);
    } catch (e: any) {
      setError(e.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const detect = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setError(null);
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const data = await fetchWeatherByCoords(lat, lon);
          setWeather(data);
          setCity(data.name);
        } catch (e: any) {
          setError(e.message);
          setWeather(null);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        let errorMessage = "Location permission denied";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      search();
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input 
          className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
          value={city} 
          onChange={e => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter city name..." 
          disabled={loading}
        />
        <button 
          onClick={search} 
          disabled={loading}
          className="px-4 py-3 bg-gradient-to-r cursor-pointer  from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          Search
        </button>
        <button 
          onClick={detect} 
          disabled={loading}
          className="px-4 py-3 border cursor-pointer border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Detect
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Fetching weather data...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-4 flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-medium">Unable to get weather</div>
            <div className="text-sm mt-1">{error}</div>
          </div>
        </div>
      )}

      {weather && (
        <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-bold">{weather.name}, {weather.sys.country}</div>
              <div className="text-sm opacity-90 mt-1">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt={weather.weather[0].description}
              className="w-16 h-16"
            />
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-5xl font-bold mb-2">{Math.round(weather.main.temp)}°C</div>
              <div className="text-lg capitalize">{weather.weather[0].description}</div>
              <div className="text-sm opacity-90 mt-2">Feels like {Math.round(weather.main.feels_like)}°C</div>
            </div>
            
            <div className="text-right space-y-1 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                Humidity: {weather.main.humidity}%
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
                </svg>
                Wind: {Math.round(weather.wind.speed * 3.6)} km/h
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}