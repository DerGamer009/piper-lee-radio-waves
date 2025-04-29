
import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAdmin } = useAuth();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <main className="flex-1 pt-20 md:pt-32">
        {children}
      </main>
      <footer className="bg-radio-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Über uns</h3>
              <p className="text-radio-light text-sm">
                Piper-Lee Radio bringt die beste Musik und Unterhaltung direkt zu Ihnen. 
                Wir sind Ihr Begleiter durch den Tag mit aktuellen Hits, Nachrichten und spannenden Gesprächen.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Links</h3>
              <nav className="flex flex-col space-y-2">
                <Link to="/sendeplan" className="text-radio-light hover:text-white transition-colors">Sendeplan</Link>
                <Link to="/podcasts" className="text-radio-light hover:text-white transition-colors">Podcasts</Link>
                <Link to="/news" className="text-radio-light hover:text-white transition-colors">News</Link>
                <Link to="/charts" className="text-radio-light hover:text-white transition-colors">Charts</Link>
                <Link to="/kontakt" className="text-radio-light hover:text-white transition-colors">Kontakt</Link>
              </nav>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Rechtliches</h3>
              <nav className="flex flex-col space-y-2">
                <Link to="/datenschutz" className="text-radio-light hover:text-white transition-colors">Datenschutz</Link>
                <Link to="/impressum" className="text-radio-light hover:text-white transition-colors">Impressum</Link>
                <Link to="/nutzungsbedingungen" className="text-radio-light hover:text-white transition-colors">AGB</Link>
              </nav>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Radio Piper-Lee. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
