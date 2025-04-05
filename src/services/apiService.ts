
// This file contains the API service functions that would interact with the backend
// In a real implementation, these would make HTTP requests to your backend API

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
}

interface Show {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  createdBy: number;
}

interface ScheduleItem {
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

// Mock data for development
const mockUsers: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@radiostation.de",
    fullName: "Admin User",
    roles: ["admin"],
    isActive: true
  },
  {
    id: 2,
    username: "moderator1",
    email: "mod1@radiostation.de",
    fullName: "Moderator Eins",
    roles: ["moderator"],
    isActive: true
  },
  {
    id: 3,
    username: "user1",
    email: "user1@example.com",
    fullName: "Regular User",
    roles: ["user"],
    isActive: false
  }
];

const mockShows: Show[] = [
  {
    id: 1,
    title: "Morgenshow",
    description: "Starte deinen Tag mit den besten Hits und aktuellen News",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    createdBy: 1
  },
  {
    id: 2,
    title: "Musikexpress",
    description: "Die neuesten Hits aus den Charts",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    createdBy: 2
  },
  {
    id: 3,
    title: "Abendtalk",
    description: "Interessante Gespräche mit spannenden Gästen",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    createdBy: 1
  }
];

const mockSchedule: ScheduleItem[] = [
  {
    id: 1,
    showId: 1,
    showTitle: "Morgenshow",
    dayOfWeek: "Montag",
    startTime: "08:00:00",
    endTime: "10:00:00",
    hostName: "Moderator Eins",
    isRecurring: true
  },
  {
    id: 2,
    showId: 2,
    showTitle: "Musikexpress",
    dayOfWeek: "Montag",
    startTime: "14:00:00",
    endTime: "16:00:00",
    hostName: "DJ Cool",
    isRecurring: true
  },
  {
    id: 3,
    showId: 3,
    showTitle: "Abendtalk",
    dayOfWeek: "Dienstag",
    startTime: "19:00:00",
    endTime: "21:00:00",
    hostName: "Talkmaster Tim",
    isRecurring: true
  },
  {
    id: 4,
    showId: 1,
    showTitle: "Morgenshow",
    dayOfWeek: "Mittwoch",
    startTime: "08:00:00",
    endTime: "10:00:00",
    hostName: "Moderator Eins",
    isRecurring: true
  }
];

export const login = async (username: string, password: string): Promise<{ token: string; user: User } | null> => {
  console.log('Login attempt:', username);
  // Mock login - would connect to actual backend
  const user = mockUsers.find(u => u.username === username);
  if (user) {
    return {
      token: "mock-jwt-token",
      user
    };
  }
  return null;
};

export const getUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockUsers];
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User | null> => {
  console.log('Create user:', user);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would be a POST request to your backend
  const newUser = {
    ...user,
    id: mockUsers.length + 1,
  };
  
  // Update mock data
  mockUsers.push(newUser as User);
  
  return newUser as User;
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User | null> => {
  console.log('Update user:', id, user);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find and update the user
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...user };
    return mockUsers[userIndex];
  }
  
  return null;
};

export const deleteUser = async (id: number): Promise<boolean> => {
  console.log('Delete user:', id);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find and remove the user
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    mockUsers.splice(userIndex, 1);
    return true;
  }
  
  return false;
};

export const getShows = async (): Promise<Show[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return [...mockShows];
};

export const getSchedule = async (): Promise<ScheduleItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...mockSchedule];
};

export const createShow = async (show: Omit<Show, 'id' | 'createdBy'>): Promise<Show | null> => {
  console.log('Create show:', show);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would be a POST request to your backend
  const newShow = {
    ...show,
    id: mockShows.length + 1,
    createdBy: 1, // Default to admin for mock data
  };
  
  // Update mock data
  mockShows.push(newShow);
  
  return newShow;
};

export const updateShow = async (id: number, show: Partial<Show>): Promise<Show | null> => {
  console.log('Update show:', id, show);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find and update the show
  const showIndex = mockShows.findIndex(s => s.id === id);
  if (showIndex !== -1) {
    mockShows[showIndex] = { ...mockShows[showIndex], ...show };
    return mockShows[showIndex];
  }
  
  return null;
};

export const deleteShow = async (id: number): Promise<boolean> => {
  console.log('Delete show:', id);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find and remove the show
  const showIndex = mockShows.findIndex(s => s.id === id);
  if (showIndex !== -1) {
    mockShows.splice(showIndex, 1);
    return true;
  }
  
  return false;
};

export const updateSchedule = async (id: number, schedule: Partial<ScheduleItem>): Promise<ScheduleItem | null> => {
  console.log('Update schedule:', id, schedule);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find and update the schedule item
  const scheduleIndex = mockSchedule.findIndex(s => s.id === id);
  if (scheduleIndex !== -1) {
    mockSchedule[scheduleIndex] = { ...mockSchedule[scheduleIndex], ...schedule };
    return mockSchedule[scheduleIndex];
  }
  
  return null;
};

export const createScheduleItem = async (schedule: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem | null> => {
  console.log('Create schedule item:', schedule);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would be a POST request to your backend
  const newScheduleItem = {
    ...schedule,
    id: mockSchedule.length + 1,
  };
  
  // Update mock data
  mockSchedule.push(newScheduleItem);
  
  return newScheduleItem;
};

export const deleteScheduleItem = async (id: number): Promise<boolean> => {
  console.log('Delete schedule item:', id);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find and remove the schedule item
  const scheduleIndex = mockSchedule.findIndex(s => s.id === id);
  if (scheduleIndex !== -1) {
    mockSchedule.splice(scheduleIndex, 1);
    return true;
  }
  
  return false;
};
