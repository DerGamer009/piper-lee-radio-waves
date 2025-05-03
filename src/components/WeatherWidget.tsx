
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Cloud, CloudRain, Wind } from "lucide-react";

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  updated: string;
}

const WeatherWidget = ({ city = "Berlin" }: { city?: string }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // For demo purposes, we'll use mock data
        // In a real application, you would connect to a weather API
        // Example: const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
        
        // Mock data for demonstration
        const mockWeather = {
          city,
          temperature: Math.floor(Math.random() * 15) + 10, // 10-25°C
          condition: ["sonnig", "bewölkt", "regnerisch", "windig"][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
          updated: new Date().toLocaleTimeString('de-DE')
        };
        
        setTimeout(() => {
          setWeather(mockWeather);
          setLoading(false);
        }, 600); // Simulate network delay
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
        setError("Wetterdaten konnten nicht geladen werden.");
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city]);

  const getWeatherIcon = () => {
    if (!weather) return <Sun className="h-12 w-12 text-yellow-400" />;
    
    switch (weather.condition.toLowerCase()) {
      case 'sonnig':
        return <Sun className="h-12 w-12 text-yellow-400" />;
      case 'bewölkt':
        return <Cloud className="h-12 w-12 text-gray-400" />;
      case 'regnerisch':
        return <CloudRain className="h-12 w-12 text-blue-400" />;
      case 'windig':
        return <Wind className="h-12 w-12 text-blue-300" />;
      default:
        return <Sun className="h-12 w-12 text-yellow-400" />;
    }
  };

  if (error) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-4 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
          <div className="flex items-center justify-between">
            <div>
              {loading ? (
                <>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-12 w-16" />
                </>
              ) : (
                <>
                  <p className="text-white text-sm font-medium">{weather?.city}</p>
                  <p className="text-white text-3xl font-bold">{weather?.temperature}°C</p>
                </>
              )}
            </div>
            {loading ? <Skeleton className="h-12 w-12 rounded-full" /> : getWeatherIcon()}
          </div>
        </div>
        <div className="p-4">
          {loading ? (
            <>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span>Bedingung:</span>
                <span className="font-medium">{weather?.condition}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Luftfeuchtigkeit:</span>
                <span className="font-medium">{weather?.humidity}%</span>
              </div>
              <div className="text-xs text-gray-500 mt-3 text-right">
                Aktualisiert: {weather?.updated}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
