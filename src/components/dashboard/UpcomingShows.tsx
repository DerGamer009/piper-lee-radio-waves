
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface ScheduleItem {
  id: string;
  show_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  host_id: string | null;
  is_recurring: boolean;
  show_title?: string;
  host_name?: string;
}

const UpcomingShows = () => {
  // Fetch upcoming shows from Supabase
  const { data: upcomingShows, isLoading, error } = useQuery({
    queryKey: ['upcoming-shows'],
    queryFn: async () => {
      // First fetch the schedule with joined show data
      const { data: scheduleData, error } = await supabase
        .from('schedule')
        .select(`
          *,
          shows:show_id (title)
        `)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(4);
      
      if (error) throw error;
      
      // Process the data to match the required format
      const processedData = await Promise.all(scheduleData.map(async (item) => {
        // Get host name if host_id is available
        let hostName = 'Nicht zugewiesen';
        
        if (item.host_id) {
          const { data: hostData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', item.host_id)
            .single();
          
          if (hostData) {
            hostName = hostData.full_name;
          }
        }
        
        // Determine show status (Live, Upcoming, or Scheduled)
        const now = new Date();
        const currentDay = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][now.getDay()];
        const currentTime = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
        
        let status = 'Scheduled';
        if (item.day_of_week === currentDay) {
          if (item.start_time <= currentTime && currentTime <= item.end_time) {
            status = 'Live';
          } else if (item.start_time > currentTime) {
            status = 'Upcoming';
          }
        }
        
        return {
          id: item.id,
          title: item.shows?.title || 'Unbekannte Show',
          host: hostName,
          day: item.day_of_week,
          startTime: item.start_time,
          endTime: item.end_time,
          status
        };
      }));
      
      return processedData;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return (
    <div className="rounded-lg border shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">Anstehende Sendungen</h3>
        <a href="/sendeplan" className="text-sm text-radio-purple hover:underline">Alle anzeigen</a>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Sendungen werden geladen...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            Fehler beim Laden der Sendungen
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sendung</TableHead>
                <TableHead>Moderator</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Zeit</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingShows && upcomingShows.length > 0 ? (
                upcomingShows.map((show) => (
                  <TableRow key={show.id}>
                    <TableCell className="font-medium">{show.title}</TableCell>
                    <TableCell>{show.host}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {show.day}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {show.startTime} - {show.endTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          show.status === "Live" ? "success" : 
                          show.status === "Upcoming" ? "info" : 
                          "secondary"
                        }
                        size="sm"
                      >
                        {show.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Keine anstehenden Sendungen gefunden
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UpcomingShows;
