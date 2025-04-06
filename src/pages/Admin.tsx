import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, UserPlus, Trash, Edit, LogOut } from "lucide-react";
import { getUsers, deleteUser, updateUser, User } from "@/services/apiService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UserForm from "@/components/UserForm";
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

// Constants for radio stream
const STREAM_URL = "https://backend.piper-lee.net/listen/piper-lee/radio.mp3";
const STATION_NAME = "Piper Lee Radio";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch users from the API
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers
  });

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
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

  const handleEditUser = (userId: number) => {
    setSelectedUserId(userId);
    setIsEditingUser(true);
  };

  const handleDeleteClick = (userId: number) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUserId) {
      try {
        await deleteUser(selectedUserId);
        queryClient.invalidateQueries({ queryKey: ['users'] });
        toast({
          title: "Benutzer gelöscht",
          description: "Der Benutzer wurde erfolgreich gelöscht.",
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Fehler",
          description: "Der Benutzer konnte nicht gelöscht werden.",
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const handleUserFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    setIsAddingUser(false);
    setIsEditingUser(false);
  };

  const handleToggleUserStatus = async (userId: number, isCurrentlyActive: boolean) => {
    try {
      await updateUser(userId, { isActive: !isCurrentlyActive });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Status geändert",
        description: `Benutzer ist jetzt ${!isCurrentlyActive ? 'aktiv' : 'inaktiv'}.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Fehler",
        description: "Der Status konnte nicht geändert werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading users: {error instanceof Error ? error.message : 'Unknown error'}</div>;

  const selectedUser = users?.find(user => user.id === selectedUserId);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Admin-Bereich
        </h1>
        <div className="flex gap-4 items-center">
          <RadioPlayer streamUrl={STREAM_URL} stationName={STATION_NAME} compact={true} />
          <div className="flex gap-2">
            <Button onClick={() => setIsAddingUser(true)} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Neuer Benutzer
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

      {isAddingUser && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Neuen Benutzer hinzufügen</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm onCancel={() => setIsAddingUser(false)} onSuccess={handleUserFormSuccess} />
          </CardContent>
        </Card>
      )}

      {isEditingUser && selectedUser && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Benutzer bearbeiten</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm 
              user={selectedUser} 
              onCancel={() => setIsEditingUser(false)} 
              onSuccess={handleUserFormSuccess} 
              isEditing={true}
            />
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
                    <TableCell>{Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        className={`px-2 py-1 rounded-full text-xs ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                      >
                        {user.isActive ? "Aktiv" : "Inaktiv"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Bearbeiten"
                        onClick={() => handleEditUser(user.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Löschen"
                        onClick={() => handleDeleteClick(user.id)}
                      >
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Benutzer löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie diesen Benutzer wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
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

export default Admin;
