
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Wrench, Users, Settings, Radio, ChevronRight, RefreshCw, Database, Archive, History, ServerCog, Trash, Download, Upload } from 'lucide-react';
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
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [settingsTab, setSettingsTab] = useState('general');
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [optimizingDatabase, setOptimizingDatabase] = useState(false);

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

  const handleCreateBackup = () => {
    setBackupInProgress(true);
    
    // Simulate backup process
    setTimeout(() => {
      setBackupInProgress(false);
      toast({
        title: "Backup erstellt",
        description: "Das Backup wurde erfolgreich erstellt und gespeichert.",
      });
    }, 2000);
  };

  const handleRestoreBackup = (backupDate: string) => {
    setRestoreInProgress(true);
    
    // Simulate restore process
    setTimeout(() => {
      setRestoreInProgress(false);
      toast({
        title: "Backup wiederhergestellt",
        description: `Das Backup vom ${backupDate} wurde erfolgreich wiederhergestellt.`,
      });
    }, 3000);
  };

  const handleOptimizeDatabase = () => {
    setOptimizingDatabase(true);
    
    // Simulate database optimization
    setTimeout(() => {
      setOptimizingDatabase(false);
      toast({
        title: "Datenbank optimiert",
        description: "Die Datenbank wurde erfolgreich optimiert und bereinigt.",
      });
    }, 2500);
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
              <CardContent>
                <Tabs value={settingsTab} onValueChange={setSettingsTab} className="w-full">
                  <TabsList className="mb-4 grid grid-cols-3 md:w-auto md:inline-flex">
                    <TabsTrigger value="general">Allgemein</TabsTrigger>
                    <TabsTrigger value="backup">Backup & Wartung</TabsTrigger>
                    <TabsTrigger value="database">Datenbank</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-6">
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
                  </TabsContent>
                  
                  <TabsContent value="backup" className="space-y-6">
                    {/* Backup-Sektion */}
                    <div className="border border-border/40 rounded-lg p-4 bg-card/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Database className="h-5 w-5 text-blue-500" />
                            <h3 className="font-medium">Datenbankbackup</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Erstellen Sie ein vollständiges Backup der Datenbank, um Ihre Daten zu sichern.
                            Backups werden sicher in der Cloud gespeichert.
                          </p>
                          <Button 
                            onClick={handleCreateBackup} 
                            disabled={backupInProgress}
                            className="mb-2"
                          >
                            {backupInProgress ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Backup wird erstellt...
                              </>
                            ) : (
                              <>
                                <Database className="h-4 w-4 mr-2" />
                                Backup jetzt erstellen
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Backup-Verlauf */}
                    <div className="border border-border/40 rounded-lg p-4 bg-card/50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium flex items-center gap-2">
                          <History className="h-5 w-5 text-indigo-500" />
                          Backup-Verlauf
                        </h3>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Upload className="h-4 w-4" />
                          Backup hochladen
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 border-b">
                          <div>
                            <p className="font-medium">Vollständiges Backup</p>
                            <p className="text-xs text-muted-foreground">29.04.2025 - 08:45</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRestoreBackup("29.04.2025")} 
                              disabled={restoreInProgress}
                              className="flex items-center gap-1"
                            >
                              {restoreInProgress ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Archive className="h-3 w-3" />
                              )}
                              Wiederherstellen
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 border-b">
                          <div>
                            <p className="font-medium">Wöchentliches Backup</p>
                            <p className="text-xs text-muted-foreground">22.04.2025 - 03:00</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRestoreBackup("22.04.2025")}
                              disabled={restoreInProgress}
                              className="flex items-center gap-1"
                            >
                              {restoreInProgress ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Archive className="h-3 w-3" />
                              )}
                              Wiederherstellen
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 border-b">
                          <div>
                            <p className="font-medium">Manuelles Backup</p>
                            <p className="text-xs text-muted-foreground">15.04.2025 - 14:22</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRestoreBackup("15.04.2025")}
                              disabled={restoreInProgress}
                              className="flex items-center gap-1"
                            >
                              {restoreInProgress ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Archive className="h-3 w-3" />
                              )}
                              Wiederherstellen
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Backup-Einstellungen */}
                    <div className="border border-border/40 rounded-lg p-4 bg-card/50">
                      <h3 className="font-medium mb-4 flex items-center gap-2">
                        <ServerCog className="h-5 w-5 text-gray-500" />
                        Backup-Einstellungen
                      </h3>
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="auto-backup" className="font-medium">Automatisches Backup</Label>
                            <p className="text-xs text-muted-foreground">Wöchentliches Backup der Datenbank</p>
                          </div>
                          <Switch id="auto-backup" defaultChecked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="backup-retention" className="font-medium">Aufbewahrungsdauer</Label>
                            <p className="text-xs text-muted-foreground">Wie lange sollen Backups aufbewahrt werden</p>
                          </div>
                          <select 
                            id="backup-retention"
                            className="w-32 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                            defaultValue="30"
                          >
                            <option value="7">7 Tage</option>
                            <option value="14">14 Tage</option>
                            <option value="30">30 Tage</option>
                            <option value="90">90 Tage</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="database" className="space-y-6">
                    {/* Database Status */}
                    <div className="border border-border/40 rounded-lg p-4 bg-card/50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium flex items-center gap-2">
                          <Database className="h-5 w-5 text-blue-500" />
                          Datenbankstatus
                        </h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleOptimizeDatabase}
                          disabled={optimizingDatabase}
                          className="flex items-center gap-1"
                        >
                          {optimizingDatabase ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                              Optimierung läuft...
                            </>
                          ) : (
                            <>
                              <ServerCog className="h-4 w-4 mr-1" />
                              Datenbank optimieren
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <div className="p-3 bg-background/40 border rounded-md">
                          <p className="text-sm text-muted-foreground">Größe</p>
                          <p className="text-xl font-medium">256 MB</p>
                        </div>
                        <div className="p-3 bg-background/40 border rounded-md">
                          <p className="text-sm text-muted-foreground">Tabellen</p>
                          <p className="text-xl font-medium">12</p>
                        </div>
                        <div className="p-3 bg-background/40 border rounded-md">
                          <p className="text-sm text-muted-foreground">Status</p>
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                            <p className="font-medium">Optimal</p>
                          </div>
                        </div>
                      </div>

                      {/* Database Tables */}
                      <h4 className="font-medium text-sm text-muted-foreground mb-3">Datenbanktabellen</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {['users', 'profiles', 'shows', 'podcasts', 'news', 'schedule', 'polls', 'poll_options', 'poll_votes', 'app_settings', 'user_roles'].map((table) => (
                          <div key={table} className="flex justify-between items-center p-2 border rounded-md hover:bg-muted/50">
                            <span className="font-mono text-sm">{table}</span>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                Anzeigen
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-100">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Database Maintenance */}
                    <div className="border border-border/40 rounded-lg p-4 bg-card/50">
                      <h3 className="font-medium mb-4">Datenbankwartung</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="justify-start">
                          <ServerCog className="h-4 w-4 mr-2" />
                          Datenbank überprüfen
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Archive className="h-4 w-4 mr-2" />
                          Alte Daten archivieren
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Trash className="h-4 w-4 mr-2" />
                          Cache löschen
                        </Button>
                        <Button variant="outline" className="justify-start text-red-500 hover:text-red-700 hover:bg-red-100">
                          <Trash className="h-4 w-4 mr-2" />
                          Temporäre Dateien löschen
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
