
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, UserPlus, Trash, Edit } from "lucide-react";
import { getUsers } from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";
import UserForm from "@/components/UserForm";

const Admin = () => {
  // Fetch users from the API
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  const [isAddingUser, setIsAddingUser] = React.useState(false);

  if (isLoading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading users: {error.toString()}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Admin-Bereich
        </h1>
        <Button onClick={() => setIsAddingUser(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Neuer Benutzer
        </Button>
      </div>

      {isAddingUser && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Neuen Benutzer hinzufügen</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm onCancel={() => setIsAddingUser(false)} onSuccess={() => setIsAddingUser(false)} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Benutzer verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Benutzername</TableHead>
                <TableHead>Vollständiger Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Rollen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.roles.join(", ")}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {user.isActive ? "Aktiv" : "Inaktiv"}
                      </span>
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
                  <TableCell colSpan={6} className="text-center">
                    Keine Benutzer gefunden
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

export default Admin;
