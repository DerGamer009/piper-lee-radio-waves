
import { ArrowLeft, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Partner = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 md:mb-12 flex items-center">
            <Button asChild variant="ghost" className="text-radio-light hover:text-white">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Zurück zur Startseite
              </Link>
            </Button>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Unsere Partner</h1>
            <p className="text-radio-light/70 max-w-2xl mx-auto">
              Wir arbeiten mit erstklassigen Partnern zusammen, um Ihnen das beste Radioerlebnis zu bieten.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "Soundwave Studios",
                description: "Professionelle Tonstudios für Aufnahmen und Interviews.",
                logo: "🎧",
                website: "#"
              },
              {
                name: "MusicMasters",
                description: "Experten für Musikproduktion und Sounddesign.",
                logo: "🎵",
                website: "#"
              },
              {
                name: "Digital Broadcast",
                description: "Führende Technologielösungen für Radiostationen.",
                logo: "📡",
                website: "#"
              },
              {
                name: "Media Connect",
                description: "Werbe- und PR-Agentur für Medienunternehmen.",
                logo: "📱",
                website: "#"
              },
              {
                name: "Event Horizon",
                description: "Organisation und Durchführung von Live-Events.",
                logo: "🎪",
                website: "#"
              },
              {
                name: "Global Reach",
                description: "Internationales Netzwerk für Mediendistribution.",
                logo: "🌐",
                website: "#"
              }
            ].map((partner, index) => (
              <div 
                key={index} 
                className="bg-card/50 backdrop-blur-sm p-6 rounded-lg hover:transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{partner.logo}</div>
                <h3 className="text-xl font-semibold mb-3">{partner.name}</h3>
                <p className="text-radio-light/70 mb-4">{partner.description}</p>
                <a 
                  href={partner.website} 
                  className="inline-block text-radio-purple hover:text-radio-blue transition-colors"
                >
                  Website besuchen →
                </a>
              </div>
            ))}
          </div>
          
          <div className="max-w-3xl mx-auto bg-card/20 backdrop-blur-sm p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Werden Sie Partner</h2>
            <p className="text-radio-light/80 mb-6">
              Sind Sie an einer Partnerschaft mit Piper Lee Radio interessiert? Wir sind immer offen für neue Kooperationen, 
              die unser Programm und unsere Reichweite erweitern. Kontaktieren Sie uns für weitere Informationen.
            </p>
            <Button 
              asChild
              className="bg-radio-purple hover:bg-radio-purple/90 text-white rounded-full px-8"
            >
              <Link to="/kontakt">Jetzt Kontakt aufnehmen</Link>
            </Button>
          </div>
        </div>
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

export default Partner;
