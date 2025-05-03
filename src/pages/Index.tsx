import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ArrowRight, Radio, Calendar, FileAudio, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchStreamInfo, fetchSchedule, fetchEvents } from "@/services/radioService";
import StatsOverview from "@/components/dashboard/StatsOverview";
import WeatherWidget from "@/components/WeatherWidget";

const Index = () => {
  // Fetch current stream info
  const { data: streamInfo, isLoading: loadingStreamInfo } = useQuery({
    queryKey: ['stream-info'],
    queryFn: fetchStreamInfo,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch schedule data
  const { data: scheduleData } = useQuery({
    queryKey: ['schedule'],
    queryFn: fetchSchedule,
  });

  // Fetch featured events
  const { data: events } = useQuery({
    queryKey: ['featured-events'],
    queryFn: () => fetchEvents(true), // true = only featured events
  });

  // Find the next show from the schedule
  const getNextShow = () => {
    if (!scheduleData || scheduleData.length === 0) return null;
    
    const today = new Date();
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()];
    const currentTime = today.getHours() * 60 + today.getMinutes();
    
    // First check for shows later today
    const todayShows = scheduleData.filter(show => 
      show.day.toLowerCase() === dayOfWeek && 
      parseInt(show.start_time.split(':')[0]) * 60 + parseInt(show.start_time.split(':')[1]) > currentTime
    );
    
    if (todayShows.length > 0) {
      // Sort by start time and get the first one
      todayShows.sort((a, b) => {
        const aTime = parseInt(a.start_time.split(':')[0]) * 60 + parseInt(a.start_time.split(':')[1]);
        const bTime = parseInt(b.start_time.split(':')[0]) * 60 + parseInt(b.start_time.split(':')[1]);
        return aTime - bTime;
      });
      return todayShows[0];
    }
    
    // If no shows today, find the next day with a show
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const todayIndex = daysOfWeek.indexOf(dayOfWeek);
    
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (todayIndex + i) % 7;
      const nextDay = daysOfWeek[nextDayIndex];
      const nextDayShows = scheduleData.filter(show => show.day.toLowerCase() === nextDay);
      
      if (nextDayShows.length > 0) {
        // Sort by start time and get the first one
        nextDayShows.sort((a, b) => {
          const aTime = parseInt(a.start_time.split(':')[0]) * 60 + parseInt(a.start_time.split(':')[1]);
          const bTime = parseInt(b.start_time.split(':')[0]) * 60 + parseInt(b.start_time.split(':')[1]);
          return aTime - bTime;
        });
        return nextDayShows[0];
      }
    }
    
    return null;
  };

  const nextShow = getNextShow();

  // Stats for the overview component
  const stats = {
    podcastCount: 42, // Example value, replace with actual data
    userCount: 1250, // Example value, replace with actual data
    showCount: scheduleData?.length || 0,
    nextShow: nextShow ? {
      title: nextShow.title,
      time: nextShow.start_time,
      day: nextShow.day
    } : null
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-2">Willkommen bei Piper Lee</h1>
          <p className="text-muted-foreground mb-6">Dein Community Radio für die besten Hits und spannende Talks.</p>
          
          {streamInfo?.is_live && (
            <Alert variant="info" className="mb-6 animate-pulse">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Live-Sendung!</AlertTitle>
              <AlertDescription>
                {streamInfo.streamer_name || "Ein Moderator"} ist jetzt live auf Sendung. Schalte ein und sei dabei!
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mb-8">
            <StatsOverview stats={stats} isLoading={loadingStreamInfo} />
          </div>
          
          <Tabs defaultValue="schedule" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schedule">Sendeplan</TabsTrigger>
              <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="schedule" className="border rounded-md p-4">
              <h3 className="text-xl font-semibold mb-4">Aktuelle Sendungen</h3>
              {scheduleData && scheduleData.length > 0 ? (
                <div className="space-y-3">
                  {scheduleData.slice(0, 3).map((show, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{show.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {show.day}, {show.start_time} - {show.end_time} Uhr
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {show.host && `mit ${show.host}`}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="text-right">
                    <Button variant="link" asChild>
                      <Link to="/sendeplan" className="flex items-center">
                        Kompletter Sendeplan <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Keine Sendungen geplant.</p>
              )}
            </TabsContent>
            <TabsContent value="podcasts" className="border rounded-md p-4">
              <h3 className="text-xl font-semibold mb-4">Neueste Podcasts</h3>
              <p className="text-muted-foreground mb-4">Höre unsere neuesten Podcast-Episoden.</p>
              <Button asChild>
                <Link to="/podcasts" className="flex items-center">
                  Zu den Podcasts <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </TabsContent>
            <TabsContent value="events" className="border rounded-md p-4">
              <h3 className="text-xl font-semibold mb-4">Kommende Events</h3>
              {events && events.length > 0 ? (
                <div className="space-y-3">
                  {events.slice(0, 2).map((event) => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {new Date(event.event_date).toLocaleDateString('de-DE')}
                          {event.location && ` • ${event.location}`}
                        </p>
                        {event.description && (
                          <p className="text-sm line-clamp-2">{event.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  <div className="text-right">
                    <Button variant="link" asChild>
                      <Link to="/events" className="flex items-center">
                        Alle Events <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Keine Events geplant.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Wetter</CardTitle>
            </CardHeader>
            <CardContent>
              <WeatherWidget city="Berlin" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Schnellzugriff</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/sendeplan">
                  <Calendar className="mr-2 h-4 w-4" /> Sendeplan
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/podcasts">
                  <FileAudio className="mr-2 h-4 w-4" /> Podcasts
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/songwunsch">
                  <Radio className="mr-2 h-4 w-4" /> Song wünschen
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/chat">
                  <Users className="mr-2 h-4 w-4" /> Live-Chat
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
