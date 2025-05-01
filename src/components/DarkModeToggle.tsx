
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Prüfe die Systemeinstellung, wenn keine Einstellung gespeichert ist
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const { toast } = useToast();

  // Apply theme changes whenever isDarkMode changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      htmlElement.classList.add('theme-dark');
      htmlElement.classList.remove('theme-light');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.classList.remove('theme-dark');
      htmlElement.classList.add('theme-light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change theme if user hasn't set a preference manually
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    toast({
      title: newMode ? "Dunkelmodus aktiviert" : "Hellmodus aktiviert",
      description: newMode 
        ? "Die Benutzeroberfläche wurde auf Dunkelmodus umgestellt." 
        : "Die Benutzeroberfläche wurde auf Hellmodus umgestellt.",
      duration: 2000,
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      className="rounded-full h-8 w-8 border-muted"
      title={isDarkMode ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
      aria-label={isDarkMode ? "Hellmodus aktivieren" : "Dunkelmodus aktivieren"}
    >
      {isDarkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">
        {isDarkMode ? "Hellmodus aktivieren" : "Dunkelmodus aktivieren"}
      </span>
    </Button>
  );
};
