
import { executeQuery, getUsers, getUserById, createUser, updateUser, deleteUser,
         getShows, getShowById, createShow, updateShow, deleteShow,
         getSchedule, getScheduleById, createScheduleItem as dbCreateScheduleItem, 
         updateScheduleItem, deleteScheduleItem, authenticateUser } from './dbService';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  roles: string;
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

export interface ScheduleItem {
  id: number;
  show_id: number;
  showId?: number;
  day_of_week: string;
  dayOfWeek?: string;
  start_time: string;
  startTime?: string;
  end_time: string;
  endTime?: string;
  host_id?: number;
  hostId?: number;
  host_name?: string;
  hostName?: string;
  is_recurring: boolean;
  isRecurring?: boolean;
  show_title?: string;
  show_description?: string;
}

// Mock authentication service
// In a real app, this would verify with the backend
// For now, we mock authentication with hardcoded credentials
export const login = async (username: string, password: string) => {
  try {
    // In production, the password should be hashed on the client side before sending
    // or the authentication should happen via a secure protocol
    const passwordHash = '$2y$10$xLRsIkyaCv5g.QVMn9KJTOELcB9QLsRXpV3Sn1d9S1hcZ6F04Mzx2'; // This is "admin123" for demo
    
    if (username === 'admin' && password === 'admin123') {
      const user = await authenticateUser(username, passwordHash);
      if (user) {
        // Store user info in localStorage (in a real app, use secure HTTP-only cookies)
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
    }
    
    throw new Error('Falscher Benutzername oder Passwort');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    return null;
  }
};

export const hasRole = (requiredRoles: string[]) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const userRoles = user.roles.split(',');
  return requiredRoles.some(role => userRoles.includes(role));
};

// User API functions
export const fetchUsers = async (): Promise<User[]> => {
  try {
    return await getUsers() as User[];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserById = async (id: number): Promise<User> => {
  try {
    return await getUserById(id) as User;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

export const createNewUser = async (userData: Partial<User>): Promise<number> => {
  try {
    return await createUser(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUserData = async (id: number, userData: Partial<User>): Promise<boolean> => {
  try {
    return await updateUser(id, userData);
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUserById = async (id: number): Promise<boolean> => {
  try {
    await deleteUser(id);
    return true;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

// Show API functions
export const fetchShows = async (): Promise<Show[]> => {
  try {
    return await getShows() as Show[];
  } catch (error) {
    console.error('Error fetching shows:', error);
    throw error;
  }
};

export const fetchShowById = async (id: number): Promise<Show> => {
  try {
    return await getShowById(id) as Show;
  } catch (error) {
    console.error(`Error fetching show ${id}:`, error);
    throw error;
  }
};

export const createNewShow = async (showData: Partial<Show>): Promise<number> => {
  try {
    const user = getCurrentUser();
    showData.created_by = user ? user.id : null;
    
    return await createShow(showData);
  } catch (error) {
    console.error('Error creating show:', error);
    throw error;
  }
};

export const updateShowData = async (id: number, showData: Partial<Show>): Promise<boolean> => {
  try {
    return await updateShow(id, showData);
  } catch (error) {
    console.error(`Error updating show ${id}:`, error);
    throw error;
  }
};

export const deleteShowById = async (id: number): Promise<boolean> => {
  try {
    await deleteShow(id);
    return true;
  } catch (error) {
    console.error(`Error deleting show ${id}:`, error);
    throw error;
  }
};

// Schedule API functions
export const fetchSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    const scheduleData = await getSchedule() as any[];
    
    // Transform data to match the expected format
    return scheduleData.map(item => ({
      id: item.id,
      show_id: item.show_id,
      showId: item.show_id,
      day_of_week: item.day_of_week,
      dayOfWeek: item.day_of_week,
      start_time: item.start_time,
      startTime: item.start_time,
      end_time: item.end_time,
      endTime: item.end_time,
      host_id: item.host_id,
      hostId: item.host_id,
      host_name: item.host_name,
      hostName: item.host_name,
      is_recurring: item.is_recurring === 1,
      isRecurring: item.is_recurring === 1,
      show_title: item.show_title,
      show_description: item.show_description
    }));
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

export const fetchScheduleById = async (id: number): Promise<ScheduleItem> => {
  try {
    const item = await getScheduleById(id) as any;
    
    return {
      id: item.id,
      show_id: item.show_id,
      showId: item.show_id,
      day_of_week: item.day_of_week,
      dayOfWeek: item.day_of_week,
      start_time: item.start_time,
      startTime: item.start_time,
      end_time: item.end_time,
      endTime: item.end_time,
      host_id: item.host_id,
      hostId: item.host_id,
      host_name: item.host_name,
      hostName: item.host_name,
      is_recurring: item.is_recurring === 1,
      isRecurring: item.is_recurring === 1,
      show_title: item.show_title
    };
  } catch (error) {
    console.error(`Error fetching schedule item ${id}:`, error);
    throw error;
  }
};

export const createScheduleItem = async (scheduleData: Partial<ScheduleItem>): Promise<number> => {
  try {
    // Transform data to match the database schema
    const dbData = {
      showId: scheduleData.showId || scheduleData.show_id,
      dayOfWeek: scheduleData.dayOfWeek || scheduleData.day_of_week,
      startTime: scheduleData.startTime || scheduleData.start_time,
      endTime: scheduleData.endTime || scheduleData.end_time,
      hostId: scheduleData.hostId || scheduleData.host_id,
      isRecurring: scheduleData.isRecurring !== undefined ? scheduleData.isRecurring : scheduleData.is_recurring
    };
    
    return await dbCreateScheduleItem(dbData);
  } catch (error) {
    console.error('Error creating schedule item:', error);
    throw error;
  }
};

export const updateSchedule = async (id: number, scheduleData: Partial<ScheduleItem>): Promise<boolean> => {
  try {
    // Transform data to match the database schema
    const dbData = {
      showId: scheduleData.showId || scheduleData.show_id,
      dayOfWeek: scheduleData.dayOfWeek || scheduleData.day_of_week,
      startTime: scheduleData.startTime || scheduleData.start_time,
      endTime: scheduleData.endTime || scheduleData.end_time,
      hostId: scheduleData.hostId || scheduleData.host_id,
      isRecurring: scheduleData.isRecurring !== undefined ? scheduleData.isRecurring : scheduleData.is_recurring
    };
    
    return await updateScheduleItem(id, dbData);
  } catch (error) {
    console.error(`Error updating schedule item ${id}:`, error);
    throw error;
  }
};

export const deleteSchedule = async (id: number): Promise<boolean> => {
  try {
    await deleteScheduleItem(id);
    return true;
  } catch (error) {
    console.error(`Error deleting schedule item ${id}:`, error);
    throw error;
  }
};
