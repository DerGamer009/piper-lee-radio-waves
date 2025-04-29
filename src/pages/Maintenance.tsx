
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Wrench, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Maintenance = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <div className="bg-amber-900/30 p-6 rounded-full">
            <Wrench className="h-16 w-16 text-amber-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mt-6">
          Website-Wartung
        </h1>

        <div className="bg-card/60 backdrop-blur-md border border-white/5 shadow-md p-6 rounded-lg mt-8">
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-4" />
          <p className="text-lg mb-4">
            Unsere Website wird gerade gewartet. Wir sind bald wieder für Sie da!
          </p>
          <p className="text-sm text-muted-foreground">
            Wir führen momentan Wartungsarbeiten durch, um unser Angebot zu verbessern. 
            Bitte versuchen Sie es später noch einmal.
          </p>
        </div>

        {isAdmin && (
          <div className="mt-8 bg-blue-900/20 border border-blue-700/20 p-4 rounded-lg">
            <p className="text-sm text-blue-300 mb-4">
              <strong>Hinweis für Administratoren:</strong> Sie sehen diese Nachricht, weil Sie ein Administrator sind. 
              Der Wartungsmodus kann im Admin-Panel deaktiviert werden.
            </p>
            <div className="flex space-x-4 justify-center">
              <Button variant="outline" asChild>
                <Link to="/admin/panel" className="flex items-center gap-2">
                  Zum Admin-Panel
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Zur Startseite
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
