
import { useState, useEffect } from "react";
import { Music, Users, Radio, Headphones } from "lucide-react";

interface StreamInfoData {
  title: string;
  artist: string;
  listeners: {
    current: number;
    total?: number;
    peak?: number;
  };
  current_song?: string;
  show_name?: string;
  show_host?: string;
  live: {
    is_live: boolean;
  };
  now_playing: {
    song?: {
      title: string;
      artist: string;
    }
  }
}

const StreamInfo = () => {
  const [streamInfo, setStreamInfo] = useState<Partial<StreamInfoData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStreamInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://backend.piper-lee.net/api/nowplaying/1');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch stream info: ${response.status}`);
        }
        
        const data = await response.json();
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
  const currentSong = streamInfo?.now_playing?.song 
    ? `${streamInfo.now_playing.song.artist} - ${streamInfo.now_playing.song.title}`
    : streamInfo?.current_song || "Musik wird geladen...";

  // Extract listeners count
  const listenersCount = typeof streamInfo?.listeners?.current === 'number'
    ? streamInfo.listeners.current
    : null;

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
          
          {streamInfo.show_name && (
            <div className="border-t border-gray-700/50 pt-3 mt-3">
              <p className="font-medium text-gray-200">{streamInfo.show_name}</p>
              {streamInfo.show_host && <p className="text-sm text-gray-400">Mit {streamInfo.show_host}</p>}
            </div>
          )}
          
          {typeof listenersCount === 'number' && (
            <div className="flex items-center gap-2 mt-2 bg-gray-800/30 px-3 py-2 rounded-md">
              <Headphones className="h-4 w-4 text-green-400" />
              <span className="text-green-300">{listenersCount} Hörer online</span>
            </div>
          )}

          {streamInfo.live?.is_live && (
            <div className="flex items-center gap-2 bg-red-900/20 px-3 py-1.5 rounded-md">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-red-400 text-sm">Live</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamInfo;
