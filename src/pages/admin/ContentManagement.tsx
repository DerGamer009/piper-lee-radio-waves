
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SidebarInset } from '@/components/ui/sidebar';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash, 
  Upload,
  Download,
  Search,
  Calendar,
  Users,
  Radio,
  MessageSquare
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Define known table names for type safety
type KnownTable = 'news' | 'events' | 'podcasts' | 'partners' | 'polls' | 'chat_messages';

// Type guard to check if a string is a known table name
const isKnownTable = (table: string): table is KnownTable => {
  return ['news', 'events', 'podcasts', 'partners', 'polls', 'chat_messages'].includes(table);
};

const ContentManagement = () => {
  const [selectedContent, setSelectedContent] = useState<string>('news');

  // Fetch content statistics
  const { data: contentStats, isLoading } = useQuery({
    queryKey: ['content-stats'],
    queryFn: async () => {
      const stats = await Promise.all([
        supabase.from('news').select('id, title, created_at, is_published'),
        supabase.from('events').select('id, title, created_at, start_date'),
        supabase.from('podcasts').select('id, title, created_at, duration'),
        supabase.from('partners').select('id, name, created_at, is_active'),
        supabase.from('polls').select('id, question, created_at, is_active'),
        supabase.from('chat_messages').select('id, message, created_at, sender_name')
      ]);

      return {
        news: stats[0].data || [],
        events: stats[1].data || [],
        podcasts: stats[2].data || [],
        partners: stats[3].data || [],
        polls: stats[4].data || [],
        messages: stats[5].data || []
      };
    }
  });

  // Fetch specific content based on selection
  const { data: currentContent } = useQuery({
    queryKey: ['content', selectedContent],
    queryFn: async () => {
      if (!isKnownTable(selectedContent)) {
        throw new Error(`Unknown table: ${selectedContent}`);
      }
      
      const { data, error } = await supabase
        .from(selectedContent)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedContent
  });

  const handleDelete = async (id: string) => {
    if (!isKnownTable(selectedContent)) return;
    
    try {
      const { error } = await supabase
        .from(selectedContent)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refetch data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const ContentCard = ({ title, count, icon: Icon, type }: any) => (
    <Card 
      className={`cursor-pointer transition-colors ${selectedContent === type ? 'ring-2 ring-primary' : ''}`}
      onClick={() => setSelectedContent(type)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <SidebarInset>
        <div className="container mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Content Management</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="manage">Verwalten</TabsTrigger>
            <TabsTrigger value="bulk">Bulk-Aktionen</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ContentCard
                title="News-Artikel"
                count={contentStats?.news?.length || 0}
                icon={FileText}
                type="news"
              />
              <ContentCard
                title="Events"
                count={contentStats?.events?.length || 0}
                icon={Calendar}
                type="events"
              />
              <ContentCard
                title="Podcasts"
                count={contentStats?.podcasts?.length || 0}
                icon={Radio}
                type="podcasts"
              />
              <ContentCard
                title="Partner"
                count={contentStats?.partners?.length || 0}
                icon={Users}
                type="partners"
              />
              <ContentCard
                title="Umfragen"
                count={contentStats?.polls?.length || 0}
                icon={Search}
                type="polls"
              />
              <ContentCard
                title="Chat-Nachrichten"
                count={contentStats?.messages?.length || 0}
                icon={MessageSquare}
                type="messages"
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

          <TabsContent value="manage" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedContent.charAt(0).toUpperCase() + selectedContent.slice(1)} verwalten
              </h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Suchen
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Neu erstellen
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titel/Name</TableHead>
                      <TableHead>Erstellt</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentContent?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.title || item.name || item.question || item.message?.substring(0, 50)}
                        </TableCell>
                        <TableCell>
                          {new Date(item.created_at).toLocaleDateString('de-DE')}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.is_published || item.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.is_published || item.is_active ? 'Aktiv' : 'Inaktiv'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk-Aktionen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20">
                    <Upload className="h-6 w-6 mr-2" />
                    CSV Import
                  </Button>
                  <Button variant="outline" className="h-20">
                    <Download className="h-6 w-6 mr-2" />
                    CSV Export
                  </Button>
                  <Button variant="outline" className="h-20">
                    <Edit className="h-6 w-6 mr-2" />
                    Bulk-Bearbeitung
                  </Button>
                  <Button variant="outline" className="h-20">
                    <Trash className="h-6 w-6 mr-2" />
                    Bulk-Löschung
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
};

export default ContentManagement;
