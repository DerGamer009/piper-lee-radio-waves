import sqlite3 from 'sqlite3';
import bcryptjs from 'bcryptjs';
import { promisify } from 'util';

// Create a new database instance
const db = new sqlite3.Database('users.db');

// Promisify database methods
const runAsync = promisify(db.run.bind(db));
const getAsync = promisify(db.get.bind(db));
const allAsync = promisify(db.all.bind(db));

// Initialize the database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      fullName TEXT,
      email TEXT UNIQUE,
      roles TEXT NOT NULL,
      isActive BOOLEAN DEFAULT true,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export interface DBUser {
  id: number;
  username: string;
  password?: string;
  fullName?: string;
  email?: string;
  roles: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserData {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  roles: string[];
  isActive?: boolean;
}

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
    const existingUser = await getAsync('SELECT id FROM users WHERE username = ?', [user.username]);
    if (!existingUser) {
      const hashedPassword = await bcryptjs.hash(user.password, 10);
      await runAsync(
        'INSERT INTO users (username, password, fullName, email, roles, isActive) VALUES (?, ?, ?, ?, ?, ?)',
        [user.username, hashedPassword, user.fullName, user.email, user.roles, user.isActive]
      );
    }
  }
};

// Initialize default users
initializeDefaultUsers().catch(console.error);

// User authentication
export const authenticateUser = async (username: string, password: string): Promise<Omit<DBUser, 'password'> | null> => {
  const user = await getAsync('SELECT * FROM users WHERE username = ? AND isActive = 1', [username]) as DBUser;
  
  if (!user || !user.password) {
    return null;
  }

  const isValid = await bcryptjs.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Get all users
export const getAllUsers = async (): Promise<Omit<DBUser, 'password'>[]> => {
  const users = await allAsync('SELECT * FROM users') as DBUser[];
  return users.map(({ password: _, ...user }) => user);
};

// Create new user
export const createUser = async (userData: CreateUserData): Promise<Omit<DBUser, 'password'>> => {
  const hashedPassword = await bcryptjs.hash(userData.password, 10);
  
  await runAsync(
    'INSERT INTO users (username, password, fullName, email, roles, isActive) VALUES (?, ?, ?, ?, ?, ?)',
    [
      userData.username,
      hashedPassword,
      userData.fullName || null,
      userData.email || null,
      userData.roles.join(','),
      userData.isActive ?? true
    ]
  );

  const newUser = await getAsync(
    'SELECT * FROM users WHERE username = ?',
    [userData.username]
  ) as DBUser;

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Update user
export const updateUser = async (id: number, userData: Partial<CreateUserData>): Promise<Omit<DBUser, 'password'> | null> => {
  const updates: string[] = [];
  const values: any[] = [];

  if (userData.username) {
    updates.push('username = ?');
    values.push(userData.username);
  }
  if (userData.password) {
    updates.push('password = ?');
    values.push(await bcryptjs.hash(userData.password, 10));
  }
  if (userData.fullName !== undefined) {
    updates.push('fullName = ?');
    values.push(userData.fullName);
  }
  if (userData.email !== undefined) {
    updates.push('email = ?');
    values.push(userData.email);
  }
  if (userData.roles) {
    updates.push('roles = ?');
    values.push(userData.roles.join(','));
  }
  if (userData.isActive !== undefined) {
    updates.push('isActive = ?');
    values.push(userData.isActive);
  }

  if (updates.length === 0) return null;

  values.push(id);
  await runAsync(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

  const updatedUser = await getAsync('SELECT * FROM users WHERE id = ?', [id]) as DBUser;
  if (!updatedUser) return null;

  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

// Delete user
export const deleteUser = async (id: number): Promise<boolean> => {
  const result = await runAsync('DELETE FROM users WHERE id = ?', [id]);
  return true;
}; 