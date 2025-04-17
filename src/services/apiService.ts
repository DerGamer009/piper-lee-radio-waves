<<<<<<< Updated upstream

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
=======
import axios from 'axios';
import { getShows as dbGetShows, createShow as dbCreateShow, updateShow as dbUpdateShow, deleteShow as dbDeleteShow, 
         getSchedule as dbGetSchedule, createScheduleItem as dbCreateScheduleItem, updateScheduleItem as dbUpdateScheduleItem, 
         deleteScheduleItem as dbDeleteScheduleItem, type Show, type ScheduleItem } from '@/lib/showsDb';

const API_URL = 'http://localhost:3001/api';

// Types
export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
>>>>>>> Stashed changes
}

export interface LoginResponse {
  user: User;
}

<<<<<<< Updated upstream
// Import the executeQuery function and define the DbQueryResult interface
import { executeQuery } from '@/services/dbService';

// Define the DbQueryResult interface if it's not exported from dbService
interface DbQueryResult {
  insertId?: number;
  affectedRows?: number;
}

// API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Helper to make API requests
const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'API request failed');
  }
  
  return response.json();
};

// Authentication service
export const login = async (username: string, password: string): Promise<LoginResponse | null> => {
  try {
    const response = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    // Store user data in localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
=======
export interface CreateUserData {
  username: string;
  password: string;
  fullName: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

export interface Show {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleItem {
  id: number;
  showId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  hostId: number;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

// Authentication
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
>>>>>>> Stashed changes
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

// Users
export const getUsers = async (): Promise<User[]> => {
  try {
<<<<<<< Updated upstream
    return await apiRequest('/users');
=======
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const createNewUser = async (userData: CreateUserData): Promise<User> => {
  try {
<<<<<<< Updated upstream
    return await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
=======
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: number, userData: Partial<CreateUserData>): Promise<User> => {
  try {
<<<<<<< Updated upstream
    return await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
=======
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
<<<<<<< Updated upstream
    await apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
    return true;
=======
    await axios.delete(`${API_URL}/users/${id}`);
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Shows
export const getShows = async (): Promise<Show[]> => {
  try {
<<<<<<< Updated upstream
    // This is a mock implementation - in a real app, call the API
    const results = await import('@/services/dbService').then(
      module => module.executeQuery('SELECT * FROM shows')
    );
    return Array.isArray(results) ? results as Show[] : [];
=======
    const response = await axios.get(`${API_URL}/shows`);
    return response.data;
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error getting shows:', error);
    throw error;
  }
};

export const createShow = async (showData: Omit<Show, 'id' | 'createdAt' | 'updatedAt'>): Promise<Show> => {
  try {
<<<<<<< Updated upstream
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
=======
    const response = await axios.post(`${API_URL}/shows`, showData);
    return response.data;
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error creating show:', error);
    throw error;
  }
};

export const updateShow = async (id: number, showData: Partial<Show>): Promise<Show> => {
  try {
<<<<<<< Updated upstream
    await executeQuery('UPDATE shows', [show, id]);
    
    // Simulate fetching the updated show
    const shows = await getShows();
    return shows.find(s => s.id === id) || null;
=======
    const response = await axios.put(`${API_URL}/shows/${id}`, showData);
    return response.data;
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error updating show:', error);
    throw error;
  }
};

export const deleteShow = async (id: number): Promise<void> => {
  try {
<<<<<<< Updated upstream
    const result = await executeQuery('DELETE FROM shows', [id]) as DbQueryResult[];
    return result && result.length > 0 && !!result[0]?.affectedRows;
=======
    await axios.delete(`${API_URL}/shows/${id}`);
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error deleting show:', error);
    throw error;
  }
};

// Schedule
export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
<<<<<<< Updated upstream
    const results = await executeQuery('SELECT * FROM schedule');
    return Array.isArray(results) ? results as ScheduleItem[] : [];
=======
    const response = await axios.get(`${API_URL}/schedule`);
    return response.data;
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error getting schedule:', error);
    throw error;
  }
};

export const createScheduleItem = async (scheduleData: Omit<ScheduleItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScheduleItem> => {
  try {
<<<<<<< Updated upstream
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
=======
    const response = await axios.post(`${API_URL}/schedule`, scheduleData);
    return response.data;
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error creating schedule item:', error);
    throw error;
  }
};

export const updateScheduleItem = async (id: number, scheduleData: Partial<ScheduleItem>): Promise<ScheduleItem> => {
  try {
<<<<<<< Updated upstream
    await executeQuery('UPDATE schedule', [item, id]);
    
    // Simulate fetching the updated schedule item
    const schedule = await getSchedule();
    return schedule.find(s => s.id === id) || null;
=======
    const response = await axios.put(`${API_URL}/schedule/${id}`, scheduleData);
    return response.data;
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error updating schedule item:', error);
    throw error;
  }
};

export const deleteScheduleItem = async (id: number): Promise<void> => {
  try {
<<<<<<< Updated upstream
    const result = await executeQuery('DELETE FROM schedule', [id]) as DbQueryResult[];
    return result && result.length > 0 && !!result[0]?.affectedRows;
=======
    await axios.delete(`${API_URL}/schedule/${id}`);
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    throw error;
  }
};
