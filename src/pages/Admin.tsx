
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart2, Users, Radio, FileAudio, CalendarDays, Activity, Database, Server, ShieldCheck, Lock, HardDrive, Bell, AlertTriangle, Cloud, Refresh, Download, Terminal, CheckCircle, XCircle, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import AdminStatusPanel from '@/components/admin/AdminStatusPanel';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [serverStatus, setServerStatus] = useState({
    cpu: 24,
    ram: 42,
    disk: 78,
    network: 16,
    uptime: '5d 14h 32m'
  });
  const [backupType, setBackupType] = useState('full');
  const [isScanningSystem, setIsScanningSystem] = useState(false);
  const [services, setServices] = useState([
    { name: 'Webserver', status: 'online' },
    { name: 'Datenbank', status: 'online' },
    { name: 'Stream Server', status: 'online' },
    { name: 'Cache Server', status: 'online' },
    { name: 'Media Storage', status: 'warning', message: 'Fast voll (92%)' }
  ]);

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

  // Sample system logs
  const systemLogs = [
    { time: '09:45:22', level: 'info', message: 'Nutzer admin hat sich angemeldet' },
    { time: '09:32:16', level: 'warning', message: 'Festplattenspeicher fast voll (92%)' },
    { time: '08:15:03', level: 'info', message: 'Tägliches Backup erfolgreich abgeschlossen' },
    { time: '07:30:00', level: 'info', message: 'System-Update verfügbar' },
    { time: '23:15:45', level: 'error', message: 'Fehlgeschlagener Login-Versuch für Nutzer admin (IP: 82.45.128.65)' },
    { time: '22:30:12', level: 'info', message: 'Datenbank-Optimierung durchgeführt' },
    { time: '21:45:30', level: 'info', message: 'Cache geleert' },
    { time: '20:10:05', level: 'warning', message: 'Hohe CPU-Auslastung (85%)' }
  ];

  // Check if the user is authenticated and is an admin
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Refresh stats for CPU, RAM, etc.
  const refreshSystemStats = () => {
    // Here you would typically fetch real data from an API
    toast({
      title: "System-Status aktualisiert",
      description: "Die System-Statistiken wurden aktualisiert.",
      duration: 3000,
    });
    
    // Simulate updated stats
    setServerStatus({
      cpu: Math.floor(Math.random() * 40) + 10,
      ram: Math.floor(Math.random() * 40) + 30,
      disk: 78,
      network: Math.floor(Math.random() * 30) + 5,
      uptime: '5d 14h 32m'
    });
  };

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
    
    const backupTypes = {
      'full': 'Vollständiges Backup',
      'users': 'Nur Benutzerdaten',
      'media': 'Nur Medien-Dateien',
      'config': 'Nur Konfiguration'
    };
    
    toast({
      title: "Backup gestartet",
      description: `${backupTypes[backupType]} wurde gestartet. Dies kann einige Minuten dauern.`,
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
            description: `${backupTypes[backupType]} wurde erfolgreich erstellt.`,
            duration: 5000,
          });
          
          // Add the new backup to the list
          const newBackup = {
            id: backupData.length + 1,
            name: backupTypes[backupType],
            date: new Date().toLocaleDateString('de-DE'),
            size: backupType === 'full' ? '1.4 GB' : 
                  backupType === 'media' ? '850 MB' : 
                  backupType === 'users' ? '120 MB' : '35 MB',
            status: 'Abgeschlossen'
          };
          
          // In a real app, you would update this through an API or state management
          
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

  const handleSystemDiagnostic = () => {
    setIsScanningSystem(true);
    
    toast({
      title: "Diagnose gestartet",
      description: "Die System-Diagnose wurde gestartet. Dies kann einige Sekunden dauern.",
      duration: 3000,
    });
    
    // Simulate system scan
    setTimeout(() => {
      setIsScanningSystem(false);
      
      // Update services with simulated results
      const updatedServices = [...services];
      const randomIndex = Math.floor(Math.random() * services.length);
      
      if (Math.random() > 0.7) {
        // Simulate finding an issue
        updatedServices[randomIndex].status = 'warning';
        updatedServices[randomIndex].message = 'Latenz über Schwellenwert';
        
        toast({
          title: "Diagnose abgeschlossen",
          description: `Probleme gefunden bei: ${updatedServices[randomIndex].name}`,
          variant: "destructive",
          duration: 5000,
        });
      } else {
        // All systems normal
        setServices(services.map(service => ({...service, status: service.name === 'Media Storage' ? 'warning' : 'online'})));
        
        toast({
          title: "Diagnose abgeschlossen",
          description: "Alle Systeme funktionieren normal.",
          duration: 3000,
        });
      }
    }, 3000);
  };

  const handleServiceToggle = (serviceName) => {
    // In a real application, this would send a request to restart the service
    toast({
      title: "Service wird neu gestartet",
      description: `Der Dienst "${serviceName}" wird neu gestartet. Dies kann einige Momente dauern.`,
      duration: 3000,
    });
    
    // Simulate service restart
    const updatedServices = services.map(service => 
      service.name === serviceName 
        ? {...service, status: 'restarting'} 
        : service
    );
    
    setServices(updatedServices);
    
    // Simulate completion of restart after a delay
    setTimeout(() => {
      const finalServices = services.map(service => 
        service.name === serviceName 
          ? {...service, status: 'online', message: service.name === 'Media Storage' ? 'Fast voll (92%)' : undefined} 
          : service
      );
      
      setServices(finalServices);
      
      toast({
        title: "Service neu gestartet",
        description: `Der Dienst "${serviceName}" wurde erfolgreich neu gestartet.`,
        duration: 3000,
      });
    }, 2500);
  };

  const downloadLog = () => {
    toast({
      title: "Log-Dateien werden heruntergeladen",
      description: "Die Log-Dateien werden als ZIP-Archiv heruntergeladen.",
      duration: 3000,
    });
    
    // In a real app, this would trigger a file download
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
            <TabsTrigger value="logs">Logs</TabsTrigger>
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
                      <Refresh className="mr-1 h-4 w-4" /> Aktualisieren
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
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    System Info
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <Badge variant="outline" className="bg-primary/5">2.5.3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Letztes Update:</span>
                      <span className="font-medium">03.05.2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Server Status:</span>
                      <Badge variant="success">Online</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Datenbank:</span>
                      <Badge variant="success">Online</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uptime:</span>
                      <span className="font-medium">{serverStatus.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Caching:</span>
                      <Badge variant="success">Aktiv</Badge>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={handleSystemDiagnostic}
                        disabled={isScanningSystem}
                      >
                        {isScanningSystem ? (
                          <>
                            <span className="animate-spin mr-2">⟳</span> Diagnose läuft...
                          </>
                        ) : (
                          <>
                            <Terminal className="mr-2 h-4 w-4" /> System-Diagnose ausführen
                          </>
                        )}
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Server Status
                  </h2>
                  <Button variant="outline" size="sm" onClick={refreshSystemStats}>
                    <Refresh className="h-4 w-4 mr-1" /> Aktualisieren
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="system-status-item p-3 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${serverStatus.cpu < 30 ? 'bg-green-500' : serverStatus.cpu < 70 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span>CPU-Auslastung</span>
                      </div>
                      <span className="font-medium">{serverStatus.cpu}%</span>
                    </div>
                    <Progress value={serverStatus.cpu} className={`h-1.5 mt-2 ${serverStatus.cpu < 30 ? 'bg-green-200 [&>div]:bg-green-500' : serverStatus.cpu < 70 ? 'bg-yellow-200 [&>div]:bg-yellow-500' : 'bg-red-200 [&>div]:bg-red-500'}`} />
                  </div>
                  
                  <div className="system-status-item p-3 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${serverStatus.ram < 50 ? 'bg-green-500' : serverStatus.ram < 80 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span>RAM-Auslastung</span>
                      </div>
                      <span className="font-medium">{serverStatus.ram}%</span>
                    </div>
                    <Progress value={serverStatus.ram} className={`h-1.5 mt-2 ${serverStatus.ram < 50 ? 'bg-green-200 [&>div]:bg-green-500' : serverStatus.ram < 80 ? 'bg-yellow-200 [&>div]:bg-yellow-500' : 'bg-red-200 [&>div]:bg-red-500'}`} />
                  </div>
                  
                  <div className="system-status-item p-3 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${serverStatus.disk < 70 ? 'bg-green-500' : serverStatus.disk < 90 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span>Festplattenspeicher</span>
                      </div>
                      <span className="font-medium">{serverStatus.disk}%</span>
                    </div>
                    <Progress value={serverStatus.disk} className={`h-1.5 mt-2 ${serverStatus.disk < 70 ? 'bg-green-200 [&>div]:bg-green-500' : serverStatus.disk < 90 ? 'bg-yellow-200 [&>div]:bg-yellow-500' : 'bg-red-200 [&>div]:bg-red-500'}`} />
                  </div>
                  
                  <div className="system-status-item p-3 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${serverStatus.network < 30 ? 'bg-green-500' : serverStatus.network < 70 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span>Netzwerkauslastung</span>
                      </div>
                      <span className="font-medium">{serverStatus.network}%</span>
                    </div>
                    <Progress value={serverStatus.network} className={`h-1.5 mt-2 ${serverStatus.network < 30 ? 'bg-green-200 [&>div]:bg-green-500' : serverStatus.network < 70 ? 'bg-yellow-200 [&>div]:bg-yellow-500' : 'bg-red-200 [&>div]:bg-red-500'}`} />
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
              
              <Card className="p-6 glass-card">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-primary" />
                  Dienste
                </h2>
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-card/60">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${
                          service.status === 'online' ? 'bg-green-500' : 
                          service.status === 'warning' ? 'bg-yellow-500' : 
                          service.status === 'restarting' ? 'bg-blue-500 animate-pulse' : 
                          'bg-red-500'
                        }`}></div>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          {service.message && (
                            <div className="text-xs text-muted-foreground">{service.message}</div>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        disabled={service.status === 'restarting'}
                        onClick={() => handleServiceToggle(service.name)}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-6 glass-card">
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
                  
                  <div className="mt-2 flex justify-end">
                    <Button variant="outline" size="sm">
                      Alle anzeigen
                    </Button>
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
                    <ScrollArea className="h-64 pr-4">
                      <div className="space-y-2">
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
                        
                        <div className="p-3 border rounded-lg bg-card/60 flex items-start justify-between">
                          <div>
                            <p className="font-medium">Neue Firewall-Regel hinzugefügt</p>
                            <p className="text-sm text-muted-foreground">Administrator, 01.05.2025 14:22</p>
                          </div>
                          <Badge variant="outline">Manuell</Badge>
                        </div>
                        
                        <div className="p-3 border rounded-lg bg-card/60 flex items-start justify-between">
                          <div>
                            <p className="font-medium">Verdächtige Aktivität blockiert</p>
                            <p className="text-sm text-muted-foreground">Firewall, 01.05.2025 03:15</p>
                          </div>
                          <Badge variant="destructive">118.25.67.94</Badge>
                        </div>
                      </div>
                    </ScrollArea>
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
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label htmlFor="backup-type" className="text-sm font-medium">Backup-Typ</label>
                      <Select
                        value={backupType}
                        onValueChange={setBackupType}
                      >
                        <SelectTrigger id="backup-type" className="w-full">
                          <SelectValue placeholder="Backup-Typ wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Vollständiges Backup</SelectItem>
                          <SelectItem value="users">Nur Benutzerdaten</SelectItem>
                          <SelectItem value="media">Nur Medien-Dateien</SelectItem>
                          <SelectItem value="config">Nur Konfiguration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                <ScrollArea className="h-96 pr-4">
                  <div className="space-y-3 mb-4">
                    {backupData.map((backup) => (
                      <div key={backup.id} className="p-4 border rounded-lg hover:bg-card/60 transition-all flex justify-between items-center">
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
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="pt-4 border-t mt-4 flex justify-between gap-2">
                  <div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" /> Exportieren
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Importieren
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                      Verwalten
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card className="p-6 glass-card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    System-Logs
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={downloadLog}>
                      <Download className="mr-2 h-4 w-4" /> Logs exportieren
                    </Button>
                    <Button variant="outline" size="sm">
                      <Refresh className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge className="cursor-pointer">Alle</Badge>
                  <Badge variant="outline" className="cursor-pointer">Info</Badge>
                  <Badge variant="outline" className="cursor-pointer">Warnung</Badge>
                  <Badge variant="outline" className="cursor-pointer">Fehler</Badge>
                  <Badge variant="outline" className="cursor-pointer">System</Badge>
                  <Badge variant="outline" className="cursor-pointer">Benutzer</Badge>
                  <Badge variant="outline" className="cursor-pointer">Sicherheit</Badge>
                </div>
                
                <ScrollArea className="h-[500px] border rounded-lg bg-card/30 p-4">
                  <div className="space-y-2 font-mono text-sm">
                    {systemLogs.map((log, index) => (
                      <div 
                        key={index} 
                        className={`p-2 rounded flex items-start ${
                          log.level === 'error' ? 'bg-red-500/10 border border-red-500/20' : 
                          log.level === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' : 
                          'bg-card/20 border border-border/30'
                        }`}
                      >
                        <span className="text-muted-foreground mr-3">{log.time}</span>
                        <div className="flex-1">
                          <span className={`font-medium ${
                            log.level === 'error' ? 'text-red-500' : 
                            log.level === 'warning' ? 'text-yellow-500' : 
                            'text-blue-500'
                          } mr-2`}>
                            [{log.level.toUpperCase()}]
                          </span>
                          <span>{log.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="flex justify-between mt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Zeige 8 von 1,245 Einträgen</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Zurück
                    </Button>
                    <Button variant="outline" size="sm">
                      Weiter
                    </Button>
                  </div>
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

