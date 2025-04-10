
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Edit } from 'lucide-react';
import { getSchedule, deleteScheduleItem, createScheduleItem, updateScheduleItem } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ScheduleItemData {
  id?: number;
  show_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  host_id: number;
  is_recurring: boolean;
}

export function Schedule() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItemData | null>(null);
  const [formData, setFormData] = useState<ScheduleItemData>({
    show_id: 0,
    day_of_week: 0,
    start_time: "00:00",
    end_time: "01:00",
    host_id: 0,
    is_recurring: false
  });

  const { data: scheduleItems = [], isLoading } = useQuery({
    queryKey: ["schedule"],
    queryFn: getSchedule,
  });

  const createMutation = useMutation({
    mutationFn: (data: ScheduleItemData) => createScheduleItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Erfolg",
        description: "Termin wurde erfolgreich erstellt",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: ScheduleItemData) => {
      if (!id) throw new Error("ID is required for update");
      return updateScheduleItem(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Erfolg",
        description: "Termin wurde erfolgreich aktualisiert",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteScheduleItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      toast({
        title: "Erfolg",
        description: "Termin wurde erfolgreich gelöscht",
      });
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const getDaySchedule = (date: Date) => {
    const dayOfWeek = date.getDay();
    return scheduleItems.filter((item) => item.day_of_week === dayOfWeek);
  };

  const resetForm = () => {
    setFormData({
      show_id: 0,
      day_of_week: 0,
      start_time: "00:00",
      end_time: "01:00",
      host_id: 0,
      is_recurring: false
    });
    setEditingSchedule(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchedule && editingSchedule.id) {
      updateMutation.mutate({ ...formData, id: editingSchedule.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <div className="p-4">Lädt...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Kalender</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>Termin hinzufügen</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSchedule ? "Termin bearbeiten" : "Neuer Termin"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="showId">Show</Label>
                  <Input
                    id="showId"
                    type="number"
                    value={formData.show_id}
                    onChange={(e) => setFormData({ ...formData, show_id: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="startTime">Startzeit</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Endzeit</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hostId">Host</Label>
                  <Input
                    id="hostId"
                    type="number"
                    value={formData.host_id}
                    onChange={(e) => setFormData({ ...formData, host_id: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.is_recurring}
                    onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                  />
                  <Label htmlFor="isRecurring">Wöchentlich wiederholen</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button type="submit">
                    {editingSchedule ? "Aktualisieren" : "Erstellen"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border"
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">
          Termine für {selectedDate?.toLocaleDateString()}
        </h3>
        <div className="space-y-4">
          {selectedDate &&
            getDaySchedule(selectedDate).map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">Show ID: {item.show_id}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.start_time} - {item.end_time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Host ID: {item.host_id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSchedule({
                        id: item.id,
                        show_id: item.show_id,
                        day_of_week: item.day_of_week,
                        start_time: item.start_time,
                        end_time: item.end_time,
                        host_id: item.host_id,
                        is_recurring: item.is_recurring
                      });
                      setIsDialogOpen(true);
                    }}
                  >
                    Bearbeiten
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("Sind Sie sicher?")) {
                        deleteMutation.mutate(item.id);
                      }
                    }}
                  >
                    Löschen
                  </Button>
                </div>
              </div>
            ))}
          {selectedDate && getDaySchedule(selectedDate).length === 0 && (
            <p className="text-center text-muted-foreground">
              Keine Termine für diesen Tag
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
