
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart2, Users, Radio, FileAudio, CalendarDays, Activity, Database, Server, ShieldCheck, Lock, HardDrive, Bell, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import AdminStatusPanel from '@/components/admin/AdminStatusPanel';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Sample stats data - in a real app, this would come from an API
  const statsData = {
    users: 1254,
    podcasts: 87,
    shows: 42,
    listeners: 3890
  };
  
  // Stream URL for the radio station
  const streamUrl = "https://stream.radio-piper-lee.com/live";
  
  // Sample security stats
  const securityStats = {
    lastScan: "03.05.2025, 09:30",
    vulnerabilities: 0,
    failedLogins: 3,
    updatesAvailable: 2
  };
  
  // Sample backup data
  const backupData = [
    { id: 1, name: "Vollständiges Backup", date: "03.05.2025", size: "1.2 GB", status: "Abgeschlossen" },
    { id: 2, name: "Nutzer-Datenbank", date: "02.05.2025", size: "450 MB", status: "Abgeschlossen" },
    { id: 3, name: "Audio-Dateien", date: "30.04.2025", size: "3.8 GB", status: "Abgeschlossen" }
  ];

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleRefreshStats = () => {
    toast({
      title: "Aktualisiert",
      description: "Die Statistiken wurden aktualisiert.",
      duration: 3000,
    });
  };
  
  const handleBackup = () => {
    if (isBackingUp) return;
    
    setIsBackingUp(true);
    setBackupProgress(0);
    
    toast({
      title: "Backup gestartet",
      description: "Das Backup wurde gestartet. Dies kann einige Minuten dauern.",
      duration: 5000,
    });
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          
          toast({
            title: "Backup abgeschlossen",
            description: "Das Backup wurde erfolgreich erstellt.",
            duration: 5000,
          });
          
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };
  
  const handleSecurityScan = () => {
    toast({
      title: "Sicherheitsscan gestartet",
      description: "Der Sicherheitsscan wurde gestartet und läuft im Hintergrund.",
      duration: 3000,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-background/95 p-6">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gradient">Admin Dashboard</h1>
          <p className="text-muted-foreground">Verwalten Sie Ihre Plattform und überwachen Sie wichtige Kennzahlen</p>
        </header>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="mb-2">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="security">Sicherheit</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>
        
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview Cards */}
            <section className="fade-in" style={{animationDelay: "150ms"}}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 glass-card hover-lift flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Benutzer</p>
                    <h3 className="text-2xl font-bold">{statsData.users}</h3>
                  </div>
                </Card>
                
                <Card className="p-4 glass-card hover-lift flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <FileAudio className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Podcasts</p>
                    <h3 className="text-2xl font-bold">{statsData.podcasts}</h3>
                  </div>
                </Card>
                
                <Card className="p-4 glass-card hover-lift flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <CalendarDays className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Shows</p>
                    <h3 className="text-2xl font-bold">{statsData.shows}</h3>
                  </div>
                </Card>
                
                <Card className="p-4 glass-card hover-lift flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                    <Radio className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zuhörer</p>
                    <h3 className="text-2xl font-bold">{statsData.listeners}</h3>
                  </div>
                </Card>
              </div>
            </section>
            
            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Detailed Statistics */}
              <div className="lg:col-span-2 space-y-6 fade-in" style={{animationDelay: "250ms"}}>
                <Card className="p-6 glass-card hover-lift">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-primary" />
                      <span>Statistiken</span>
                    </h2>
                    <Button variant="outline" size="sm" onClick={handleRefreshStats}>
                      Aktualisieren
                    </Button>
                  </div>
                  <div className="h-80">
                    <DashboardStats />
                  </div>
                </Card>
                
                <Card className="p-6 glass-card hover-lift">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <span>System Status</span>
                    </h2>
                  </div>
                  <AdminStatusPanel streamUrl={streamUrl} />
                </Card>
              </div>
              
              {/* Right Column: Quick Actions and Information */}
              <div className="space-y-6 fade-in" style={{animationDelay: "350ms"}}>
                <Card className="p-6 glass-card hover-lift">
                  <h2 className="text-xl font-semibold mb-4">Schnellzugriff</h2>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start text-left" asChild>
                      <a href="/admin/users">
                        <Users className="mr-2 h-4 w-4" />
                        Benutzer verwalten
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left" asChild>
                      <a href="/admin/database">
                        <Database className="mr-2 h-4 w-4" />
                        Datenbank
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left" asChild>
                      <a href="/sendeplan-admin">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Sendeplan bearbeiten
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left" asChild>
                      <a href="/admin/settings">
                        <Activity className="mr-2 h-4 w-4" />
                        Einstellungen
                      </a>
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-6 glass-card hover-lift">
                  <h2 className="text-xl font-semibold mb-4">System Info</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <span className="font-medium">2.5.3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Letztes Update:</span>
                      <span className="font-medium">03.05.2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Server Status:</span>
                      <span className="font-medium text-green-500">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Datenbank Status:</span>
                      <span className="font-medium text-green-500">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Caching:</span>
                      <span className="font-medium text-green-500">Aktiv</span>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        System-Diagnose ausführen
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 glass-card">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  Server Status
                </h2>
                <div className="space-y-4">
                  <div className="system-status-item p-3 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span>CPU-Auslastung</span>
                      </div>
                      <span className="font-medium">24%</span>
                    </div>
                    <Progress value={24} className="h-1.5 mt-2" />
                  </div>
                  
                  <div className="system-status-item p-3 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span>RAM-Auslastung</span>
                      </div>
                      <span className="font-medium">42%</span>
                    </div>
                    <Progress value={42} className="h-1.5 mt-2" />
                  </div>
                  
                  <div className="system-status-item p-3 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                        <span>Festplattenspeicher</span>
                      </div>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-1.5 mt-2" />
                  </div>
                  
                  <div className="system-status-item p-3 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span>Netzwerkauslastung</span>
                      </div>
                      <span className="font-medium">16%</span>
                    </div>
                    <Progress value={16} className="h-1.5 mt-2" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 glass-card">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Datenbank Status
                </h2>
                <div className="space-y-4">
                  <div className="system-status-item p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>Verbindungen</span>
                      <span className="font-medium">32/100</span>
                    </div>
                  </div>
                  
                  <div className="system-status-item p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>Abfragelatenz</span>
                      <span className="font-medium text-green-500">18ms</span>
                    </div>
                  </div>
                  
                  <div className="system-status-item p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>Aktive Transaktionen</span>
                      <span className="font-medium">4</span>
                    </div>
                  </div>
                  
                  <div className="system-status-item p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>Cache-Trefferquote</span>
                      <span className="font-medium">92%</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 glass-card md:col-span-2">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  System Benachrichtigungen
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Festplattenplatz wird knapp</h4>
                      <p className="text-sm text-muted-foreground">Der verfügbare Speicherplatz beträgt weniger als 25%. Erwägen Sie, nicht benötigte Dateien zu löschen.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <Bell className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Sicherung erfolgreich</h4>
                      <p className="text-sm text-muted-foreground">Die automatische tägliche Sicherung wurde erfolgreich abgeschlossen.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 glass-card">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Sicherheitsstatus
                </h2>
                <div className="flex flex-col items-center py-6">
                  <div className="relative mb-4">
                    <div className="h-32 w-32 rounded-full border-8 border-green-100 dark:border-green-900/20 flex items-center justify-center">
                      <ShieldCheck className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold">
                      100
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">Geschützt</h3>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    Alle Sicherheitseinstellungen sind aktuell.
                  </p>
                </div>
                <div className="pt-4 border-t mt-4">
                  <Button className="w-full" onClick={handleSecurityScan}>
                    <Lock className="mr-2 h-4 w-4" /> Sicherheitsscan starten
                  </Button>
                </div>
              </Card>
              
              <Card className="p-6 glass-card md:col-span-2">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Sicherheitsübersicht
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-card/60">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">Letzter Scan</span>
                        <Badge variant="outline">{securityStats.lastScan}</Badge>
                      </div>
                      <div className="text-2xl font-bold flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        Sicherheit gewährleistet
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-card/60">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">Sicherheitsstatus</span>
                        <Badge>{securityStats.vulnerabilities} Probleme gefunden</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Kritische Probleme</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">0</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Kürzliche Aktivitäten</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      <div className="p-3 border rounded-lg bg-card/60 flex items-start justify-between">
                        <div>
                          <p className="font-medium">Login erfolgt</p>
                          <p className="text-sm text-muted-foreground">Administrator, 03.05.2025 09:45</p>
                        </div>
                        <Badge variant="outline">192.168.1.45</Badge>
                      </div>
                      
                      <div className="p-3 border rounded-lg bg-card/60 flex items-start justify-between">
                        <div>
                          <p className="font-medium">Fehlgeschlagener Login</p>
                          <p className="text-sm text-muted-foreground">Benutzer: admin, 02.05.2025 22:32</p>
                        </div>
                        <Badge variant="destructive">82.45.128.65</Badge>
                      </div>
                      
                      <div className="p-3 border rounded-lg bg-card/60 flex items-start justify-between">
                        <div>
                          <p className="font-medium">Sicherheitsupdate installiert</p>
                          <p className="text-sm text-muted-foreground">System, 02.05.2025 08:15</p>
                        </div>
                        <Badge variant="outline">Automatisch</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="backup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 glass-card">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-primary" />
                  Backup erstellen
                </h2>
                <div className="space-y-6">
                  <div className="flex flex-col items-center py-6">
                    <div className="relative mb-4">
                      <div className="h-32 w-32 rounded-full border-8 border-blue-100 dark:border-blue-900/20 flex items-center justify-center">
                        <Database className="h-12 w-12 text-blue-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">Backup Management</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      Letztes Backup: 03.05.2025, 02:30
                    </p>
                  </div>
                  
                  {isBackingUp && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Backup wird erstellt...</span>
                        <span>{backupProgress}%</span>
                      </div>
                      <Progress value={backupProgress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="pt-4 border-t mt-4">
                    <Button 
                      className="w-full" 
                      onClick={handleBackup} 
                      disabled={isBackingUp}
                    >
                      <HardDrive className="mr-2 h-4 w-4" /> 
                      {isBackingUp ? 'Backup läuft...' : 'Backup erstellen'}
                    </Button>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 glass-card md:col-span-2">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Backup-Verlauf
                </h2>
                <div className="backup-list">
                  {backupData.map((backup) => (
                    <div key={backup.id} className="backup-item">
                      <div>
                        <p className="font-medium">{backup.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {backup.date} • {backup.size}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          {backup.status}
                        </Badge>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <HardDrive className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Importieren
                  </Button>
                  <Button variant="outline" size="sm">
                    Exportieren
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
