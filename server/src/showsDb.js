import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize database
const dbPromise = open({
  filename: 'shows.db',
  driver: sqlite3.Database
});

// Create shows and schedule tables
const initializeDatabase = async () => {
  const db = await dbPromise;
  
  // Create shows table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS shows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      imageUrl TEXT,
      createdBy INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (createdBy) REFERENCES users (id)
    )
  `);
  
  // Create schedule table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      showId INTEGER NOT NULL,
      dayOfWeek INTEGER NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      hostId INTEGER NOT NULL,
      isRecurring INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (showId) REFERENCES shows (id),
      FOREIGN KEY (hostId) REFERENCES users (id)
    )
  `);
};

// Initialize database
initializeDatabase().then(() => {
  console.log('Shows database initialized');
});

// Shows functions
export const getShows = async () => {
  const db = await dbPromise;
  const shows = await db.all(`
    SELECT shows.*, users.username as createdByUsername 
    FROM shows 
    LEFT JOIN users ON shows.createdBy = users.id
  `);
  return shows;
};

export const createShow = async (showData) => {
  const db = await dbPromise;
  const result = await db.run(
    'INSERT INTO shows (title, description, imageUrl, createdBy) VALUES (?, ?, ?, ?)',
    [showData.title, showData.description, showData.imageUrl, showData.createdBy]
  );
  
  const show = await db.get('SELECT * FROM shows WHERE id = ?', [result.lastID]);
  return show;
};

export const updateShow = async (id, showData) => {
  const db = await dbPromise;
  const updates = [];
  const values = [];
  
  if (showData.title) {
    updates.push('title = ?');
    values.push(showData.title);
  }
  
  if (showData.description) {
    updates.push('description = ?');
    values.push(showData.description);
  }
  
  if (showData.imageUrl) {
    updates.push('imageUrl = ?');
    values.push(showData.imageUrl);
  }
  
  if (updates.length > 0) {
    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);
    await db.run(
      `UPDATE shows SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }
  
  const show = await db.get('SELECT * FROM shows WHERE id = ?', [id]);
  return show;
};

export const deleteShow = async (id) => {
  const db = await dbPromise;
  await db.run('DELETE FROM shows WHERE id = ?', [id]);
};

// Schedule functions
export const getSchedule = async () => {
  const db = await dbPromise;
  const schedule = await db.all(`
    SELECT schedule.*, shows.title as showTitle, users.username as hostUsername
    FROM schedule
    LEFT JOIN shows ON schedule.showId = shows.id
    LEFT JOIN users ON schedule.hostId = users.id
  `);
  return schedule;
};

export const createScheduleItem = async (scheduleData) => {
  const db = await dbPromise;
  const result = await db.run(
    'INSERT INTO schedule (showId, dayOfWeek, startTime, endTime, hostId, isRecurring) VALUES (?, ?, ?, ?, ?, ?)',
    [
      scheduleData.showId,
      scheduleData.dayOfWeek,
      scheduleData.startTime,
      scheduleData.endTime,
      scheduleData.hostId,
      scheduleData.isRecurring ? 1 : 0
    ]
  );
  
  const scheduleItem = await db.get('SELECT * FROM schedule WHERE id = ?', [result.lastID]);
  return scheduleItem;
};

export const updateScheduleItem = async (id, scheduleData) => {
  const db = await dbPromise;
  const updates = [];
  const values = [];
  
  if (scheduleData.showId) {
    updates.push('showId = ?');
    values.push(scheduleData.showId);
  }
  
  if (scheduleData.dayOfWeek !== undefined) {
    updates.push('dayOfWeek = ?');
    values.push(scheduleData.dayOfWeek);
  }
  
  if (scheduleData.startTime) {
    updates.push('startTime = ?');
    values.push(scheduleData.startTime);
  }
  
  if (scheduleData.endTime) {
    updates.push('endTime = ?');
    values.push(scheduleData.endTime);
  }
  
  if (scheduleData.hostId) {
    updates.push('hostId = ?');
    values.push(scheduleData.hostId);
  }
  
  if (scheduleData.isRecurring !== undefined) {
    updates.push('isRecurring = ?');
    values.push(scheduleData.isRecurring ? 1 : 0);
  }
  
  if (updates.length > 0) {
    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);
    await db.run(
      `UPDATE schedule SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }
  
  const scheduleItem = await db.get('SELECT * FROM schedule WHERE id = ?', [id]);
  return scheduleItem;
};

export const deleteScheduleItem = async (id) => {
  const db = await dbPromise;
  await db.run('DELETE FROM schedule WHERE id = ?', [id]);
}; 