
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Volume2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchStreamInfo } from "@/services/radioService";
import StreamInfo from "@/components/StreamInfo";

const Index = () => {
  // Fetch current stream info
  const { data: streamInfo, isLoading: loadingStreamInfo } = useQuery({
    queryKey: ['stream-info'],
    queryFn: fetchStreamInfo,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-6xl font-bold">
              <span className="text-white">Live Radio</span>{" "}
              <span className="text-[#9b87f5]">Erlebnis</span>
            </h1>
            
            <p className="text-xl text-gray-300">
              Hören Sie Piper Lee Radio - wir bringen Ihnen die beste Musik und Unterhaltung, rund um die Uhr.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-[#9b87f5] hover:bg-[#7e69ab]">
                <Link to="/sendeplan">Sendeplan</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10">
                <Link to="/podcasts">Podcasts</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10">
                <Link to="/chat">Live-Chat</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/songwunsch">Song wünschen</Link>
              </Button>
            </div>
          </div>
          
          <div className="lg:pl-8">
            <div className="bg-[#252a40] p-8 rounded-xl shadow-xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Piper Lee Radio</h2>
                <p className="text-gray-400">Live Stream</p>
              </div>
              
              {streamInfo?.current_song && (
                <div className="mb-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#9b87f5] rounded-full animate-pulse"></div>
                    <span className="text-xl font-medium">Jetzt läuft:</span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold">{streamInfo.title || streamInfo.current_song.split(' - ')[1] || 'Unbekannter Titel'}</h3>
                    <p className="text-gray-400">{streamInfo.artist || streamInfo.current_song.split(' - ')[0] || 'Unbekannter Künstler'}</p>
                  </div>
                  
                  {streamInfo.elapsed !== undefined && streamInfo.duration !== undefined && (
                    <div className="space-y-1">
                      <Progress value={(streamInfo.elapsed / streamInfo.duration) * 100} className="h-1.5" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{formatTime(streamInfo.elapsed)}</span>
                        <span>{formatTime(streamInfo.duration)}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-green-400">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>{streamInfo.listeners || 1} Hörer online</span>
                  </div>
                </div>
              )}
              
              <div className="text-center space-y-6">
                <p className="text-lg">Klicken Sie Play zum Hören</p>
                
                <div className="flex justify-center">
                  <Button size="lg" className="w-16 h-16 rounded-full bg-[#9b87f5] hover:bg-[#7e69ab]">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <Volume2 className="h-5 w-5 text-gray-400" />
                  <Progress value={75} className="h-1.5 w-32" />
                </div>
              </div>
              
              {/* Weather widget */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-yellow-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-2xl font-bold">21°C</span>
                      <span className="ml-2 text-sm text-gray-400">Berlin</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    sonnig, 32% Luftfeuchtigkeit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time
const formatTime = (seconds?: number): string => {
  if (!seconds && seconds !== 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default Index;
