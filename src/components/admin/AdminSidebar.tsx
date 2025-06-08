
import React from "react";
import { Home, Database, Users, FileText, BarChart3, Settings, Shield, HardDrive, MessageSquare, Bell } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Content Management",
    url: "/admin/content",
    icon: FileText,
  },
  {
    title: "Benutzerverwaltung",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Analytics & Reports",
    url: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Backup-Verwaltung",
    url: "/admin/backup",
    icon: HardDrive,
  },
  {
    title: "Datenbank",
    url: "/admin/database",
    icon: Database,
  },
  {
    title: "Nachrichten",
    url: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Benachrichtigungen",
    url: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Einstellungen",
    url: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-semibold">Admin Panel</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
