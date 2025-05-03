
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, UserPlus, Trash, Edit, LogOut, Home, RefreshCcw, Plus, Radio } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UserForm from "@/components/UserForm";
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SidebarInset } from "@/components/ui/sidebar";
import AdminStatusPanel from "@/components/admin/AdminStatusPanel";
import { supabase } from "@/integrations/supabase/client";

// Constants for radio stream
const RADIO_STREAM_URL = "https://backend.piper-lee.net/listen/piper-lee/radio.mp3";

// Main Admin component
const Admin = () => {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch users from Supabase
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase');
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      return data.map(user => ({
        id: user.id,
        username: user.username || 'No Username',
        fullName: user.full_name || '',
        email: user.email || '',
        isActive: user.is_active,
        roles: user.user_roles ? 
          (Array.isArray(user.user_roles) ? 
            user.user_roles.map((r: any) => r.role).join(',') : 
            'user') : 
          'user',
        createdAt: user.created_at
      }));
    },
  });

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete the user from Supabase
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      toast({
        title: "Benutzer gelöscht",
        description: "Der Benutzer wurde erfolgreich gelöscht.",
      });
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setUserToDelete(null);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Fehler",
        description: `Der Benutzer konnte nicht gelöscht werden: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    toast({
      title: "Daten aktualisiert",
      description: "Die Benutzerdaten wurden aktualisiert.",
    });
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <SidebarInset>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={navigateToHome}>
              <Home className="w-4 h-4 mr-2" />
              Startseite
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Aktualisieren
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="col-span-2 shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg pb-4">
              <CardTitle className="flex items-center gap-2">
                <span className="bg-white text-purple-600 p-1 rounded-full">
                  <Radio className="h-4 w-4" />
                </span>
                Radio Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminStatusPanel streamUrl={RADIO_STREAM_URL} />
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white rounded-t-lg pb-4">
              <CardTitle className="flex justify-between items-center">
                <span>Benutzer</span>
                <Button 
                  size="sm" 
                  onClick={() => setIsAddingUser(true)} 
                  className="bg-white text-indigo-700 hover:bg-white/90"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Neu
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Benutzer</TableHead>
                        <TableHead>Rolle</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users && users.length > 0 ? (
                        users.map((user: any) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{user.username}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.roles && user.roles.includes('admin') ? (
                                <div className="flex items-center">
                                  <Shield className="h-4 w-4 text-purple-600 mr-1" />
                                  Admin
                                </div>
                              ) : user.roles && user.roles.includes('moderator') ? (
                                <div className="flex items-center">
                                  <UserPlus className="h-4 w-4 text-blue-600 mr-1" />
                                  Moderator
                                </div>
                              ) : (
                                <div className="text-gray-600">User</div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                                user.isActive 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {user.isActive ? "Aktiv" : "Inaktiv"}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setUserToEdit(user)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Benutzer löschen</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Sind Sie sicher, dass Sie diesen Benutzer löschen möchten? 
                                        Diese Aktion kann nicht rückgängig gemacht werden.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Löschen
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            Keine Benutzer gefunden
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {isAddingUser && (
          <Card className="mb-6 shadow-md">
            <CardHeader className="bg-gradient-to-r from-green-700 to-green-500 text-white rounded-t-lg pb-4">
              <CardTitle>Neuen Benutzer hinzufügen</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <UserForm 
                onCancel={() => setIsAddingUser(false)} 
                onSuccess={() => {
                  setIsAddingUser(false);
                  queryClient.invalidateQueries({ queryKey: ['users'] });
                  toast({
                    title: "Benutzer hinzugefügt",
                    description: "Der Benutzer wurde erfolgreich hinzugefügt.",
                  });
                }}
              />
            </CardContent>
          </Card>
        )}

        {userToEdit && (
          <Card className="mb-6 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-t-lg pb-4">
              <CardTitle>Benutzer bearbeiten</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <UserForm 
                user={userToEdit}
                isEditing 
                onCancel={() => setUserToEdit(null)} 
                onSuccess={() => {
                  setUserToEdit(null);
                  queryClient.invalidateQueries({ queryKey: ['users'] });
                  toast({
                    title: "Benutzer aktualisiert",
                    description: "Die Benutzerdaten wurden erfolgreich aktualisiert.",
                  });
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarInset>
  );
};

export default Admin;
