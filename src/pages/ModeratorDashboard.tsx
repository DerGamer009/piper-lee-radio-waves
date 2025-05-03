
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  BarChart2, 
  Radio, 
  Calendar, 
  Users, 
  FileAudio, 
  LogOut, 
  Settings, 
  Home, 
  Mic,
  RefreshCcw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecentUsers from '@/components/dashboard/RecentUsers';
import RadioPlayer from '@/components/RadioPlayer';

const ModeratorDashboard = () => {
  const { user, isModerator, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Fetch statistics from Supabase
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get podcast count
      const { data: podcasts, error: podcastError } = await supabase
        .from('podcasts')
        .select('id', { count: 'exact', head: true });
      
      // Get user count
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      
      // Get active shows count
      const { data: shows, error: showError } = await supabase
        .from('shows')
        .select('id', { count: 'exact', head: true });
      
      // Get next scheduled show
      const today = new Date();
      const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()];
      
      const { data: nextShow } = await supabase
        .from('schedule')
        .select(`
          *,
          shows:show_id (title)
        `)
        .eq('day_of_week', dayOfWeek)
        .order('start_time', { ascending: true })
        .limit(1);
      
      if (podcastError || userError || showError) {
        throw new Error('Error fetching statistics');
      }
      
      return {
        podcastCount: podcasts?.length ?? 0,
        userCount: users?.length ?? 0,
        showCount: shows?.length ?? 0,
        nextShow: nextShow && nextShow.length > 0 ? {
          title: nextShow[0].shows?.title || 'Unbekannte Sendung',
          time: nextShow[0].start_time,
          day: nextShow[0].day_of_week
        } : null
      };
    }
  });

  const handleRefresh = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    queryClient.invalidateQueries({ queryKey: ['recent-users'] });
    
    setTimeout(() => {
      toast({
        title: "Daten aktualisiert",
        description: "Die Dashboard-Daten wurden erfolgreich aktualisiert.",
      });
      setRefreshing(false);
    }, 1000);
  };

  if (!user || !isModerator) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar className="border-r">
        <SidebarHeader className="border-b">
          <div className="px-6 py-4 flex items-center gap-2">
            <Mic className="h-6 w-6 text-purple-500" />
            <h1 className="text-xl font-semibold">Moderator Panel</h1>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span>Startseite</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <a href="/moderator-dashboard" className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      <span>Dashboard</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/moderator" className="flex items-center gap-2">
                      <Radio className="h-4 w-4" />
                      <span>Radio</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Content</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/schedule" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Sendeplan</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/podcasts" className="flex items-center gap-2">
                      <FileAudio className="h-4 w-4" />
                      <span>Podcasts</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/users" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Benutzer</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Einstellungen</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="border-t">
          <div className="p-4">
            <Button 
              variant="outline" 
              onClick={() => signOut()} 
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          {/* Header with actions */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
          </div>
          
          {/* Statistics Overview */}
          <StatsOverview stats={stats} isLoading={statsLoading} />
          
          {/* Radio Player and Recent Users */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="md:col-span-1 shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5" />
                  Live Radio
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <RadioPlayer 
                  streamUrl="https://backend.piper-lee.net/listen/piper-lee/radio.mp3" 
                  stationName="Piper Lee Radio" 
                />
              </CardContent>
            </Card>
            
            <div className="md:col-span-2">
              <RecentUsers />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
