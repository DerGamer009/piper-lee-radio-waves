import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, FileText, BarChart3, CalendarDays, 
  Database, Radio, PanelLeft, LogOut, Activity
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import UserManagement from '@/components/dashboard/UserManagement';
import NewsManagement from '@/components/dashboard/NewsManagement';
import PollManagement from '@/components/dashboard/PollManagement';
import PodcastManagement from '@/components/dashboard/PodcastManagement';
import PartnerManagement from '@/components/dashboard/PartnerManagement';
import DashboardStats from '@/components/dashboard/DashboardStats';
import StatusManagement from '@/components/dashboard/StatusManagement';

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-sidebar flex flex-col transition-width duration-300 ease-in-out fixed h-screen border-r border-border`}>
        <div className="p-4 flex items-center justify-between border-b border-border">
          <h2 className={`font-semibold ${sidebarCollapsed ? 'hidden' : 'block'}`}>Admin Panel</h2>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
            className="p-1 rounded-md hover:bg-accent/50"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 py-4">
          {/* Sidebar navigation links would go here */}
        </div>
        
        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center px-3 py-2 rounded-md hover:bg-accent/50">
            <LogOut className="h-5 w-5 mr-2" />
            {!sidebarCollapsed && <span>Abmelden</span>}
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-margin duration-300 ease-in-out px-6 py-8`}>
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Verwalten Sie Ihre Seite und Inhalte.</p>
          </header>
          
          <Tabs defaultValue="users">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Benutzer</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">News</span>
              </TabsTrigger>
              <TabsTrigger value="polls" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Umfragen</span>
              </TabsTrigger>
              <TabsTrigger value="podcasts" className="flex items-center gap-1">
                <Radio className="h-4 w-4" />
                <span className="hidden sm:inline">Podcasts</span>
              </TabsTrigger>
              <TabsTrigger value="partners" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Partner</span>
              </TabsTrigger>
              <TabsTrigger value="status" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Status</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <DashboardStats />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="news">
              <NewsManagement />
            </TabsContent>
            
            <TabsContent value="polls">
              <PollManagement />
            </TabsContent>
            
            <TabsContent value="podcasts">
              <PodcastManagement />
            </TabsContent>
            
            <TabsContent value="partners">
              <PartnerManagement />
            </TabsContent>
            
            <TabsContent value="status">
              <StatusManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
