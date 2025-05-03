
import React, { useState, useEffect } from 'react';
import { 
  fetchStreamStatus, 
  restartStreamServer, 
  getRestartStatus 
} from '@/services/radioService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Radio, 
  RefreshCw, 
  Power, 
  Calendar, 
  Users, 
  Music, 
  PlayCircle,
  PauseCircle,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminStatusPanel from '@/components/admin/AdminStatusPanel';

const ModeratorRadio = () => {
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartStatus, setRestartStatus] = useState<{
    success: boolean;
    message: string;
    status: 'completed' | 'in_progress' | 'failed';
    timestamp: string;
  } | null>(null);
  const [streamStatus, setStreamStatus] = useState<{
    status: 'online' | 'offline' | 'starting' | 'stopping' | 'unknown';
    is_live: boolean;
    listeners: number;
    current_track?: {
      title: string;
      artist: string;
    };
  }>({
    status: 'unknown',
    is_live: false,
    listeners: 0
  });
  const { toast } = useToast();
  
  useEffect(() => {
    fetchInitialData();
    
    const intervalId = setInterval(() => {
      fetchInitialData();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  const fetchInitialData = async () => {
    try {
      const [statusData, restartData] = await Promise.all([
        fetchStreamStatus(),
        getRestartStatus()
      ]);
      
      setStreamStatus(statusData);
      setRestartStatus(restartData);
      
      if (restartData.status === 'in_progress') {
        setIsRestarting(true);
      } else {
        setIsRestarting(false);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Daten konnten nicht abgerufen werden."
      });
    }
  };
  
  const handleRestartServer = async () => {
    if (isRestarting) return;
    
    try {
      setIsRestarting(true);
      toast({
        title: "Stream wird neu gestartet",
        description: "Bitte warten Sie, während der Stream-Server neu startet."
      });
      
      const result = await restartStreamServer();
      setRestartStatus(result);
      
      if (result.status === 'completed' && result.success) {
        toast({
          title: "Neustart erfolgreich",
          description: "Der Stream-Server wurde erfolgreich neu gestartet."
        });
        // Fetch new status after restart
        setTimeout(() => fetchInitialData(), 2000);
      } else if (result.status === 'in_progress') {
        toast({
          title: "Neustart läuft",
          description: "Der Stream-Server wird gerade neu gestartet."
        });
        // Poll for status
        pollRestartStatus();
      } else {
        toast({
          variant: "destructive",
          title: "Fehler beim Neustart",
          description: result.message || "Der Server konnte nicht neu gestartet werden."
        });
        setIsRestarting(false);
      }
    } catch (error) {
      console.error("Error restarting server:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Der Stream-Server konnte nicht neu gestartet werden."
      });
      setIsRestarting(false);
    }
  };
  
  const pollRestartStatus = () => {
    const pollInterval = setInterval(async () => {
      const status = await getRestartStatus();
      setRestartStatus(status);
      
      if (status.status !== 'in_progress') {
        clearInterval(pollInterval);
        setIsRestarting(false);
        
        if (status.status === 'completed' && status.success) {
          toast({
            title: "Neustart erfolgreich",
            description: "Der Stream-Server wurde erfolgreich neu gestartet."
          });
          fetchInitialData();
        } else {
          toast({
            variant: "destructive",
            title: "Fehler beim Neustart",
            description: status.message || "Der Server konnte nicht neu gestartet werden."
          });
        }
      }
    }, 5000); // Poll every 5 seconds
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('de-DE');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Radio-Management</h1>
        <Button 
          onClick={fetchInitialData} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Aktualisieren
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Radio className="h-5 w-5 text-primary" />
                  Stream-Status
                </CardTitle>
                <Badge 
                  variant={
                    streamStatus.status === 'online' ? 'success' :
                    streamStatus.status === 'offline' ? 'destructive' :
                    'outline'
                  }
                  className="capitalize"
                >
                  {streamStatus.status}
                </Badge>
              </div>
              <CardDescription>
                Verwalten und überwachen Sie den Live-Stream-Status
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-muted/20 p-4 rounded-lg border border-border/50 text-center">
                  <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-xs text-muted-foreground">Aktive Hörer</p>
                  <p className="text-2xl font-bold">{streamStatus.listeners}</p>
                </div>
                
                <div className="bg-muted/20 p-4 rounded-lg border border-border/50 text-center">
                  {streamStatus.is_live ? (
                    <>
                      <PlayCircle className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                      <p className="text-xs text-muted-foreground">Live-Übertragung</p>
                      <p className="text-md font-medium truncate">Aktiv</p>
                    </>
                  ) : (
                    <>
                      <PauseCircle className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                      <p className="text-xs text-muted-foreground">Live-Übertragung</p>
                      <p className="text-md font-medium">Inaktiv</p>
                    </>
                  )}
                </div>
                
                <div className="bg-muted/20 p-4 rounded-lg border border-border/50 text-center">
                  <Music className="h-5 w-5 mx-auto mb-1 text-violet-500" />
                  <p className="text-xs text-muted-foreground">Aktueller Titel</p>
                  {streamStatus.current_track ? (
                    <p className="text-sm font-medium truncate">
                      {streamStatus.current_track.artist} - {streamStatus.current_track.title}
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground">Keine Information</p>
                  )}
                </div>
              </div>
              
              {restartStatus && (
                <Alert 
                  variant={
                    restartStatus.status === 'completed' && restartStatus.success ? 'success' :
                    restartStatus.status === 'in_progress' ? 'info' :
                    'destructive'
                  }
                  className="mb-4"
                >
                  {restartStatus.status === 'completed' && restartStatus.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : restartStatus.status === 'in_progress' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {restartStatus.status === 'completed' && restartStatus.success ? 'Neustart erfolgreich' :
                     restartStatus.status === 'in_progress' ? 'Neustart wird durchgeführt' :
                     'Fehler beim Neustart'}
                  </AlertTitle>
                  <AlertDescription>
                    <p>{restartStatus.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(restartStatus.timestamp)}
                    </p>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-end">
                <Button 
                  variant="destructive" 
                  onClick={handleRestartServer}
                  disabled={isRestarting}
                  className="flex items-center gap-2"
                >
                  {isRestarting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Wird neu gestartet...
                    </>
                  ) : (
                    <>
                      <Power className="h-4 w-4" />
                      Server neu starten
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Aktionen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Hörer anzeigen
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Zum Sendeplan
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Music className="h-4 w-4 mr-2" />
                  Song-Wünsche verwalten
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Stream testen</CardTitle>
            <CardDescription>
              Überprüfen Sie den aktuellen Stream und die Verbindung
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminStatusPanel streamUrl="https://backend.piper-lee.net/listen/piper-lee/radio.mp3" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModeratorRadio;
