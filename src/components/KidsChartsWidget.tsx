
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Play, Heart, Star } from "lucide-react";

const KidsChartsWidget = () => {
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  
  const songs = [
    { id: 1, title: "Alle meine Entchen", artist: "Kinderchor", position: 1 },
    { id: 2, title: "Die Räder vom Bus", artist: "Kinderlieder Band", position: 2 },
    { id: 3, title: "Backe, backe Kuchen", artist: "Sing mit uns", position: 3 },
    { id: 4, title: "Häschen in der Grube", artist: "Klassiker", position: 4 },
    { id: 5, title: "Auf der Mauer, auf der Lauer", artist: "Fun Kids", position: 5 }
  ];

  const toggleLike = (songId: number) => {
    setLikedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  return (
    <Card className="bg-gradient-to-br from-yellow-100/50 to-green-100/50 dark:from-yellow-900/20 dark:to-green-900/20 border-yellow-200/50 dark:border-yellow-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Kids Top 5
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {songs.map((song) => (
          <div key={song.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold">
              {song.position}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{song.title}</p>
              <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => toggleLike(song.id)}
              >
                <Heart className={`h-3 w-3 ${likedSongs.includes(song.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <Play className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default KidsChartsWidget;
