
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import RadioPlayer from "@/components/RadioPlayer";
import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";

const STREAM_URL = "https://backend.piper-lee.net/listen/piper-lee/radio.mp3";
const STATION_NAME = "Piper Lee Radio";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Simple animation on load
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
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
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Button 
                    className="bg-radio-purple hover:bg-radio-purple/90 text-white rounded-full px-8"
                  >
                    Unsere Programme
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-radio-blue text-radio-blue hover:bg-radio-blue/10 rounded-full px-8"
                  >
                    Über Uns
                  </Button>
                </div>
              </div>
              
              <div className="lg:w-1/2 flex justify-center">
                <RadioPlayer streamUrl={STREAM_URL} stationName={STATION_NAME} />
              </div>
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
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Premium Inhalte",
                  description: "Genießen Sie hochwertige Musik und Shows, kuratiert von unserem erfahrenen Team aus Produzenten und DJs."
                },
                {
                  title: "Live-Sendungen",
                  description: "Schalten Sie ein zu unseren spannenden Live-Übertragungen mit besonderen Gästen, Interviews und Höreranrufen."
                },
                {
                  title: "Gemeinschaftsfokus",
                  description: "Wir sind mehr als nur Radio - wir sind eine Gemeinschaft von Musikliebhabern und Kreativen, die unsere Leidenschaft teilen."
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="bg-card/50 backdrop-blur-sm p-6 rounded-lg hover:transform hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-radio-light/70">{item.description}</p>
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
                  className={`flex items-center justify-between p-4 ${
                    index % 2 === 0 ? "bg-card" : "bg-card/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-radio-purple font-semibold w-24">{item.day}</div>
                    <div className="font-medium">{item.show}</div>
                  </div>
                  <div className="text-radio-light/70">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-radio-dark/80 backdrop-blur-sm border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Radio className="h-5 w-5 text-radio-purple" />
              <p className="text-sm text-radio-light/70">
                © 2025 Piper Lee Radio. Alle Rechte vorbehalten.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center">
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
        </div>
      </footer>
    </div>
  );
};

export default Index;
