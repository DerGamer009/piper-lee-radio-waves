
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Radio,
  Calendar,
  BarChart,
  Settings,
  LogOut
} from 'lucide-react';
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
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/services/apiService';

const AdminSidebar = () => {
  const location = useLocation();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet."
    });
  };
  
  const menuItems = [
    {
      title: "Benutzer",
      icon: Users,
      path: "/admin",
      active: location.pathname === "/admin"
    },
    {
      title: "Sendungen",
      icon: Radio,
      path: "/admin/shows",
      active: location.pathname === "/admin/shows"
    },
    {
      title: "Sendeplan",
      icon: Calendar,
      path: "/admin/schedule",
      active: location.pathname === "/admin/schedule"
    },
    {
      title: "Statistiken",
      icon: BarChart,
      path: "/admin/stats",
      active: location.pathname === "/admin/stats"
    },
    {
      title: "Einstellungen",
      icon: Settings,
      path: "/admin/settings",
      active: location.pathname === "/admin/settings"
    }
  ];
  
  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2 font-semibold">
          <Radio className="h-5 w-5" />
          <span>Admin-Bereich</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hauptmenü</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Abmelden
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
