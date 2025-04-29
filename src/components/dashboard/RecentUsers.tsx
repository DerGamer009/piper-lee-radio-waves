
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, User } from 'lucide-react';

// Dummy data for recent users
const recentUsers = [
  { id: 1, username: "max.mueller", fullName: "Max Müller", email: "max.mueller@example.com", role: "Benutzer", date: "29.04.2023", status: "Aktiv" },
  { id: 2, username: "laura.schmidt", fullName: "Laura Schmidt", email: "laura.schmidt@example.com", role: "Moderator", date: "27.04.2023", status: "Aktiv" },
  { id: 3, username: "thomas.weber", fullName: "Thomas Weber", email: "thomas.weber@example.com", role: "Benutzer", date: "25.04.2023", status: "Inaktiv" },
  { id: 4, username: "anna.becker", fullName: "Anna Becker", email: "anna.becker@example.com", role: "Benutzer", date: "23.04.2023", status: "Aktiv" },
];

const RecentUsers = () => {
  return (
    <div className="rounded-lg border shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">Neueste Benutzer</h3>
        <a href="/admin" className="text-sm text-radio-purple hover:underline">Alle anzeigen</a>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Benutzer</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Registriert</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-radio-purple/10 flex items-center justify-center text-radio-purple">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-xs text-muted-foreground">{user.username}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.role === "Moderator" ? "purple" : "secondary"}
                    size="sm"
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {user.date}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === "Aktiv" ? "success" : "secondary"}
                    size="sm"
                  >
                    {user.status}
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

export default RecentUsers;
