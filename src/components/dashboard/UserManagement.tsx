
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserForm from '../UserForm';
import { AlertTriangle, Check, Search, Shield, ShieldAlert, User, Users } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar_url: string | null;
  isActive: boolean;
  roles: string[];
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch users from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Fetch auth users for email
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      // Combine data
      const mappedUsers: UserData[] = profiles.map(profile => {
        const roles = userRoles
          .filter(role => role.user_id === profile.id)
          .map(role => role.role);
        
        const authUser = authUsers.users.find(user => user.id === profile.id);
        
        return {
          id: profile.id,
          username: profile.username || '',
          email: authUser?.email || '',
          fullName: profile.full_name || '',
          avatar_url: profile.avatar_url,
          isActive: true, // Default to true if not available
          roles: roles,
          created_at: profile.created_at
        };
      });

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Fehler beim Laden der Benutzer",
        description: "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
    
    try {
      // Delete user from auth
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      // The trigger will automatically delete the profile and roles due to CASCADE
      
      toast({
        title: "Benutzer gelöscht",
        description: "Der Benutzer wurde erfolgreich gelöscht.",
      });
      
      // Update local state
      setUsers(users.filter(user => user.id !== userId));
    } catch (error: any) {
      console.error('Error removing user:', error);
      toast({
        title: "Fehler beim Löschen des Benutzers",
        description: error.message || "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
  };

  const handleUserSuccess = () => {
    fetchUsers();
    setSelectedUser(null);
    setIsAddingUser(false);
  };

  const filteredUsers = users.filter(user => {
    // Filter by search query
    const matchesSearch = 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'admin') return matchesSearch && user.roles.includes('admin');
    if (activeTab === 'moderator') return matchesSearch && user.roles.includes('moderator');
    if (activeTab === 'user') return matchesSearch && user.roles.includes('user') && !user.roles.includes('admin') && !user.roles.includes('moderator');
    
    return matchesSearch;
  });

  const getRoleIcon = (user: UserData) => {
    if (user.roles.includes('admin')) return <Shield className="h-4 w-4 text-red-500" />;
    if (user.roles.includes('moderator')) return <ShieldAlert className="h-4 w-4 text-amber-500" />;
    return <User className="h-4 w-4 text-blue-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          Benutzerverwaltung
        </CardTitle>
        <CardDescription>
          Verwalten Sie alle Benutzer der Website und weisen Sie Rollen zu.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex w-full md:w-auto items-center border rounded-md px-2 focus-within:ring-1 focus-within:ring-primary">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
              placeholder="Benutzer suchen..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button onClick={() => setIsAddingUser(true)}>
            Benutzer hinzufügen
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>Alle</span>
              <Badge variant="outline" className="ml-1">{users.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              <span>Admins</span>
              <Badge variant="outline" className="ml-1">{users.filter(u => u.roles.includes('admin')).length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="moderator" className="flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Moderatoren</span>
              <Badge variant="outline" className="ml-1">{users.filter(u => u.roles.includes('moderator')).length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="user" className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>Nutzer</span>
              <Badge variant="outline" className="ml-1">
                {users.filter(u => u.roles.includes('user') && !u.roles.includes('admin') && !u.roles.includes('moderator')).length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Benutzer werden geladen...
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-xs font-medium text-left p-2 pl-4">Benutzer</th>
                    <th className="text-xs font-medium text-left p-2">Email</th>
                    <th className="text-xs font-medium text-left p-2">Rolle</th>
                    <th className="text-xs font-medium text-left p-2">Status</th>
                    <th className="text-xs font-medium text-left p-2">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-t hover:bg-muted/50">
                      <td className="p-2 pl-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar_url || ''} />
                            <AvatarFallback>{user.username?.charAt(0) || user.fullName?.charAt(0) || '?'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName || 'Kein Name'}</div>
                            <div className="text-xs text-muted-foreground">@{user.username || 'unbekannt'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-sm">{user.email}</div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1.5">
                          {getRoleIcon(user)}
                          <div className="text-sm">
                            {user.roles.includes('admin') 
                              ? 'Administrator' 
                              : user.roles.includes('moderator') 
                                ? 'Moderator' 
                                : 'Nutzer'}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge 
                          variant={user.isActive ? "outline" : "secondary"}
                          className={`flex w-24 justify-center items-center gap-1 ${user.isActive ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400' : ''}`}
                        >
                          {user.isActive 
                            ? <><Check className="h-3 w-3" /> Aktiv</>
                            : <><AlertTriangle className="h-3 w-3" /> Inaktiv</>}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            Bearbeiten
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                            onClick={() => handleRemoveUser(user.id)}
                          >
                            Löschen
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground border rounded-md">
            {searchQuery ? 'Keine Benutzer gefunden. Versuchen Sie einen anderen Suchbegriff.' : 'Keine Benutzer vorhanden.'}
          </div>
        )}
      </CardContent>

      {/* Dialog for editing user */}
      <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Benutzer bearbeiten</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm 
              isEditing={true}
              user={{
                id: selectedUser.id,
                username: selectedUser.username,
                email: selectedUser.email,
                fullName: selectedUser.fullName,
                roles: selectedUser.roles,
                isActive: selectedUser.isActive
              }}
              onCancel={() => setSelectedUser(null)}
              onSuccess={handleUserSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for adding user */}
      <Dialog open={isAddingUser} onOpenChange={(open) => !open && setIsAddingUser(false)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Neuen Benutzer erstellen</DialogTitle>
          </DialogHeader>
          <UserForm 
            onCancel={() => setIsAddingUser(false)}
            onSuccess={handleUserSuccess}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserManagement;
