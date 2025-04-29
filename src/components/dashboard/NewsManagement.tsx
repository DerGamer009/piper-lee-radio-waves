
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Eye, X, Calendar, User, Tag, Image, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  author: string | null;
  published_at: string;
  is_published: boolean;
  tags: string[] | null;
  created_at: string;
}

const NewsManagement = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const { data: newsItems, isLoading, isError } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as NewsItem[];
    }
  });

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImageUrl('');
    setAuthor('');
    setIsPublished(true);
    setTags([]);
    setTagInput('');
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEdit = (newsItem: NewsItem) => {
    setTitle(newsItem.title);
    setContent(newsItem.content);
    setImageUrl(newsItem.image_url || '');
    setAuthor(newsItem.author || '');
    setIsPublished(newsItem.is_published !== false);
    setTags(newsItem.tags || []);
    setIsEditing(newsItem.id);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('news')
        .insert([
          {
            title,
            content,
            image_url: imageUrl || null,
            author: author || null,
            is_published: isPublished,
            tags: tags.length > 0 ? tags : null
          }
        ]);

      if (error) throw error;
      
      toast({
        title: "News-Eintrag erstellt",
        description: "Der News-Eintrag wurde erfolgreich erstellt."
      });
      
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['news'] });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: `Der News-Eintrag konnte nicht erstellt werden: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    
    try {
      const { data, error } = await supabase
        .from('news')
        .update({
          title,
          content,
          image_url: imageUrl || null,
          author: author || null,
          is_published: isPublished,
          tags: tags.length > 0 ? tags : null
        })
        .eq('id', isEditing);

      if (error) throw error;
      
      toast({
        title: "News-Eintrag aktualisiert",
        description: "Der News-Eintrag wurde erfolgreich aktualisiert."
      });
      
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['news'] });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: `Der News-Eintrag konnte nicht aktualisiert werden: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen News-Eintrag löschen möchten?')) return;
    
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "News-Eintrag gelöscht",
        description: "Der News-Eintrag wurde erfolgreich gelöscht."
      });
      
      queryClient.invalidateQueries({ queryKey: ['news'] });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: `Der News-Eintrag konnte nicht gelöscht werden: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-12 w-12 border-4 border-radio-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-2">Fehler beim Laden der News-Einträge</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['news'] })}>
          Erneut versuchen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(isAdding || isEditing) ? (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'News-Eintrag bearbeiten' : 'Neuen News-Eintrag erstellen'}</CardTitle>
            <CardDescription>
              {isEditing 
                ? 'Bearbeiten Sie einen bestehenden News-Eintrag.'
                : 'Erstellen Sie einen neuen News-Eintrag, der auf der Website angezeigt wird.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isEditing ? handleUpdate : handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    placeholder="Titel des News-Eintrags"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Autor (optional)</Label>
                  <Input
                    id="author"
                    placeholder="Name des Autors"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Inhalt</Label>
                <Textarea
                  id="content"
                  placeholder="Inhalt des News-Eintrags"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                  className="min-h-32"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Bild-URL (optional)</Label>
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4 opacity-50" />
                  <Input
                    id="imageUrl"
                    placeholder="URL zum Bild des News-Eintrags"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Tags (optional)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => handleRemoveTag(tag)} 
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 opacity-50" />
                  <Input
                    placeholder="Neuen Tag eingeben"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Hinzufügen
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                  className="data-[state=checked]:bg-radio-purple"
                />
                <Label htmlFor="is-published">Veröffentlicht</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Abbrechen
                </Button>
                <Button type="submit">
                  {isEditing ? 'Aktualisieren' : 'Erstellen'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">News & Updates verwalten</h2>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Neuer Eintrag
          </Button>
        </div>
      )}
      
      {!isAdding && !isEditing && (
        <div className="space-y-4">
          {newsItems && newsItems.length > 0 ? (
            newsItems.map(item => (
              <Card key={item.id} className={!item.is_published ? 'border-dashed opacity-70' : ''}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        {!item.is_published && (
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                            Entwurf
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(item.published_at)}
                        </span>
                        {item.author && (
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {item.author}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.content}</p>
                      
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex md:flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 md:flex-none"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Bearbeiten
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 md:flex-none hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Löschen
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 md:flex-none"
                        asChild
                      >
                        <a href={`/news/${item.id}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-1" />
                          Ansehen
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border">
              <p className="text-gray-500 mb-4">Keine News-Einträge gefunden</p>
              <Button onClick={() => setIsAdding(true)}>
                Ersten News-Eintrag erstellen
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsManagement;
