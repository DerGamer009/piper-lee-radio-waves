
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Home, 
  Users, 
  Settings, 
  Bell, 
  MessageSquare, 
  Database, 
  Calendar, 
  BarChart2, 
  Radio, 
  FileAudio, 
  Shield, 
  Server, 
  LogOut,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { toast } = useToast();

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle sign out
  const handleSignOut = () => {
    signOut();
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    });
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <div className="px-6 py-4 flex items-center gap-2">
          <div className="relative">
            <Shield className="h-6 w-6 text-primary animate-pulse" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
          </div>
          <h1 className="text-xl font-semibold">
            <span className="text-primary">Admin</span> Panel
          </h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Home className="h-4 w-4" />
                    <span>Startseite</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin")}>
                  <Link to="/admin" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <BarChart2 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Verwaltung</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/users")}>
                  <Link to="/admin/users" className="flex items-center justify-between hover:text-primary transition-colors">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Benutzer</span>
                    </div>
                    <Badge className="bg-amber-500 text-white text-[10px]">125</Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/messages")}>
                  <Link to="/admin/messages" className="flex items-center justify-between hover:text-primary transition-colors">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Nachrichten</span>
                    </div>
                    <Badge className="bg-blue-500 text-white text-[10px]">3</Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/notifications")}>
                  <Link to="/admin/notifications" className="flex items-center justify-between hover:text-primary transition-colors">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Benachrichtigungen</span>
                    </div>
                    <Badge className="bg-red-500 text-white text-[10px]">5</Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/sendeplan-admin")}>
                  <Link to="/sendeplan-admin" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Calendar className="h-4 w-4" />
                    <span>Sendeplan</span>
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
                <SidebarMenuButton asChild isActive={isActive("/admin/radio")}>
                  <Link to="/admin/radio" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Radio className="h-4 w-4" />
                    <span>Radio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/podcasts")}>
                  <Link to="/admin/podcasts" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <FileAudio className="h-4 w-4" />
                    <span>Podcasts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/news")}>
                  <Link to="/admin/news" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Globe className="h-4 w-4" />
                    <span>Neuigkeiten</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/database")}>
                  <Link to="/admin/database" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Database className="h-4 w-4" />
                    <span>Datenbank</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/server")}>
                  <Link to="/admin/server" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Server className="h-4 w-4" />
                    <span>Server</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/settings")}>
                  <Link to="/admin/settings" className="flex items-center gap-2 hover:text-primary transition-colors">
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
          <div className={cn(
            "text-xs text-center mt-2 text-muted-foreground",
            "border-t border-dashed border-muted/50 pt-2"
          )}>
            Version 1.5.2 • System Online
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
