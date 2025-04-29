
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import PollManagement from '@/components/dashboard/PollManagement';
import { 
  Settings, 
  Users, 
  Radio, 
  Calendar,
  BarChart,
  Plus,
  RefreshCw,
  Download,
  ArrowUpRight,
  PieChart
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface UserRole {
  id: string;
  user_id: string;
  role: string;
}

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch roles from user_roles table
  const { data: userRoles } = useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data as UserRole[];
    },
    enabled: isAdmin
  });

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

  const handleRefreshStats = () => {
    setRefreshing(true);
    queryClient.invalidateQueries();
    setTimeout(() => {
      toast({
        title: "Statistiken aktualisiert",
        description: "Die Daten wurden erfolgreich aktualisiert.",
      });
      setRefreshing(false);
    }, 1000);
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
          <Settings className="h-8 w-8 text-radio-purple" />
          Admin-Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefreshStats}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportieren
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="mb-4 bg-background border">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="shows">Sendungen</TabsTrigger>
          <TabsTrigger value="polls">Umfragen</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <DashboardStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <DashboardCard
              title="Aktuelle Benutzer"
              icon={<Users className="h-5 w-5 text-radio-purple" />}
              actionButton={
                <Button variant="ghost" size="sm" asChild>
                  <a href="/admin" className="flex items-center gap-1 text-xs">
                    Verwalten <ArrowUpRight className="h-3 w-3" />
                  </a>
                </Button>
              }
            >
              <RecentUsers />
            </DashboardCard>
            
            <DashboardCard
              title="Anstehende Sendungen"
              icon={<Calendar className="h-5 w-5 text-radio-purple" />}
              actionButton={
                <Button variant="ghost" size="sm" asChild>
                  <a href="/moderator" className="flex items-center gap-1 text-xs">
                    Verwalten <ArrowUpRight className="h-3 w-3" />
                  </a>
                </Button>
              }
            >
              <UpcomingShows />
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <DashboardCard
            title="Benutzerverwaltung" 
            icon={<Users className="h-5 w-5 text-radio-purple" />}
            className="mb-6"
            actionButton={
              <Button size="sm" asChild>
                <a href="/admin">
                  <Plus className="h-4 w-4 mr-2" />
                  Benutzer verwalten
                </a>
              </Button>
            }
          >
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
              <p className="text-sm text-yellow-800">
                Eine vollständige Verwaltung aller Benutzer und deren Rechte finden Sie im <a href="/admin" className="text-radio-purple hover:underline font-medium">Admin-Bereich</a>.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Benutzerrollen</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Administratoren</h4>
                    <Badge variant="outline" className="bg-blue-50">
                      {userRoles?.filter(r => r.role === 'admin').length || 0}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Voller Zugriff auf alle Funktionen</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Moderatoren</h4>
                    <Badge variant="outline" className="bg-purple-50">
                      {userRoles?.filter(r => r.role === 'moderator').length || 0}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Können Sendungen und Inhalte verwalten</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Benutzer</h4>
                    <Badge variant="outline" className="bg-green-50">
                      {userRoles?.filter(r => r.role === 'user').length || 0}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Standard-Zugriff auf die Plattform</p>
                </div>
              </div>
            </div>
          </DashboardCard>
          
          <RecentUsers />
        </TabsContent>
        
        <TabsContent value="shows">
          <DashboardCard
            title="Sendungsverwaltung" 
            icon={<Radio className="h-5 w-5 text-radio-purple" />}
            className="mb-6"
            actionButton={
              <Button size="sm" asChild>
                <a href="/moderator-dashboard">
                  <Plus className="h-4 w-4 mr-2" />
                  Sendungen verwalten
                </a>
              </Button>
            }
          >
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mb-4">
              <p className="text-sm text-blue-800">
                Eine vollständige Verwaltung aller Sendungen und des Sendeplans finden Sie im <a href="/moderator-dashboard" className="text-radio-purple hover:underline font-medium">Moderatoren-Dashboard</a> oder im <a href="/moderator" className="text-radio-purple hover:underline font-medium">Sendeplan-Manager</a>.
              </p>
            </div>
          </DashboardCard>
          
          <UpcomingShows />
        </TabsContent>

        <TabsContent value="polls">
          <DashboardCard
            title="Umfrageverwaltung" 
            icon={<PieChart className="h-5 w-5 text-radio-purple" />}
            headerClassName="border-b pb-4"
          >
            <PollManagement />
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="grid gap-6">
            <DashboardCard
              title="Benutzerregistrierung"
              icon={<Settings className="h-5 w-5 text-radio-purple" />}
              headerClassName="border-b pb-4"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-2 rounded-md bg-gray-50">
                  <Switch
                    id="registration-mode"
                    checked={registrationEnabled}
                    onCheckedChange={toggleRegistration}
                    disabled={loading}
                    className="data-[state=checked]:bg-radio-purple"
                  />
                  <Label htmlFor="registration-mode" className="font-medium">
                    Registrierung ist {registrationEnabled ? 'aktiviert' : 'deaktiviert'}
                  </Label>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-700">
                    {registrationEnabled
                      ? "Neue Benutzer können sich registrieren. Der erste Benutzer erhält automatisch Administrator-Rechte."
                      : "Registrierung ist gesperrt. Nur bestehende Benutzer können sich anmelden."
                    }
                  </p>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="System-Status"
              icon={<BarChart className="h-5 w-5 text-radio-purple" />}
              headerClassName="border-b pb-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-md bg-gray-50">
                  <span className="font-medium">Datenbank-Status:</span>
                  <Badge variant="success" className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Online
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-md bg-gray-50">
                  <span className="font-medium">API-Status:</span>
                  <Badge variant="success" className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Online
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-md bg-gray-50">
                  <span className="font-medium">Streaming-Server:</span>
                  <Badge variant="success" className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Online
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-md bg-gray-50">
                  <span className="font-medium">Letztes Backup:</span>
                  <span className="text-sm">29.04.2025, 04:00 Uhr</span>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Website-Einstellungen"
              icon={<Settings className="h-5 w-5 text-radio-purple" />}
              headerClassName="border-b pb-4"
            >
              <div className="space-y-3 p-4">
                <p className="text-sm text-gray-700 mb-4">
                  Hier können Sie verschiedene Einstellungen für die Website vornehmen.
                </p>

                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maintenance-mode" 
                      className="data-[state=checked]:bg-radio-purple"
                    />
                    <Label htmlFor="maintenance-mode" className="font-medium">Wartungsmodus</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="show-listener-count"
                      defaultChecked
                      className="data-[state=checked]:bg-radio-purple"
                    />
                    <Label htmlFor="show-listener-count" className="font-medium">Hörerzahl anzeigen</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enable-comments"
                      defaultChecked
                      className="data-[state=checked]:bg-radio-purple"
                    />
                    <Label htmlFor="enable-comments" className="font-medium">Kommentare aktivieren</Label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button>Einstellungen speichern</Button>
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
