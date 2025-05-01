
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Plus, Edit, Trash, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import ScheduleForm from "@/components/ScheduleForm";

interface Show {
  id: string;
  title: string;
  description: string | null;
}

interface ScheduleItem {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  host_id: string | null;
  host_name?: string; // Added host_name field
  show_id: string;
  show?: Show;
  show_title?: string;
}

const ScheduleAdmin = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch schedule items
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('schedule')
        .select(`
          *,
          shows:show_id (
            id,
            title,
            description
          )
        `)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (scheduleError) throw scheduleError;

      // Fetch shows for the form
      const { data: showsData, error: showsError } = await supabase
        .from('shows')
        .select('*')
        .order('title', { ascending: true });

      if (showsError) throw showsError;

      // Process schedule data with host_name
      const processedSchedule = scheduleData.map((item) => ({
        ...item,
        host_name: item.host_name || "Nicht zugewiesen", // Use host_name field or default value
        show_title: item.shows?.title || 'Unbekannt',
      }));

      setScheduleItems(processedSchedule);
      setShows(showsData);
    } catch (error) {
      console.error("Fehler beim Laden der Daten:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Die Daten konnten nicht geladen werden."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditItem = (item: ScheduleItem) => {
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    try {
      const { error } = await supabase
        .from('schedule')
        .delete()
        .eq('id', selectedItem.id);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Sendeplaneintrag wurde gelöscht.",
      });
      fetchData();
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Der Eintrag konnte nicht gelöscht werden.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleOpenDeleteDialog = (item: ScheduleItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleFormCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setSelectedItem(null);
  };

  const handleFormSuccess = () => {
    setIsEditing(false);
    setIsAdding(false);
    setSelectedItem(null);
    fetchData();
  };

  const dayOrder: Record<string, number> = {
    "Montag": 1,
    "Dienstag": 2, 
    "Mittwoch": 3,
    "Donnerstag": 4,
    "Freitag": 5,
    "Samstag": 6,
    "Sonntag": 7,
  };

  // Sort schedule items by day and time
  const sortedSchedule = [...scheduleItems].sort((a, b) => {
    if (dayOrder[a.day_of_week] !== dayOrder[b.day_of_week]) {
      return dayOrder[a.day_of_week] - dayOrder[b.day_of_week];
    }
    return a.start_time.localeCompare(b.start_time);
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#1c1f2f]">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" className="text-white hover:text-white/80">
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Zurück zur Startseite
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={fetchData}
                disabled={loading}
                className="border-gray-600"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Aktualisieren
              </Button>
              <Button 
                onClick={() => setIsAdding(true)} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Neuer Eintrag
              </Button>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white flex items-center justify-center gap-2">
              <Calendar className="h-8 w-8 text-purple-500" />
              Sendeplan Verwaltung
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Hier können Sie den Sendeplan verwalten, neue Einträge hinzufügen, bearbeiten oder löschen.
            </p>
          </div>
          
          {(isAdding || isEditing) && (
            <Card className="mb-8 bg-[#252a40]/80 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>{isEditing ? "Sendeplaneintrag bearbeiten" : "Neuen Sendeplaneintrag hinzufügen"}</CardTitle>
                <CardDescription className="text-gray-300">
                  Füllen Sie alle Felder aus, um einen {isEditing ? "Sendeplaneintrag zu aktualisieren" : "neuen Sendeplaneintrag zu erstellen"}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScheduleForm 
                  scheduleItem={selectedItem || undefined}
                  shows={shows}
                  isEditing={isEditing}
                  onCancel={handleFormCancel}
                  onSuccess={handleFormSuccess}
                />
              </CardContent>
            </Card>
          )}
          
          <Card className="bg-[#252a40]/80 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                Sendeplan Übersicht
              </CardTitle>
              <CardDescription className="text-gray-300">
                Eine Übersicht aller geplanten Sendungen und ihrer Details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                </div>
              ) : sortedSchedule.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-700/50">
                        <TableHead className="text-white">Tag</TableHead>
                        <TableHead className="text-white">Zeit</TableHead>
                        <TableHead className="text-white">Sendung</TableHead>
                        <TableHead className="text-white">Moderator</TableHead>
                        <TableHead className="text-white">Wiederkehrend</TableHead>
                        <TableHead className="text-white">Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedSchedule.map((item) => (
                        <TableRow 
                          key={item.id}
                          className="border-b border-gray-700/50 hover:bg-gray-800/20"
                        >
                          <TableCell className="font-medium text-gray-200">{item.day_of_week}</TableCell>
                          <TableCell className="text-gray-300">{item.start_time} - {item.end_time} Uhr</TableCell>
                          <TableCell className="text-white">{item.show_title}</TableCell>
                          <TableCell className="text-gray-300">{item.host_name}</TableCell>
                          <TableCell>
                            {item.is_recurring ? (
                              <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">Ja</span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">Nein</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleEditItem(item)}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleOpenDeleteDialog(item)}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-4">Keine Sendepläne gefunden</p>
                  <Button 
                    onClick={() => setIsAdding(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ersten Eintrag hinzufügen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sendeplaneintrag löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diesen Sendeplaneintrag löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteItem}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ScheduleAdmin;
