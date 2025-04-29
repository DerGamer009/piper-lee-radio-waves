
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

// Dummy data for upcoming shows
const upcomingShows = [
  { id: 1, title: "Morgenshow mit Max", host: "Max Müller", day: "Montag", startTime: "06:00", endTime: "10:00", status: "Live" },
  { id: 2, title: "Mittagsmagazin", host: "Laura Schmidt", day: "Montag", startTime: "12:00", endTime: "14:00", status: "Upcoming" },
  { id: 3, title: "Nachmittagsmix", host: "Thomas Weber", day: "Montag", startTime: "15:00", endTime: "18:00", status: "Upcoming" },
  { id: 4, title: "Abendshow", host: "Anna Becker", day: "Montag", startTime: "19:00", endTime: "22:00", status: "Scheduled" },
];

const UpcomingShows = () => {
  return (
    <div className="rounded-lg border shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">Anstehende Sendungen</h3>
        <a href="/sendeplan" className="text-sm text-radio-purple hover:underline">Alle anzeigen</a>
      </div>
      <div className="overflow-x-auto">
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
            {upcomingShows.map((show) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UpcomingShows;
