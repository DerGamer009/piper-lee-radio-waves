
import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Radio, Music, Headphones, Calendar, MessageCircle, AlertTriangle } from "lucide-react";
import RadioPlayer from "@/components/RadioPlayer";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePollData } from "@/hooks/usePollData";
import { usePodcastData } from "@/hooks/usePodcastData";
import DynamicPollWidget from "@/components/DynamicPollWidget";
import DynamicPodcastCard from "@/components/DynamicPodcastCard";

// Constants for radio stream
const STREAM_URL = "https://backend.piper-lee.net/listen/piper-lee/radio.mp3";
const STATION_NAME = "Piper Lee Radio";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isMaintenanceMode, isAdmin } = useAuth();
  const { polls, isLoading: loadingPolls } = usePollData(2);
  const { podcasts, isLoading: loadingPodcasts } = usePodcastData(4);
  
  useEffect(() => {
    // Set isLoaded to true after component mounts
    setIsLoaded(true);
  }, []);
  
  // Redirect to maintenance page if maintenance mode is active and user is not admin
  if (isMaintenanceMode && !isAdmin) {
    return <Navigate to="/maintenance" replace />;
  }
  
  return (
    <>
      {isMaintenanceMode && isAdmin && (
        <Alert className="mb-4 border-amber-500 bg-amber-500/10">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <AlertDescription className="text-amber-600">
            Wartungsmodus ist aktiv. Normale Benutzer werden zur Wartungsseite umgeleitet.
            <Button variant="link" asChild className="p-0 h-auto text-amber-700 font-semibold ml-2">
              <Link to="/admin/panel">Wartungsmodus deaktivieren</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <section 
        className={`min-h-[85vh] relative flex items-center transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-radio-purple/10 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-white">Live Radio</span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-radio-purple to-radio-blue">
                  Erlebnis
                </span>
              </h1>
              <p className="text-xl text-radio-light/80 mb-8 max-w-lg mx-auto lg:mx-0">
                Hören Sie Piper Lee Radio - wir bringen Ihnen die beste Musik und Unterhaltung, rund um die Uhr.
              </p>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 justify-center lg:justify-start">
                <Button 
                  asChild
                  className="bg-radio-purple hover:bg-radio-purple/90 text-white rounded-full px-6"
                >
                  <Link to="/sendeplan">Sendeplan</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-radio-blue text-radio-blue hover:bg-radio-blue/10 rounded-full px-6"
                  asChild
                >
                  <Link to="/podcasts">Podcasts</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-radio-purple text-radio-purple hover:bg-radio-purple/10 rounded-full px-6"
                  asChild
                >
                  <Link to="/charts">Charts</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-radio-light hover:text-white rounded-full px-6"
                  asChild
                >
                  <Link to="/kontakt">Kontakt</Link>
                </Button>
              </div>
            </div>
            
            <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
              <RadioPlayer streamUrl={STREAM_URL} stationName={STATION_NAME} />
            </div>
          </div>
        </div>
      </section>
      
      <section id="feedback" className="py-16 bg-gradient-to-b from-radio-dark/50 to-radio-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ihre Meinung zählt</h2>
            <p className="text-radio-light/70 max-w-2xl mx-auto">
              Nehmen Sie an unseren Umfragen teil und gestalten Sie Ihr Radioprogramm mit!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {loadingPolls ? (
              // Zeige Ladezustand
              Array(2).fill(0).map((_, index) => (
                <div key={index} className="bg-card/30 backdrop-blur-sm p-6 rounded-lg animate-pulse">
                  <div className="h-6 bg-radio-purple/20 rounded mb-4 w-3/4"></div>
                  <div className="space-y-3">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="h-10 bg-radio-purple/10 rounded"></div>
                    ))}
                  </div>
                </div>
              ))
            ) : polls.length > 0 ? (
              // Zeige dynamische Umfragen aus der Datenbank
              polls.map((poll) => (
                <DynamicPollWidget
                  key={poll.id}
                  question={poll.question}
                  options={poll.options}
                />
              ))
            ) : (
              // Zeige Nachricht, wenn keine Umfragen verfügbar sind
              <div className="md:col-span-2 text-center p-6 bg-card/30 backdrop-blur-sm rounded-lg">
                <p className="text-radio-light/70">Derzeit sind keine aktiven Umfragen verfügbar.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <section id="about" className="py-16 bg-gradient-to-b from-radio-dark to-radio-dark/90">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Über Unseren Sender</h2>
            <p className="text-radio-light/70 max-w-2xl mx-auto">
              Piper Lee Radio widmet sich der feinsten Auswahl an Musik und Unterhaltung. 
              Unser Sender sendet rund um die Uhr und bietet eine vielfältige Auswahl an Genres und ansprechenden Programmen.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Music,
                title: "Premium Inhalte",
                description: "Genießen Sie hochwertige Musik und Shows, kuratiert von unserem erfahrenen Team aus Produzenten und DJs."
              },
              {
                icon: Headphones,
                title: "Live-Sendungen",
                description: "Schalten Sie ein zu unseren spannenden Live-Übertragungen mit besonderen Gästen, Interviews und Höreranrufen."
              },
              {
                icon: Calendar,
                title: "Regelmäßige Events",
                description: "Verpassen Sie keine unserer regelmäßigen Veranstaltungen, Specials und thematischen Sendungen."
              },
              {
                icon: MessageCircle,
                title: "Gemeinschaftsfokus",
                description: "Wir sind mehr als nur Radio - wir sind eine Gemeinschaft von Musikliebhabern und Kreativen, die unsere Leidenschaft teilen."
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-card/50 backdrop-blur-sm p-6 rounded-lg hover:transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-radio-purple/20 rounded-full">
                    <item.icon className="h-6 w-6 text-radio-purple" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{item.title}</h3>
                <p className="text-radio-light/70 text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section id="schedule" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Programmplan</h2>
            <p className="text-radio-light/70 max-w-2xl mx-auto">
              Sehen Sie sich unsere wöchentliche Aufstellung von Shows und Programmen an. Es gibt etwas für jeden!
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-card rounded-lg overflow-hidden">
            {[
              { day: "Montag", show: "Morgenmelodien", time: "8:00 - 11:00 Uhr" },
              { day: "Dienstag", show: "Nachmittagsklänge", time: "13:00 - 15:00 Uhr" },
              { day: "Mittwoch", show: "Abendechos", time: "19:00 - 21:00 Uhr" },
              { day: "Donnerstag", show: "Nachtlounge", time: "22:00 - 0:00 Uhr" },
              { day: "Freitag", show: "Wochenendauftakt", time: "18:00 - 20:00 Uhr" }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 ${
                  index % 2 === 0 ? "bg-card" : "bg-card/50"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-0">
                  <div className="text-radio-purple font-semibold">{item.day}</div>
                  <div className="font-medium">{item.show}</div>
                </div>
                <div className="text-radio-light/70">{item.time}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              asChild
              className="bg-radio-purple hover:bg-radio-purple/90 text-white rounded-full px-8"
            >
              <Link to="/sendeplan">Vollständigen Sendeplan anzeigen</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section id="podcasts-preview" className="py-16 bg-gradient-to-b from-radio-dark/90 to-radio-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Aktuelle Podcasts</h2>
            <p className="text-radio-light/70 max-w-2xl mx-auto">
              Entdecken Sie unsere neuesten Podcasts und Aufzeichnungen vergangener Sendungen. Hören Sie nach, was Sie verpasst haben!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {loadingPodcasts ? (
              // Zeige Ladezustand
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="bg-card/30 rounded-lg overflow-hidden animate-pulse">
                  <div className="h-40 bg-radio-purple/20"></div>
                  <div className="p-4">
                    <div className="h-4 bg-radio-purple/20 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-radio-purple/10 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : podcasts.length > 0 ? (
              // Zeige dynamische Podcasts aus der Datenbank
              podcasts.map((podcast) => (
                <DynamicPodcastCard key={podcast.id} podcast={podcast} />
              ))
            ) : (
              // Zeige Nachricht, wenn keine Podcasts verfügbar sind
              <div className="lg:col-span-4 text-center p-6 bg-card/30 backdrop-blur-sm rounded-lg">
                <p className="text-radio-light/70">Derzeit sind keine Podcasts verfügbar.</p>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="border-radio-purple text-radio-purple hover:bg-radio-purple/10 rounded-full px-8"
            >
              <Link to="/podcasts">Alle Podcasts anzeigen</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-radio-dark/80 backdrop-blur-sm border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Radio className="h-5 w-5 text-radio-purple" />
              <p className="text-sm text-radio-light/70">
                © 2025 Piper Lee Radio. Alle Rechte vorbehalten.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/datenschutz" className="text-radio-light/70 hover:text-white transition-colors">
                Datenschutz
              </Link>
              <Link to="/nutzungsbedingungen" className="text-radio-light/70 hover:text-white transition-colors">
                Nutzungsbedingungen
              </Link>
              <Link to="/impressum" className="text-radio-light/70 hover:text-white transition-colors">
                Impressum
              </Link>
              <Link to="/kontakt" className="text-radio-light/70 hover:text-white transition-colors">
                Kontakt
              </Link>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <Link to="/sendeplan" className="text-radio-light/70 hover:text-white transition-colors text-sm">
              Sendeplan
            </Link>
            <Link to="/podcasts" className="text-radio-light/70 hover:text-white transition-colors text-sm">
              Podcasts
            </Link>
            <Link to="/charts" className="text-radio-light/70 hover:text-white transition-colors text-sm">
              Charts
            </Link>
            <Link to="/partner" className="text-radio-light/70 hover:text-white transition-colors text-sm">
              Partner
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Index;
