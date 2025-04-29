
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

// Dummy data for upcoming shows
const upcomingShows = [
  { id: 1, title: "Morgenshow mit Max", host: "Max Müller", day: "Montag", startTime: "06:00", endTime: "10:00" },
  { id: 2, title: "Mittagsmagazin", host: "Laura Schmidt", day: "Montag", startTime: "12:00", endTime: "14:00" },
  { id: 3, title: "Nachmittagsmix", host: "Thomas Weber", day: "Montag", startTime: "15:00", endTime: "18:00" },
  { id: 4, title: "Abendshow", host: "Anna Becker", day: "Montag", startTime: "19:00", endTime: "22:00" },
];

const UpcomingShows = () => {
  return (
    <div className="rounded-lg border shadow">
      <div className="p-4 border-b">
        <h3 className="font-medium">Anstehende Sendungen</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sendung</TableHead>
              <TableHead>Moderator</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Startzeit</TableHead>
              <TableHead>Endzeit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingShows.map((show) => (
              <TableRow key={show.id}>
                <TableCell className="font-medium">{show.title}</TableCell>
                <TableCell>{show.host}</TableCell>
                <TableCell>{show.day}</TableCell>
                <TableCell>{show.startTime}</TableCell>
                <TableCell>{show.endTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UpcomingShows;
