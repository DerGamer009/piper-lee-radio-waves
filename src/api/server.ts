
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createShow, deleteShow, getSchedule, getShows, updateShow, createScheduleItem, updateScheduleItem, deleteScheduleItem } from './lib/showsDb';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Database initialization
const usersDb = await open({
  filename: path.join(__dirname, '../users.db'),
  driver: sqlite3.Database
});

const showsDb = await open({
  filename: path.join(__dirname, '../shows.db'),
  driver: sqlite3.Database
});

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as { id: number };
    const dbUser = await usersDb.get('SELECT * FROM users WHERE id = ?', [user.id]);
    if (!dbUser) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    req.user = dbUser;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
    return;
  }
};

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
app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await usersDb.get('SELECT * FROM users WHERE username = ?', [username]);
    
    if (user && user.password) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
        return;
      }
    }
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Users
app.get('/api/users', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await usersDb.all('SELECT id, username, fullName, email, roles, isActive, createdAt FROM users');
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', authenticateToken, async (req: Request, res: Response): Promise<void> => {
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

app.put('/api/users/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
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
      
      const user = await usersDb.get(
        'SELECT id, username, fullName, email, roles, isActive, createdAt FROM users WHERE id = ?',
        [id]
      );
      
      res.json(user);
    } else {
      res.status(400).json({ error: 'No updates provided' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await usersDb.run('DELETE FROM users WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Show routes
app.get('/api/shows', async (req, res) => {
  try {
    const shows = await getShows();
    res.json(shows);
  } catch (error) {
    console.error('Get shows error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/shows', authenticateToken, async (req, res) => {
  try {
    const show = await createShow(req.body);
    res.json(show);
  } catch (error) {
    console.error('Create show error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/shows/:id', authenticateToken, async (req, res) => {
  try {
    const show = await updateShow(parseInt(req.params.id), req.body);
    res.json(show);
  } catch (error) {
    console.error('Update show error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/shows/:id', authenticateToken, async (req, res) => {
  try {
    await deleteShow(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete show error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Schedule routes
app.get('/api/schedule', async (req, res) => {
  try {
    const schedule = await getSchedule();
    res.json(schedule);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/schedule', authenticateToken, async (req, res) => {
  try {
    const scheduleItem = await createScheduleItem(req.body);
    res.json(scheduleItem);
  } catch (error) {
    console.error('Create schedule item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/schedule/:id', authenticateToken, async (req, res) => {
  try {
    const scheduleItem = await updateScheduleItem(parseInt(req.params.id), req.body);
    res.json(scheduleItem);
  } catch (error) {
    console.error('Update schedule item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/schedule/:id', authenticateToken, async (req, res) => {
  try {
    await deleteScheduleItem(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete schedule item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
