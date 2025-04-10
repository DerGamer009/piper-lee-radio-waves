
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash, Edit } from 'lucide-react';
import { Show, getShows, deleteShow } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createShow, updateShow } from "@/services/apiService";

interface ShowFormData {
  title: string;
  description: string;
  image_url: string;
}

export function Shows() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedShowId, setSelectedShowId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [formData, setFormData] = useState<ShowFormData>({
    title: "",
    description: "",
    image_url: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { data: shows = [], isLoading, error } = useQuery({
    queryKey: ['shows'],
    queryFn: getShows
  });

  const createMutation = useMutation({
    mutationFn: createShow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Erfolg",
        description: "Show wurde erfolgreich erstellt",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Show konnte nicht erstellt werden",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<ShowFormData>) => {
      return updateShow(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Erfolg",
        description: "Show wurde erfolgreich aktualisiert",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Show konnte nicht aktualisiert werden",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteShow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
      toast({
        title: "Erfolg",
        description: "Show wurde erfolgreich gelöscht",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Show konnte nicht gelöscht werden",
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (showId: number) => {
    setSelectedShowId(showId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedShowId) {
      try {
        await deleteMutation.mutate(selectedShowId);
      } catch (error) {
        console.error('Error deleting show:', error);
        toast({
          title: "Error",
          description: "Failed to delete show",
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingShow) {
      updateMutation.mutate({ id: editingShow.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (show: Show) => {
    setEditingShow(show);
    setFormData({
      title: show.title,
      description: show.description,
      image_url: show.image_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Sind Sie sicher, dass Sie diese Show löschen möchten?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", image_url: "" });
    setEditingShow(null);
  };

  const filteredShows = shows.filter((show: Show) =>
    show.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-4">Loading shows...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading shows: {error instanceof Error ? error.message : 'Unknown error'}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Shows</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Shows suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>Show erstellen</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingShow ? "Show bearbeiten" : "Neue Show erstellen"}</DialogTitle>
                <DialogDescription>
                  Füllen Sie die folgenden Felder aus, um eine neue Show zu erstellen.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Bild URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingShow ? "Aktualisieren" : "Erstellen"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Shows</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShows.map((show: Show) => (
                <TableRow key={show.id}>
                  <TableCell>{show.title}</TableCell>
                  <TableCell>{show.description}</TableCell>
                  <TableCell>{show.creator_name}</TableCell>
                  <TableCell>{new Date(show.created_at || '').toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      title="Edit"
                      onClick={() => handleEdit(show)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      title="Delete"
                      onClick={() => handleDelete(show.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Show</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this show? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
