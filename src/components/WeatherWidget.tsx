
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Cloud, CloudRain, Wind, CloudLightning } from "lucide-react";

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  updated: string;
}

// Types for wetter.com API response
interface WetterComResponse {
  city?: string;
  temperature?: number;
  condition?: string;
  humidity?: number;
  timestamp?: string;
}

const WeatherWidget = ({ city = "Berlin" }: { city?: string }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Try to fetch from wetter.com API
        // Note: This is a placeholder URL - you need to replace with actual wetter.com API endpoint
        const wetterComApiUrl = `https://api.wetter.com/location/city=${encodeURIComponent(city)}/format=json`;
        
        try {
          const response = await fetch(wetterComApiUrl);
          
          if (response.ok) {
            const data: WetterComResponse = await response.json();
            
            // Transform wetter.com API response to our WeatherData format
            const weatherData: WeatherData = {
              city: data.city || city,
              temperature: data.temperature || 0,
              condition: mapWetterCondition(data.condition || ""),
              humidity: data.humidity || 0,
              updated: formatTime(data.timestamp || new Date().toISOString())
            };
            
            setWeather(weatherData);
            setLoading(false);
          } else {
            // If API call fails, fall back to mock data
            console.warn("Wetter.com API call failed, using fallback data");
            useFallbackData();
          }
        } catch (apiError) {
          console.error("Error fetching from wetter.com API:", apiError);
          useFallbackData();
        }
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
        setError("Wetterdaten konnten nicht geladen werden.");
        setLoading(false);
      }
    };

    // Helper function to use mock data as fallback
    const useFallbackData = () => {
      console.log("Using fallback weather data for", city);
      
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
    };

    fetchWeather();
    
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city]);

  // Map wetter.com condition to our internal condition format
  const mapWetterCondition = (wetterCondition: string): string => {
    const conditionMap: {[key: string]: string} = {
      "clear": "sonnig",
      "sunny": "sonnig",
      "partly_cloudy": "bewölkt",
      "cloudy": "bewölkt",
      "overcast": "bewölkt",
      "rain": "regnerisch",
      "showers": "regnerisch",
      "thunderstorm": "gewitter",
      "windy": "windig",
      // Add more mappings as needed
    };
    
    return conditionMap[wetterCondition.toLowerCase()] || "bewölkt";
  };

  const formatTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    }
  };

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
      case 'gewitter':
        return <CloudLightning className="h-12 w-12 text-purple-400" />;
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
