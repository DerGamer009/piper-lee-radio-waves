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

interface CreateUserData {
  username: string;
  fullName: string;
  email: string;
  password?: string;
  roles: string[];
  isActive: boolean;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

// Import the executeQuery function and define the DbQueryResult interface
import { executeQuery } from '@/services/dbService';

// Define the DbQueryResult interface if it's not exported from dbService
interface DbQueryResult {
  insertId?: number;
  affectedRows?: number;
}

// API Base URL
const API_BASE_URL = 'http://localhost:3001';

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'API request failed' }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json().catch(() => null);
};

// Authentication service
export const login = async (username: string, password: string): Promise<LoginResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json().catch(() => null);
    
    if (!response.ok || !data) {
      throw new Error(data?.error || 'Login failed');
    }
    
    // Store user data in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
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
  
  return requiredRoles.some(role => user.roles.includes(role));
};

// User API functions
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiRequest('/api/users');
    return response.map((user: any) => ({
      ...user,
      roles: typeof user.roles === 'string' ? user.roles.split(',') : user.roles,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export async function createNewUser(userData: CreateUserData): Promise<User> {
  if (!userData.password) {
    throw new Error('Password is required for new users');
  }

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export const updateUser = async (userId: number, userData: Partial<CreateUserData>): Promise<User> => {
  try {
    const response = await apiRequest(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return {
      ...response,
      roles: typeof response.roles === 'string' ? response.roles.split(',') : response.roles,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await apiRequest(`/api/users/${userId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Show API functions
export const getShows = async (): Promise<Show[]> => {
  try {
    // This is a mock implementation - in a real app, call the API
    const results = await import('@/services/dbService').then(
      module => module.executeQuery('SELECT * FROM shows')
    );
    return Array.isArray(results) ? results as Show[] : [];
  } catch (error) {
    console.error('Error fetching shows:', error);
    return [];
  }
};

export const createShow = async (show: Omit<Show, 'id' | 'created_at' | 'updated_at'>): Promise<Show | null> => {
  try {
    const result = await executeQuery('INSERT INTO shows', [show]) as DbQueryResult[];
    if (result && result.length > 0 && result[0]?.insertId) {
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
    const result = await executeQuery('DELETE FROM shows', [id]) as DbQueryResult[];
    return result && result.length > 0 && !!result[0]?.affectedRows;
  } catch (error) {
    console.error('Error deleting show:', error);
    return false;
  }
};

// Schedule API functions
export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    const results = await executeQuery('SELECT * FROM schedule');
    return Array.isArray(results) ? results as ScheduleItem[] : [];
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
};

export const createScheduleItem = async (item: Omit<ScheduleItem, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduleItem | null> => {
  try {
    const result = await executeQuery('INSERT INTO schedule', [item]) as DbQueryResult[];
    if (result && result.length > 0 && result[0]?.insertId) {
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
    const result = await executeQuery('DELETE FROM schedule', [id]) as DbQueryResult[];
    return result && result.length > 0 && !!result[0]?.affectedRows;
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    return false;
  }
};
