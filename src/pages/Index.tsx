
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Radio, Music, Headphones, Calendar, MessageCircle } from "lucide-react";
import RadioPlayer from "@/components/RadioPlayer";
import PollWidget from "@/components/PollWidget";

// Constants for radio stream
const STREAM_URL = "https://stream.piper-lee.net/radio.mp3";
const STATION_NAME = "Piper Lee Radio";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Set isLoaded to true after component mounts
    setIsLoaded(true);
  }, []);
  
  return (
    <>
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
            <PollWidget 
              question="Welches Musikgenre würden Sie gerne mehr in unserem Programm hören?"
              options={[
                { id: "1", text: "Pop", votes: 142 },
                { id: "2", text: "Rock", votes: 98 },
                { id: "3", text: "Electronic/Dance", votes: 73 },
                { id: "4", text: "Hip-Hop/Rap", votes: 65 },
                { id: "5", text: "Jazz/Blues", votes: 42 }
              ]}
            />
            
            <PollWidget 
              question="Zu welcher Tageszeit hören Sie am liebsten Radio?"
              options={[
                { id: "1", text: "Morgens (6-10 Uhr)", votes: 186 },
                { id: "2", text: "Mittags (10-14 Uhr)", votes: 78 },
                { id: "3", text: "Nachmittags (14-18 Uhr)", votes: 104 },
                { id: "4", text: "Abends (18-22 Uhr)", votes: 135 },
                { id: "5", text: "Nachts (22-6 Uhr)", votes: 47 }
              ]}
            />
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
            {[
              {
                title: "Morgenmelodien Spezial",
                host: "Maria Müller",
                image: "https://placehold.co/300x300/242938/FFFFFF?text=Morgenmelodien",
                date: "2025-04-01"
              },
              {
                title: "Wochenendauftakt: DJ Maxi",
                host: "Max Schneider",
                image: "https://placehold.co/300x300/242938/FFFFFF?text=Wochenendauftakt",
                date: "2025-03-30"
              },
              {
                title: "Nachtlounge: Entspannung",
                host: "Sophia Becker",
                image: "https://placehold.co/300x300/242938/FFFFFF?text=Nachtlounge",
                date: "2025-03-29"
              },
              {
                title: "Technikecke: Neue Gadgets",
                host: "Thomas Weber",
                image: "https://placehold.co/300x300/242938/FFFFFF?text=Technikecke",
                date: "2025-03-28"
              }
            ].map((item, index) => (
              <div key={index} className="bg-card/30 rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                    <p className="text-sm text-white">{new Date(item.date).toLocaleDateString('de-DE')}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-radio-light/70">Mit {item.host}</p>
                </div>
              </div>
            ))}
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
