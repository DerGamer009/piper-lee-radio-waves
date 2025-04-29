
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Plus, 
  Edit, 
  Headphones, 
  Pause, 
  Play, 
  Music,
  Clock,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Podcast {
  id: string;
  title: string;
  description: string | null;
  audio_url: string;
  image_url: string | null;
  duration: string | null;
  host: string | null;
  category: string | null;
  published_at: string;
  is_published: boolean;
  created_at: string;
  created_by: string | null;
}

const PodcastManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingPodcast, setIsAddingPodcast] = useState(false);
  const [isEditingPodcast, setIsEditingPodcast] = useState(false);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [podcastToDelete, setPodcastToDelete] = useState<string | null>(null);
  const [playingPodcast, setPlayingPodcast] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [host, setHost] = useState('');
  const [category, setCategory] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const { data: podcasts, isLoading } = useQuery({
    queryKey: ['podcasts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as Podcast[];
    }
  });

  const createPodcastMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('podcasts')
        .insert([{ 
          title,
          description,
          audio_url: audioUrl,
          image_url: imageUrl || null,
          duration,
          host,
          category,
          is_published: isPublished,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
      resetForm();
      toast({
        title: 'Podcast erstellt',
        description: 'Der Podcast wurde erfolgreich erstellt.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Fehler',
        description: `Fehler beim Erstellen des Podcasts: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const updatePodcastMutation = useMutation({
    mutationFn: async () => {
      if (!currentPodcast) return null;

      const { error } = await supabase
        .from('podcasts')
        .update({ 
          title,
          description,
          audio_url: audioUrl,
          image_url: imageUrl || null,
          duration,
          host,
          category,
          is_published: isPublished
        })
        .eq('id', currentPodcast.id);

      if (error) {
        throw error;
      }

      return currentPodcast.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
      resetForm();
      toast({
        title: 'Podcast aktualisiert',
        description: 'Der Podcast wurde erfolgreich aktualisiert.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Fehler',
        description: `Fehler beim Aktualisieren des Podcasts: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const deletePodcastMutation = useMutation({
    mutationFn: async (podcastId: string) => {
      const { error } = await supabase
        .from('podcasts')
        .delete()
        .eq('id', podcastId);

      if (error) {
        throw error;
      }
      return podcastId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: 'Podcast gelöscht',
        description: 'Der Podcast wurde erfolgreich gelöscht.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Fehler',
        description: `Fehler beim Löschen des Podcasts: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const togglePodcastStatus = useMutation({
    mutationFn: async ({ id, is_published }: { id: string, is_published: boolean }) => {
      const { error } = await supabase
        .from('podcasts')
        .update({ is_published })
        .eq('id', id);

      if (error) {
        throw error;
      }
      return { id, is_published };
    },
    onSuccess: ({ id, is_published }) => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
      toast({
        title: `Podcast ${is_published ? 'veröffentlicht' : 'versteckt'}`,
        description: `Der Podcast wurde erfolgreich ${is_published ? 'veröffentlicht' : 'versteckt'}.`
      });
    },
    onError: (error) => {
      toast({
        title: 'Fehler',
        description: `Status konnte nicht geändert werden: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const handleDeletePodcast = (podcastId: string) => {
    setPodcastToDelete(podcastId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (podcastToDelete) {
      deletePodcastMutation.mutate(podcastToDelete);
    }
  };

  const handleEditPodcast = (podcast: Podcast) => {
    setCurrentPodcast(podcast);
    setTitle(podcast.title);
    setDescription(podcast.description || '');
    setAudioUrl(podcast.audio_url);
    setImageUrl(podcast.image_url || '');
    setDuration(podcast.duration || '');
    setHost(podcast.host || '');
    setCategory(podcast.category || '');
    setIsPublished(podcast.is_published);
    setIsEditingPodcast(true);
  };

  const handleToggleStatus = (podcastId: string, currentStatus: boolean) => {
    togglePodcastStatus.mutate({ id: podcastId, is_published: !currentStatus });
  };

  const togglePlayPodcast = (podcastId: string) => {
    setPlayingPodcast(playingPodcast === podcastId ? null : podcastId);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAudioUrl('');
    setImageUrl('');
    setDuration('');
    setHost('');
    setCategory('');
    setIsPublished(true);
    setCurrentPodcast(null);
    setIsAddingPodcast(false);
    setIsEditingPodcast(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingPodcast) {
      updatePodcastMutation.mutate();
    } else {
      createPodcastMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Podcasts werden geladen...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <div className="animate-spin h-10 w-10 border-4 border-radio-purple border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Podcasts verwalten</CardTitle>
          {!isAddingPodcast && !isEditingPodcast && (
            <Button onClick={() => setIsAddingPodcast(true)}>
              <Plus className="h-4 w-4 mr-2" /> Neuer Podcast
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {(isAddingPodcast || isEditingPodcast) ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titel</Label>
                <Input 
                  id="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Podcast-Titel"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea 
                  id="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschreibung des Podcasts..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="audioUrl">Audio-URL</Label>
                <Input 
                  id="audioUrl" 
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="URL zur Audio-Datei"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="imageUrl">Bild-URL (optional)</Label>
                <Input 
                  id="imageUrl" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL zum Cover-Bild"
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">Dauer</Label>
                  <Input 
                    id="duration" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="z.B. 30:45"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="host">Moderator</Label>
                  <Input 
                    id="host" 
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="Name des Moderators"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Kategorie</Label>
                  <Input 
                    id="category" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="z.B. Nachrichten, Musik"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is-published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <Label htmlFor="is-published">Podcast veröffentlichen</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Abbrechen
                </Button>
                <Button type="submit">
                  {isEditingPodcast ? 'Aktualisieren' : 'Erstellen'}
                </Button>
              </div>
            </form>
          ) : (
            <>
              {podcasts && podcasts.length > 0 ? (
                <div className="space-y-4">
                  {podcasts.map((podcast) => (
                    <Card key={podcast.id} className="overflow-hidden">
                      <div className="flex border-b">
                        {podcast.image_url && (
                          <div className="w-24 h-24 flex-shrink-0">
                            <img 
                              src={podcast.image_url} 
                              alt={podcast.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4 flex-1 flex items-center justify-between">
                          <div className="flex items-center">
                            <Headphones className="h-5 w-5 text-radio-purple mr-2 flex-shrink-0" />
                            <div>
                              <h3 className="font-medium">{podcast.title}</h3>
                              <div className="flex items-center flex-wrap gap-2 mt-1 text-xs text-gray-500">
                                {podcast.duration && (
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {podcast.duration}
                                  </span>
                                )}
                                {podcast.host && (
                                  <span className="flex items-center">
                                    <User className="h-3 w-3 mr-1" />
                                    {podcast.host}
                                  </span>
                                )}
                                {podcast.category && (
                                  <span className="flex items-center">
                                    <Music className="h-3 w-3 mr-1" />
                                    {podcast.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge variant={podcast.is_published ? "success" : "secondary"}>
                            {podcast.is_published ? 'Veröffentlicht' : 'Entwurf'}
                          </Badge>
                        </div>
                      </div>

                      {podcast.description && (
                        <div className="px-4 py-2 text-sm">
                          <p className="line-clamp-2">{podcast.description}</p>
                        </div>
                      )}

                      <div className="p-4 flex items-center justify-between bg-gray-50">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePlayPodcast(podcast.id)}
                        >
                          {playingPodcast === podcast.id ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Abspielen
                            </>
                          )}
                        </Button>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleStatus(podcast.id, podcast.is_published)}
                          >
                            {podcast.is_published ? 'Als Entwurf speichern' : 'Veröffentlichen'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditPodcast(podcast)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeletePodcast(podcast.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {playingPodcast === podcast.id && (
                        <div className="p-4 bg-gray-100 border-t">
                          <audio controls className="w-full" src={podcast.audio_url}>
                            Ihr Browser unterstützt das Audio-Element nicht.
                          </audio>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>Keine Podcasts vorhanden</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsAddingPodcast(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Podcast erstellen
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Podcast löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diesen Podcast löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PodcastManagement;
