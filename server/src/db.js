import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';

// Initialize database
const dbPromise = open({
  filename: 'users.db',
  driver: sqlite3.Database
});

// Create users table
const initializeDatabase = async () => {
  const db = await dbPromise;
  await db.exec(`
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
};

// Initialize default users
const initializeDefaultUsers = async () => {
  const db = await dbPromise;
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
    const existingUser = await db.get('SELECT id FROM users WHERE username = ?', [user.username]);
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await db.run(
        'INSERT INTO users (username, password, fullName, email, roles, isActive) VALUES (?, ?, ?, ?, ?, ?)',
        [user.username, hashedPassword, user.fullName, user.email, user.roles, user.isActive]
      );
    }
  }
};

// Initialize database and default users
initializeDatabase().then(initializeDefaultUsers);

// Database functions
export const authenticateUser = async (username, password) => {
  const db = await dbPromise;
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
  
  if (user && user.password) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  }
  return null;
};

export const getAllUsers = async () => {
  const db = await dbPromise;
  const users = await db.all('SELECT id, username, fullName, email, roles, isActive, createdAt FROM users');
  return users;
};

export const createUser = async (userData) => {
  const db = await dbPromise;
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  const result = await db.run(
    'INSERT INTO users (username, password, fullName, email, roles, isActive) VALUES (?, ?, ?, ?, ?, ?)',
    [
      userData.username,
      hashedPassword,
      userData.fullName,
      userData.email,
      JSON.stringify(userData.roles),
      userData.isActive ? 1 : 0
    ]
  );
  
  const newUser = await db.get(
    'SELECT id, username, fullName, email, roles, isActive, createdAt FROM users WHERE id = ?',
    [result.lastID]
  );
  
  return newUser;
};

export const updateUser = async (id, userData) => {
  const db = await dbPromise;
  const updates = [];
  const values = [];
  
  if (userData.username) {
    updates.push('username = ?');
    values.push(userData.username);
  }
  
  if (userData.password) {
    updates.push('password = ?');
    values.push(await bcrypt.hash(userData.password, 10));
  }
  
  if (userData.fullName) {
    updates.push('fullName = ?');
    values.push(userData.fullName);
  }
  
  if (userData.email) {
    updates.push('email = ?');
    values.push(userData.email);
  }
  
  if (userData.roles) {
    updates.push('roles = ?');
    values.push(JSON.stringify(userData.roles));
  }
  
  if (typeof userData.isActive === 'boolean') {
    updates.push('isActive = ?');
    values.push(userData.isActive ? 1 : 0);
  }
  
  if (updates.length > 0) {
    values.push(id);
    await db.run(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }
  
  const updatedUser = await db.get(
    'SELECT id, username, fullName, email, roles, isActive, createdAt FROM users WHERE id = ?',
    [id]
  );
  
  return updatedUser;
};

export const deleteUser = async (id) => {
  const db = await dbPromise;
  await db.run('DELETE FROM users WHERE id = ?', [id]);
}; 