
import { useState, useEffect } from "react";
import { Music, Users, Radio, Headphones } from "lucide-react";
import { fetchStreamInfo } from "@/services/radioService";

interface StreamInfoData {
  title?: string;
  artist?: string;
  listeners?: number;
  current_song?: string;
  show_name?: string;
  show_host?: string;
  is_live?: boolean;
  streamer_name?: string;
  elapsed?: number;
  duration?: number;
  remaining?: number;
}

const StreamInfo = () => {
  const [streamInfo, setStreamInfo] = useState<StreamInfoData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStreamInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStreamInfo();
        setStreamInfo(data);
      } catch (error) {
        console.error("Fehler beim Laden der Stream-Informationen:", error);
        setError("Die Stream-Informationen konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    getStreamInfo();
    
    // Aktualisiere alle 30 Sekunden
    const interval = setInterval(getStreamInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  // Extract current song information
  const currentSong = streamInfo.current_song || "Musik wird geladen...";
  
  // Calculate progress percentage
  const progress = streamInfo.duration ? (streamInfo.elapsed! / streamInfo.duration) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-[#1c1f2f] to-[#252a40] border border-gray-800/50 rounded-xl p-4 shadow-lg">
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin h-8 w-8 border-4 border-[#9b87f5] border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="p-3 text-center text-amber-400 bg-amber-900/20 rounded-md border border-amber-900/30">
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-900/30 rounded-full">
              <Radio className="text-purple-400 h-5 w-5" />
            </div>
            <h3 className="font-medium text-gray-200">Jetzt läuft:</h3>
          </div>
          
          <p className="text-xl font-semibold text-white">{currentSong}</p>
          
          {/* Progress bar */}
          {streamInfo.duration && streamInfo.duration > 0 && (
            <div className="mt-2 space-y-1">
              <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(streamInfo.elapsed || 0)}</span>
                <span>{formatTime(streamInfo.duration)}</span>
              </div>
            </div>
          )}
          
          {streamInfo.show_name && (
            <div className="border-t border-gray-700/50 pt-3 mt-3">
              <p className="font-medium text-gray-200">{streamInfo.show_name}</p>
              {streamInfo.show_host && <p className="text-sm text-gray-400">Mit {streamInfo.show_host}</p>}
            </div>
          )}
          
          {typeof streamInfo.listeners === 'number' && (
            <div className="flex items-center gap-2 mt-2 bg-gray-800/30 px-3 py-2 rounded-md">
              <Headphones className="h-4 w-4 text-green-400" />
              <span className="text-green-300">{streamInfo.listeners} Hörer online</span>
            </div>
          )}

          {streamInfo.is_live && (
            <div className="flex items-center gap-2 bg-red-900/20 px-3 py-1.5 rounded-md">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-red-400 text-sm">Live: {streamInfo.streamer_name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to format time
const formatTime = (seconds?: number): string => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default StreamInfo;
