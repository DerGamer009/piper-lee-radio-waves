
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users as UsersIcon, UserPlus, UserX, Search, Filter, Save, Download } from 'lucide-react';
import { SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import UserForm from '@/components/UserForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/services/apiService';

type AppUser = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
  roles: string[];
  lastLogin: string;
  status: 'active' | 'inactive' | 'banned';
  isActive?: boolean;
};

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const queryClient = useQueryClient();
  
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching users for admin page');
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role)
        `);
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      return data.map(user => {
        // Extract roles from the nested user_roles array
        let roles: string[] = ['user']; // default role
        if (user.user_roles && Array.isArray(user.user_roles)) {
          roles = user.user_roles.map((r: any) => r.role);
        } 
        
        // Format for the UI
        return {
          id: user.id,
          username: user.username || 'No Username',
          fullName: user.full_name || '',
          email: user.email || '',
          avatar: user.avatar_url,
          roles: roles,
          lastLogin: user.registered_at ? new Date(user.registered_at).toLocaleDateString() : 'Nie',
          status: user.is_active ? 'active' : 'inactive',
          isActive: user.is_active
        } as AppUser;
      });
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter users based on search term
    toast({
      title: "Suche",
      description: `Suche nach "${searchTerm}"`,
    });
  };

  const handleExportUsers = () => {
    toast({
      title: "Export gestartet",
      description: "Die Benutzerdaten werden exportiert.",
    });
  };

  const handleAddUserSuccess = () => {
    setIsAddingUser(false);
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    toast({
      title: "Benutzer hinzugefügt",
      description: "Der Benutzer wurde erfolgreich hinzugefügt.",
    });
  };

  const handleEditUserSuccess = () => {
    setEditingUser(null);
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    toast({
      title: "Benutzer aktualisiert",
      description: "Die Benutzerdaten wurden erfolgreich aktualisiert.",
    });
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'banned') => {
    try {
      // Update the user's status in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: newStatus === 'active'
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      
      const user = users?.find(u => u.id === userId);
      if (user) {
        toast({
          title: "Status geändert",
          description: `Der Status von ${user.username} wurde auf ${
            newStatus === 'active' ? 'Aktiv' : 
            newStatus === 'inactive' ? 'Inaktiv' : 'Gesperrt'
          } geändert.`,
        });
      }
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast({
        title: "Fehler",
        description: `Der Status konnte nicht geändert werden: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const filteredUsers = searchTerm && users
    ? users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-3 mb-8">
          <UsersIcon className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Benutzerverwaltung</h1>
        </div>

        {isAddingUser ? (
          <Card className="border-none shadow-md mb-6">
            <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg pb-4">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Neuen Benutzer hinzufügen
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <UserForm 
                onCancel={() => setIsAddingUser(false)} 
                onSuccess={handleAddUserSuccess}
              />
            </CardContent>
          </Card>
        ) : editingUser ? (
          <Card className="border-none shadow-md mb-6">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-lg pb-4">
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Benutzer bearbeiten
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <UserForm 
                user={editingUser as User}
                isEditing={true}
                onCancel={() => setEditingUser(null)} 
                onSuccess={handleEditUserSuccess}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-md mb-6">
            <CardHeader className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white rounded-t-lg pb-4">
              <CardTitle className="flex justify-between items-center">
                <span>Benutzer-Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form onSubmit={handleSearch} className="flex">
                  <Input 
                    placeholder="Benutzer suchen..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-r-none"
                  />
                  <Button 
                    type="submit" 
                    className="rounded-l-none bg-purple-600 hover:bg-purple-700"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => setIsAddingUser(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Neuer Benutzer
                  </Button>
                  <Button variant="outline" onClick={handleExportUsers}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg pb-4">
            <CardTitle>Benutzerliste</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-b-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Benutzer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rollen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Letzter Login</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : user.username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.fullName || user.username}</div>
                              <div className="text-sm text-muted-foreground">@{user.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.roles.map(role => (
                            <span 
                              key={role} 
                              className={`inline-block px-2 py-1 rounded-full text-xs mr-1 ${
                                role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                role === 'moderator' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {role}
                            </span>
                          ))}
                        </TableCell>
                        <TableCell>
                          <span 
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' : 
                              user.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.status === 'active' ? 'Aktiv' : 
                             user.status === 'inactive' ? 'Inaktiv' : 
                             'Gesperrt'}
                          </span>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditingUser(user)}
                            >
                              Bearbeiten
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Filter className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                                  Status: Aktiv
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'inactive')}>
                                  Status: Inaktiv
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'banned')}>
                                  Status: Gesperrt
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {searchTerm ? (
                          <>Keine Benutzer gefunden für "{searchTerm}"</>
                        ) : (
                          <>Keine Benutzer vorhanden</>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
};

export default UsersPage;
