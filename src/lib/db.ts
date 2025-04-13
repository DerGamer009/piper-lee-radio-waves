import Database from 'better-sqlite3';
import { hash, compare } from 'bcryptjs';

const db = new Database('users.db');

// Initialisiere die Datenbank
db.exec(`
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

// Füge Standardbenutzer hinzu, wenn sie nicht existieren
const initializeDefaultUsers = async () => {
  const adminExists = db.prepare('SELECT 1 FROM users WHERE username = ?').get('admin');
  const moderatorExists = db.prepare('SELECT 1 FROM users WHERE username = ?').get('moderator');

  if (!adminExists) {
    const adminPassword = await hash('admin123', 10);
    db.prepare(`
      INSERT INTO users (username, password, fullName, email, roles, isActive)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('admin', adminPassword, 'Administrator', 'admin@piper-lee.net', 'admin', true);
  }

  if (!moderatorExists) {
    const moderatorPassword = await hash('moderator123', 10);
    db.prepare(`
      INSERT INTO users (username, password, fullName, email, roles, isActive)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('moderator', moderatorPassword, 'Moderator', 'moderator@piper-lee.net', 'moderator', true);
  }
};

// Benutzer authentifizieren
export const authenticateUser = async (username: string, password: string): Promise<DBUser | null> => {
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND isActive = true').get(username) as DBUser | undefined;
  
  if (!user || !user.password) {
    return null;
  }

  const passwordValid = await compare(password, user.password);
  if (!passwordValid) {
    return null;
  }

  // Passwort aus der Rückgabe entfernen
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Alle Benutzer abrufen
export const getAllUsers = (): Omit<DBUser, 'password'>[] => {
  const users = db.prepare('SELECT * FROM users').all() as DBUser[];
  return users.map(({ password: _, ...user }) => user);
};

// Benutzer erstellen
export const createUser = async (userData: CreateUserData): Promise<Omit<DBUser, 'password'>> => {
  const hashedPassword = await hash(userData.password, 10);
  
  const result = db.prepare(`
    INSERT INTO users (username, password, fullName, email, roles, isActive)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    userData.username,
    hashedPassword,
    userData.fullName || null,
    userData.email || null,
    userData.roles.join(','),
    userData.isActive ?? true
  );

  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as DBUser;
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Benutzer aktualisieren
export const updateUser = async (id: number, userData: Partial<CreateUserData>): Promise<Omit<DBUser, 'password'> | null> => {
  const updates: string[] = [];
  const values: any[] = [];

  if (userData.username) {
    updates.push('username = ?');
    values.push(userData.username);
  }
  if (userData.password) {
    updates.push('password = ?');
    values.push(await hash(userData.password, 10));
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
  const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
  db.prepare(query).run(...values);

  const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as DBUser | undefined;
  if (!updatedUser) return null;

  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

// Benutzer löschen
export const deleteUser = (id: number): boolean => {
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return result.changes > 0;
};

// Initialisiere Standardbenutzer
initializeDefaultUsers().catch(console.error);

export default db; 