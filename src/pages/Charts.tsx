
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Music, Star, Headphones, ThumbsUp, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  duration: string;
  plays: number;
  likes: number;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  createdBy: string;
  songs: Song[];
  date: string;
}

// Dummy data
const TOP_SONGS: Song[] = [
  {
    id: "1",
    title: "Sommertraum",
    artist: "Die Sterne",
    album: "Himmelskörper",
    coverUrl: "https://placehold.co/300x300/242938/FFFFFF?text=Sommertraum",
    duration: "3:42",
    plays: 1245,
    likes: 327
  },
  {
    id: "2",
    title: "Endlose Nacht",
    artist: "Mondschein",
    album: "Dunkelheit",
    coverUrl: "https://placehold.co/300x300/242938/FFFFFF?text=Endlose+Nacht",
    duration: "4:15",
    plays: 1120,
    likes: 298
  },
  {
    id: "3",
    title: "Stadtlichter",
    artist: "Metropolis",
    album: "Urban Feelings",
    coverUrl: "https://placehold.co/300x300/242938/FFFFFF?text=Stadtlichter",
    duration: "3:56",
    plays: 986,
    likes: 265
  },
  {
    id: "4",
    title: "Bergluft",
    artist: "Alpensound",
    album: "Höhenrausch",
    coverUrl: "https://placehold.co/300x300/242938/FFFFFF?text=Bergluft",
    duration: "3:23",
    plays: 873,
    likes: 231
  },
  {
    id: "5",
    title: "Meeresrauschen",
    artist: "Wellengang",
    album: "Küstenklänge",
    coverUrl: "https://placehold.co/300x300/242938/FFFFFF?text=Meeresrauschen",
    duration: "5:17",
    plays: 812,
    likes: 224
  },
  {
    id: "6",
    title: "Zeitlos",
    artist: "Ewigkeit",
    album: "Unendlich",
    coverUrl: "https://placehold.co/300x300/242938/FFFFFF?text=Zeitlos",
    duration: "4:03",
    plays: 756,
    likes: 198
  },
  {
    id: "7",
    title: "Herbstwind",
    artist: "Jahreszeiten",
    album: "Naturzyklen",
    coverUrl: "https://placehold.co/300x300/242938/FFFFFF?text=Herbstwind",
    duration: "3:49",
    plays: 720,
    likes: 187
  },
  {
    id: "8",
    title: "Regentropfen",
    artist: "Wolkenbruch",
    album: "Wasserspiel",
    coverUrl: "https://placehold.co/300x300/242938/FFFFFF?text=Regentropfen",
    duration: "4:22",
    plays: 689,
    likes: 176
  },
  {
    id: "9",
    title: "Sonnenstrahlen",
    artist: "Lichtblick",
    album: "Tagesanbruch",
    coverUrl: "https://placehold.co/300x300/242938/FFFFFF?text=Sonnenstrahlen",
    duration: "3:35",
    plays: 654,
    likes: 167
  },
  {
    id: "10",
    title: "Winterstille",
    artist: "Schneekristall",
    album: "Eiszeit",
    coverUrl: "https://placehold.co/300x300/242938/FFFFFF?text=Winterstille",
    duration: "4:11",
    plays: 612,
    likes: 159
  }
];

const PLAYLISTS: Playlist[] = [
  {
    id: "1",
    title: "Morgenshow Hits",
    description: "Die besten Songs aus unserer Morgenshow",
    coverUrl: "https://placehold.co/400x400/242938/FFFFFF?text=Morgenshow",
    createdBy: "Maria Müller",
    date: "2025-03-28",
    songs: TOP_SONGS.slice(0, 5)
  },
  {
    id: "2",
    title: "Wochenend-Mix",
    description: "Perfekt für das Wochenende",
    coverUrl: "https://placehold.co/400x400/242938/FFFFFF?text=Wochenend-Mix",
    createdBy: "Max Schneider",
    date: "2025-04-02",
    songs: TOP_SONGS.slice(2, 7)
  },
  {
    id: "3",
    title: "Entspannungsklänge",
    description: "Musik zum Relaxen und Abschalten",
    coverUrl: "https://placehold.co/400x400/242938/FFFFFF?text=Entspannung",
    createdBy: "Sophia Becker",
    date: "2025-03-20",
    songs: TOP_SONGS.slice(4, 9)
  },
  {
    id: "4",
    title: "Partyhits 2025",
    description: "Für jede Party ein Muss",
    coverUrl: "https://placehold.co/400x400/242938/FFFFFF?text=Partyhits",
    createdBy: "Thomas Weber",
    date: "2025-04-05",
    songs: [TOP_SONGS[1], TOP_SONGS[3], TOP_SONGS[5], TOP_SONGS[7], TOP_SONGS[9]]
  }
];

const Charts = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const { toast } = useToast();
  
  const handlePlaySong = (song: Song) => {
    // In a real app, you would play the song here
    toast({
      title: "Song wird abgespielt",
      description: `${song.artist} - ${song.title}`,
    });
  };
  
  const handleLikeSong = (song: Song) => {
    // In a real app, you would like the song here
    toast({
      title: "Song geliked",
      description: `${song.artist} - ${song.title}`,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button asChild variant="ghost" className="text-radio-light hover:text-white">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Startseite
          </Link>
        </Button>
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Musik-Charts & Playlists</h1>
        <p className="text-radio-light/70 max-w-2xl mx-auto">
          Entdecken Sie unsere beliebtesten Songs und kuratierte Playlists.
        </p>
      </div>
      
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="charts">Top 10 Charts</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="mt-0">
          <div className="bg-card/20 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 bg-card/50 p-4 text-sm font-medium text-radio-light/70 border-b border-white/10">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5 md:col-span-6">Song</div>
              <div className="col-span-3 md:col-span-2 text-center hidden sm:block">Dauer</div>
              <div className="col-span-3 text-center">Statistik</div>
            </div>
            
            {TOP_SONGS.map((song, index) => (
              <div 
                key={song.id} 
                className={`grid grid-cols-12 p-4 items-center ${
                  index % 2 === 0 ? "bg-card/10" : ""
                } hover:bg-card/30 transition-colors duration-200`}
              >
                <div className="col-span-1 text-center font-bold text-lg text-radio-purple">
                  {index + 1}
                </div>
                
                <div className="col-span-5 md:col-span-6 flex items-center gap-3">
                  <img 
                    src={song.coverUrl} 
                    alt={song.title} 
                    className="w-12 h-12 rounded-md"
                  />
                  <div>
                    <h3 className="font-medium">{song.title}</h3>
                    <p className="text-sm text-radio-light/70">{song.artist}</p>
                  </div>
                </div>
                
                <div className="col-span-3 md:col-span-2 text-center hidden sm:block text-radio-light/70">
                  {song.duration}
                </div>
                
                <div className="col-span-3 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1 text-radio-light/70">
                    <Headphones className="h-4 w-4" />
                    <span className="text-xs">{song.plays}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-radio-light/70 hover:text-radio-purple"
                    onClick={() => handleLikeSong(song)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-radio-light/70 hover:text-radio-purple"
                    onClick={() => handlePlaySong(song)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="playlists" className="mt-0">
          {selectedPlaylist ? (
            <div>
              <div className="flex flex-col md:flex-row gap-6 bg-card/30 p-6 rounded-xl mb-6">
                <img 
                  src={selectedPlaylist.coverUrl} 
                  alt={selectedPlaylist.title} 
                  className="w-full max-w-xs mx-auto md:mx-0 rounded-lg"
                />
                
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedPlaylist.title}</h2>
                    <p className="text-radio-light/70 mb-4">{selectedPlaylist.description}</p>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-radio-light/60 mb-6">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Erstellt am {new Date(selectedPlaylist.date).toLocaleDateString('de-DE')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Headphones className="h-4 w-4" />
                        <span>Von {selectedPlaylist.createdBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Music className="h-4 w-4" />
                        <span>{selectedPlaylist.songs.length} Songs</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setSelectedPlaylist(null)}
                      variant="outline"
                      className="border-radio-light/30 hover:bg-card/50"
                    >
                      Zurück zu allen Playlists
                    </Button>
                    
                    <Button className="bg-radio-purple hover:bg-radio-purple/90">
                      <Play className="mr-2 h-4 w-4" /> Alle abspielen
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-card/20 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 bg-card/50 p-4 text-sm font-medium text-radio-light/70 border-b border-white/10">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-5 md:col-span-6">Song</div>
                  <div className="col-span-3 md:col-span-2 text-center hidden sm:block">Dauer</div>
                  <div className="col-span-3 text-center">Aktionen</div>
                </div>
                
                {selectedPlaylist.songs.map((song, index) => (
                  <div 
                    key={song.id} 
                    className={`grid grid-cols-12 p-4 items-center ${
                      index % 2 === 0 ? "bg-card/10" : ""
                    } hover:bg-card/30 transition-colors duration-200`}
                  >
                    <div className="col-span-1 text-center font-medium">
                      {index + 1}
                    </div>
                    
                    <div className="col-span-5 md:col-span-6 flex items-center gap-3">
                      <img 
                        src={song.coverUrl} 
                        alt={song.title} 
                        className="w-12 h-12 rounded-md"
                      />
                      <div>
                        <h3 className="font-medium">{song.title}</h3>
                        <p className="text-sm text-radio-light/70">{song.artist}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-3 md:col-span-2 text-center hidden sm:block text-radio-light/70">
                      {song.duration}
                    </div>
                    
                    <div className="col-span-3 flex items-center justify-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-radio-light/70 hover:text-radio-purple"
                        onClick={() => handleLikeSong(song)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-radio-light/70 hover:text-radio-purple"
                        onClick={() => handlePlaySong(song)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PLAYLISTS.map((playlist) => (
                <div 
                  key={playlist.id} 
                  className="bg-card/30 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedPlaylist(playlist)}
                >
                  <div className="relative h-48 overflow-hidden group">
                    <img 
                      src={playlist.coverUrl} 
                      alt={playlist.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button className="bg-radio-purple hover:bg-radio-purple/90 rounded-full">
                        <Play className="mr-2 h-4 w-4" /> Abspielen
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{playlist.title}</h3>
                    <p className="text-sm text-radio-light/70 mb-2">{playlist.description}</p>
                    <div className="flex items-center justify-between text-xs text-radio-light/60">
                      <span className="flex items-center gap-1">
                        <Headphones className="h-3 w-3" />
                        {playlist.createdBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Music className="h-3 w-3" />
                        {playlist.songs.length} Songs
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Charts;
