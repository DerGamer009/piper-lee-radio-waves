
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, UserPlus, Trash, Edit, LogOut, Home, RefreshCcw, Plus } from "lucide-react";
import { getUsers, deleteUser, updateUser } from "@/services/apiService";
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
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import RadioCard from "@/components/dashboard/RadioCard";
import StatusManagement from "@/components/dashboard/StatusManagement";
import AdminStatusPanel from "@/components/admin/AdminStatusPanel";

// Constants for radio stream
const STREAM_URL = "https://backend.piper-lee.net/listen/piper-lee/radio.mp3";
const STATION_NAME = "Piper Lee Radio";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch users from the API with proper error handling
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        return await getUsers();
      } catch (err) {
        console.error('Error in queryFn:', err);
        throw err;
      }
    }
  });

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [radioStatus, setRadioStatus] = useState<'online' | 'maintenance' | 'offline'>('online');

  const handleRadioStatusChange = (status: 'online' | 'maintenance' | 'offline') => {
    setRadioStatus(status);
    toast({
      title: "Status aktualisiert",
      description: `Radio Status wurde auf ${status} gesetzt.`,
    });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    });
    navigate("/login");
  };

  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId);
    setIsEditingUser(true);
  };

  const handleDeleteClick = (userId: string) => {
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

  const handleToggleUserStatus = async (userId: string, isCurrentlyActive: boolean) => {
    try {
      await updateUser(userId, { 
        isActive: !isCurrentlyActive,
        // These empty fields are required by the API but won't be used for the update
        username: '', 
        email: '', 
        fullName: '', 
        roles: [] 
      });
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

  const selectedUser = users?.find(user => user.id === selectedUserId);

  if (isLoading) return (
    <SidebarInset className="p-4">Daten werden geladen...</SidebarInset>
  );

  if (error) return (
    <SidebarInset className="p-4 text-red-500">
      Fehler beim Laden der Benutzer: {error instanceof Error ? error.message : 'Unbekannter Fehler'}
    </SidebarInset>
  );

  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Admin-Bereich</h1>
          </div>
          <div className="flex gap-4 items-center">
            <RadioPlayer streamUrl={STREAM_URL} stationName={STATION_NAME} compact={true} />
            <div className="flex gap-2">
              <Button onClick={() => setIsAddingUser(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                <UserPlus className="h-4 w-4" />
                Neuer Benutzer
              </Button>
              <Button 
                variant="outline" 
                onClick={handleBackToHome}
                className="flex items-center gap-2 border-purple-500 text-purple-500 hover:bg-purple-50 hover:text-purple-600"
              >
                <Home className="h-4 w-4" />
                Startseite
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg pb-4">
              <CardTitle className="flex items-center gap-2">
                <span className="bg-white text-purple-600 p-1 rounded-full">
                  <RadioCard.Icon />
                </span>
                Radio Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-4 h-4 rounded-full ${radioStatus === 'online' ? 'bg-green-500' : 'bg-gray-200'}`}
                    role="radio"
                    aria-checked={radioStatus === 'online'}
                    onClick={() => handleRadioStatusChange('online')}
                  ></div>
                  <span className={radioStatus === 'online' ? 'font-medium' : ''}>Online</span>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-4 h-4 rounded-full ${radioStatus === 'maintenance' ? 'bg-amber-500' : 'bg-gray-200'}`}
                    role="radio"
                    aria-checked={radioStatus === 'maintenance'}
                    onClick={() => handleRadioStatusChange('maintenance')}
                  ></div>
                  <span className={radioStatus === 'maintenance' ? 'font-medium' : ''}>Maintenance Mode</span>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-4 h-4 rounded-full ${radioStatus === 'offline' ? 'bg-red-500' : 'bg-gray-200'}`}
                    role="radio"
                    aria-checked={radioStatus === 'offline'}
                    onClick={() => handleRadioStatusChange('offline')}
                  ></div>
                  <span className={radioStatus === 'offline' ? 'font-medium' : ''}>Offline</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <AdminStatusPanel />
        </div>

        {isAddingUser && (
          <Card className="mb-8 border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Neuen Benutzer hinzufügen
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <UserForm onCancel={() => setIsAddingUser(false)} onSuccess={handleUserFormSuccess} />
            </CardContent>
          </Card>
        )}

        {isEditingUser && selectedUser && (
          <Card className="mb-8 border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Benutzer bearbeiten
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <UserForm 
                user={selectedUser} 
                onCancel={() => setIsEditingUser(false)} 
                onSuccess={handleUserFormSuccess} 
                isEditing={true}
              />
            </CardContent>
          </Card>
        )}

        <Card className="border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white rounded-t-lg pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-white text-indigo-600 p-1 rounded-full">
                  <Users className="h-4 w-4" />
                </span>
                Benutzer verwalten
              </div>
              <Button 
                onClick={() => setIsAddingUser(true)} 
                variant="outline" 
                size="sm"
                className="bg-white/20 text-white border-white/40 hover:bg-white/30"
              >
                <Plus className="h-4 w-4 mr-2" /> 
                Neu
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 p-0">
            <div className="rounded-b-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
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
                            onClick={() => handleToggleUserStatus(user.id, user.isActive || false)}
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
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Löschen"
                            onClick={() => handleDeleteClick(user.id)}
                            className="hover:bg-red-50 hover:text-red-600"
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
            </div>
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
    </SidebarInset>
  );
};

export default Admin;
