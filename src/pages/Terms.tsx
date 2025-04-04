
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Terms = () => {
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
            <Shield className="h-8 w-8 text-radio-blue" />
            <h1 className="text-3xl font-bold">Nutzungsbedingungen</h1>
          </div>
          
          <div className="space-y-6 text-radio-light/80">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">1. Geltungsbereich</h2>
              <p>
                Diese Nutzungsbedingungen regeln die Nutzung des Webradio-Angebotes von Piper Lee Radio. Mit der Nutzung unseres Angebots erkennen Sie diese Bedingungen an.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">2. Leistungsbeschreibung</h2>
              <p>
                Piper Lee Radio bietet ein Webradio-Angebot mit verschiedenen Musikprogrammen und Unterhaltungsformaten. Die Nutzung des Angebots ist kostenlos.
              </p>
              <p className="mt-3">
                Wir behalten uns vor, das Angebot jederzeit ohne Vorankündigung zu ändern, zu erweitern oder einzuschränken.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">3. Nutzungsrechte</h2>
              <p>
                Die auf unserer Website bereitgestellten Inhalte unterliegen dem Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">4. Pflichten des Nutzers</h2>
              <p>
                Bei der Nutzung unseres Angebots sind Sie verpflichtet:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>keine rechtswidrigen, beleidigenden oder anderweitig anstößigen Inhalte zu verbreiten</li>
                <li>keine Schadsoftware oder andere schädliche Programme zu verbreiten</li>
                <li>keine Maßnahmen zu ergreifen, die die Infrastruktur unseres Angebots überlasten können</li>
                <li>keine Daten anderer Nutzer unbefugt zu sammeln oder zu speichern</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">5. Haftungsausschluss</h2>
              <p>
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
              </p>
              <p className="mt-3">
                Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
