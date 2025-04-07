
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sqlite3 = require('better-sqlite3');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
const db = new sqlite3('users.db');

// Initialize tables if they don't exist (using the existing schema from db.ts)
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

// Auth Routes
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND isActive = true').get(username);
    
    if (!user) {
      return res.status(401).json({ error: 'Ungültige Anmeldeinformationen' });
    }
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Ungültige Anmeldeinformationen' });
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    // Convert roles string to array
    userWithoutPassword.roles = user.roles.split(',');
    
    res.json({ 
      user: userWithoutPassword,
      token: 'dummy-token' // In a real app, use JWT
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email, fullName, roles = ['user'], isActive = true } = req.body;
    
    // Check if user already exists
    const existingUser = db.prepare('SELECT 1 FROM users WHERE username = ?').get(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Benutzername bereits vergeben' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const result = db.prepare(`
      INSERT INTO users (username, password, fullName, email, roles, isActive)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(username, hashedPassword, fullName, email, roles.join(','), isActive);
    
    // Get created user
    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    
    // Return without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Convert roles string to array
    userWithoutPassword.roles = newUser.roles.split(',');
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// User management routes
app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users').all();
    
    // Remove passwords and convert roles to arrays
    const usersWithoutPasswords = users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      userWithoutPassword.roles = user.roles.split(',');
      return userWithoutPassword;
    });
    
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, email, fullName, roles, isActive } = req.body;
    
    const updates = [];
    const values = [];
    
    if (username) {
      updates.push('username = ?');
      values.push(username);
    }
    
    if (password) {
      updates.push('password = ?');
      values.push(await bcrypt.hash(password, 10));
    }
    
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    
    if (fullName !== undefined) {
      updates.push('fullName = ?');
      values.push(fullName);
    }
    
    if (roles) {
      updates.push('roles = ?');
      values.push(roles.join(','));
    }
    
    if (isActive !== undefined) {
      updates.push('isActive = ?');
      values.push(isActive);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'Keine Aktualisierungen angegeben' });
    }
    
    values.push(id);
    
    // Update user
    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    
    // Get updated user
    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }
    
    // Return without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    // Convert roles string to array
    userWithoutPassword.roles = updatedUser.roles.split(',');
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete user
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }
    
    res.json({ message: 'Benutzer erfolgreich gelöscht' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});

module.exports = app;
