// This file provides the API service functions for interacting with the database.

import { supabase } from "../integrations/supabase/client";

// Types definitions
export interface User {
  id: string;
  username: string;
  email?: string;
  fullName: string;
  roles: string | string[];
  isActive: boolean;
  createdAt?: string;
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
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface ScheduleItem {
  id: string;
  show_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  host_id?: string | null;
  host_name?: string;
  is_recurring: boolean;
  show?: Show;
  show_title?: string;
}

// Authentication functions
export const login = async (username: string, password: string) => {
  try {
    // Sign in with username/email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username.includes('@') ? username : `${username}@example.com`,
      password: password
    });
    
    if (error) throw error;
    
    if (data.user) {
      // Get user profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      // Get user roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id);
      
      let roles = ['user']; // Default role
      if (rolesData && rolesData.length > 0) {
        // Make sure we're accessing the data correctly
        roles = rolesData.map(r => r.role);
      }
      
      const user = {
        id: data.user.id,
        username: profileData?.username || username,
        email: data.user.email,
        fullName: profileData?.full_name || "",
        roles: roles.join(','),
        isActive: profileData?.is_active !== false, // Default to true if undefined
        createdAt: profileData?.created_at || data.user.created_at
      };
      
      return { user, session: data.session };
    }
    
    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};

export const authenticateUser = async (username: string, password: string) => {
  console.log('Authenticating user:', username);
  
  try {
    // Sign in with username/email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username.includes('@') ? username : `${username}@example.com`,
      password: password
    });
    
    if (error) throw error;
    
    if (data.user) {
      // Get user profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      // Get user roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id);
      
      let roles = ['user']; // Default role
      if (rolesData && rolesData.length > 0) {
        // Make sure we're accessing the data correctly
        roles = rolesData.map(r => r.role);
      }
      
      return {
        id: data.user.id,
        username: profileData?.username || username,
        email: data.user.email,
        fullName: profileData?.full_name || "",
        roles: roles.join(','),
        isActive: profileData?.is_active !== false, // Default to true if undefined
        createdAt: profileData?.created_at || data.user.created_at
      };
    }
    
    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};

// User management functions
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users_with_roles')
      .select('*');
    
    if (error) throw error;
    
    return data.map(user => ({
      id: user.id,
      username: user.username || '',
      email: user.email || '',
      fullName: user.full_name || '',
      roles: user.roles || ['user'],
      isActive: user.is_active !== false
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const createNewUser = async (userData: CreateUserData): Promise<{ insertId: string } | null> => {
  try {
    const result = await executeQuery('insert into users', [userData]);
    
    // Ensure correct return format
    if (result && result.length > 0) {
      const item = result[0];
      return { insertId: item.id || item.insertId };
    }
    return null;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<{ affectedRows: number } | null> => {
  try {
    const result = await executeQuery('update users', [userData, userId]);
    
    // Ensure correct return format
    if (result && result.length > 0) {
      return { affectedRows: 1 }; // Return expected format
    }
    return null;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<{ affectedRows: number } | null> => {
  try {
    const result = await executeQuery('delete from users', [userId]);
    
    // Ensure correct return format
    if (result && result.length > 0) {
      return { affectedRows: 1 }; // Return expected format
    }
    return null;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Schedule management functions
export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    const { data, error } = await supabase
      .from('schedule')
      .select(`
        *,
        shows:show_id (
          id,
          title,
          description
        )
      `);
    
    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      show_title: item.shows?.title || 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
};

export const getShows = async (): Promise<Show[]> => {
  try {
    const { data, error } = await supabase
      .from('shows')
      .select('*');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching shows:', error);
    return [];
  }
};

export const createScheduleItem = async (scheduleData: Omit<ScheduleItem, 'id'>): Promise<{ insertId: string, show_title?: string } | null> => {
  try {
    const result = await executeQuery('insert into schedule', [scheduleData]);
    
    // Ensure correct return format
    if (result && result.length > 0) {
      const item = result[0];
      return { 
        insertId: item.id || item.insertId, 
        show_title: item.show_title 
      };
    }
    return null;
  } catch (error) {
    console.error('Error creating schedule item:', error);
    throw error;
  }
};

export const updateScheduleItem = async (scheduleId: string, scheduleData: Partial<ScheduleItem>): Promise<{ affectedRows: number } | null> => {
  try {
    const result = await executeQuery('update schedule', [scheduleData, scheduleId]);
    
    // Ensure correct return format
    if (result && result.length > 0) {
      return { affectedRows: 1 }; // Return expected format
    }
    return null;
  } catch (error) {
    console.error('Error updating schedule item:', error);
    throw error;
  }
};

export const deleteScheduleItem = async (scheduleId: string): Promise<{ affectedRows: number } | null> => {
  try {
    const result = await executeQuery('delete from schedule', [scheduleId]);
    
    // Ensure correct return format
    if (result && result.length > 0) {
      return { affectedRows: 1 }; // Return expected format
    }
    return null;
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    throw error;
  }
};

// Query execution function that now uses Supabase
export const executeQuery = async (query: string, params: any[] = []) => {
  console.log('Executing query:', query, 'with params:', params);
  
  // Parse query to determine what operation to perform
  const queryLower = query.toLowerCase();
  
  try {
    if (queryLower.includes('select') && queryLower.includes('from users')) {
      // Get all users or specific user from profiles and user_roles
      let queryBuilder = supabase
        .from('profiles')
        .select('*, user_roles(role)');
      
      if (params.length > 0 && queryLower.includes('where id =')) {
        const userId = params[0];
        queryBuilder = queryBuilder.eq('id', userId);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      
      return data.map(user => {
        // Handle the case where user_roles might be null, an array, or an object
        let roles = 'user'; // Default role
        
        // Safely handle user_roles which might be null
        if (user.user_roles) {
          if (Array.isArray(user.user_roles)) {
            // If it's an array of role objects
            roles = user.user_roles
              .map((r: any) => r.role)
              .filter(Boolean)
              .join(',') || 'user';
          } 
          else if (typeof user.user_roles === 'object') {
            // If it's a single object
            roles = (user.user_roles as any).role || 'user';
          }
        }
        
        return {
          id: user.id,
          username: user.username,
          password: 'REDACTED', // Password hash not exposed
          email: user.email,
          fullName: user.full_name,
          roles: roles,
          isActive: user.is_active,
          createdAt: user.created_at
        };
      });
    }
    
    if (queryLower.includes('select') && queryLower.includes('from shows')) {
      // Get all shows or specific show
      let queryBuilder = supabase.from('shows').select('*');
      
      if (params.length > 0 && queryLower.includes('where id =')) {
        const showId = params[0];
        queryBuilder = queryBuilder.eq('id', showId);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      
      return data;
    }
    
    if (queryLower.includes('select') && queryLower.includes('from schedule')) {
      // Get all schedule items or specific schedule item
      let queryBuilder = supabase
        .from('schedule')
        .select(`
          *,
          shows:show_id (
            id,
            title,
            description
          )
        `);
      
      if (params.length > 0 && queryLower.includes('where id =')) {
        const scheduleId = params[0];
        queryBuilder = queryBuilder.eq('id', scheduleId);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        show_title: item.shows?.title || 'Unknown',
        show_description: item.shows?.description || ''
      }));
    }
    
    if (queryLower.includes('insert into users')) {
      const userData = params[0];
      
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email || `${userData.username}@example.com`,
        password: userData.password
      });
      
      if (authError) throw authError;
      
      if (!authData.user) throw new Error("Failed to create user");
      
      // Create profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: userData.username,
          full_name: userData.fullName || null,
          email: userData.email || null,
          is_active: userData.isActive !== undefined ? userData.isActive : true
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add roles
      if (userData.roles && Array.isArray(userData.roles)) {
        const rolePromises = userData.roles.map(role => 
          supabase
            .from('user_roles')
            .insert({
              user_id: authData.user!.id,
              role: role
            })
        );
        
        await Promise.all(rolePromises);
      }
      
      return [{ insertId: authData.user.id }];
    }
    
    if (queryLower.includes('update users')) {
      const userData = params[0];
      const id = params[1];
      
      // Update profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: userData.username,
          full_name: userData.fullName,
          email: userData.email,
          is_active: userData.isActive
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update roles if provided
      if (userData.roles) {
        // First delete all existing roles
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', id);
        
        // Then insert new roles
        const roles = Array.isArray(userData.roles) ? userData.roles : userData.roles.split(',');
        const rolePromises = roles.map(role => 
          supabase
            .from('user_roles')
            .insert({
              user_id: id,
              role: role.trim()
            })
        );
        
        await Promise.all(rolePromises);
      }
      
      return [{ affectedRows: 1 }];
    }
    
    if (queryLower.includes('delete from users')) {
      const userId = params[0];
      
      // Delete from auth.users will cascade to profiles and user_roles
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      return [{ affectedRows: 1 }];
    }
    
    if (queryLower.includes('insert into shows')) {
      const showData = params[0];
      
      const { data, error } = await supabase
        .from('shows')
        .insert(showData)
        .select()
        .single();
      
      if (error) throw error;
      
      return [{ insertId: data.id }];
    }
    
    if (queryLower.includes('update shows')) {
      const showData = params[0];
      const id = params[1];
      
      const { data, error } = await supabase
        .from('shows')
        .update(showData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return [{ affectedRows: 1 }];
    }
    
    if (queryLower.includes('delete from shows')) {
      const showId = params[0];
      
      // Delete the show
      const { error } = await supabase
        .from('shows')
        .delete()
        .eq('id', showId);
      
      if (error) throw error;
      
      // Delete related schedule items
      await supabase
        .from('schedule')
        .delete()
        .eq('show_id', showId);
      
      return [{ affectedRows: 1 }];
    }
    
    if (queryLower.includes('insert into schedule')) {
      const scheduleData = params[0];
      
      const { data, error } = await supabase
        .from('schedule')
        .insert(scheduleData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Get related show and host information
      const { data: showData } = await supabase
        .from('shows')
        .select('title, description')
        .eq('id', scheduleData.show_id)
        .single();
      
      let hostName = 'Nicht zugewiesen';
      if (scheduleData.host_id) {
        const { data: hostData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', scheduleData.host_id)
          .single();
        
        if (hostData) {
          hostName = hostData.full_name;
        }
      }
      
      // Return the created item with additional information
      return [{
        insertId: data.id,
        show_title: showData?.title || null,
        show_description: showData?.description || null,
        host_name: hostName
      }];
    }
    
    if (queryLower.includes('update schedule')) {
      const scheduleData = params[0];
      const id = params[1];
      
      const { data, error } = await supabase
        .from('schedule')
        .update(scheduleData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return [{ affectedRows: 1 }];
    }
    
    if (queryLower.includes('delete from schedule')) {
      const scheduleId = params[0];
      
      const { error } = await supabase
        .from('schedule')
        .delete()
        .eq('id', scheduleId);
      
      if (error) throw error;
      
      return [{ affectedRows: 1 }];
    }
    
    // Default fallback for unsupported queries
    console.warn('Unsupported query:', query);
    return [];
    
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
};

// Status Update Type
export interface StatusUpdate {
  id: number | string;
  system_name: string;
  status: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Get all status updates
export const getStatusUpdates = async (): Promise<StatusUpdate[]> => {
  try {
    const { data, error } = await supabase
      .from('status_updates')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching status updates:', error);
    throw error;
  }
};

// Create a new status update
export const createStatusItem = async (statusData: Omit<StatusUpdate, 'id' | 'created_at' | 'updated_at'>): Promise<StatusUpdate> => {
  try {
    const { data, error } = await supabase
      .from('status_updates')
      .insert(statusData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating status item:', error);
    throw error;
  }
};

// Update an existing status update
export const updateStatusItem = async (id: string, statusData: Partial<Omit<StatusUpdate, 'id' | 'created_at' | 'updated_at'>>): Promise<StatusUpdate> => {
  try {
    const { data, error } = await supabase
      .from('status_updates')
      .update(statusData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating status item:', error);
    throw error;
  }
};

// Delete a status update
export const deleteStatusItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('status_updates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting status item:', error);
    throw error;
  }
};

// Mock implementation of backup-related functions to prevent errors
export const createBackup = async () => {
  console.warn('createBackup is not implemented yet');
  return { id: 'mock-backup-id', created_at: new Date().toISOString() };
};

export const getBackups = async () => {
  console.warn('getBackups is not implemented yet');
  return [];
};

export const downloadBackup = async () => {
  console.warn('downloadBackup is not implemented yet');
  return null;
};

export const restoreBackup = async () => {
  console.warn('restoreBackup is not implemented yet');
  return { success: false, message: 'Not implemented' };
};

export interface BackupInfo {
  id: string;
  created_at: string;
  size?: number;
  name?: string;
}

export default {
  authenticateUser,
  executeQuery,
  getStatusUpdates,
  createStatusItem,
  updateStatusItem,
  deleteStatusItem,
  login,
  getUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getSchedule,
  getShows,
  createScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
  createBackup,
  getBackups,
  downloadBackup,
  restoreBackup
};
