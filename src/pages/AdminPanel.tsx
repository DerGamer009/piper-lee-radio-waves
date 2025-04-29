
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardCard from '@/components/dashboard/DashboardCard';
import RecentUsers from '@/components/dashboard/RecentUsers';
import UpcomingShows from '@/components/dashboard/UpcomingShows';
import { 
  Settings, 
  Users, 
  Radio, 
  Calendar,
  BarChart
} from 'lucide-react';

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
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Admin-Dashboard
        </h1>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="shows">Sendungen</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <DashboardStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <DashboardCard
              title="Aktuelle Benutzer"
              icon={<Users className="h-5 w-5" />}
            >
              <RecentUsers />
            </DashboardCard>
            
            <DashboardCard
              title="Anstehende Sendungen"
              icon={<Calendar className="h-5 w-5" />}
            >
              <UpcomingShows />
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <DashboardCard
            title="Benutzerverwaltung" 
            icon={<Users className="h-5 w-5" />}
            className="mb-6"
          >
            <div className="p-4">
              <p>Eine vollständige Liste aller Benutzer und deren Verwaltung finden Sie im <a href="/admin" className="text-radio-purple hover:underline">Admin-Bereich</a>.</p>
            </div>
          </DashboardCard>
          
          <RecentUsers />
        </TabsContent>
        
        <TabsContent value="shows">
          <DashboardCard
            title="Sendungsverwaltung" 
            icon={<Radio className="h-5 w-5" />}
            className="mb-6"
          >
            <div className="p-4">
              <p>Eine vollständige Liste aller Sendungen und deren Verwaltung finden Sie im <a href="/moderator" className="text-radio-purple hover:underline">Moderatoren-Bereich</a>.</p>
            </div>
          </DashboardCard>
          
          <UpcomingShows />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="grid gap-6">
            <DashboardCard
              title="Benutzerregistrierung"
              icon={<Settings className="h-5 w-5" />}
            >
              <div className="space-y-4">
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
                <p className="text-sm text-muted-foreground">
                  {registrationEnabled
                    ? "Neue Benutzer können sich registrieren. Der erste Benutzer erhält automatisch Administrator-Rechte."
                    : "Registrierung ist gesperrt. Nur bestehende Benutzer können sich anmelden."
                  }
                </p>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="System-Status"
              icon={<BarChart className="h-5 w-5" />}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Datenbank-Status:</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>API-Status:</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Streaming-Server:</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Letztes Backup:</span>
                  <span className="font-medium">29.04.2025, 04:00 Uhr</span>
                </div>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
