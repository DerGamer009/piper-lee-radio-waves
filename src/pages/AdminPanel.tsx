
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, FileText, BarChart3, CalendarDays, 
  Database, Radio, PanelLeft, LogOut, Activity,
  LayoutDashboard
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
  const [activeTab, setActiveTab] = useState('users');

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'users', label: 'Benutzer', icon: <Users className="h-5 w-5" /> },
    { id: 'news', label: 'News', icon: <FileText className="h-5 w-5" /> },
    { id: 'polls', label: 'Umfragen', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'podcasts', label: 'Podcasts', icon: <Radio className="h-5 w-5" /> },
    { id: 'partners', label: 'Partner', icon: <Users className="h-5 w-5" /> },
    { id: 'status', label: 'Status', icon: <Activity className="h-5 w-5" /> },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-[#1c1f2f] flex flex-col transition-width duration-300 ease-in-out fixed h-screen border-r border-border`}>
        <div className="p-4 flex items-center justify-between border-b border-border">
          <h2 className={`font-semibold text-white ${sidebarCollapsed ? 'hidden' : 'block'}`}>Admin Panel</h2>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
            className="p-1 rounded-md hover:bg-accent/50 text-white"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          {/* Navigation links */}
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                  activeTab === item.id 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                } ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                onClick={() => handleTabChange(item.id)}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-border">
          <button className={`w-full flex items-center px-3 py-2 rounded-md text-gray-300 hover:bg-accent/50 hover:text-white ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span className="ml-2">Abmelden</span>}
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
          
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="hidden">
              {navItems.map(item => (
                <TabsTrigger key={item.id} value={item.id}>
                  {item.label}
                </TabsTrigger>
              ))}
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
