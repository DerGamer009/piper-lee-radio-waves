import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  Wrench, 
  Users, 
  Settings, 
  Radio, 
  ChevronRight, 
  RefreshCw, 
  Database, 
  Archive, 
  History, 
  ServerCog, 
  Trash, 
  Download, 
  Upload, 
  Menu,
  X,
  Home,
  ChevronDown
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentUsers from '@/components/dashboard/RecentUsers';
import UpcomingShows from '@/components/dashboard/UpcomingShows';
import PollManagement from '@/components/dashboard/PollManagement';
import NewsManagement from '@/components/dashboard/NewsManagement';
import UserManagement from '@/components/dashboard/UserManagement';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AdminPanel = () => {
  const { isAdmin, isMaintenanceMode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(isMaintenanceMode);
  const [refreshing, setRefreshing] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [settingsTab, setSettingsTab] = useState('general');
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [optimizingDatabase, setOptimizingDatabase] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isMobile } = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-xl font-bold mb-4">Zugriff verweigert</h1>
        <p>Sie haben keine Berechtigung, auf diesen Bereich zuzugreifen.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 md:py-8 px-3 md:px-4">
      <div className="flex justify-between items-center mb-4 md:mb-8 gap-2">
        <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2 truncate">
          {isMobile ? "" : "Admin-Panel"}
          <Settings className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
        </h1>
        
        <div className="flex items-center gap-2">
          {isMobile && (
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <div className="px-1 py-4">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Admin-Panel</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowMobileMenu(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <Button 
                      variant={activeTab === 'dashboard' ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab('dashboard');
                        setShowMobileMenu(false);
                      }}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button 
                      variant={activeTab === 'users' ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab('users');
                        setShowMobileMenu(false);
                      }}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Benutzer
                    </Button>
                    <Button 
                      variant={activeTab === 'content' ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab('content');
                        setShowMobileMenu(false);
                      }}
                    >
                      <Radio className="mr-2 h-4 w-4" />
                      Inhalte
                    </Button>
                    
                    {/* Settings with submenu */}
                    <div className="space-y-1">
                      <Button 
                        variant={activeTab === 'settings' ? "default" : "ghost"}
                        className="w-full justify-between group"
                        onClick={() => {
                          setActiveTab('settings');
                          setShowMobileMenu(false);
                        }}
                      >
                        <span className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Einstellungen
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                      
                      {activeTab === 'settings' && (
                        <div className="ml-6 border-l pl-3 space-y-1 border-primary/20">
                          <Button 
                            variant={settingsTab === 'general' ? "secondary" : "ghost"} 
                            size="sm"
                            className="w-full justify-start text-sm"
                            onClick={() => {
                              setSettingsTab('general');
                              setShowMobileMenu(false);
                            }}
                          >
                            Allgemein
                          </Button>
                          <Button 
                            variant={settingsTab === 'backup' ? "secondary" : "ghost"} 
                            size="sm"
                            className="w-full justify-start text-sm"
                            onClick={() => {
                              setSettingsTab('backup');
                              setShowMobileMenu(false);
                            }}
                          >
                            Backup & Wartung
                          </Button>
                          <Button 
                            variant={settingsTab === 'database' ? "secondary" : "ghost"} 
                            size="sm"
                            className="w-full justify-start text-sm"
                            onClick={() => {
                              setSettingsTab('database');
                              setShowMobileMenu(false);
                            }}
                          >
                            Datenbank
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-8 w-8 md:w-auto md:px-3"
          >
            <RefreshCw className={`h-4 w-4 ${!isMobile && "mr-2"} ${refreshing ? 'animate-spin' : ''}`} />
            {!isMobile && "Aktualisieren"}
          </Button>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-6"
      >
        <TabsList className={`mb-4 ${isMobile ? "hidden" : "flex overflow-x-auto"}`}>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="content">Inhalte</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6">
            <DashboardStats />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <UpcomingShows />
            <RecentUsers />
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-4 md:space-y-6">
            <PollManagement />
            <NewsManagement />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Settings className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Website-Einstellungen
                </CardTitle>
                <CardDescription>
                  Konfigurieren Sie Einstellungen für die Radio-Website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={settingsTab} onValueChange={setSettingsTab} className="w-full">
                  <TabsList className="mb-4 grid grid-cols-3 w-full md:w-auto md:inline-flex">
                    <TabsTrigger value="general">Allgemein</TabsTrigger>
                    <TabsTrigger value="backup">Backup</TabsTrigger>
                    <TabsTrigger value="database">Datenbank</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-4 md:space-y-6">
                    {/* Wartungsmodus Einstellung */}
                    <div className="border border-border/40 rounded-lg p-3 md:p-4 bg-card/50">
                      <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Wrench className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
                            <h3 className="font-medium text-sm md:text-base">Wartungsmodus</h3>
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground mb-2">
                            Aktivieren Sie den Wartungsmodus, wenn Sie Wartungsarbeiten an der Website durchführen möchten. 
                            Nur Administratoren können im Wartungsmodus auf die Website zugreifen.
                          </p>
                        </div>
                        <div className="ml-0 sm:ml-6 flex items-center">
                          <Switch
                            id="maintenance-mode"
                            checked={isMaintenance}
                            disabled={isLoading}
                            onCheckedChange={handleMaintenanceModeChange}
                          />
                        </div>
                      </div>
                      {isMaintenance && (
                        <div className="mt-2 flex items-start p-2 md:p-3 rounded border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
                          <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                          <p className="text-xs">
                            Der Wartungsmodus ist aktiv. Die Website ist nur für Administratoren zugänglich.
                            Normale Benutzer werden zur Wartungsseite weitergeleitet.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Streaming-Status Einstellung */}
                    <div className="border border-border/40 rounded-lg p-3 md:p-4 bg-card/50">
                      <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Radio className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                            <h3 className="font-medium text-sm md:text-base">Live-Stream</h3>
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Verwalten Sie hier den Status des Live-Streams.
                          </p>
                        </div>
                        <div className="ml-0 sm:ml-6 flex items-center">
                          <Label htmlFor="stream-status" className="mr-2 text-sm">Aktiv</Label>
                          <Switch id="stream-status" defaultChecked={true} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="backup" className="space-y-4 md:space-y-6">
                    {/* Backup-Sektion */}
                    <div className="border border-border/40 rounded-lg p-3 md:p-4 bg-card/50">
                      <div className="flex flex-col gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Database className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                            <h3 className="font-medium text-sm md:text-base">Datenbankbackup</h3>
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground mb-3">
                            Erstellen Sie ein vollständiges Backup der Datenbank, um Ihre Daten zu sichern.
                            Backups werden sicher in der Cloud gespeichert.
                          </p>
                          <Button 
                            onClick={handleCreateBackup} 
                            disabled={backupInProgress}
                            size={isMobile ? "sm" : "default"}
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
                    <div className="border border-border/40 rounded-lg p-3 md:p-4 bg-card/50">
                      <div className="flex items-center justify-between mb-3 md:mb-4 flex-wrap gap-2">
                        <h3 className="font-medium flex items-center gap-2 text-sm md:text-base">
                          <History className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />
                          Backup-Verlauf
                        </h3>
                        <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
                          <Upload className="h-3 w-3 mr-1" />
                          Backup hochladen
                        </Button>
                      </div>
                      <div className="space-y-2 overflow-x-auto">
                        <div className="flex justify-between items-center p-2 border-b flex-wrap gap-2">
                          <div>
                            <p className="font-medium text-sm">Vollständiges Backup</p>
                            <p className="text-xs text-muted-foreground">29.04.2025 - 08:45</p>
                          </div>
                          <div className="flex gap-1 md:gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRestoreBackup("29.04.2025")} 
                              disabled={restoreInProgress}
                              className="flex items-center gap-1 h-7 text-xs px-2"
                            >
                              {restoreInProgress ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Archive className="h-3 w-3" />
                              )}
                              <span className="hidden sm:inline">Wiederherstellen</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-1 h-7 text-xs px-2">
                              <Download className="h-3 w-3" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 border-b flex-wrap gap-2">
                          <div>
                            <p className="font-medium text-sm">Wöchentliches Backup</p>
                            <p className="text-xs text-muted-foreground">22.04.2025 - 03:00</p>
                          </div>
                          <div className="flex gap-1 md:gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRestoreBackup("22.04.2025")}
                              disabled={restoreInProgress}
                              className="flex items-center gap-1 h-7 text-xs px-2"
                            >
                              {restoreInProgress ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Archive className="h-3 w-3" />
                              )}
                              <span className="hidden sm:inline">Wiederherstellen</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-1 h-7 text-xs px-2">
                              <Download className="h-3 w-3" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 border-b flex-wrap gap-2">
                          <div>
                            <p className="font-medium text-sm">Manuelles Backup</p>
                            <p className="text-xs text-muted-foreground">15.04.2025 - 14:22</p>
                          </div>
                          <div className="flex gap-1 md:gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRestoreBackup("15.04.2025")}
                              disabled={restoreInProgress}
                              className="flex items-center gap-1 h-7 text-xs px-2"
                            >
                              {restoreInProgress ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Archive className="h-3 w-3" />
                              )}
                              <span className="hidden sm:inline">Wiederherstellen</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-1 h-7 text-xs px-2">
                              <Download className="h-3 w-3" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Backup-Einstellungen */}
                    <div className="border border-border/40 rounded-lg p-3 md:p-4 bg-card/50">
                      <h3 className="font-medium mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                        <ServerCog className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                        Backup-Einstellungen
                      </h3>
                      <div className="grid gap-3 md:gap-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <Label htmlFor="auto-backup" className="font-medium text-sm">Automatisches Backup</Label>
                            <p className="text-xs text-muted-foreground">Wöchentliches Backup der Datenbank</p>
                          </div>
                          <Switch id="auto-backup" defaultChecked={true} />
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <Label htmlFor="backup-retention" className="font-medium text-sm">Aufbewahrungsdauer</Label>
                            <p className="text-xs text-muted-foreground">Wie lange sollen Backups aufbewahrt werden</p>
                          </div>
                          <select 
                            id="backup-retention"
                            className="w-28 rounded-md border border-input bg-background px-2 py-1 text-xs md:text-sm ring-offset-background"
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

                  <TabsContent value="database" className="space-y-4 md:space-y-6">
                    {/* Database Status */}
                    <div className="border border-border/40 rounded-lg p-3 md:p-4 bg-card/50">
                      <div className="flex items-center justify-between mb-3 md:mb-4 flex-wrap gap-2">
                        <h3 className="font-medium flex items-center gap-2 text-sm md:text-base">
                          <Database className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                          Datenbankstatus
                        </h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleOptimizeDatabase}
                          disabled={optimizingDatabase}
                          className="flex items-center gap-1 h-8"
                        >
                          {optimizingDatabase ? (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              <span className="hidden sm:inline">Optimierung läuft...</span>
                              <span className="sm:hidden">Läuft...</span>
                            </>
                          ) : (
                            <>
                              <ServerCog className="h-3 w-3 mr-1" />
                              <span className="hidden sm:inline">Datenbank optimieren</span>
                              <span className="sm:hidden">Optimieren</span>
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                        <div className="p-2 md:p-3 bg-background/40 border rounded-md">
                          <p className="text-xs text-muted-foreground">Größe</p>
                          <p className="text-sm md:text-xl font-medium">256 MB</p>
                        </div>
                        <div className="p-2 md:p-3 bg-background/40 border rounded-md">
                          <p className="text-xs text-muted-foreground">Tabellen</p>
                          <p className="text-sm md:text-xl font-medium">12</p>
                        </div>
                        <div className="p-2 md:p-3 bg-background/40 border rounded-md">
                          <p className="text-xs text-muted-foreground">Status</p>
                          <div className="flex items-center">
                            <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-green-500 mr-2"></div>
                            <p className="font-medium text-sm md:text-base">Optimal</p>
                          </div>
                        </div>
                      </div>

                      {/* Database Tables */}
                      <h4 className="font-medium text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">Datenbanktabellen</h4>
                      <div className="space-y-1 md:space-y-2 max-h-48 md:max-h-64 overflow-y-auto pr-1">
                        {['users', 'profiles', 'shows', 'podcasts', 'news', 'schedule', 'polls', 'poll_options', 'poll_votes', 'app_settings', 'user_roles'].map((table) => (
                          <div key={table} className="flex justify-between items-center p-1.5 md:p-2 border rounded-md hover:bg-muted/50">
                            <span className="font-mono text-xs md:text-sm">{table}</span>
                            <div className="flex gap-1 md:gap-2">
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                {!isMobile && "Anzeigen"}
                                {isMobile && <ChevronRight className="h-3 w-3" />}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-100">
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Database Maintenance */}
                    <div className="border border-border/40 rounded-lg p-3 md:p-4 bg-card/50">
                      <h3 className="font-medium mb-3 md:mb-4 text-sm md:text-base">Datenbankwartung</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                        <Button variant="outline" size="sm" className="justify-start h-8 text-xs md:text-sm">
                          <ServerCog className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          Datenbank überprüfen
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start h-8 text-xs md:text-sm">
                          <Archive className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          Alte Daten archivieren
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start h-8 text-xs md:text-sm">
                          <Trash className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          Cache löschen
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start h-8 text-xs md:text-sm text-red-500 hover:text-red-700 hover:bg-red-100">
                          <Trash className="h-3 w-3 md:h-4 md:w-4 mr-2" />
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
