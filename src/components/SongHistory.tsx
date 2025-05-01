
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSongHistory } from "@/services/radioService";
import { Music } from "lucide-react";

interface SongHistoryItem {
  id: string;
  song_name: string;
  artist_name?: string;
  played_at: string;
  image_url?: string;
  duration?: number;
}

export function SongHistory() {
  const [songs, setSongs] = useState<SongHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSongHistory = async () => {
      setLoading(true);
      try {
        const history = await fetchSongHistory();
        setSongs(history);
      } catch (error) {
        console.error("Fehler beim Laden der Song-Historie:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSongHistory();
    
    // Aktualisiere die Song-Historie alle 60 Sekunden
    const interval = setInterval(loadSongHistory, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Fallback-Daten, wenn die Datenbank leer ist oder keine Verbindung besteht
  const fallbackSongs = [
    { song_name: "Believer", artist_name: "Imagine Dragons", played_at: new Date(Date.now() - 5*60000).toISOString() },
    { song_name: "Someone Like You", artist_name: "Adele", played_at: new Date(Date.now() - 9*60000).toISOString() },
    { song_name: "Shape of You", artist_name: "Ed Sheeran", played_at: new Date(Date.now() - 13*60000).toISOString() },
    { song_name: "Don't Stop Me Now", artist_name: "Queen", played_at: new Date(Date.now() - 18*60000).toISOString() },
    { song_name: "Bad Guy", artist_name: "Billie Eilish", played_at: new Date(Date.now() - 22*60000).toISOString() },
  ];

  const displaySongs = songs.length > 0 ? songs : fallbackSongs;

  return (
    <Card className="border border-gray-800/50 bg-gradient-to-br from-[#1c1f2f]/60 to-[#252a40]/60 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <Music className="h-5 w-5 text-radio-purple" />
          Zuletzt gespielt
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 rounded bg-gray-700"></div>
                <div className="flex-1">
                  <div className="h-4 w-36 bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 w-24 bg-gray-800 rounded"></div>
                </div>
                <div className="h-3 w-10 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {displaySongs.map((song, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 rounded bg-gradient-to-br from-radio-purple/30 to-radio-purple/10 flex items-center justify-center">
                  {song.image_url ? (
                    <img 
                      src={song.image_url} 
                      alt={song.song_name} 
                      className="h-full w-full rounded object-cover" 
                    />
                  ) : (
                    <Music className="h-5 w-5 text-radio-purple/70" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{song.song_name}</p>
                  <p className="text-xs text-gray-400 truncate">{song.artist_name}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(song.played_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
