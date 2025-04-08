import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize database
const dbPromise = open({
  filename: './shows.db',
  driver: sqlite3.Database
});

// Create tables
async function initializeDatabase() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS shows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      show_id INTEGER NOT NULL,
      day_of_week INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      host_id INTEGER,
      is_recurring BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (show_id) REFERENCES shows(id),
      FOREIGN KEY (host_id) REFERENCES users(id)
    )
  `);
}

initializeDatabase();

export interface Show {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

export interface ScheduleItem {
  id: number;
  show_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  host_id?: number;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

// Show functions
export async function getShows(): Promise<Show[]> {
  try {
    const db = await dbPromise;
    return await db.all(`
      SELECT s.*, u.username as creator_name 
      FROM shows s
      LEFT JOIN users u ON s.created_by = u.id
    `);
  } catch (error) {
    console.error('Error fetching shows:', error);
    return [];
  }
}

export async function createShow(show: Omit<Show, 'id' | 'created_at' | 'updated_at'>): Promise<Show | null> {
  try {
    const db = await dbPromise;
    const result = await db.run(
      'INSERT INTO shows (title, description, image_url, created_by) VALUES (?, ?, ?, ?)',
      [show.title, show.description, show.image_url, show.created_by]
    );
    return await db.get('SELECT * FROM shows WHERE id = ?', result.lastID);
  } catch (error) {
    console.error('Error creating show:', error);
    return null;
  }
}

export async function updateShow(id: number, show: Partial<Show>): Promise<Show | null> {
  try {
    const db = await dbPromise;
    const updates = [];
    const values = [];

    if (show.title) {
      updates.push('title = ?');
      values.push(show.title);
    }
    if (show.description !== undefined) {
      updates.push('description = ?');
      values.push(show.description);
    }
    if (show.image_url !== undefined) {
      updates.push('image_url = ?');
      values.push(show.image_url);
    }
    if (show.created_by !== undefined) {
      updates.push('created_by = ?');
      values.push(show.created_by);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await db.run(
      `UPDATE shows SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return await db.get('SELECT * FROM shows WHERE id = ?', id);
  } catch (error) {
    console.error('Error updating show:', error);
    return null;
  }
}

export async function deleteShow(id: number): Promise<boolean> {
  try {
    const db = await dbPromise;
    await db.run('DELETE FROM schedule WHERE show_id = ?', id);
    await db.run('DELETE FROM shows WHERE id = ?', id);
    return true;
  } catch (error) {
    console.error('Error deleting show:', error);
    return false;
  }
}

// Schedule functions
export async function getSchedule(): Promise<ScheduleItem[]> {
  try {
    const db = await dbPromise;
    return await db.all(`
      SELECT s.*, sh.title as show_title, u.username as host_name 
      FROM schedule s
      LEFT JOIN shows sh ON s.show_id = sh.id
      LEFT JOIN users u ON s.host_id = u.id
    `);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
}

export async function createScheduleItem(item: Omit<ScheduleItem, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduleItem | null> {
  try {
    const db = await dbPromise;
    const result = await db.run(
      'INSERT INTO schedule (show_id, day_of_week, start_time, end_time, host_id, is_recurring) VALUES (?, ?, ?, ?, ?, ?)',
      [item.show_id, item.day_of_week, item.start_time, item.end_time, item.host_id, item.is_recurring]
    );
    return await db.get('SELECT * FROM schedule WHERE id = ?', result.lastID);
  } catch (error) {
    console.error('Error creating schedule item:', error);
    return null;
  }
}

export async function updateScheduleItem(id: number, item: Partial<ScheduleItem>): Promise<ScheduleItem | null> {
  try {
    const db = await dbPromise;
    const updates = [];
    const values = [];

    if (item.show_id) {
      updates.push('show_id = ?');
      values.push(item.show_id);
    }
    if (item.day_of_week !== undefined) {
      updates.push('day_of_week = ?');
      values.push(item.day_of_week);
    }
    if (item.start_time) {
      updates.push('start_time = ?');
      values.push(item.start_time);
    }
    if (item.end_time) {
      updates.push('end_time = ?');
      values.push(item.end_time);
    }
    if (item.host_id !== undefined) {
      updates.push('host_id = ?');
      values.push(item.host_id);
    }
    if (item.is_recurring !== undefined) {
      updates.push('is_recurring = ?');
      values.push(item.is_recurring);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await db.run(
      `UPDATE schedule SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return await db.get('SELECT * FROM schedule WHERE id = ?', id);
  } catch (error) {
    console.error('Error updating schedule item:', error);
    return null;
  }
}

export async function deleteScheduleItem(id: number): Promise<boolean> {
  try {
    const db = await dbPromise;
    await db.run('DELETE FROM schedule WHERE id = ?', id);
    return true;
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    return false;
  }
} 