
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  const { isAdmin } = useAuth();
  const { isMobile } = useIsMobile();
  
  // Apply transition classes to page elements for smooth theme transitions
  useEffect(() => {
    const elements = document.querySelectorAll('button, a, div, span, p, h1, h2, h3, h4, h5, h6');
    elements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.classList.add('transition-colors', 'duration-300');
      }
    });
    
    return () => {
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.classList.remove('transition-colors', 'duration-300');
        }
      });
    };
  }, []);
  
  // Layout with sidebar
  if (showSidebar) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {children}
        </div>
        <Toaster />
      </SidebarProvider>
    );
  }
  
  // Standard layout without sidebar
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16 md:pt-20 lg:pt-32">
        {children}
      </main>
      <footer className="bg-card text-foreground py-6 md:py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Über uns</h3>
              <p className="text-foreground/70 text-sm">
                Piper-Lee Radio bringt die beste Musik und Unterhaltung direkt zu Ihnen. 
                Wir sind Ihr Begleiter durch den Tag mit aktuellen Hits, Nachrichten und spannenden Gesprächen.
              </p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Links</h3>
              <nav className="flex flex-col space-y-2">
                <Link to="/sendeplan" className="text-foreground/70 hover:text-foreground transition-colors">Sendeplan</Link>
                <Link to="/podcasts" className="text-foreground/70 hover:text-foreground transition-colors">Podcasts</Link>
                <Link to="/news" className="text-foreground/70 hover:text-foreground transition-colors">News</Link>
                <Link to="/charts" className="text-foreground/70 hover:text-foreground transition-colors">Charts</Link>
                <Link to="/kontakt" className="text-foreground/70 hover:text-foreground transition-colors">Kontakt</Link>
              </nav>
            </div>
            <div className={isMobile ? "mt-4 sm:mt-0" : ""}>
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Rechtliches</h3>
              <nav className="flex flex-col space-y-2">
                <Link to="/datenschutz" className="text-foreground/70 hover:text-foreground transition-colors">Datenschutz</Link>
                <Link to="/impressum" className="text-foreground/70 hover:text-foreground transition-colors">Impressum</Link>
                <Link to="/nutzungsbedingungen" className="text-foreground/70 hover:text-foreground transition-colors">AGB</Link>
              </nav>
            </div>
          </div>
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-border/20 text-center text-xs text-foreground/50">
            © {new Date().getFullYear()} Radio Piper-Lee. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
