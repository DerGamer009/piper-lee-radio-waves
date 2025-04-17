import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mic, Calendar, Plus, Edit, Trash, LogOut } from "lucide-react";
import { getSchedule, getShows, deleteScheduleItem, Show as ApiShow, ScheduleItem } from "@/services/apiService";
import ScheduleForm from "@/components/ScheduleForm";
import { useToast } from "@/hooks/use-toast";
import RadioPlayer from "@/components/RadioPlayer";
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

interface Show {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  createdBy: number;
}

const STREAM_URL = "https://backend.piper-lee.net/listen/piper-lee/radio.mp3";
const STATION_NAME = "Piper Lee Radio";

const Moderator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: scheduleItems, isLoading: scheduleLoading } = useQuery({
    queryKey: ['schedule'],
    queryFn: getSchedule
  });

  const { data: apiShows, isLoading: showsLoading } = useQuery({
    queryKey: ['shows'],
    queryFn: getShows
  });

  const shows: Show[] = React.useMemo(() => {
    if (!apiShows || !Array.isArray(apiShows)) return [];
    
    return apiShows.map((show: ApiShow) => ({
      id: show.id,
      title: show.title,
      description: show.description,
      imageUrl: show.image_url,
      createdBy: show.created_by || 0,
    }));
  }, [apiShows]);

  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    });
    navigate("/login");
  };

  const handleEditSchedule = (scheduleId: number) => {
    setSelectedScheduleId(scheduleId);
    setIsEditingSchedule(true);
  };

  const handleDeleteClick = (scheduleId: number) => {
    setSelectedScheduleId(scheduleId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedScheduleId) {
      try {
        await deleteScheduleItem(selectedScheduleId);
        queryClient.invalidateQueries({ queryKey: ['schedule'] });
        toast({
          title: "Sendeplan gelöscht",
          description: "Der Sendeplan wurde erfolgreich gelöscht.",
        });
      } catch (error) {
        toast({
          title: "Fehler",
          description: "Der Sendeplan konnte nicht gelöscht werden.",
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const handleScheduleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['schedule'] });
    setIsAddingSchedule(false);
    setIsEditingSchedule(false);
  };

  const isLoading = scheduleLoading || showsLoading;

  const sortedSchedule = React.useMemo(() => {
    if (!scheduleItems || !Array.isArray(scheduleItems)) return [];
    
    const dayOrder = {
      "Montag": 1,
      "Dienstag": 2,
      "Mittwoch": 3,
      "Donnerstag": 4,
      "Freitag": 5,
      "Samstag": 6,
      "Sonntag": 7,
    };
    
    return [...scheduleItems].sort((a, b) => {
      const aDayOfWeek = a.day_of_week;
      const bDayOfWeek = b.day_of_week;
      
      if (dayOrder[aDayOfWeek] !== dayOrder[bDayOfWeek]) {
        return dayOrder[aDayOfWeek] - dayOrder[bDayOfWeek];
      }
      
      const aStartTime = a.start_time;
      const bStartTime = b.start_time;
      return aStartTime.localeCompare(bStartTime);
    });
  }, [scheduleItems]);

  const selectedSchedule = scheduleItems && Array.isArray(scheduleItems) 
    ? scheduleItems.find(item => item.id === selectedScheduleId) 
    : undefined;

  if (isLoading) return <div className="p-4">Daten werden geladen...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Mic className="h-8 w-8" />
          Moderatoren-Bereich
        </h1>
        <div className="flex gap-4 items-center">
          <RadioPlayer streamUrl={STREAM_URL} stationName={STATION_NAME} compact={true} />
          <div className="flex gap-2">
            <Button onClick={() => setIsAddingSchedule(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Neuer Sendeplan
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </Button>
          </div>
        </div>
      </div>

      {isAddingSchedule && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Neuen Sendeplan hinzufügen</CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduleForm 
              shows={shows}
              onCancel={() => setIsAddingSchedule(false)} 
              onSuccess={handleScheduleSuccess} 
            />
          </CardContent>
        </Card>
      )}

      {isEditingSchedule && selectedSchedule && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sendeplan bearbeiten</CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduleForm 
              shows={shows}
              scheduleItem={selectedSchedule}
              onCancel={() => setIsEditingSchedule(false)} 
              onSuccess={handleScheduleSuccess}
              isEditing={true}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Sendeplan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Ende</TableHead>
                <TableHead>Sendung</TableHead>
                <TableHead>Moderator</TableHead>
                <TableHead>Wöchentlich</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSchedule.length > 0 ? (
                sortedSchedule.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.day_of_week}</TableCell>
                    <TableCell>{item.start_time}</TableCell>
                    <TableCell>{item.end_time}</TableCell>
                    <TableCell>{item.show_title}</TableCell>
                    <TableCell>{item.host_name || 'Nicht zugewiesen'}</TableCell>
                    <TableCell>
                      {(item.is_recurring !== undefined ? item.is_recurring : item.is_recurring) ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Ja</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Nein</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Bearbeiten"
                        onClick={() => handleEditSchedule(item.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Löschen"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Kein Sendeplan vorhanden
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sendeplan löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie diesen Sendeplan wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Moderator;
