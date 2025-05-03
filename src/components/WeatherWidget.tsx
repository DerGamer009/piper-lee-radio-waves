
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchWeatherData } from "@/services/radioService";

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  updated: string;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      try {
        const data = await fetchWeatherData();
        setWeather(data);
      } catch (error) {
        console.error("Fehler beim Laden der Wetterdaten:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
    
    // Aktualisiere die Wetterdaten alle 30 Minuten
    const interval = setInterval(loadWeather, 30 * 60000);
    return () => clearInterval(interval);
  }, []);

  // Wetter-Icons basierend auf Bedingung
  const getWeatherIcon = (condition: string) => {
    switch(condition.toLowerCase()) {
      case "sonnig":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="5" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        );
      case "bewölkt":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
      case "regnerisch":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 19.4l.72-1.2m4.32 0l.72-1.2m4.32 0l.72-1.2" />
          </svg>
        );
      case "windig":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.59 4.59A2 2 0 1112 8H3m10.59 11.41A2 2 0 1116 16H7" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
    }
  };

  return (
    <Card className="border border-gray-800/50 bg-gradient-to-br from-[#1c1f2f]/60 to-[#252a40]/60 backdrop-blur-sm shadow-lg">
      <CardContent className="p-4">
        {loading ? (
          <div className="flex items-center justify-center animate-pulse">
            <div className="h-10 w-10 rounded-full bg-gray-700 mr-3"></div>
            <div>
              <div className="h-4 w-16 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-800 rounded"></div>
            </div>
          </div>
        ) : weather ? (
          <div className="flex items-center">
            <div className="mr-3">
              {weather.condition && getWeatherIcon(weather.condition)}
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-lg font-medium">{weather.temperature}°C</span>
                <span className="ml-1 text-xs text-gray-400">{weather.city}</span>
              </div>
              <div className="text-xs text-gray-400">
                {weather.condition}, {weather.humidity}% Luftfeuchtigkeit
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-400">Keine Wetterdaten verfügbar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
