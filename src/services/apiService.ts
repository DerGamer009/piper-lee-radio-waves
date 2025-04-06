import { authenticateUser, getAllUsers, createUser, updateUser as dbUpdateUser, deleteUser as dbDeleteUser, type DBUser, type CreateUserData } from '@/lib/db';
import { getShows as dbGetShows, createShow as dbCreateShow, updateShow as dbUpdateShow, deleteShow as dbDeleteShow, 
         getSchedule as dbGetSchedule, createScheduleItem as dbCreateScheduleItem, updateScheduleItem as dbUpdateScheduleItem, 
         deleteScheduleItem as dbDeleteScheduleItem, type Show, type ScheduleItem } from '@/lib/showsDb';

// Types
export interface User extends Omit<DBUser, 'password'> {}

export { Show, ScheduleItem };

export interface LoginResponse {
  user: User;
  token?: string;
}

// Mock authentication service
export const login = async (username: string, password: string): Promise<LoginResponse | null> => {
  try {
    const user = await authenticateUser(username, password);
    if (!user) return null;

    // In einer echten Anwendung würden Sie hier ein JWT oder ähnliches Token generieren
    const token = 'dummy-token';
    localStorage.setItem('token', token);

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
  
  const userRoles = Array.isArray(user.roles) ? user.roles : user.roles.split(',');
  return requiredRoles.some(role => userRoles.includes(role));
};

// User API functions
export const getUsers = async (): Promise<User[]> => {
  try {
    return getAllUsers();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const createNewUser = async (userData: CreateUserData): Promise<User | null> => {
  try {
    return await createUser(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

export const updateUser = async (id: number, userData: Partial<CreateUserData>): Promise<User | null> => {
  try {
    return await dbUpdateUser(id, userData);
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    return await dbDeleteUser(id);
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

// Show API functions
export const getShows = async (): Promise<Show[]> => {
  try {
    return await dbGetShows();
  } catch (error) {
    console.error('Error fetching shows:', error);
    return [];
  }
};

export const createShow = async (show: Omit<Show, 'id' | 'created_at' | 'updated_at'>): Promise<Show | null> => {
  try {
    return await dbCreateShow(show);
  } catch (error) {
    console.error('Error creating show:', error);
    return null;
  }
};

export const updateShow = async (id: number, show: Partial<Show>): Promise<Show | null> => {
  try {
    return await dbUpdateShow(id, show);
  } catch (error) {
    console.error('Error updating show:', error);
    return null;
  }
};

export const deleteShow = async (id: number): Promise<boolean> => {
  try {
    return await dbDeleteShow(id);
  } catch (error) {
    console.error('Error deleting show:', error);
    return false;
  }
};

// Schedule API functions
export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    return await dbGetSchedule();
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
};

export const createScheduleItem = async (item: Omit<ScheduleItem, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduleItem | null> => {
  try {
    return await dbCreateScheduleItem(item);
  } catch (error) {
    console.error('Error creating schedule item:', error);
    return null;
  }
};

export const updateScheduleItem = async (id: number, item: Partial<ScheduleItem>): Promise<ScheduleItem | null> => {
  try {
    return await dbUpdateScheduleItem(id, item);
  } catch (error) {
    console.error('Error updating schedule item:', error);
    return null;
  }
};

export const deleteScheduleItem = async (id: number): Promise<boolean> => {
  try {
    return await dbDeleteScheduleItem(id);
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    return false;
  }
};
