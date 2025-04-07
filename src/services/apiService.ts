
// Adjust the imports to avoid Node-specific modules
import { executeQuery, authenticateUser as dbAuthenticateUser } from '@/services/dbService';

// Types
export interface User {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  roles: string[];
  isActive: boolean;
  created_at?: string;
  last_login?: string;
}

export interface Show {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  creator_name?: string;
}

// Extended ScheduleItem interface to include UI fields
export interface ScheduleItem {
  id: number;
  show_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  host_id?: number;
  is_recurring: boolean;
  created_at?: string;
  updated_at?: string;
  show_title?: string;       // For UI display
  show_description?: string; // For UI display
  host_name?: string;        // For UI display
}

export interface CreateUserData {
  username: string;
  password?: string;  // Make password optional for update operations
  email?: string;
  fullName?: string;
  roles: string[];
  isActive?: boolean;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

// Authentication service
export const login = async (username: string, password: string): Promise<LoginResponse | null> => {
  try {
    const user = await dbAuthenticateUser(username, password);
    if (!user) return null;

    // Store user in localStorage
    const token = 'dummy-token';
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    return null;
  }
};

export const hasRole = (requiredRoles: string[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const userRoles = Array.isArray(user.roles) ? user.roles : user.roles.split(',');
  return requiredRoles.some(role => userRoles.includes(role));
};

// User API functions
export const getUsers = async (): Promise<User[]> => {
  try {
    const results = await executeQuery('SELECT * FROM users');
    return results.map(user => ({
      ...user,
      roles: typeof user.roles === 'string' ? user.roles.split(',') : user.roles
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const createNewUser = async (userData: CreateUserData): Promise<User | null> => {
  try {
    // For simplicity in browser environment, we generate a password if not provided
    const userToCreate = {
      ...userData,
      password: userData.password || 'defaultPassword123' // Would be hashed in a real app
    };
    
    const result = await executeQuery('INSERT INTO users', [userToCreate]);
    if (result && result.length > 0 && result[0].insertId) {
      // Simulate fetching the created user
      return {
        id: result[0].insertId,
        username: userData.username,
        email: userData.email || '',
        fullName: userData.fullName || '',
        roles: userData.roles,
        isActive: userData.isActive ?? true,
        created_at: new Date().toISOString()
      };
    }
    return null;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

export const updateUser = async (id: number, userData: Partial<CreateUserData>): Promise<User | null> => {
  try {
    await executeQuery('UPDATE users', [userData, id]);
    
    // Simulate fetching the updated user
    const users = await getUsers();
    return users.find(user => user.id === id) || null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const result = await executeQuery('DELETE FROM users', [id]);
    return result && result.length > 0 && result[0].affectedRows > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

// Show API functions
export const getShows = async (): Promise<Show[]> => {
  try {
    return await executeQuery('SELECT * FROM shows');
  } catch (error) {
    console.error('Error fetching shows:', error);
    return [];
  }
};

export const createShow = async (show: Omit<Show, 'id' | 'created_at' | 'updated_at'>): Promise<Show | null> => {
  try {
    const result = await executeQuery('INSERT INTO shows', [show]);
    if (result && result.length > 0 && result[0].insertId) {
      return {
        ...show,
        id: result[0].insertId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    return null;
  } catch (error) {
    console.error('Error creating show:', error);
    return null;
  }
};

export const updateShow = async (id: number, show: Partial<Show>): Promise<Show | null> => {
  try {
    await executeQuery('UPDATE shows', [show, id]);
    
    // Simulate fetching the updated show
    const shows = await getShows();
    return shows.find(s => s.id === id) || null;
  } catch (error) {
    console.error('Error updating show:', error);
    return null;
  }
};

export const deleteShow = async (id: number): Promise<boolean> => {
  try {
    const result = await executeQuery('DELETE FROM shows', [id]);
    return result && result.length > 0 && result[0].affectedRows > 0;
  } catch (error) {
    console.error('Error deleting show:', error);
    return false;
  }
};

// Schedule API functions
export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    return await executeQuery('SELECT * FROM schedule');
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
};

export const createScheduleItem = async (item: Omit<ScheduleItem, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduleItem | null> => {
  try {
    const result = await executeQuery('INSERT INTO schedule', [item]);
    if (result && result.length > 0 && result[0].insertId) {
      return {
        ...item,
        id: result[0].insertId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    return null;
  } catch (error) {
    console.error('Error creating schedule item:', error);
    return null;
  }
};

export const updateScheduleItem = async (id: number, item: Partial<ScheduleItem>): Promise<ScheduleItem | null> => {
  try {
    await executeQuery('UPDATE schedule', [item, id]);
    
    // Simulate fetching the updated schedule item
    const schedule = await getSchedule();
    return schedule.find(s => s.id === id) || null;
  } catch (error) {
    console.error('Error updating schedule item:', error);
    return null;
  }
};

export const deleteScheduleItem = async (id: number): Promise<boolean> => {
  try {
    const result = await executeQuery('DELETE FROM schedule', [id]);
    return result && result.length > 0 && result[0].affectedRows > 0;
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    return false;
  }
};
