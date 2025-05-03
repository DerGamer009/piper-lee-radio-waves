
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { BarChart2, Users, Radio, FileAudio, CalendarDays, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminStatusPanel from '@/components/admin/AdminStatusPanel';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Sample stats data - in a real app, this would come from an API
  const statsData = {
    users: 1254,
    podcasts: 87,
    shows: 42,
    listeners: 3890
  };
  
  // Stream URL for the radio station
  const streamUrl = "https://stream.radio-piper-lee.com/live";

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleRefreshStats = () => {
    toast({
      title: "Aktualisiert",
      description: "Die Statistiken wurden aktualisiert.",
      duration: 3000,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-background/95 p-6">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gradient">Admin Dashboard</h1>
          <p className="text-muted-foreground">Verwalten Sie Ihre Plattform und überwachen Sie wichtige Kennzahlen</p>
        </header>
        
        <div className="grid gap-6">
          {/* Stats Overview Cards */}
          <section className="fade-in" style={{animationDelay: "150ms"}}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 glass-card hover-lift flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Benutzer</p>
                  <h3 className="text-2xl font-bold">{statsData.users}</h3>
                </div>
              </Card>
              
              <Card className="p-4 glass-card hover-lift flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <FileAudio className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Podcasts</p>
                  <h3 className="text-2xl font-bold">{statsData.podcasts}</h3>
                </div>
              </Card>
              
              <Card className="p-4 glass-card hover-lift flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CalendarDays className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shows</p>
                  <h3 className="text-2xl font-bold">{statsData.shows}</h3>
                </div>
              </Card>
              
              <Card className="p-4 glass-card hover-lift flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                  <Radio className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zuhörer</p>
                  <h3 className="text-2xl font-bold">{statsData.listeners}</h3>
                </div>
              </Card>
            </div>
          </section>
          
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Detailed Statistics */}
            <div className="lg:col-span-2 space-y-6 fade-in" style={{animationDelay: "250ms"}}>
              <Card className="p-6 glass-card hover-lift">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    <span>Statistiken</span>
                  </h2>
                  <Button variant="outline" size="sm" onClick={handleRefreshStats}>
                    Aktualisieren
                  </Button>
                </div>
                <div className="h-80">
                  <DashboardStats />
                </div>
              </Card>
              
              <Card className="p-6 glass-card hover-lift">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>System Status</span>
                  </h2>
                </div>
                <AdminStatusPanel streamUrl={streamUrl} />
              </Card>
            </div>
            
            {/* Right Column: Quick Actions and Information */}
            <div className="space-y-6 fade-in" style={{animationDelay: "350ms"}}>
              <Card className="p-6 glass-card hover-lift">
                <h2 className="text-xl font-semibold mb-4">Schnellzugriff</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-left" asChild>
                    <a href="/admin/users">
                      <Users className="mr-2 h-4 w-4" />
                      Benutzer verwalten
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left" asChild>
                    <a href="/admin/database">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Datenbank
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left" asChild>
                    <a href="/sendeplan-admin">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Sendeplan bearbeiten
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left" asChild>
                    <a href="/admin/settings">
                      <Activity className="mr-2 h-4 w-4" />
                      Einstellungen
                    </a>
                  </Button>
                </div>
              </Card>
              
              <Card className="p-6 glass-card hover-lift">
                <h2 className="text-xl font-semibold mb-4">System Info</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version:</span>
                    <span className="font-medium">2.5.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Letztes Update:</span>
                    <span className="font-medium">03.05.2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Server Status:</span>
                    <span className="font-medium text-green-500">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Datenbank Status:</span>
                    <span className="font-medium text-green-500">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Caching:</span>
                    <span className="font-medium text-green-500">Aktiv</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      System-Diagnose ausführen
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
