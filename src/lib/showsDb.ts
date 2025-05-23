
import { executeQuery } from "../services/dbService";

export interface Show {
  id: string; // Changed from number to string to match Supabase UUID format
  title: string;
  description: string;
  image_url?: string;
  created_by?: string; // Changed from number to string
  created_at?: string;
  updated_at?: string;
  creator_name?: string;
}

export interface ScheduleItem {
  id: string; // Changed from number to string
  show_id: string; // Changed from number to string
  day_of_week: string;
  start_time: string;
  end_time: string;
  host_id?: string; // Changed from number to string
  is_recurring: boolean;
  created_at?: string;
  updated_at?: string;
  host_name?: string;
  show_title?: string;
  show_description?: string;
}

export const getShows = async (): Promise<Show[]> => {
  try {
    // Use type assertion to help TypeScript understand the return type
    const shows = await executeQuery(`
      SELECT s.*, u.fullName as creator_name
      FROM shows s
      LEFT JOIN users u ON s.created_by = u.id
    `) as unknown as Show[];
    
    return shows;
  } catch (error) {
    console.error('Error fetching shows:', error);
    return [];
  }
};

export const createShow = async (show: Omit<Show, 'id' | 'created_at' | 'updated_at'>): Promise<Show | null> => {
  try {
    const result = await executeQuery(`INSERT INTO shows`, [show]);
    
    // Verwende sicheres Zugriffsmuster für insertId
    const newShowId = typeof result[0] === 'object' && result[0] !== null && 'insertId' in result[0] 
      ? result[0].insertId 
      : null;
    
    if (newShowId === null) {
      throw new Error("Failed to get inserted ID");
    }
    
    // Use type assertion to help TypeScript understand the return type
    const newShow = await executeQuery(`SELECT * FROM shows WHERE id = ?`, [newShowId]) as unknown as Show[];
    return newShow[0] || null;
  } catch (error) {
    console.error('Error creating show:', error);
    return null;
  }
};

export const updateShow = async (id: string, show: Partial<Show>): Promise<Show | null> => {
  try {
    await executeQuery(`UPDATE shows`, [show, id]);
    
    // Use type assertion to help TypeScript understand the return type
    const updatedShow = await executeQuery(`SELECT * FROM shows WHERE id = ?`, [id]) as unknown as Show[];
    return updatedShow[0] || null;
  } catch (error) {
    console.error('Error updating show:', error);
    return null;
  }
};

export const deleteShow = async (id: string): Promise<boolean> => {
  try {
    // Delete related schedule items first
    await executeQuery(`DELETE FROM schedule WHERE show_id = ?`, [id]);
    
    // Then delete the show
    const result = await executeQuery(`DELETE FROM shows WHERE id = ?`, [id]);
    
    // Verwende sicheres Zugriffsmuster für affectedRows
    const affectedRows = typeof result[0] === 'object' && result[0] !== null && 'affectedRows' in result[0] 
      ? result[0].affectedRows 
      : 0;
    
    return affectedRows > 0;
  } catch (error) {
    console.error('Error deleting show:', error);
    return false;
  }
};

export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    // Use type assertion to help TypeScript understand the return type
    const schedule = await executeQuery(`
      SELECT s.*, sh.title as show_title, sh.description as show_description,
             u.fullName as host_name
      FROM schedule s
      JOIN shows sh ON s.show_id = sh.id
      LEFT JOIN users u ON s.host_id = u.id
      ORDER BY 
        CASE s.day_of_week
          WHEN 'Montag' THEN 1
          WHEN 'Dienstag' THEN 2
          WHEN 'Mittwoch' THEN 3
          WHEN 'Donnerstag' THEN 4
          WHEN 'Freitag' THEN 5
          WHEN 'Samstag' THEN 6
          WHEN 'Sonntag' THEN 7
        END, s.start_time
    `) as unknown as (ScheduleItem & { show_title?: string; show_description?: string; host_name?: string; })[];
    
    return schedule;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
};

export const createScheduleItem = async (item: Omit<ScheduleItem, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduleItem | null> => {
  try {
    const result = await executeQuery(`INSERT INTO schedule`, [item]);
    
    // Verwende sicheres Zugriffsmuster für insertId
    const newItemId = typeof result[0] === 'object' && result[0] !== null && 'insertId' in result[0] 
      ? result[0].insertId 
      : null;
    
    if (newItemId === null) {
      throw new Error("Failed to get inserted ID");
    }
    
    // Use type assertion to help TypeScript understand the return type
    const newItem = await executeQuery(`SELECT * FROM schedule WHERE id = ?`, [newItemId]) as unknown as ScheduleItem[];
    return newItem[0] || null;
  } catch (error) {
    console.error('Error creating schedule item:', error);
    return null;
  }
};

export const updateScheduleItem = async (id: string, item: Partial<ScheduleItem>): Promise<ScheduleItem | null> => {
  try {
    await executeQuery(`UPDATE schedule`, [item, id]);
    
    // Use type assertion to help TypeScript understand the return type
    const updatedItem = await executeQuery(`SELECT * FROM schedule WHERE id = ?`, [id]) as unknown as ScheduleItem[];
    return updatedItem[0] || null;
  } catch (error) {
    console.error('Error updating schedule item:', error);
    return null;
  }
};

export const deleteScheduleItem = async (id: string): Promise<boolean> => {
  try {
    const result = await executeQuery(`DELETE FROM schedule WHERE id = ?`, [id]);
    
    // Verwende sicheres Zugriffsmuster für affectedRows
    const affectedRows = typeof result[0] === 'object' && result[0] !== null && 'affectedRows' in result[0] 
      ? result[0].affectedRows 
      : 0;
    
    return affectedRows > 0;
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    return false;
  }
};

export default {
  getShows,
  createShow,
  updateShow,
  deleteShow,
  getSchedule,
  createScheduleItem,
  updateScheduleItem,
  deleteScheduleItem
};
