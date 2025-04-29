
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'registration_enabled')
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      setRegistrationEnabled(data.value === 'true');
    };

    if (isAdmin) {
      fetchSettings();
    }
  }, [isAdmin]);

  const toggleRegistration = async () => {
    setLoading(true);
    try {
      const newValue = !registrationEnabled;
      const { error } = await supabase
        .from('app_settings')
        .update({ value: newValue ? 'true' : 'false' })
        .eq('key', 'registration_enabled');

      if (error) {
        throw error;
      }

      setRegistrationEnabled(newValue);
      toast({
        title: "Einstellung aktualisiert",
        description: `Die Registrierung ist jetzt ${newValue ? 'aktiviert' : 'deaktiviert'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: "Die Einstellung konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
      console.error('Error updating registration setting:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin-Bereich</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Benutzerregistrierung</CardTitle>
            <CardDescription>
              Steuern Sie die Möglichkeit für neue Benutzer, sich zu registrieren
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="registration-mode"
                checked={registrationEnabled}
                onCheckedChange={toggleRegistration}
                disabled={loading}
              />
              <Label htmlFor="registration-mode">
                Registrierung ist {registrationEnabled ? 'aktiviert' : 'deaktiviert'}
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              {registrationEnabled
                ? "Neue Benutzer können sich registrieren. Der erste Benutzer erhält automatisch Administrator-Rechte."
                : "Registrierung ist gesperrt. Nur bestehende Benutzer können sich anmelden."
              }
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
