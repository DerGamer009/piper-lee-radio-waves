import Database from 'better-sqlite3';

const db = new Database('shows.db');

// Initialisiere die Datenbank
db.exec(`
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
    day_of_week TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    host_id INTEGER,
    is_recurring BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (show_id) REFERENCES shows(id),
    FOREIGN KEY (host_id) REFERENCES users(id)
  );
`);

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
  day_of_week: string;
  start_time: string;
  end_time: string;
  host_id?: number;
  is_recurring: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getShows = async (): Promise<Show[]> => {
  try {
    const shows = db.prepare(`
      SELECT s.*, u.fullName as creator_name
      FROM shows s
      LEFT JOIN users u ON s.created_by = u.id
    `).all() as Show[];
    
    return shows;
  } catch (error) {
    console.error('Error fetching shows:', error);
    return [];
  }
};

export const createShow = async (show: Omit<Show, 'id' | 'created_at' | 'updated_at'>): Promise<Show | null> => {
  try {
    const result = db.prepare(`
      INSERT INTO shows (title, description, image_url, created_by)
      VALUES (?, ?, ?, ?)
    `).run(show.title, show.description, show.image_url, show.created_by);

    const newShow = db.prepare('SELECT * FROM shows WHERE id = ?').get(result.lastInsertRowid) as Show;
    return newShow;
  } catch (error) {
    console.error('Error creating show:', error);
    return null;
  }
};

export const updateShow = async (id: number, show: Partial<Show>): Promise<Show | null> => {
  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (show.title !== undefined) {
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

    const query = `UPDATE shows SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...values);

    const updatedShow = db.prepare('SELECT * FROM shows WHERE id = ?').get(id) as Show;
    return updatedShow;
  } catch (error) {
    console.error('Error updating show:', error);
    return null;
  }
};

export const deleteShow = async (id: number): Promise<boolean> => {
  try {
    // Lösche zuerst alle zugehörigen Zeitpläne
    db.prepare('DELETE FROM schedule WHERE show_id = ?').run(id);
    
    // Dann lösche die Show
    const result = db.prepare('DELETE FROM shows WHERE id = ?').run(id);
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting show:', error);
    return false;
  }
};

export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    const schedule = db.prepare(`
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
    `).all() as (ScheduleItem & { show_title?: string; show_description?: string; host_name?: string; })[];
    
    return schedule;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
};

export const createScheduleItem = async (item: Omit<ScheduleItem, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduleItem | null> => {
  try {
    const result = db.prepare(`
      INSERT INTO schedule (show_id, day_of_week, start_time, end_time, host_id, is_recurring)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      item.show_id,
      item.day_of_week,
      item.start_time,
      item.end_time,
      item.host_id || null,
      item.is_recurring
    );

    const newItem = db.prepare('SELECT * FROM schedule WHERE id = ?').get(result.lastInsertRowid) as ScheduleItem;
    return newItem;
  } catch (error) {
    console.error('Error creating schedule item:', error);
    return null;
  }
};

export const updateScheduleItem = async (id: number, item: Partial<ScheduleItem>): Promise<ScheduleItem | null> => {
  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (item.show_id !== undefined) {
      updates.push('show_id = ?');
      values.push(item.show_id);
    }
    if (item.day_of_week !== undefined) {
      updates.push('day_of_week = ?');
      values.push(item.day_of_week);
    }
    if (item.start_time !== undefined) {
      updates.push('start_time = ?');
      values.push(item.start_time);
    }
    if (item.end_time !== undefined) {
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

    const query = `UPDATE schedule SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...values);

    const updatedItem = db.prepare('SELECT * FROM schedule WHERE id = ?').get(id) as ScheduleItem;
    return updatedItem;
  } catch (error) {
    console.error('Error updating schedule item:', error);
    return null;
  }
};

export const deleteScheduleItem = async (id: number): Promise<boolean> => {
  try {
    const result = db.prepare('DELETE FROM schedule WHERE id = ?').run(id);
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    return false;
  }
};

export default db; 