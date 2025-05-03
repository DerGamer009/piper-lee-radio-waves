
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
  Mic,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentUsers from '@/components/dashboard/RecentUsers';
import RadioPlayer from '@/components/RadioPlayer';
import WeatherWidget from '@/components/WeatherWidget';

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
            <div className="relative">
              <Mic className="h-6 w-6 text-primary animate-pulse" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            <h1 className="text-xl font-semibold">
              <span className="text-primary">Moderator</span> Panel
            </h1>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="custom-scrollbar">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="fade-in" style={{animationDelay: "0ms"}}>
                  <SidebarMenuButton asChild>
                    <Link to="/" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Home className="h-4 w-4" />
                      <span>Startseite</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="fade-in" style={{animationDelay: "50ms"}}>
                  <SidebarMenuButton asChild isActive={isActive("/moderator")}>
                    <Link to="/moderator" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <BarChart2 className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-1">
              <span>Content</span>
              <Sparkles className="h-3 w-3 text-amber-400" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="fade-in" style={{animationDelay: "100ms"}}>
                  <SidebarMenuButton asChild isActive={isActive("/sendeplan-admin")}>
                    <Link to="/sendeplan-admin" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Calendar className="h-4 w-4" />
                      <span>Sendeplan</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="fade-in" style={{animationDelay: "150ms"}}>
                  <SidebarMenuButton asChild isActive={isActive("/podcasts")}>
                    <Link to="/podcasts" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <FileAudio className="h-4 w-4" />
                      <span>Podcasts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="fade-in" style={{animationDelay: "200ms"}}>
                  <SidebarMenuButton asChild isActive={isActive("/moderator/users")}>
                    <Link to="/moderator/users" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Users className="h-4 w-4" />
                      <span>Benutzer</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="fade-in" style={{animationDelay: "250ms"}}>
                  <SidebarMenuButton asChild isActive={isActive("/moderator/radio")}>
                    <Link to="/moderator/radio" className="flex items-center gap-2 hover:text-primary transition-colors">
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
                <SidebarMenuItem className="fade-in" style={{animationDelay: "300ms"}}>
                  <SidebarMenuButton asChild isActive={isActive("/moderator/settings")}>
                    <Link to="/moderator/settings" className="flex items-center gap-2 hover:text-primary transition-colors">
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
              className="w-full justify-start hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      {/* Main Dashboard Content (only shown on the main dashboard route) */}
      {isMainDashboard && (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-background/95">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2 text-gradient">Dashboard</h1>
            <p className="text-muted-foreground mb-8">Willkommen im Moderator-Bereich, verwalten Sie Ihre Inhalte.</p>
            
            {/* Statistics Overview */}
            <div className="fade-in" style={{animationDelay: "150ms"}}>
              <DashboardStats />
            </div>
            
            {/* Radio Player, Weather and Recent Users */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="md:col-span-1 fade-in" style={{animationDelay: "250ms"}}>
                <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden shadow-sm hover-lift mb-6">
                  <RadioPlayer 
                    streamUrl="https://backend.piper-lee.net/listen/piper-lee/radio.mp3" 
                    stationName="Piper Lee Radio" 
                  />
                </div>
                
                <div className="fade-in" style={{animationDelay: "300ms"}}>
                  <WeatherWidget city="Berlin" />
                </div>
              </div>
              
              <div className="md:col-span-2 fade-in" style={{animationDelay: "350ms"}}>
                <div className="h-full bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm overflow-hidden hover-lift">
                  <RecentUsers />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModeratorDashboard;
