
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const UsersPage = () => {
  const { isAdmin, isModerator } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Fetch users data
  const { data: users, isLoading } = useQuery({
    queryKey: ['users-list'],
    queryFn: async () => {
      let query = supabase
        .from('users_with_roles')
        .select('*')
        .order('registered_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        toast({
          title: "Fehler beim Laden der Benutzer",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    },
  });

  // Filter users based on search query
  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    if (!searchQuery) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.username?.toLowerCase().includes(query) || 
      user.email?.toLowerCase().includes(query) || 
      user.full_name?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      case 'moderator':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Benutzer Verwaltung</h1>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Benutzer suchen..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isAdmin && (
            <Button variant="default">
              <UserPlus className="h-4 w-4 mr-2" />
              Benutzer anlegen
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-lg">Benutzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Benutzer</th>
                  <th className="text-left p-3 font-medium">E-Mail</th>
                  <th className="text-left p-3 font-medium">Rolle</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Registriert am</th>
                  {(isAdmin || isModerator) && <th className="p-3 w-10"></th>}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3">
                        <div className="flex items-center">
                          <Skeleton className="h-8 w-8 rounded-full mr-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </td>
                      <td className="p-3"><Skeleton className="h-4 w-32" /></td>
                      <td className="p-3"><Skeleton className="h-4 w-16" /></td>
                      <td className="p-3"><Skeleton className="h-4 w-16" /></td>
                      <td className="p-3"><Skeleton className="h-4 w-24" /></td>
                      {(isAdmin || isModerator) && <td className="p-3"></td>}
                    </tr>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    // Get user initials for avatar fallback
                    const initials = user.full_name 
                      ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                      : user.username?.substring(0, 2).toUpperCase() || '??';
                    
                    // Format registration date
                    const registeredDate = user.registered_at 
                      ? new Date(user.registered_at).toLocaleDateString('de-DE')
                      : 'Unbekannt';
                    
                    return (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={user.avatar_url || ''} alt={user.full_name || user.username || ''} />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.full_name || 'Kein Name'}</div>
                              <div className="text-xs text-muted-foreground">{user.username || '-'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {user.roles && user.roles.length > 0 ? user.roles.map(role => (
                              <Badge key={role} className={`${getRoleBadgeColor(role)} text-white`}>
                                {role}
                              </Badge>
                            )) : (
                              <Badge variant="outline">Benutzer</Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          {user.is_active ? (
                            <Badge variant="success" className="bg-green-500 hover:bg-green-600">Aktiv</Badge>
                          ) : (
                            <Badge variant="destructive">Inaktiv</Badge>
                          )}
                        </td>
                        <td className="p-3">{registeredDate}</td>
                        {(isAdmin || isModerator) && (
                          <td className="p-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Menü öffnen</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profil anzeigen</DropdownMenuItem>
                                {isAdmin && (
                                  <>
                                    <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                                    <DropdownMenuItem>Rolle ändern</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      {user.is_active ? 'Deaktivieren' : 'Aktivieren'}
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={(isAdmin || isModerator) ? 6 : 5} className="p-8 text-center text-muted-foreground">
                      Keine Benutzer gefunden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
