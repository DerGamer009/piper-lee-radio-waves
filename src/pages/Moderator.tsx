
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mic, Calendar, Plus, Edit, Trash } from "lucide-react";
import { getSchedule, getShows } from "@/services/apiService";
import ScheduleForm from "@/components/ScheduleForm";

const Moderator = () => {
  // Fetch schedule and shows
  const { data: scheduleItems, isLoading: scheduleLoading } = useQuery({
    queryKey: ['schedule'],
    queryFn: getSchedule
  });

  const { data: shows, isLoading: showsLoading } = useQuery({
    queryKey: ['shows'],
    queryFn: getShows
  });

  const [isAddingSchedule, setIsAddingSchedule] = React.useState(false);

  const isLoading = scheduleLoading || showsLoading;

  // Sort schedule by day and time
  const sortedSchedule = React.useMemo(() => {
    if (!scheduleItems) return [];
    
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
      if (dayOrder[a.dayOfWeek] !== dayOrder[b.dayOfWeek]) {
        return dayOrder[a.dayOfWeek] - dayOrder[b.dayOfWeek];
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }, [scheduleItems]);

  if (isLoading) return <div className="p-4">Daten werden geladen...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Mic className="h-8 w-8" />
          Moderatoren-Bereich
        </h1>
        <Button onClick={() => setIsAddingSchedule(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Neuer Sendeplan
        </Button>
      </div>

      {isAddingSchedule && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Neuen Sendeplan hinzufügen</CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduleForm 
              shows={shows || []}
              onCancel={() => setIsAddingSchedule(false)} 
              onSuccess={() => setIsAddingSchedule(false)} 
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
                    <TableCell>{item.dayOfWeek}</TableCell>
                    <TableCell>{item.startTime}</TableCell>
                    <TableCell>{item.endTime}</TableCell>
                    <TableCell>{item.showTitle}</TableCell>
                    <TableCell>{item.hostName || 'Nicht zugewiesen'}</TableCell>
                    <TableCell>
                      {item.isRecurring ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Ja</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Nein</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" title="Bearbeiten">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Löschen">
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
    </div>
  );
};

export default Moderator;
