
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash, 
  Save, 
  Eye, 
  Calendar,
  Tag,
  Image,
  Globe,
  Settings
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch news articles
  const { data: newsArticles, isLoading: newsLoading } = useQuery({
    queryKey: ['admin-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch events
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch podcasts
  const { data: podcasts, isLoading: podcastsLoading } = useQuery({
    queryKey: ['admin-podcasts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleCreateContent = () => {
    setIsCreating(true);
    setEditingItem(null);
  };

  const handleEditContent = (item: any) => {
    setEditingItem(item);
    setIsCreating(false);
  };

  const handleDeleteContent = async (type: string, id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Inhalt löschen möchten?')) return;

    try {
      const { error } = await supabase
        .from(type)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Inhalt gelöscht",
        description: "Der Inhalt wurde erfolgreich gelöscht.",
      });

      queryClient.invalidateQueries({ queryKey: [`admin-${type}`] });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: `Fehler beim Löschen: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const ContentForm = ({ type, item = null }: { type: string, item?: any }) => {
    const [formData, setFormData] = useState({
      title: item?.title || '',
      content: item?.content || item?.description || '',
      author: item?.author || '',
      tags: item?.tags?.join(', ') || '',
      image_url: item?.image_url || '',
      is_published: item?.is_published ?? true,
      event_date: item?.event_date || '',
      location: item?.location || '',
      audio_url: item?.audio_url || '',
      host: item?.host || '',
      duration: item?.duration || '',
      category: item?.category || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        const submitData: any = {
          title: formData.title,
          is_published: formData.is_published
        };

        if (type === 'news') {
          submitData.content = formData.content;
          submitData.author = formData.author;
          submitData.tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
          submitData.image_url = formData.image_url;
        } else if (type === 'events') {
          submitData.description = formData.content;
          submitData.event_date = formData.event_date;
          submitData.location = formData.location;
          submitData.image_url = formData.image_url;
        } else if (type === 'podcasts') {
          submitData.description = formData.content;
          submitData.audio_url = formData.audio_url;
          submitData.host = formData.host;
          submitData.duration = formData.duration;
          submitData.category = formData.category;
          submitData.image_url = formData.image_url;
        }

        let result;
        if (item) {
          result = await supabase
            .from(type)
            .update(submitData)
            .eq('id', item.id);
        } else {
          result = await supabase
            .from(type)
            .insert([submitData]);
        }

        if (result.error) throw result.error;

        toast({
          title: item ? "Inhalt aktualisiert" : "Inhalt erstellt",
          description: `Der ${type.slice(0, -1)} wurde erfolgreich ${item ? 'aktualisiert' : 'erstellt'}.`,
        });

        queryClient.invalidateQueries({ queryKey: [`admin-${type}`] });
        setIsCreating(false);
        setEditingItem(null);
      } catch (error: any) {
        toast({
          title: "Fehler",
          description: `Fehler beim Speichern: ${error.message}`,
          variant: "destructive"
        });
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Titel"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        
        <Textarea
          placeholder={type === 'events' ? "Beschreibung" : "Inhalt"}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="min-h-32"
          required
        />

        {type === 'news' && (
          <>
            <Input
              placeholder="Autor"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
            <Input
              placeholder="Tags (kommagetrennt)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </>
        )}

        {type === 'events' && (
          <>
            <Input
              type="datetime-local"
              placeholder="Event-Datum"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              required
            />
            <Input
              placeholder="Ort"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </>
        )}

        {type === 'podcasts' && (
          <>
            <Input
              placeholder="Audio-URL"
              value={formData.audio_url}
              onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
              required
            />
            <Input
              placeholder="Moderator"
              value={formData.host}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
            />
            <Input
              placeholder="Dauer (z.B. 45 min)"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
            <Input
              placeholder="Kategorie"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </>
        )}

        <Input
          placeholder="Bild-URL"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
          />
          <label>Veröffentlicht</label>
        </div>

        <div className="flex gap-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              setIsCreating(false);
              setEditingItem(null);
            }}
          >
            Abbrechen
          </Button>
        </div>
      </form>
    );
  };

  const ContentList = ({ type, data, loading }: { type: string, data: any[], loading: boolean }) => {
    if (loading) {
      return <div className="text-center py-8">Wird geladen...</div>;
    }

    return (
      <div className="space-y-4">
        {data.map((item) => (
          <Card key={item.id} className="border">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.content || item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={item.is_published ? "default" : "secondary"}>
                      {item.is_published ? "Veröffentlicht" : "Entwurf"}
                    </Badge>
                    {item.author && <span className="text-xs text-muted-foreground">von {item.author}</span>}
                    {item.event_date && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.event_date).toLocaleDateString('de-DE')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditContent(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteContent(type, item.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Content Management</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-[400px] mb-6">
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>News-Artikel</CardTitle>
                  <Button onClick={handleCreateContent}>
                    <Plus className="h-4 w-4 mr-2" />
                    Neuer Artikel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(isCreating || editingItem) ? (
                  <ContentForm type="news" item={editingItem} />
                ) : (
                  <ContentList type="news" data={newsArticles || []} loading={newsLoading} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Events</CardTitle>
                  <Button onClick={handleCreateContent}>
                    <Plus className="h-4 w-4 mr-2" />
                    Neues Event
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(isCreating || editingItem) ? (
                  <ContentForm type="events" item={editingItem} />
                ) : (
                  <ContentList type="events" data={events || []} loading={eventsLoading} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="podcasts">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Podcasts</CardTitle>
                  <Button onClick={handleCreateContent}>
                    <Plus className="h-4 w-4 mr-2" />
                    Neuer Podcast
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(isCreating || editingItem) ? (
                  <ContentForm type="podcasts" item={editingItem} />
                ) : (
                  <ContentList type="podcasts" data={podcasts || []} loading={podcastsLoading} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
};

export default ContentManagement;
