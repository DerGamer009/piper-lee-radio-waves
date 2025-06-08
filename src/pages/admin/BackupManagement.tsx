
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Calendar,
  HardDrive,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BackupManagement = () => {
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const { toast } = useToast();

  // Mock backup history data
  const backupHistory = [
    {
      id: '1',
      type: 'Vollständig',
      date: '2025-06-08 02:00:00',
      size: '24.5 MB',
      status: 'Erfolgreich',
      duration: '2m 34s'
    },
    {
      id: '2',
      type: 'Inkrementell',
      date: '2025-06-07 14:30:00',
      size: '1.2 MB',
      status: 'Erfolgreich',
      duration: '18s'
    },
    {
      id: '3',
      type: 'Vollständig',
      date: '2025-06-07 02:00:00',
      size: '23.8 MB',
      status: 'Erfolgreich',
      duration: '2m 18s'
    },
    {
      id: '4',
      type: 'Vollständig',
      date: '2025-06-06 02:00:00',
      size: '23.1 MB',
      status: 'Fehlgeschlagen',
      duration: '1m 45s',
      error: 'Verbindungsfehler zur Datenbank'
    },
    {
      id: '5',
      type: 'Inkrementell',
      date: '2025-06-05 18:15:00',
      size: '892 KB',
      status: 'Erfolgreich',
      duration: '12s'
    }
  ];

  const handleCreateBackup = async (type: 'full' | 'incremental') => {
    setIsBackupRunning(true);
    setBackupProgress(0);

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackupRunning(false);
          toast({
            title: "Backup erstellt",
            description: `${type === 'full' ? 'Vollständiges' : 'Inkrementelles'} Backup wurde erfolgreich erstellt.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleRestoreBackup = (backupId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie dieses Backup wiederherstellen möchten? Aktuelle Daten können überschrieben werden.')) {
      return;
    }

    toast({
      title: "Wiederherstellung gestartet",
      description: "Das Backup wird wiederhergestellt. Dies kann einige Minuten dauern.",
    });
  };

  const handleDownloadBackup = (backupId: string) => {
    toast({
      title: "Download gestartet",
      description: "Das Backup wird heruntergeladen.",
    });
  };

  const toggleAutoBackup = () => {
    setAutoBackupEnabled(!autoBackupEnabled);
    toast({
      title: autoBackupEnabled ? "Automatische Backups deaktiviert" : "Automatische Backups aktiviert",
      description: autoBackupEnabled 
        ? "Automatische Backups wurden deaktiviert." 
        : "Automatische Backups wurden aktiviert.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Erfolgreich':
        return <Badge className="bg-green-500 hover:bg-green-600">Erfolgreich</Badge>;
      case 'Fehlgeschlagen':
        return <Badge variant="destructive">Fehlgeschlagen</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-3 mb-8">
          <Database className="h-8 w-8 text-indigo-500" />
          <h1 className="text-3xl font-bold">Backup-Verwaltung</h1>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList>
            <TabsTrigger value="create">Backup erstellen</TabsTrigger>
            <TabsTrigger value="history">Backup-Verlauf</TabsTrigger>
            <TabsTrigger value="schedule">Zeitplan</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Letzte Sicherung</p>
                      <p className="text-lg font-bold">vor 6h</p>
                    </div>
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Backup-Größe</p>
                      <p className="text-lg font-bold">24.5 MB</p>
                    </div>
                    <HardDrive className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Verfügbare Backups</p>
                      <p className="text-lg font-bold">15</p>
                    </div>
                    <Shield className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nächstes Auto-Backup</p>
                      <p className="text-lg font-bold">in 18h</p>
                    </div>
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Vollständiges Backup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Erstellt eine komplette Sicherung aller Daten einschließlich Benutzerdaten, Content und Einstellungen.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Geschätzte Größe:</span>
                      <span>~25 MB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Geschätzte Dauer:</span>
                      <span>~3 Minuten</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleCreateBackup('full')}
                    disabled={isBackupRunning}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Vollständiges Backup erstellen
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Inkrementelles Backup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sichert nur die Änderungen seit dem letzten Backup. Schneller und platzsparender.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Geschätzte Größe:</span>
                      <span>~2 MB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Geschätzte Dauer:</span>
                      <span>~30 Sekunden</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleCreateBackup('incremental')}
                    disabled={isBackupRunning}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Inkrementelles Backup erstellen
                  </Button>
                </CardContent>
              </Card>
            </div>

            {isBackupRunning && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin">
                        <RefreshCw className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Backup wird erstellt...</span>
                    </div>
                    <Progress value={backupProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      {backupProgress}% abgeschlossen
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup-Verlauf</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backupHistory.map((backup) => (
                    <div 
                      key={backup.id} 
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {backup.status === 'Erfolgreich' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <p className="font-medium">{backup.type} Backup</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(backup.date).toLocaleString('de-DE')}
                            </p>
                            {backup.error && (
                              <p className="text-xs text-red-500 mt-1">{backup.error}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{backup.size}</p>
                          <p className="text-xs text-muted-foreground">{backup.duration}</p>
                        </div>
                        {getStatusBadge(backup.status)}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadBackup(backup.id)}
                            disabled={backup.status !== 'Erfolgreich'}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestoreBackup(backup.id)}
                            disabled={backup.status !== 'Erfolgreich'}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automatische Backups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Automatische Backups aktivieren</h3>
                      <p className="text-sm text-muted-foreground">
                        Erstellt automatisch regelmäßige Backups Ihrer Daten
                      </p>
                    </div>
                    <Button
                      variant={autoBackupEnabled ? "default" : "outline"}
                      onClick={toggleAutoBackup}
                    >
                      {autoBackupEnabled ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {autoBackupEnabled ? "Deaktivieren" : "Aktivieren"}
                    </Button>
                  </div>

                  {autoBackupEnabled && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Automatische Backups sind aktiviert. Nächstes Backup: Heute um 02:00 Uhr
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Vollständige Backups</h4>
                      <p className="text-sm text-muted-foreground">Täglich um 02:00 Uhr</p>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Zeitplan ändern
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Inkrementelle Backups</h4>
                      <p className="text-sm text-muted-foreground">Alle 6 Stunden</p>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Zeitplan ändern
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup-Einstellungen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Aufbewahrung</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Vollständige Backups behalten:</span>
                        <span className="text-sm font-medium">30 Tage</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Inkrementelle Backups behalten:</span>
                        <span className="text-sm font-medium">7 Tage</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Speicherort</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Lokaler Speicher:</span>
                        <span className="text-sm font-medium">Aktiviert</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cloud-Speicher:</span>
                        <span className="text-sm font-medium">Nicht konfiguriert</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Benachrichtigungen</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">E-Mail bei erfolgreichem Backup:</span>
                        <span className="text-sm font-medium">Aktiviert</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">E-Mail bei fehlgeschlagenem Backup:</span>
                        <span className="text-sm font-medium">Aktiviert</span>
                      </div>
                    </div>
                  </div>

                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Einstellungen speichern
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
};

export default BackupManagement;
