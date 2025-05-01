import { supabase } from "@/integrations/supabase/client";
import { authenticateUser, createUser, deleteUser as deleteUserFromDb, getAllUsers, updateUser as updateUserInDb } from "@/lib/db";

// Types
export interface ScheduleItem {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  host_id: string | null;
  host_name?: string;
  show_id: string;
  show?: Show;
  show_title?: string;
}

export interface Show {
  id: string;
  title: string;
  description: string | null;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

export interface CreateUserData {
  username: string;
  password: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive?: boolean;
}

export interface LoginResponse {
  user: User;
  session?: {
    access_token?: string;
  };
}

// New StatusUpdate interface
export interface StatusUpdate {
  id: string;
  system_name: string;
  status: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Auth functions
export const login = async (username: string, password: string): Promise<LoginResponse | null> => {
  try {
    const user = await authenticateUser(username, password);
    
    if (!user) {
      return null;
    }
    
    const userData: User = {
      id: user.id.toString(),
      username: user.username,
      fullName: user.fullName || "",
      email: user.email || "",
      roles: user.roles ? user.roles.split(',') : [],
      isActive: user.isActive
    };
    
    return {
      user: userData,
      session: {
        access_token: "dummy-token-" + Math.random().toString(36).substring(2)
      }
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// User management functions
export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await getAllUsers();
    return users.map(user => ({
      id: user.id.toString(),
      username: user.username,
      fullName: user.fullName || "",
      email: user.email || "",
      roles: user.roles ? user.roles.split(',') : [],
      isActive: user.isActive
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createNewUser = async (userData: CreateUserData): Promise<User> => {
  try {
    const newUser = await createUser(userData);
    return {
      id: newUser.id.toString(),
      username: newUser.username,
      fullName: newUser.fullName || "",
      email: newUser.email || "",
      roles: newUser.roles ? newUser.roles.split(',') : [],
      isActive: newUser.isActive
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User | null> => {
  try {
    // Ensure we're passing all required fields for updateUser
    if (!userId) {
      throw new Error("Invalid user ID");
    }
    
    // Map roles array to comma-separated string if provided
    const dbUpdateData: any = {...userData};
    if (userData.roles) {
      dbUpdateData.roles = userData.roles;
    }
    
    console.log("Updating user with data:", dbUpdateData);
    
    const updatedUser = await updateUserInDb(userId, dbUpdateData);
    if (!updatedUser) return null;
    
    return {
      id: updatedUser.id.toString(),
      username: updatedUser.username,
      fullName: updatedUser.fullName || "",
      email: updatedUser.email || "",
      roles: updatedUser.roles ? updatedUser.roles.split(',') : [],
      isActive: updatedUser.isActive
    };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // The id is now a string in the updated DB interface, so we don't need to parse it
    if (!userId) {
      throw new Error("Invalid user ID");
    }
    
    return await deleteUserFromDb(userId);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Schedule API functions
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
      `)
      .order('day_of_week')
      .order('start_time');

    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      ...item,
      show_title: item.shows?.title || 'Unknown'
    }));
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

export const getShows = async (): Promise<Show[]> => {
  try {
    const { data, error } = await supabase
      .from('shows')
      .select('*')
      .order('title');

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching shows:', error);
    throw error;
  }
};

export const createScheduleItem = async (scheduleItem: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem> => {
  try {
    const { data, error } = await supabase
      .from('schedule')
      .insert(scheduleItem)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating schedule item:', error);
    throw error;
  }
};

export const updateScheduleItem = async (id: string, updates: Partial<ScheduleItem>): Promise<ScheduleItem> => {
  try {
    const { data, error } = await supabase
      .from('schedule')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating schedule item:', error);
    throw error;
  }
};

export const deleteScheduleItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    throw error;
  }
};

// Status update API functions
export const getStatusUpdates = async (): Promise<StatusUpdate[]> => {
  try {
    const { data, error } = await supabase
      .from('status_updates')
      .select('*')
      .order('system_name');
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching status updates:', error);
    throw error;
  }
};

export const updateStatusItem = async (id: string, updates: Partial<StatusUpdate>): Promise<StatusUpdate> => {
  try {
    // Make sure to update the updated_at timestamp
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('status_updates')
      .update(updateData)
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

export const createStatusItem = async (statusItem: Omit<StatusUpdate, 'id' | 'created_at' | 'updated_at'>): Promise<StatusUpdate> => {
  try {
    const { data, error } = await supabase
      .from('status_updates')
      .insert(statusItem)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating status item:', error);
    throw error;
  }
};

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

// Add other API functions here as needed
