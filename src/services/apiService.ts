
import { supabase } from "@/integrations/supabase/client";
import { Session, User as AuthUser, WeakPassword } from '@supabase/supabase-js';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
}

export interface CreateUserData {
  username: string;
  password: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
}

export interface Show {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  created_by?: string;
}

export interface ScheduleItem {
  id: string;
  show_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  host_id?: string;
  is_recurring: boolean;
  show?: Show; // Used for joined queries
  show_title?: string; // Used for display in UI
  host_name?: string; // Used for display in UI
}

export const createNewUser = async (userData: CreateUserData): Promise<User> => {
  // Create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true,
    user_metadata: {
      username: userData.username,
      full_name: userData.fullName
    }
  });

  if (authError) throw authError;
  
  // User roles will be created automatically via trigger for 'user' role
  // But we need to add any additional roles
  
  const userId = authData.user.id;
  
  // Remove default 'user' role if needed to avoid duplicates
  await supabase.from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role', 'user');
  
  // Add all selected roles
  for (const role of userData.roles) {
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role as "user" | "moderator" | "admin" // Cast to match the enum type
      });
    
    if (error) throw error;
  }
  
  return {
    id: userId,
    username: userData.username,
    email: userData.email,
    fullName: userData.fullName,
    roles: userData.roles,
    isActive: userData.isActive
  };
};

export const updateUser = async (userId: string, userData: Omit<User, 'id'>): Promise<User> => {
  // Update the profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      username: userData.username,
      full_name: userData.fullName
    })
    .eq('id', userId);
  
  if (profileError) throw profileError;
  
  // Update email if changed
  const { data: userData2 } = await supabase.auth.admin.getUserById(userId);
  if (userData2 && userData2.user && userData2.user.email !== userData.email) {
    const { error } = await supabase.auth.admin.updateUserById(
      userId, 
      { email: userData.email, email_confirm: true }
    );
    if (error) throw error;
  }
  
  // Update roles
  // First, remove all existing roles
  await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId);
  
  // Then add the new roles
  for (const role of userData.roles) {
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role as "user" | "moderator" | "admin" // Cast to match the enum type
      });
    
    if (error) throw error;
  }
  
  return {
    id: userId,
    ...userData
  };
};

export const getUsers = async (): Promise<User[]> => {
  try {
    // Get profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) throw profilesError;
    if (!profiles) return [];

    // Get all auth users to get emails
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    if (!authData || !authData.users) return [];

    // Get user roles
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('*');

    if (roleError) throw roleError;
    
    // Type the role data to avoid 'never' type issues
    type UserRole = { user_id: string; role: string };
    const typedRoleData: UserRole[] = roleData || [];

    // Combine data to create user objects
    const users = profiles.map(profile => {
      // Find matching auth user 
      const authUser = authData.users.find(user => {
        return user && user.id === profile.id;
      });
      
      // Get roles for this user
      const userRoles = typedRoleData.length > 0
        ? typedRoleData.filter(r => r.user_id === profile.id).map(r => r.role)
        : ['user'];

      return {
        id: profile.id,
        username: profile.username || '',
        email: authUser?.email || '',
        fullName: profile.full_name || '',
        roles: userRoles,
        isActive: true // Default to true if not specified
      };
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Deleting a user from auth will cascade delete from profiles and roles
    // due to database constraints
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Extract user metadata for our custom User object
  const userData: User = {
    id: data.user?.id || '',
    username: data.user?.user_metadata?.username || '',
    email: data.user?.email || '',
    fullName: data.user?.user_metadata?.full_name || '',
    roles: data.user?.user_metadata?.roles || ['user'],
    isActive: true
  };
  
  return {
    user: userData,
    session: data.session
  };
};

// Schedule related functions
export const getSchedule = async (): Promise<ScheduleItem[]> => {
  const { data, error } = await supabase
    .from('schedule')
    .select(`
      *,
      show:show_id (
        id, title, description, image_url
      )
    `);
  
  if (error) throw error;
  
  return data || [];
};

export const getShows = async (): Promise<Show[]> => {
  const { data, error } = await supabase
    .from('shows')
    .select('*');
  
  if (error) throw error;
  
  return data || [];
};

export const createScheduleItem = async (scheduleItem: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem> => {
  const { data, error } = await supabase
    .from('schedule')
    .insert({
      show_id: scheduleItem.show_id,
      day_of_week: scheduleItem.day_of_week,
      start_time: scheduleItem.start_time,
      end_time: scheduleItem.end_time,
      host_id: scheduleItem.host_id,
      is_recurring: scheduleItem.is_recurring
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

export const updateScheduleItem = async (id: string, scheduleItem: Partial<ScheduleItem>): Promise<ScheduleItem> => {
  const { data, error } = await supabase
    .from('schedule')
    .update({
      show_id: scheduleItem.show_id,
      day_of_week: scheduleItem.day_of_week,
      start_time: scheduleItem.start_time,
      end_time: scheduleItem.end_time,
      host_id: scheduleItem.host_id,
      is_recurring: scheduleItem.is_recurring
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

export const deleteScheduleItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('schedule')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
