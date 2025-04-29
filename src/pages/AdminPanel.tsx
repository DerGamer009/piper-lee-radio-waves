
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Wrench, Users, Settings, Radio, ChevronRight, RefreshCw } from 'lucide-react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentUsers from '@/components/dashboard/RecentUsers';
import UpcomingShows from '@/components/dashboard/UpcomingShows';
import PollManagement from '@/components/dashboard/PollManagement';
import NewsManagement from '@/components/dashboard/NewsManagement';

const AdminPanel = () => {
  const { isAdmin, isMaintenanceMode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(isMaintenanceMode);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Update local state when the maintenance mode changes in the context
    setIsMaintenance(isMaintenanceMode);
  }, [isMaintenanceMode]);

  const handleMaintenanceModeChange = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ value: (!isMaintenance).toString(), updated_at: new Date().toISOString() })
        .eq('key', 'maintenance_mode');

      if (error) {
        throw error;
      }

      setIsMaintenance(!isMaintenance);
      toast({
        title: !isMaintenance ? "Wartungsmodus aktiviert" : "Wartungsmodus deaktiviert",
        description: !isMaintenance 
          ? "Die Website ist jetzt im Wartungsmodus und nur für Administratoren zugänglich." 
          : "Die Website ist jetzt wieder für alle Benutzer zugänglich.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: `Wartungsmodus konnte nicht geändert werden: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Aktualisiert",
        description: "Die Daten wurden aktualisiert.",
      });
    }, 1000);
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-6">Zugriff verweigert</h1>
        <p>Sie haben keine Berechtigung, auf diesen Bereich zuzugreifen.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin-Panel</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Aktualisieren
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="content">Inhalte</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <DashboardStats />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UpcomingShows />
            <RecentUsers />
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Benutzerverwaltung
              </CardTitle>
              <CardDescription>
                Hier können Sie Benutzer verwalten und ihre Rollen ändern.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Die Benutzerverwaltung wird derzeit implementiert. Bitte schauen Sie später noch einmal vorbei.
              </p>
              <Button variant="outline">
                Benutzer anzeigen <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-6">
            <PollManagement />
            <NewsManagement />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Website-Einstellungen
                </CardTitle>
                <CardDescription>
                  Konfigurieren Sie Einstellungen für die Radio-Website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Wartungsmodus Einstellung */}
                <div className="border border-border/40 rounded-lg p-4 bg-card/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench className="h-5 w-5 text-amber-500" />
                        <h3 className="font-medium">Wartungsmodus</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Aktivieren Sie den Wartungsmodus, wenn Sie Wartungsarbeiten an der Website durchführen möchten. 
                        Nur Administratoren können im Wartungsmodus auf die Website zugreifen.
                      </p>
                    </div>
                    <div className="ml-6 flex items-center">
                      <Switch
                        id="maintenance-mode"
                        checked={isMaintenance}
                        disabled={isLoading}
                        onCheckedChange={handleMaintenanceModeChange}
                      />
                    </div>
                  </div>
                  {isMaintenance && (
                    <div className="mt-2 flex items-start p-3 rounded border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
                      <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <p className="text-xs">
                        Der Wartungsmodus ist aktiv. Die Website ist nur für Administratoren zugänglich.
                        Normale Benutzer werden zur Wartungsseite weitergeleitet.
                      </p>
                    </div>
                  )}
                </div>

                {/* Streaming-Status Einstellung */}
                <div className="border border-border/40 rounded-lg p-4 bg-card/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Radio className="h-5 w-5 text-green-500" />
                        <h3 className="font-medium">Live-Stream</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Verwalten Sie hier den Status des Live-Streams.
                      </p>
                    </div>
                    <div className="ml-6 flex items-center">
                      <Label htmlFor="stream-status" className="mr-2 text-sm">Aktiv</Label>
                      <Switch id="stream-status" defaultChecked={true} />
                    </div>
                  </div>
                </div>

                {/* Weitere Einstellungen können hier hinzugefügt werden */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
