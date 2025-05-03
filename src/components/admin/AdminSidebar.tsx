
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Radio,
  FileAudio,
  BarChart2,
  Calendar,
  MessageSquare,
  Settings,
  Bell,
  Database,
  LifeBuoy,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const { state, toggleSidebar } = useSidebar();
  const [sidebarState, setSidebarState] = useState(state);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleToggleSidebar = () => {
    toggleSidebar();
    setSidebarState(state === "expanded" ? "collapsed" : "expanded");
  };

  const handleBackToHome = () => {
    navigate('/');
    toast({
      title: "Navigation",
      description: "Sie wurden zur Startseite weitergeleitet.",
    });
  };

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    });
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border relative">
        <div className="flex items-center gap-2 px-4 py-3">
          <Radio className="h-6 w-6 text-purple-500" />
          <div className="font-semibold text-lg">Admin Portal</div>
          <div className="ml-auto">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleSidebar}
              className="hover:bg-purple-100 hover:text-purple-600"
            >
              {sidebarState === "expanded" ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hauptmenü</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Startseite" 
                  onClick={handleBackToHome}
                >
                  <button className="w-full">
                    <Home className="h-4 w-4" />
                    <span>Startseite</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard" isActive={isActive("/admin")}>
                  <Link to="/admin">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Benutzer" isActive={isActive("/admin/users")}>
                  <Link to="/admin/users">
                    <Users className="h-4 w-4" />
                    <span>Benutzerverwaltung</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Sendungen" isActive={isActive("/sendeplan-admin")}>
                  <Link to="/sendeplan-admin">
                    <Calendar className="h-4 w-4" />
                    <span>Sendeplan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Inhalte</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Podcasts" isActive={isActive("/moderator")}>
                  <Link to="/moderator">
                    <FileAudio className="h-4 w-4" />
                    <span>Podcasts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Statistiken" isActive={isActive("/moderator-dashboard")}>
                  <Link to="/moderator-dashboard">
                    <BarChart2 className="h-4 w-4" />
                    <span>Statistiken</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Benachrichtigungen" isActive={isActive("/admin/notifications")}>
                  <Link to="/admin/notifications">
                    <Bell className="h-4 w-4" />
                    <span>Benachrichtigungen</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Nachrichten" isActive={isActive("/admin/messages")}>
                  <Link to="/admin/messages">
                    <MessageSquare className="h-4 w-4" />
                    <span>Nachrichten</span>
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
                <SidebarMenuButton asChild tooltip="Einstellungen" isActive={isActive("/admin/settings")}>
                  <Link to="/admin/settings">
                    <Settings className="h-4 w-4" />
                    <span>Einstellungen</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Datenbank" isActive={isActive("/admin/database")}>
                  <Link to="/admin/database">
                    <Database className="h-4 w-4" />
                    <span>Datenbank</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Support">
                  <a href="https://piper-lee.de/help" target="_blank" rel="noopener noreferrer">
                    <LifeBuoy className="h-4 w-4" />
                    <span>Support</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Abmelden" onClick={handleSignOut}>
              <button className="w-full">
                <LogOut className="h-4 w-4" />
                <span>Abmelden</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}

export default AdminSidebar;
