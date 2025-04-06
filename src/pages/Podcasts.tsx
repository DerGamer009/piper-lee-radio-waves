
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Clock, Calendar, Headphones, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Podcast {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  imageUrl: string;
  audioUrl: string;
  host: string;
  category: string;
}

const DUMMY_PODCASTS: Podcast[] = [
  {
    id: "1",
    title: "Morgenmelodien Spezial: Deutsche Musik der 80er",
    description: "In dieser Sendung präsentieren wir die besten deutschsprachigen Hits der 80er Jahre und sprechen über deren kulturelle Bedeutung.",
    date: "2025-03-21",
    duration: "56:23",
    imageUrl: "https://placehold.co/400x400/242938/FFFFFF?text=Morgenmelodien",
    audioUrl: "https://example.com/podcast1.mp3",
    host: "Maria Müller",
    category: "Musik"
  },
  {
    id: "2",
    title: "Wochenendauftakt: Interview mit DJ Maxi",
    description: "Ein exklusives Interview mit dem bekannten DJ Maxi über seine neue Tour und kommende Projekte.",
    date: "2025-04-01",
    duration: "42:15",
    imageUrl: "https://placehold.co/400x400/242938/FFFFFF?text=Wochenendauftakt",
    audioUrl: "https://example.com/podcast2.mp3",
    host: "Max Schneider",
    category: "Interview"
  },
  {
    id: "3",
    title: "Nachtlounge: Entspannungsmusik und Meditation",
    description: "Eine Stunde mit beruhigenden Klängen und geführten Meditationen für einen erholsamen Schlaf.",
    date: "2025-03-28",
    duration: "62:10",
    imageUrl: "https://placehold.co/400x400/242938/FFFFFF?text=Nachtlounge",
    audioUrl: "https://example.com/podcast3.mp3",
    host: "Sophia Becker",
    category: "Wellness"
  },
  {
    id: "4",
    title: "Technikecke: Die neuesten Gadgets im Test",
    description: "Wir besprechen und testen die neuesten technischen Geräte und geben Empfehlungen.",
    date: "2025-03-10",
    duration: "48:37",
    imageUrl: "https://placehold.co/400x400/242938/FFFFFF?text=Technikecke",
    audioUrl: "https://example.com/podcast4.mp3",
    host: "Thomas Weber",
    category: "Technik"
  }
];

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>(DUMMY_PODCASTS);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Get unique categories from podcasts
  const categories = Array.from(new Set(podcasts.map(podcast => podcast.category)));
  
  // Filter podcasts based on search term and selected category
  const filteredPodcasts = podcasts.filter(podcast => {
    const matchesSearch = podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          podcast.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          podcast.host.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? podcast.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });
  
  const togglePlay = (podcastId: string) => {
    if (currentlyPlaying === podcastId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(podcastId);
      
      // In a real app, you would start playing the audio here
      toast({
        title: "Podcast wird abgespielt",
        description: `Podcast "${podcasts.find(p => p.id === podcastId)?.title}" wird geladen...`,
      });
    }
  };
  
  const handleDownload = (podcast: Podcast) => {
    // In a real app, you would trigger the download here
    toast({
      title: "Download gestartet",
      description: `${podcast.title} wird heruntergeladen...`,
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
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Podcasts & Archiv</h1>
        <p className="text-radio-light/70 max-w-2xl mx-auto">
          Entdecken Sie unsere vergangenen Sendungen und exklusive Inhalte zum Nachhören.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-radio-light/50 h-4 w-4" />
          <Input 
            placeholder="Podcasts durchsuchen..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card/30 border-radio-light/20"
          />
        </div>
        
        <div className="flex overflow-x-auto pb-2 gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            className={`rounded-full px-4 whitespace-nowrap ${
              selectedCategory === null 
                ? "bg-radio-purple hover:bg-radio-purple/90" 
                : "border-radio-light/20 hover:border-radio-purple/50"
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            Alle
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full px-4 whitespace-nowrap ${
                selectedCategory === category 
                  ? "bg-radio-purple hover:bg-radio-purple/90" 
                  : "border-radio-light/20 hover:border-radio-purple/50"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {filteredPodcasts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPodcasts.map((podcast) => (
            <div key={podcast.id} className="bg-card/30 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={podcast.imageUrl} 
                  alt={podcast.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold line-clamp-2">{podcast.title}</h3>
                  <span className="bg-radio-purple/20 text-radio-purple px-2 py-1 rounded-full text-xs">
                    {podcast.category}
                  </span>
                </div>
                
                <p className="text-radio-light/70 text-sm mb-4 line-clamp-2">
                  {podcast.description}
                </p>
                
                <div className="flex flex-wrap gap-3 text-xs text-radio-light/60 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(podcast.date).toLocaleDateString('de-DE')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{podcast.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Headphones className="h-3 w-3" />
                    <span>{podcast.host}</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    onClick={() => togglePlay(podcast.id)}
                    variant="outline"
                    size="sm"
                    className="border-radio-purple text-radio-purple hover:bg-radio-purple/10"
                  >
                    {currentlyPlaying === podcast.id ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" /> Abspielen
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => handleDownload(podcast)}
                    variant="ghost"
                    size="sm"
                    className="text-radio-light/70 hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-card/20 rounded-xl">
          <Search className="h-12 w-12 text-radio-light/40 mb-4" />
          <h3 className="text-xl font-medium mb-2">Keine Podcasts gefunden</h3>
          <p className="text-radio-light/60 text-center max-w-lg">
            Leider konnten wir keine Podcasts finden, die Ihren Suchkriterien entsprechen. Versuchen Sie andere Suchbegriffe oder entfernen Sie Filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default Podcasts;
