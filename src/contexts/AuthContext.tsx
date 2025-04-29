
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'user' | 'moderator' | 'admin';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { username: string; full_name: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isModerator: boolean;
  roles: UserRole[];
  isMaintenanceMode: boolean; // Add maintenance mode state
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false); // Add maintenance mode state
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserRoles(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsModerator(false);
          setRoles([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
      setLoading(false);
    });

    // Check for maintenance mode setting
    const fetchMaintenanceMode = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'maintenance_mode')
          .single();
        
        if (!error && data) {
          setIsMaintenanceMode(data.value === 'true');
        }
      } catch (error) {
        console.error('Error fetching maintenance mode:', error);
      }
    };

    fetchMaintenanceMode();

    // Set up subscription to app_settings changes
    const appSettingsChannel = supabase
      .channel('app_settings_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'app_settings' },
        (payload: any) => {
          // Fixed TypeScript error by adding proper type checking
          if (payload.new && typeof payload.new === 'object' && 
              'key' in payload.new && 'value' in payload.new && 
              payload.new.key === 'maintenance_mode') {
            setIsMaintenanceMode(payload.new.value === 'true');
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(appSettingsChannel);
    };
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      // Fetch all roles for this user
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return;
      }

      const rolesList = userRoles.map(r => r.role as UserRole);
      setRoles(rolesList);
      setIsAdmin(rolesList.includes('admin'));
      setIsModerator(rolesList.includes('admin') || rolesList.includes('moderator'));
    } catch (error) {
      console.error('Error checking roles:', error);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: { username: string; full_name: string }
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.full_name
          }
        }
      });

      if (error) {
        toast({
          title: "Registrierung fehlgeschlagen",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Registrierung erfolgreich",
        description: "Ihr Konto wurde erstellt.",
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Fehler bei der Registrierung",
        description: error.message || "Es ist ein unbekannter Fehler aufgetreten.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Anmeldung fehlgeschlagen",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Erfolgreich angemeldet",
        description: "Willkommen zurück!",
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Fehler bei der Anmeldung",
        description: error.message || "Es ist ein unbekannter Fehler aufgetreten.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signUp, 
      signIn, 
      signOut, 
      isAdmin, 
      isModerator, 
      roles,
      isMaintenanceMode // Add to context value
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
