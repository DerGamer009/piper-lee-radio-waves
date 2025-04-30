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
import { Calendar, Mic, Radio, LogOut, RefreshCw, Menu } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PodcastManagement from '@/components/dashboard/PodcastManagement';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-radio-purple" />
                Live-Sendung
              </CardTitle>
              <CardDescription>
                Starten Sie eine Live-Sendung und verwalten Sie den Stream.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 md:p-6 border rounded-md bg-gray-50">
                  <h3 className="text-lg md:text-xl font-medium mb-4">Stream-Status</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="font-medium">Online</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Hörer: 42
                    </div>
                    <div className="text-sm text-gray-500">
                      Laufzeit: 01:23:45
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <Label htmlFor="live-title">Live-Titel</Label>
                    <Input 
                      id="live-title" 
                      placeholder="Titel der Live-Sendung" 
                      className="mt-1"
                      defaultValue="Nachmittagsklänge mit DJ Max"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="current-song">Aktueller Song</Label>
                    <div className="relative mt-1">
                      <Input 
                        id="current-song" 
                        placeholder="Titel - Interpret" 
                        defaultValue="Sunshine - The Weeknd"
                        className="pr-24"
                      />
                      <Button 
                        className="absolute right-1 top-1 h-7" 
                        size="sm"
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="live-description">Beschreibung</Label>
                  <Textarea 
                    id="live-description" 
                    placeholder="Beschreibung der Live-Sendung" 
                    className="mt-1"
                    defaultValue="Die besten Hits für Ihren Nachmittag! DJ Max bringt Sie mit den neusten Charts und den größten Klassikern durch den Tag."
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="enable-chat" defaultChecked />
                    <Label htmlFor="enable-chat">Chat aktivieren</Label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline">
                      Pause
                    </Button>
                    <Button variant="destructive">
                      Beenden
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModeratorDashboard;
