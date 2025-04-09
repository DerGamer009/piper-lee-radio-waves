import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Database initialization
const usersDb = await open({
  filename: path.join(__dirname, '../../users.db'),
  driver: sqlite3.Database
});

const showsDb = await open({
  filename: path.join(__dirname, '../../shows.db'),
  driver: sqlite3.Database
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database tables
await usersDb.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fullName TEXT,
    email TEXT,
    roles TEXT,
    isActive INTEGER DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

await showsDb.exec(`
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

await showsDb.exec(`
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

// Initialize default users
const initializeDefaultUsers = async () => {
  const defaultUsers = [
    {
      username: 'admin',
      password: 'admin123',
      fullName: 'Admin User',
      email: 'admin@example.com',
      roles: 'admin',
      isActive: 1
    },
    {
      username: 'moderator',
      password: 'mod123',
      fullName: 'Moderator User',
      email: 'mod@example.com',
      roles: 'moderator',
      isActive: 1
    }
  ];

  for (const user of defaultUsers) {
    const existingUser = await usersDb.get('SELECT id FROM users WHERE username = ?', [user.username]);
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await usersDb.run(
        'INSERT INTO users (username, password, fullName, email, roles, isActive) VALUES (?, ?, ?, ?, ?, ?)',
        [user.username, hashedPassword, user.fullName, user.email, user.roles, user.isActive]
      );
    }
  }
};

await initializeDefaultUsers();

// Authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await usersDb.get('SELECT * FROM users WHERE username = ?', [username]);
    
    if (user && user.password) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await usersDb.all('SELECT id, username, fullName, email, roles, isActive, createdAt FROM users');
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username, password, fullName, email, roles, isActive } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await usersDb.run(
      'INSERT INTO users (username, password, fullName, email, roles, isActive) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, fullName, email, JSON.stringify(roles), isActive ? 1 : 0]
    );
    
    const user = await usersDb.get(
      'SELECT id, username, fullName, email, roles, isActive, createdAt FROM users WHERE id = ?',
      [result.lastID]
    );
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = [];
    const values = [];
    
    if (req.body.username) {
      updates.push('username = ?');
      values.push(req.body.username);
    }
    
    if (req.body.password) {
      updates.push('password = ?');
      values.push(await bcrypt.hash(req.body.password, 10));
    }
    
    if (req.body.fullName) {
      updates.push('fullName = ?');
      values.push(req.body.fullName);
    }
    
    if (req.body.email) {
      updates.push('email = ?');
      values.push(req.body.email);
    }
    
    if (req.body.roles) {
      updates.push('roles = ?');
      values.push(JSON.stringify(req.body.roles));
    }
    
    if (typeof req.body.isActive === 'boolean') {
      updates.push('isActive = ?');
      values.push(req.body.isActive ? 1 : 0);
    }
    
    if (updates.length > 0) {
      values.push(id);
      await usersDb.run(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
    
    const user = await usersDb.get(
      'SELECT id, username, fullName, email, roles, isActive, createdAt FROM users WHERE id = ?',
      [id]
    );
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await usersDb.run('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shows
app.get('/api/shows', async (req, res) => {
  try {
    const shows = await showsDb.all(`
      SELECT shows.*, users.username as createdByUsername 
      FROM shows 
      LEFT JOIN users ON shows.createdBy = users.id
    `);
    res.json(shows);
  } catch (error) {
    console.error('Error getting shows:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/shows', async (req, res) => {
  try {
    const result = await showsDb.run(
      'INSERT INTO shows (title, description, imageUrl, createdBy) VALUES (?, ?, ?, ?)',
      [req.body.title, req.body.description, req.body.imageUrl, req.body.createdBy]
    );
    
    const show = await showsDb.get('SELECT * FROM shows WHERE id = ?', [result.lastID]);
    res.status(201).json(show);
  } catch (error) {
    console.error('Error creating show:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/shows/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = [];
    const values = [];
    
    if (req.body.title) {
      updates.push('title = ?');
      values.push(req.body.title);
    }
    
    if (req.body.description) {
      updates.push('description = ?');
      values.push(req.body.description);
    }
    
    if (req.body.imageUrl) {
      updates.push('imageUrl = ?');
      values.push(req.body.imageUrl);
    }
    
    if (updates.length > 0) {
      updates.push('updatedAt = CURRENT_TIMESTAMP');
      values.push(id);
      await showsDb.run(
        `UPDATE shows SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
    
    const show = await showsDb.get('SELECT * FROM shows WHERE id = ?', [id]);
    if (show) {
      res.json(show);
    } else {
      res.status(404).json({ error: 'Show not found' });
    }
  } catch (error) {
    console.error('Error updating show:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/shows/:id', async (req, res) => {
  try {
    await showsDb.run('DELETE FROM shows WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting show:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Schedule
app.get('/api/schedule', async (req, res) => {
  try {
    const schedule = await showsDb.all(`
      SELECT schedule.*, shows.title as showTitle, users.username as hostUsername
      FROM schedule
      LEFT JOIN shows ON schedule.showId = shows.id
      LEFT JOIN users ON schedule.hostId = users.id
    `);
    res.json(schedule);
  } catch (error) {
    console.error('Error getting schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/schedule', async (req, res) => {
  try {
    const result = await showsDb.run(
      'INSERT INTO schedule (showId, dayOfWeek, startTime, endTime, hostId, isRecurring) VALUES (?, ?, ?, ?, ?, ?)',
      [
        req.body.showId,
        req.body.dayOfWeek,
        req.body.startTime,
        req.body.endTime,
        req.body.hostId,
        req.body.isRecurring ? 1 : 0
      ]
    );
    
    const scheduleItem = await showsDb.get('SELECT * FROM schedule WHERE id = ?', [result.lastID]);
    res.status(201).json(scheduleItem);
  } catch (error) {
    console.error('Error creating schedule item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/schedule/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = [];
    const values = [];
    
    if (req.body.showId) {
      updates.push('showId = ?');
      values.push(req.body.showId);
    }
    
    if (req.body.dayOfWeek !== undefined) {
      updates.push('dayOfWeek = ?');
      values.push(req.body.dayOfWeek);
    }
    
    if (req.body.startTime) {
      updates.push('startTime = ?');
      values.push(req.body.startTime);
    }
    
    if (req.body.endTime) {
      updates.push('endTime = ?');
      values.push(req.body.endTime);
    }
    
    if (req.body.hostId) {
      updates.push('hostId = ?');
      values.push(req.body.hostId);
    }
    
    if (req.body.isRecurring !== undefined) {
      updates.push('isRecurring = ?');
      values.push(req.body.isRecurring ? 1 : 0);
    }
    
    if (updates.length > 0) {
      updates.push('updatedAt = CURRENT_TIMESTAMP');
      values.push(id);
      await showsDb.run(
        `UPDATE schedule SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
    
    const scheduleItem = await showsDb.get('SELECT * FROM schedule WHERE id = ?', [id]);
    if (scheduleItem) {
      res.json(scheduleItem);
    } else {
      res.status(404).json({ error: 'Schedule item not found' });
    }
  } catch (error) {
    console.error('Error updating schedule item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/schedule/:id', async (req, res) => {
  try {
    await showsDb.run('DELETE FROM schedule WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
