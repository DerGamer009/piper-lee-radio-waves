import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Calendar, Mic, Radio, LogOut, RefreshCw, Menu, Clock, Users, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PodcastManagement from '@/components/dashboard/PodcastManagement';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import RadioPlayer from '@/components/RadioPlayer';

interface Show {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

interface ScheduleItem {
  id: string;
  show_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  host_id: string | null;
  is_recurring: boolean;
  show_title?: string;
}

const ModeratorDashboard = () => {
  const { user, isModerator, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { isMobile } = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  // States for show form
  const [isAddingShow, setIsAddingShow] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [currentSong, setCurrentSong] = useState('Sunshine - The Weeknd');
  const [liveTitle, setLiveTitle] = useState('Nachmittagsklänge mit DJ Max');
  const [liveDescription, setLiveDescription] = useState('Die besten Hits für Ihren Nachmittag! DJ Max bringt Sie mit den neusten Charts und den größten Klassikern durch den Tag.');
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const [streamDuration, setStreamDuration] = useState('01:23:45');
  const [listeners, setListeners] = useState(42);

  // Query for shows
  const { data: shows, isLoading: showsLoading } = useQuery({
    queryKey: ['shows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Show[];
    }
  });

  // Query for schedule
  const { data: schedule, isLoading: scheduleLoading } = useQuery({
    queryKey: ['schedule'],
    queryFn: async () => {
      // Get schedule with show information
      const { data, error } = await supabase
        .from('schedule')
        .select(`
          *,
          shows:show_id (
            title
          )
        `)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      return data.map((item) => ({
        ...item,
        show_title: item.shows?.title
      })) as ScheduleItem[];
    }
  });

  const handleRefresh = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ['shows'] });
    queryClient.invalidateQueries({ queryKey: ['schedule'] });
    queryClient.invalidateQueries({ queryKey: ['podcasts'] });
    
    setTimeout(() => {
      toast({
        title: "Daten aktualisiert",
        description: "Die Ansicht wurde erfolgreich aktualisiert.",
      });
      setRefreshing(false);
    }, 1000);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const updateStreamInfo = (type: string) => {
    let message = "";
    
    switch(type) {
      case 'song':
        message = "Aktueller Song aktualisiert";
        break;
      case 'title':
        message = "Live-Titel aktualisiert";
        break;
      case 'all':
        message = "Stream-Informationen aktualisiert";
        break;
      default:
        message = "Änderungen wurden gespeichert";
    }
    
    toast({
      title: message,
      description: "Die Stream-Informationen wurden erfolgreich aktualisiert.",
    });
  };

  const handleEndStream = () => {
    toast({
      title: "Stream beendet",
      description: "Die Live-Sendung wurde erfolgreich beendet.",
    });
    setIsLive(false);
  };

  const handlePauseStream = () => {
    toast({
      title: "Stream pausiert",
      description: "Die Live-Sendung wurde pausiert. Klicken Sie auf 'Fortsetzen', um weiterzusenden.",
    });
  };

  const startStream = () => {
    setIsLive(true);
    toast({
      title: "Stream gestartet",
      description: "Die Live-Sendung wurde erfolgreich gestartet.",
    });
  };

  const createShow = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('shows')
        .insert([
          { 
            title, 
            description: description || null, 
            image_url: imageUrl || null,
            created_by: user?.id
          }
        ]);

      if (error) throw error;
      
      toast({
        title: "Sendung erstellt",
        description: "Die Sendung wurde erfolgreich erstellt.",
      });
      
      resetShowForm();
      queryClient.invalidateQueries({ queryKey: ['shows'] });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: `Die Sendung konnte nicht erstellt werden: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const resetShowForm = () => {
    setIsAddingShow(false);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setIsLive(false);
  };

  if (!user || !isModerator) {
    return <Navigate to="/login" replace />;
  }

  const isLoading = showsLoading || scheduleLoading;

  return (
    <div className="container mx-auto py-6 md:py-8 px-4">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Mic className="h-6 w-6 md:h-8 md:w-8 text-radio-purple" />
          <span className={isMobile ? "sr-only" : ""}>Moderator-Dashboard</span>
        </h1>
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className={isMobile ? "px-2" : ""}
          >
            <RefreshCw className={`h-4 w-4 ${isMobile ? "" : "mr-2"} ${refreshing ? 'animate-spin' : ''}`} />
            {!isMobile && "Aktualisieren"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout} className={isMobile ? "px-2" : ""}>
            <LogOut className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />
            {!isMobile && "Abmelden"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="shows" className="space-y-6">
        <TabsList className="mb-4 bg-background border overflow-x-auto flex w-full md:inline-flex">
          <TabsTrigger value="shows" className="flex-1 md:flex-initial">Sendungen</TabsTrigger>
          <TabsTrigger value="schedule" className="flex-1 md:flex-initial">Sendeplan</TabsTrigger>
          <TabsTrigger value="podcasts" className="flex-1 md:flex-initial">Podcasts</TabsTrigger>
          <TabsTrigger value="live" className="flex-1 md:flex-initial">Live</TabsTrigger>
        </TabsList>

        <TabsContent value="shows" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <CardTitle>Sendungen verwalten</CardTitle>
                {!isAddingShow && (
                  <Button onClick={() => setIsAddingShow(true)}>
                    Neue Sendung
                  </Button>
                )}
              </div>
              <CardDescription>
                Hier können Sie neue Sendungen erstellen und bestehende verwalten.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAddingShow ? (
                <form onSubmit={createShow} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titel</Label>
                    <Input 
                      id="title" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Titel der Sendung"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Beschreibung (optional)</Label>
                    <Textarea 
                      id="description" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Beschreibung der Sendung"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="imageUrl">Bild-URL (optional)</Label>
                    <Input 
                      id="imageUrl" 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="URL zum Bild der Sendung"
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetShowForm}
                    >
                      Abbrechen
                    </Button>
                    <Button type="submit">
                      Sendung erstellen
                    </Button>
                  </div>
                </form>
              ) : isLoading ? (
                <div className="flex justify-center p-6">
                  <div className="animate-spin h-10 w-10 border-4 border-radio-purple border-t-transparent rounded-full"></div>
                </div>
              ) : shows && shows.length > 0 ? (
                <div className="space-y-4">
                  {shows.map((show) => (
                    <div 
                      key={show.id} 
                      className="p-4 border rounded-md hover:bg-gray-50 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium">{show.title}</h3>
                        {show.description && (
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {show.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Erstellt am {new Date(show.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Bearbeiten
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>Keine Sendungen vorhanden</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsAddingShow(true)}
                  >
                    Erste Sendung erstellen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Sendeplan
                </CardTitle>
                <Button asChild>
                  <a href="/moderator">Zum Planer</a>
                </Button>
              </div>
              <CardDescription>
                Überblick über den aktuellen Sendeplan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-6">
                  <div className="animate-spin h-10 w-10 border-4 border-radio-purple border-t-transparent rounded-full"></div>
                </div>
              ) : schedule && schedule.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {schedule.map((item) => (
                      <div 
                        key={item.id}
                        className="p-3 border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium">{item.show_title}</div>
                        <div className="text-sm text-gray-500">
                          {item.day_of_week}, {item.start_time} - {item.end_time} Uhr
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {item.is_recurring ? "Wöchentlich" : "Einmalig"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>Kein Sendeplan vorhanden</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    asChild
                  >
                    <a href="/moderator">Zum Planer</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="podcasts">
          <PodcastManagement />
        </TabsContent>
        
        <TabsContent value="live">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="flex items-center gap-2 text-radio-purple">
                  <Radio className="h-5 w-5" />
                  <span className="text-lg md:text-2xl font-bold">Live-Sendung</span>
                </div>
                <div className={`ml-2 px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${isLive ? 'bg-red-500/20 text-red-500' : 'bg-gray-500/20 text-gray-500'}`}>
                  <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
                  <span>{isLive ? 'On Air' : 'Offline'}</span>
                </div>
              </CardTitle>
              <CardDescription>
                Starten Sie eine Live-Sendung und verwalten Sie den Stream.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Stream Status Card */}
                <div className="p-6 border rounded-xl bg-card/60 backdrop-blur-sm shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      {isLive ? (
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="font-medium text-lg">Online</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                          <span className="font-medium text-lg text-gray-400">Offline</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {isLive && (
                        <>
                          <div className="flex items-center gap-2 bg-card/80 px-4 py-2 rounded-lg">
                            <Users className="h-4 w-4 text-green-400" />
                            <span><span className="font-semibold">{listeners}</span> Hörer</span>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-card/80 px-4 py-2 rounded-lg">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span>Laufzeit: <span className="font-semibold">{streamDuration}</span></span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <RadioPlayer 
                        streamUrl="https://backend.piper-lee.net/listen/piper-lee/radio.mp3"
                        stationName={liveTitle || "Live Stream"}
                        compact={true}
                      />
                    </div>
                    
                    <div className="col-span-1 md:col-span-2">
                      {!isLive && (
                        <div className="h-full flex flex-col items-center justify-center">
                          <p className="text-muted-foreground mb-4">Starten Sie eine Live-Sendung, um den Stream zu verwalten.</p>
                          <Button onClick={startStream} className="bg-green-500 hover:bg-green-600">
                            Stream starten
                          </Button>
                        </div>
                      )}
                      
                      {isLive && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="live-title" className="text-muted-foreground">Live-Titel</Label>
                            <div className="mt-1 flex gap-2">
                              <Input
                                id="live-title"
                                value={liveTitle}
                                onChange={(e) => setLiveTitle(e.target.value)}
                                className="flex-1"
                              />
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateStreamInfo('title')}
                              >
                                Speichern
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="current-song" className="text-muted-foreground">Aktueller Song</Label>
                            <div className="mt-1 flex gap-2">
                              <Input
                                id="current-song"
                                value={currentSong}
                                onChange={(e) => setCurrentSong(e.target.value)}
                                className="flex-1"
                              />
                              <Button 
                                size="sm" 
                                className="bg-radio-purple hover:bg-radio-blue"
                                onClick={() => updateStreamInfo('song')}
                              >
                                Update
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Stream Description and Settings */}
                {isLive && (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="live-description" className="text-muted-foreground">Beschreibung</Label>
                        <Textarea
                          id="live-description"
                          value={liveDescription}
                          onChange={(e) => setLiveDescription(e.target.value)}
                          rows={3}
                          className="mt-1 resize-none"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between flex-wrap gap-4 border-t border-muted pt-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="enable-chat" 
                          checked={isChatEnabled}
                          onCheckedChange={setIsChatEnabled}
                        />
                        <Label htmlFor="enable-chat">Chat aktivieren</Label>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={handlePauseStream}
                        >
                          Pause
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleEndStream}
                        >
                          Beenden
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModeratorDashboard;
