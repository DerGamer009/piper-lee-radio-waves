
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, AlertTriangle, HelpCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Fehler: Benutzer hat versucht, eine nicht existierende Route aufzurufen:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-radio-dark to-black p-4">
      <div className="max-w-md w-full bg-card/20 backdrop-blur-lg border border-white/10 rounded-xl p-6 md:p-8 text-center animate-in fade-in slide-in-from-bottom duration-500">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-radio-purple/30 blur-md animate-pulse"></div>
            <div className="relative bg-black/70 rounded-full p-4">
              <AlertTriangle size={70} className="text-radio-purple" />
              <span className="absolute text-3xl font-bold text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                404
              </span>
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">Oops, Seite nicht gefunden</h1>
        
        <p className="text-radio-light mb-6">
          Die von Ihnen gesuchte Seite <span className="font-mono bg-black/30 px-2 py-1 rounded text-red-400">{location.pathname}</span> existiert leider nicht.
        </p>
        
        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <Button asChild variant="default" className="bg-radio-purple hover:bg-radio-purple/80 text-white shadow-md shadow-radio-purple/25 transition-all hover:shadow-lg hover:-translate-y-0.5">
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Zur Startseite
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-radio-light/30 text-radio-light hover:text-white hover:bg-white/5 transition-all">
            <Link to="/news" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zu den News
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 border-t border-white/10 pt-6 text-sm text-radio-light/70">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HelpCircle className="h-4 w-4 text-radio-purple/70" />
            <span>Brauchen Sie Hilfe?</span>
          </div>
          <p>
            Wenn Sie glauben, dass dieser Fehler nicht auftreten sollte, kontaktieren Sie bitte unseren
            <Link to="/kontakt" className="text-radio-purple hover:text-radio-blue ml-1 underline">
              Support
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
