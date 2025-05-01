
import { useState, useEffect } from "react";
import { Music, Users, Radio, Headphones } from "lucide-react";
import { fetchStreamInfo } from "@/services/radioService";
import { Progress } from "@/components/ui/progress";

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
  const [localElapsed, setLocalElapsed] = useState<number>(0);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  useEffect(() => {
    const getStreamInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStreamInfo();
        setStreamInfo(data);
        setLocalElapsed(data.elapsed || 0);
        setLastFetchTime(Date.now());
      } catch (error) {
        console.error("Fehler beim Laden der Stream-Informationen:", error);
        setError("Die Stream-Informationen konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    getStreamInfo();
    
    // Aktualisiere alle 30 Sekunden den Stream-Info von API
    const fetchInterval = setInterval(getStreamInfo, 30000);
    
    // Aktualisiere die lokale Zeit jede Sekunde
    const secondInterval = setInterval(() => {
      if (streamInfo.elapsed !== undefined && streamInfo.duration) {
        // Berechne die neue verstrichene Zeit basierend auf der letzten Aktualisierung
        const timeSinceLastFetch = (Date.now() - lastFetchTime) / 1000;
        const newElapsed = streamInfo.elapsed + timeSinceLastFetch;
        
        // Stelle sicher, dass wir nicht über die Gesamtdauer hinausgehen
        if (newElapsed <= streamInfo.duration) {
          setLocalElapsed(newElapsed);
        }
      }
    }, 1000);
    
    return () => {
      clearInterval(fetchInterval);
      clearInterval(secondInterval);
    };
  }, [streamInfo.elapsed, streamInfo.duration, lastFetchTime]);

  // Extract current song information
  const currentSong = streamInfo.current_song || "Musik wird geladen...";
  
  // Split artist and title if available
  let artist = streamInfo.artist || "";
  let title = streamInfo.title || "";
  
  // If we don't have separate artist/title but have current_song
  if ((!artist || !title) && streamInfo.current_song) {
    const parts = streamInfo.current_song.split(" - ");
    if (parts.length >= 2) {
      artist = parts[0];
      title = parts.slice(1).join(" - ");
    }
  }
  
  // Calculate progress percentage based on localElapsed
  const progress = streamInfo.duration ? (localElapsed / streamInfo.duration) * 100 : 0;

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
          
          <div className="space-y-1">
            {artist && title ? (
              <>
                <p className="text-xl font-semibold text-white">{title}</p>
                <p className="text-sm text-gray-300">{artist}</p>
              </>
            ) : (
              <p className="text-xl font-semibold text-white">{currentSong}</p>
            )}
          </div>
          
          {/* Progress bar */}
          {streamInfo.duration && streamInfo.duration > 0 && (
            <div className="mt-2 space-y-1">
              <Progress value={progress} className="h-1.5 bg-gray-700/50" />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(localElapsed)}</span>
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
