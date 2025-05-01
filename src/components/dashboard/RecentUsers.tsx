
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface UserData {
  id: string;
  username: string;
  fullName: string;
  email: string;
  roles: string[];
  date: string;
  status: string;
}

const RecentUsers = () => {
  // Fetch recent users from Supabase
  const { data: recentUsers, isLoading, error } = useQuery({
    queryKey: ['recent-users'],
    queryFn: async () => {
      // Use our new view to get profiles with roles
      const { data, error } = await supabase
        .from('users_with_roles')
        .select('*')
        .order('registered_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      
      // Process data to match our component's expected format
      return data.map(user => {
        // Format the date
        const date = new Date(user.registered_at);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
        
        // Determine primary role for display
        let role = 'Benutzer';
        if (user.roles && user.roles.includes('admin')) {
          role = 'Administrator';
        } else if (user.roles && user.roles.includes('moderator')) {
          role = 'Moderator';
        }
        
        return {
          id: user.id,
          username: user.username || user.id.substring(0, 8),
          fullName: user.full_name || 'Unbekannter Benutzer',
          email: user.email || 'keine@email.de',
          role: role,
          roles: user.roles || ['user'],
          date: formattedDate,
          status: user.is_active ? 'Aktiv' : 'Inaktiv'
        };
      });
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return (
    <div className="rounded-lg border shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">Neueste Benutzer</h3>
        <a href="/admin" className="text-sm text-radio-purple hover:underline">Alle anzeigen</a>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Benutzer werden geladen...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            Fehler beim Laden der Benutzer
          </div>
        ) : (
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
              {recentUsers && recentUsers.length > 0 ? (
                recentUsers.map((user) => (
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
                        variant={user.role === "Administrator" ? "purple" : user.role === "Moderator" ? "info" : "secondary"}
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Keine Benutzer gefunden
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default RecentUsers;
