
import { useState, useEffect } from "react";
import { Music, Users } from "lucide-react";
import { fetchStreamInfo } from "@/services/radioService";

const StreamInfo = () => {
  const [streamInfo, setStreamInfo] = useState({
    title: "",
    artist: "",
    listeners: 0,
    current_song: "",
    show_name: "",
    show_host: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStreamInfo = async () => {
      setLoading(true);
      try {
        const info = await fetchStreamInfo();
        setStreamInfo(prev => ({ ...prev, ...info }));
      } catch (error) {
        console.error("Fehler beim Laden der Stream-Informationen:", error);
      } finally {
        setLoading(false);
      }
    };

    getStreamInfo();
    
    // Aktualisiere alle 30 Sekunden
    const interval = setInterval(getStreamInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 shadow-lg">
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin h-8 w-8 border-4 border-radio-purple border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Music className="text-radio-purple h-5 w-5" />
            <h3 className="font-medium">Jetzt läuft:</h3>
          </div>
          
          {streamInfo.current_song ? (
            <p className="text-lg font-semibold">{streamInfo.current_song}</p>
          ) : streamInfo.artist && streamInfo.title ? (
            <p className="text-lg font-semibold">{streamInfo.artist} - {streamInfo.title}</p>
          ) : (
            <p className="text-lg font-semibold">Musik wird geladen...</p>
          )}
          
          {streamInfo.show_name && (
            <div className="border-t border-white/10 pt-3 mt-3">
              <p className="font-medium">{streamInfo.show_name}</p>
              {streamInfo.show_host && <p className="text-sm text-radio-light/70">Mit {streamInfo.show_host}</p>}
            </div>
          )}
          
          {streamInfo.listeners !== undefined && (
            <div className="flex items-center gap-2 text-sm text-radio-light/70 mt-2">
              <Users className="h-4 w-4" />
              <span>{streamInfo.listeners} Hörer</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamInfo;
