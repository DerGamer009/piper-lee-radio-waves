
// This file contains the API service functions that interact with the backend
import { 
  getDbUsers, createDbUser, getDbShows, 
  getDbSchedule, createDbScheduleItem 
} from './dbService';

// Define types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
}

export interface Show {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  createdBy: number;
}

export interface ScheduleItem {
  id: number;
  showId: number;
  showTitle: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  hostId?: number;
  hostName?: string;
  isRecurring: boolean;
}

// User APIs
export const login = async (username: string, password: string): Promise<{ token: string; user: User } | null> => {
  console.log('Login attempt:', username);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get users from mock DB
  const users = await getDbUsers();
  const user = users.find(u => u.username === username);
  
  if (user) {
    return {
      token: "mock-jwt-token",
      user
    };
  }
  return null;
};

export const getUsers = async (): Promise<User[]> => {
  try {
    return await getDbUsers();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User | null> => {
  console.log('Create user:', user);
  
  try {
    return await createDbUser(user);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User | null> => {
  console.log('Update user:', id, user);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get users and update
  const users = await getDbUsers();
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex !== -1) {
    const updatedUser = { ...users[userIndex], ...user };
    users[userIndex] = updatedUser;
    return updatedUser;
  }
  
  return null;
};

export const deleteUser = async (id: number): Promise<boolean> => {
  console.log('Delete user:', id);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // This would actually call a backend API to delete the user
  // For now we'll just simulate success
  return true;
};

// Show APIs
export const getShows = async (): Promise<Show[]> => {
  try {
    return await getDbShows();
  } catch (error) {
    console.error('Error fetching shows:', error);
    throw error;
  }
};

export const createShow = async (show: Omit<Show, 'id' | 'createdBy'>): Promise<Show | null> => {
  console.log('Create show:', show);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would be an API call to the backend
  // For now, we'll just return a mock show
  return {
    ...show,
    id: Math.floor(Math.random() * 1000),
    createdBy: 1,
  };
};

export const updateShow = async (id: number, show: Partial<Show>): Promise<Show | null> => {
  console.log('Update show:', id, show);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would update the show in the database
  // For now, we'll just return the updated show
  return {
    id,
    title: show.title || 'Unknown',
    description: show.description || '',
    imageUrl: show.imageUrl,
    createdBy: 1,
  };
};

export const deleteShow = async (id: number): Promise<boolean> => {
  console.log('Delete show:', id);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would delete the show from the database
  // For now, we'll just return success
  return true;
};

// Schedule APIs
export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    return await getDbSchedule();
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

export const createScheduleItem = async (schedule: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem | null> => {
  console.log('Create schedule item:', schedule);
  
  try {
    // Ensure we have the required fields
    if (!schedule.showId || !schedule.dayOfWeek || !schedule.startTime || !schedule.endTime) {
      throw new Error('Missing required schedule fields');
    }
    
    return await createDbScheduleItem({
      showId: schedule.showId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      hostId: schedule.hostId,
      isRecurring: schedule.isRecurring
    });
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

export const updateSchedule = async (id: number, schedule: Partial<ScheduleItem>): Promise<ScheduleItem | null> => {
  console.log('Update schedule:', id, schedule);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would update the schedule in the database
  // For now, we'll just return the updated schedule
  return {
    id,
    showId: schedule.showId || 1,
    showTitle: schedule.showTitle || 'Unknown',
    dayOfWeek: schedule.dayOfWeek || 'Montag',
    startTime: schedule.startTime || '00:00:00',
    endTime: schedule.endTime || '00:00:00',
    hostName: schedule.hostName,
    isRecurring: schedule.isRecurring !== undefined ? schedule.isRecurring : true,
  };
};

export const deleteScheduleItem = async (id: number): Promise<boolean> => {
  console.log('Delete schedule item:', id);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would delete the schedule from the database
  // For now, we'll just return success
  return true;
};
