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

const sampleUsers: AppUser[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'Admin User',
    email: 'admin@piper-lee.de',
    roles: ['admin'],
    lastLogin: '01.05.2025 15:30',
    status: 'active',
    isActive: true
  },
  {
    id: '2',
    username: 'moderator1',
    fullName: 'Mod User',
    email: 'mod1@piper-lee.de',
    roles: ['moderator'],
    lastLogin: '01.05.2025 12:15',
    status: 'active',
    isActive: true
  },
  {
    id: '3',
    username: 'user123',
    fullName: 'Regular User',
    email: 'user123@example.com',
    roles: ['user'],
    lastLogin: '30.04.2025 18:22',
    status: 'active',
    isActive: true
  },
  {
    id: '4',
    username: 'banned_user',
    fullName: 'Banned User',
    email: 'banned@example.com',
    roles: ['user'],
    lastLogin: '15.04.2025 09:45',
    status: 'banned',
    isActive: false
  },
  {
    id: '5',
    username: 'inactive_user',
    fullName: 'Inactive User',
    email: 'inactive@example.com',
    roles: ['user'],
    lastLogin: '01.03.2025 14:30',
    status: 'inactive',
    isActive: false
  }
];

const UsersPage = () => {
  const [users, setUsers] = useState<AppUser[]>(sampleUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  
  const { toast } = useToast();

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
    toast({
      title: "Benutzer hinzugefügt",
      description: "Der Benutzer wurde erfolgreich hinzugefügt.",
    });
  };

  const handleEditUserSuccess = () => {
    setEditingUser(null);
    toast({
      title: "Benutzer aktualisiert",
      description: "Die Benutzerdaten wurden erfolgreich aktualisiert.",
    });
  };

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'banned') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: "Status geändert",
        description: `Der Status von ${user.username} wurde auf ${
          newStatus === 'active' ? 'Aktiv' : 
          newStatus === 'inactive' ? 'Inaktiv' : 'Gesperrt'
        } geändert.`,
      });
    }
  };

  const filteredUsers = searchTerm
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
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.fullName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.fullName}</div>
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
