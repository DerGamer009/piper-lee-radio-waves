
import { ArrowLeft, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Imprint = () => {
  return (
    <div className="min-h-screen bg-radio-dark">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-radio-light hover:text-white">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Startseite
            </Link>
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto bg-card/20 backdrop-blur-sm p-8 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <Info className="h-8 w-8 text-radio-purple" />
            <h1 className="text-3xl font-bold">Impressum</h1>
          </div>
          
          <div className="space-y-6 text-radio-light/80">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">Angaben gemäß § 5 TMG</h2>
              <p>Piper Lee Radio GmbH</p>
              <p>Radiostraße 123</p>
              <p>10115 Berlin</p>
              <p>Deutschland</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">Kontakt</h2>
              <p>Telefon: +49 30 1234567</p>
              <p>E-Mail: info@piper-lee.net</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">Vertretungsberechtigte</h2>
              <p>Geschäftsführer: Peter Müller</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">Registereintrag</h2>
              <p>Eintragung im Handelsregister</p>
              <p>Registergericht: Amtsgericht Berlin-Charlottenburg</p>
              <p>Registernummer: HRB 123456</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">Aufsichtsbehörde</h2>
              <p>Landesmedienanstalt Berlin-Brandenburg (mabb)</p>
              <p>Kleine Präsidentenstraße 1</p>
              <p>10178 Berlin</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">Verantwortlich für den Inhalt</h2>
              <p>Peter Müller (Anschrift wie oben)</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imprint;
