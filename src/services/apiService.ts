
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

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
