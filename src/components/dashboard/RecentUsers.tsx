
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Dummy data for recent users
const recentUsers = [
  { id: 1, username: "max.mueller", fullName: "Max Müller", email: "max.mueller@example.com", role: "Benutzer", date: "29.04.2023", status: "Aktiv" },
  { id: 2, username: "laura.schmidt", fullName: "Laura Schmidt", email: "laura.schmidt@example.com", role: "Moderator", date: "27.04.2023", status: "Aktiv" },
  { id: 3, username: "thomas.weber", fullName: "Thomas Weber", email: "thomas.weber@example.com", role: "Benutzer", date: "25.04.2023", status: "Inaktiv" },
  { id: 4, username: "anna.becker", fullName: "Anna Becker", email: "anna.becker@example.com", role: "Benutzer", date: "23.04.2023", status: "Aktiv" },
];

const RecentUsers = () => {
  return (
    <div className="rounded-lg border shadow">
      <div className="p-4 border-b">
        <h3 className="font-medium">Neueste Benutzer</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Benutzername</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Registriert</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.date}</TableCell>
                <TableCell>
                  <Badge variant={user.status === "Aktiv" ? "default" : "secondary"}>
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
