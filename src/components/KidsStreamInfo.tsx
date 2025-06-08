
import { useState, useEffect } from "react";
import { Music, Users, Radio, Headphones, Baby, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface KidsStreamInfoData {
  title?: string;
  artist?: string;
  listeners?: number | { total?: number; unique?: number; current?: number };
  current_song?: string;
  show_name?: string;
  show_host?: string;
  is_live?: boolean;
  streamer_name?: string;
  elapsed?: number;
  duration?: number;
  remaining?: number;
}

const KidsStreamInfo = () => {
  const [streamInfo, setStreamInfo] = useState<KidsStreamInfoData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localElapsed, setLocalElapsed] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const getKidsStreamInfo = async () => {
      try {
        const response = await fetch('https://backend.piper-lee.net/api/nowplaying/2');
        const data = await response.json();
        
        if (data && Object.keys(data).length > 0) {
          setStreamInfo(data);
          setLocalElapsed(data.elapsed || 0);
          setError(null);
        } else {
          setError("Es konnten keine Stream-Informationen geladen werden.");
        }
      } catch (error) {
        console.error("Fehler beim Laden der Kids Stream-Informationen:", error);
        setError("Die Stream-Informationen konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    getKidsStreamInfo();
    
    const fetchInterval = setInterval(() => {
      getKidsStreamInfo();
    }, 30000);
    
    const secondInterval = setInterval(() => {
      setLocalElapsed(prev => {
        if (streamInfo.duration && prev < streamInfo.duration) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);
    
    return () => {
      clearInterval(fetchInterval);
      clearInterval(secondInterval);
    };
  }, []);

  const currentSong = streamInfo.current_song || "Kindermusik wird geladen...";
  
  let artist = streamInfo.artist || "";
  let title = streamInfo.title || "";
  
  if ((!artist || !title) && streamInfo.current_song) {
    const parts = streamInfo.current_song.split(" - ");
    if (parts.length >= 2) {
      artist = parts[0];
      title = parts.slice(1).join(" - ");
    }
  }
  
  const progress = streamInfo.duration ? (localElapsed / streamInfo.duration) * 100 : 0;
  const useFallbackData = error !== null && !loading;
  
  if (useFallbackData && !streamInfo.title) {
    title = "Kinderlied";
    artist = "Kids Radio";
  }

  // Helper function to extract listener count
  const getListenerCount = (listeners?: number | { total?: number; unique?: number; current?: number }): number => {
    if (typeof listeners === 'number') {
      return listeners;
    }
    if (typeof listeners === 'object' && listeners !== null) {
      return listeners.current || listeners.total || listeners.unique || 0;
    }
    return 0;
  };

  return (
    <div className="bg-gradient-to-br from-pink-100/50 to-purple-100/50 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200/50 dark:border-pink-700/50 rounded-xl p-4 shadow-lg">
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      ) : error && !title ? (
        <div className="p-3 text-center text-pink-600 bg-pink-100/50 dark:bg-pink-900/20 rounded-md border border-pink-200 dark:border-pink-700">
          <p>{error}</p>
          <p className="text-sm mt-1 text-pink-500">
            Kids Radio spielt weiter
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-200/50 dark:bg-pink-800/30 rounded-full">
              <Baby className="text-pink-500 h-5 w-5" />
            </div>
            <h3 className="font-medium text-gray-700 dark:text-gray-200">Gerade läuft:</h3>
          </div>
          
          <div className="space-y-1">
            {artist && title ? (
              <>
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{artist}</p>
              </>
            ) : (
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{currentSong}</p>
            )}
          </div>
          
          <div className="mt-2 space-y-1">
            <Progress 
              value={useFallbackData ? 60 : progress} 
              className="h-1.5 bg-pink-200/50 dark:bg-pink-700/50" 
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{useFallbackData ? "2:15" : formatTime(localElapsed)}</span>
              <span>{useFallbackData ? "3:30" : formatTime(streamInfo.duration)}</span>
            </div>
          </div>
          
          {(streamInfo.show_name || useFallbackData) && (
            <div className="border-t border-pink-200/50 dark:border-pink-700/50 pt-3 mt-3">
              <p className="font-medium text-gray-700 dark:text-gray-200">{streamInfo.show_name || "Kids Programm"}</p>
              {(streamInfo.show_host || useFallbackData) && 
                <p className="text-sm text-gray-500 dark:text-gray-400">Mit {streamInfo.show_host || "DJ Kids"}</p>
              }
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-2 bg-green-100/50 dark:bg-green-900/20 px-3 py-2 rounded-md">
            <Star className="h-4 w-4 text-green-500" />
            <span className="text-green-600 dark:text-green-400 text-sm">
              {useFallbackData ? "89" : getListenerCount(streamInfo.listeners)} kleine Hörer online
            </span>
          </div>

          {(streamInfo.is_live || useFallbackData) && (
            <div className="flex items-center gap-2 bg-red-100/50 dark:bg-red-900/20 px-3 py-1.5 rounded-md">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-red-500 dark:text-red-400 text-sm">Live: {streamInfo.streamer_name || "Kids DJ"}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds?: number): string => {
  if (!seconds && seconds !== 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default KidsStreamInfo;
