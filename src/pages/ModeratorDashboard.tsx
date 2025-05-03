
import React from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
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
  SidebarGroupLabel
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
  Mic
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecentUsers from '@/components/dashboard/RecentUsers';
import RadioPlayer from '@/components/RadioPlayer';

const ModeratorDashboard = () => {
  const { user, isModerator, signOut } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if we're on the main dashboard or a subpage
  const isMainDashboard = location.pathname === "/moderator";
  
  const handleSignOut = () => {
    signOut();
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    });
  };

  if (!user || !isModerator) {
    return <Navigate to="/login" replace />;
  }
  
  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
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
                    <Link to="/" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span>Startseite</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/moderator")}>
                    <Link to="/moderator" className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
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
                  <SidebarMenuButton asChild isActive={isActive("/sendeplan-admin")}>
                    <Link to="/sendeplan-admin" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Sendeplan</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/podcasts")}>
                    <Link to="/podcasts" className="flex items-center gap-2">
                      <FileAudio className="h-4 w-4" />
                      <span>Podcasts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/moderator/users")}>
                    <Link to="/moderator/users" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Benutzer</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/moderator/radio")}>
                    <Link to="/moderator/radio" className="flex items-center gap-2">
                      <Radio className="h-4 w-4" />
                      <span>Radio</span>
                    </Link>
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
                  <SidebarMenuButton asChild isActive={isActive("/moderator/settings")}>
                    <Link to="/moderator/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Einstellungen</span>
                    </Link>
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
              onClick={handleSignOut} 
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      {/* Main Dashboard Content (only shown on the main dashboard route) */}
      {isMainDashboard && (
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            
            {/* Statistics Overview */}
            <StatsOverview stats={{
              podcastCount: 0,
              userCount: 0,
              showCount: 0,
              nextShow: null
            }} isLoading={false} />
            
            {/* Radio Player and Recent Users */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="md:col-span-1">
                <RadioPlayer 
                  streamUrl="https://backend.piper-lee.net/listen/piper-lee/radio.mp3" 
                  stationName="Piper Lee Radio" 
                />
              </div>
              
              <div className="md:col-span-2">
                <RecentUsers />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModeratorDashboard;
