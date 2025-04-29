
import { useState, useEffect } from "react";
import { Radio, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-radio-dark/90 backdrop-blur-md shadow-lg py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-7 w-7 text-radio-purple" />
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-white">piper</span>
            <span className="text-radio-purple">-</span>
            <span className="text-radio-blue">lee</span>
          </h1>
        </div>
        
        {isMobile ? (
          <>
            <button 
              className="text-white p-2" 
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {menuOpen && (
              <div className="absolute top-full left-0 right-0 bg-radio-dark/95 backdrop-blur-md py-4 shadow-lg">
                <nav className="flex flex-col items-center gap-6">
                  <Link 
                    to="/" 
                    className="text-radio-light hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Startseite
                  </Link>
                  <Link 
                    to="/news" 
                    className="text-radio-light hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    News
                  </Link>
                  <a 
                    href="#about" 
                    className="text-radio-light hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Über Uns
                  </a>
                  <a 
                    href="#schedule" 
                    className="text-radio-light hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Programmplan
                  </a>
                  <Link 
                    to="/partner" 
                    className="text-radio-light hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Partner
                  </Link>
                  <Link 
                    to="/sendeplan" 
                    className="text-radio-light hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sendeplan
                  </Link>
                  <Link 
                    to="/kontakt" 
                    className="text-radio-light hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Kontakt
                  </Link>
                </nav>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center gap-8">
            <Link 
              to="/" 
              className="text-radio-light hover:text-white transition-colors"
            >
              Startseite
            </Link>
            <Link 
              to="/news" 
              className="text-radio-light hover:text-white transition-colors"
            >
              News
            </Link>
            <a 
              href="#about" 
              className="text-radio-light hover:text-white transition-colors"
            >
              Über Uns
            </a>
            <a 
              href="#schedule" 
              className="text-radio-light hover:text-white transition-colors"
            >
              Programmplan
            </a>
            <Link 
              to="/partner" 
              className="text-radio-light hover:text-white transition-colors"
            >
              Partner
            </Link>
            <Link 
              to="/sendeplan" 
              className="text-radio-light hover:text-white transition-colors"
            >
              Sendeplan
            </Link>
            <Link 
              to="/kontakt" 
              className="text-radio-light hover:text-white transition-colors"
            >
              Kontakt
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
