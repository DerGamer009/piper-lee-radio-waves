
import { useState, useEffect } from "react";
import { Radio } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#" 
            className="text-radio-light hover:text-white transition-colors"
          >
            Startseite
          </a>
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
