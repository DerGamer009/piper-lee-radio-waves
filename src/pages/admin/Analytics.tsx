
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarInset } from '@/components/ui/sidebar';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Download,
  Calendar,
  Activity,
  Globe,
  Radio
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30");

  // Fetch user statistics
  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at, is_active');
      
      if (error) throw error;
      
      const totalUsers = data.length;
      const activeUsers = data.filter(user => user.is_active).length;
      const newUsersToday = data.filter(user => {
        const createdDate = new Date(user.created_at);
        const today = new Date();
        return createdDate.toDateString() === today.toDateString();
      }).length;

      return { totalUsers, activeUsers, newUsersToday };
    }
  });

  // Fetch content statistics
  const { data: contentStats } = useQuery({
    queryKey: ['content-stats'],
    queryFn: async () => {
      const [news, events, podcasts, messages] = await Promise.all([
        supabase.from('news').select('id, created_at'),
        supabase.from('events').select('id, created_at'),
        supabase.from('podcasts').select('id, created_at'),
        supabase.from('chat_messages').select('id, created_at')
      ]);

      return {
        newsCount: news.data?.length || 0,
        eventsCount: events.data?.length || 0,
        podcastsCount: podcasts.data?.length || 0,
        messagesCount: messages.data?.length || 0
      };
    }
  });

  // Mock data for charts (in a real app, this would come from analytics service)
  const visitorsData = [
    { date: '01.06', visitors: 120, pageViews: 450 },
    { date: '02.06', visitors: 132, pageViews: 520 },
    { date: '03.06', visitors: 101, pageViews: 380 },
    { date: '04.06', visitors: 134, pageViews: 600 },
    { date: '05.06', visitors: 90, pageViews: 320 },
    { date: '06.06', visitors: 145, pageViews: 680 },
    { date: '07.06', visitors: 156, pageViews: 720 }
  ];

  const contentEngagementData = [
    { name: 'News', value: 35, color: '#8884d8' },
    { name: 'Podcasts', value: 30, color: '#82ca9d' },
    { name: 'Events', value: 20, color: '#ffc658' },
    { name: 'Chat', value: 15, color: '#ff7300' }
  ];

  const deviceData = [
    { device: 'Desktop', count: 45, percentage: 45 },
    { device: 'Mobile', count: 40, percentage: 40 },
    { device: 'Tablet', count: 15, percentage: 15 }
  ];

  const StatCard = ({ title, value, icon: Icon, change }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{change}% seit letztem Monat
              </p>
            )}
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="users">Benutzer</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Gesamte Benutzer"
                value={userStats?.totalUsers || 0}
                icon={Users}
                change={12}
              />
              <StatCard
                title="Aktive Benutzer"
                value={userStats?.activeUsers || 0}
                icon={Activity}
                change={8}
              />
              <StatCard
                title="Seitenaufrufe (heute)"
                value="1,234"
                icon={Eye}
                change={15}
              />
              <StatCard
                title="Radio-Hörer (live)"
                value="89"
                icon={Radio}
                change={23}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Besucher & Seitenaufrufe</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={visitorsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="visitors" stroke="#8884d8" name="Besucher" />
                      <Line type="monotone" dataKey="pageViews" stroke="#82ca9d" name="Seitenaufrufe" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={contentEngagementData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {contentEngagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Neue Benutzer (heute)"
                value={userStats?.newUsersToday || 0}
                icon={Users}
              />
              <StatCard
                title="Aktive Sessions"
                value="24"
                icon={Activity}
              />
              <StatCard
                title="Durchschnittliche Verweildauer"
                value="4:32 min"
                icon={Calendar}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Gerätenutzung</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deviceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="device" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="News-Artikel"
                value={contentStats?.newsCount || 0}
                icon={Globe}
              />
              <StatCard
                title="Events"
                value={contentStats?.eventsCount || 0}
                icon={Calendar}
              />
              <StatCard
                title="Podcasts"
                value={contentStats?.podcastsCount || 0}
                icon={Radio}
              />
              <StatCard
                title="Chat-Nachrichten"
                value={contentStats?.messagesCount || 0}
                icon={Activity}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span>Meist gelesene News</span>
                    <span className="font-semibold">1,234 Aufrufe</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span>Beliebtester Podcast</span>
                    <span className="font-semibold">892 Downloads</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span>Nächstes Event</span>
                    <span className="font-semibold">45 Anmeldungen</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Ladezeit (Ø)"
                value="1.2s"
                icon={TrendingUp}
              />
              <StatCard
                title="Bounce Rate"
                value="23%"
                icon={Activity}
              />
              <StatCard
                title="API Anfragen"
                value="15,432"
                icon={Globe}
              />
              <StatCard
                title="Server Uptime"
                value="99.9%"
                icon={Activity}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Datenbank</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Gesund</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>API Server</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Gesund</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>CDN</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Warnung</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Stream Server</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Gesund</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
};

export default Analytics;
