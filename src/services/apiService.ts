
export type StatusUpdate = {
  id: number;
  system_name: string;
  status: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type StatusItemInput = {
  system_name: string;
  status: string;
  description?: string;
};

export type BackupInfo = {
  name: string;
  created_at: string;
  size: string;
};

export type User = {
  id: string;
  username: string;
  fullName?: string;
  email?: string;
  roles?: string | string[];
  created_at?: string;
  updated_at?: string;
  isActive?: boolean;
};

export type CreateUserData = {
  username: string;
  password: string;
  email?: string;
  fullName?: string;
  roles?: string[];
  isActive?: boolean;
};

export type Show = {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  creator_name?: string;
};

export type ScheduleItem = {
  id: string;
  show_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  host_id?: string;
  host_name?: string;
  is_recurring: boolean;
  created_at?: string;
  updated_at?: string;
  show?: Show;
  show_title?: string;
};

// Use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Status Updates API functions
export const getStatusUpdates = async (): Promise<StatusUpdate[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/status-updates`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch status updates:", error);
    throw error;
  }
};

export const createStatusItem = async (item: StatusItemInput): Promise<StatusUpdate> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/status-updates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to create status item:", error);
    throw error;
  }
};

export const updateStatusItem = async (id: number, item: StatusItemInput): Promise<StatusUpdate> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/status-updates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to update status item:", error);
    throw error;
  }
};

export const deleteStatusItem = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/status-updates/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to delete status item:", error);
    throw error;
  }
};

// Backup API functions
export const createBackup = async (backupName: string): Promise<void> => {
  try {
    const response = await fetch('/api/create-backup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        backupName,
        path: '/piper-lee/backups/' 
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating backup:', error);
    throw error;
  }
};

export const getBackups = async (): Promise<BackupInfo[]> => {
  try {
    const response = await fetch('/api/backups');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching backups:', error);
    throw error;
  }
};

export const downloadBackup = async (backupName: string): Promise<Blob> => {
  try {
    const response = await fetch(`/api/backups/${backupName}/download`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error downloading backup:', error);
    throw error;
  }
};

export const restoreBackup = async (backupName: string): Promise<void> => {
  try {
    const response = await fetch(`/api/backups/${backupName}/restore`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error restoring backup:', error);
    throw error;
  }
};

// User Management API functions
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const login = async (username: string, password: string): Promise<{user: User, session?: any}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to login:", error);
    throw error;
  }
};

export const createNewUser = async (userData: CreateUserData): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<CreateUserData>): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

// Show and Schedule API functions
export const getShows = async (): Promise<Show[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/shows`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch shows:", error);
    throw error;
  }
};

export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/schedule`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
    throw error;
  }
};

export const createScheduleItem = async (scheduleData: Omit<ScheduleItem, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduleItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to create schedule item:", error);
    throw error;
  }
};

export const updateScheduleItem = async (id: string, scheduleData: Partial<ScheduleItem>): Promise<ScheduleItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/schedule/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to update schedule item:", error);
    throw error;
  }
};

export const deleteScheduleItem = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/schedule/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to delete schedule item:", error);
    throw error;
  }
};
