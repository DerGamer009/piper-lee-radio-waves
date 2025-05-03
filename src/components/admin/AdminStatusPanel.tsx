
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Volume2, Radio, SignalHigh } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface AdminStatusPanelProps {
  streamUrl: string;
}

const AdminStatusPanel = ({ streamUrl }: AdminStatusPanelProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [listenerCount, setListenerCount] = useState<number>(0);
  const [streamStatus, setStreamStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const { toast } = useToast();

  useEffect(() => {
    const audio = new Audio(streamUrl);
    setAudioElement(audio);

    // Check stream status
    checkStreamStatus();

    // Cleanup
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [streamUrl]);

  const checkStreamStatus = () => {
    fetch(streamUrl, { method: 'HEAD' })
      .then(response => {
        setStreamStatus(response.ok ? 'online' : 'offline');
        // Simulate listener count - in a real app, this would come from your streaming service API
        setListenerCount(Math.floor(Math.random() * 50) + 10);
      })
      .catch(() => {
        setStreamStatus('offline');
      });
  };

  const togglePlayback = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
      toast({
        title: "Stream pausiert",
        description: "Die Audiowiedergabe wurde pausiert.",
      });
    } else {
      audioElement.play().catch(error => {
        toast({
          title: "Fehler",
          description: "Stream konnte nicht gestartet werden.",
          variant: "destructive"
        });
        console.error("Audio playback error:", error);
      });
      setIsPlaying(true);
      toast({
        title: "Stream gestartet",
        description: "Die Audiowiedergabe wurde gestartet.",
      });
    }
  };

  const refreshStatus = () => {
    setStreamStatus('checking');
    checkStreamStatus();
    toast({
      title: "Status aktualisiert",
      description: "Der Streamstatus wurde aktualisiert.",
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="listeners">Hörer</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">Stream Status</h3>
                  </div>

                  <Badge 
                    variant={
                      streamStatus === 'online' ? 'success' :
                      streamStatus === 'offline' ? 'destructive' : 'outline'
                    }
                    className="flex items-center gap-1"
                  >
                    {streamStatus === 'checking' && 'Wird geprüft...'}
                    {streamStatus === 'online' && (
                      <>
                        <SignalHigh className="h-3.5 w-3.5" />
                        Online
                      </>
                    )}
                    {streamStatus === 'offline' && 'Offline'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePlayback}
                    disabled={streamStatus !== 'online'}
                    className="flex-1"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" /> Stream testen
                      </>
                    )}
                  </Button>
                  <Button size="sm" onClick={refreshStatus}>
                    Status prüfen
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">Aktuelle Hörer</h3>
                  </div>
                  
                  <div className="text-2xl font-bold">{listenerCount}</div>
                </div>

                <div className="mt-4 h-10 bg-gray-100 rounded-md overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-700"
                    style={{ width: `${Math.min(listenerCount, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="listeners">
          <Card>
            <CardContent className="p-4">
              <p className="text-center text-muted-foreground py-8">
                Details zu den Hörern werden hier angezeigt.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="p-4">
              <p className="text-center text-muted-foreground py-8">
                Stream-Einstellungen werden hier angezeigt.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStatusPanel;
