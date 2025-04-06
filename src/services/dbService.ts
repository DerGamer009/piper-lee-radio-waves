
import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'radio_station',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Helper function to execute queries
export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// User related functions
export const getUsers = async () => {
  return executeQuery(`
    SELECT u.id, u.username, u.email, u.full_name, u.is_active, 
           GROUP_CONCAT(r.name) AS roles
    FROM users u
    JOIN user_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    GROUP BY u.id
  `);
};

export const getUserById = async (id: number) => {
  const users = await executeQuery(
    `SELECT u.*, GROUP_CONCAT(r.name) AS roles
     FROM users u
     JOIN user_roles ur ON u.id = ur.user_id
     JOIN roles r ON ur.role_id = r.id
     WHERE u.id = ?
     GROUP BY u.id`,
    [id]
  );
  return users[0];
};

export const createUser = async (userData: any) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert user
    const [result] = await connection.execute(
      `INSERT INTO users (username, password_hash, email, full_name, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [userData.username, userData.password_hash, userData.email, userData.full_name, userData.is_active]
    );
    
    const userId = (result as any).insertId;
    
    // Insert user roles
    for (const roleName of userData.roles) {
      const [roles] = await connection.execute(
        'SELECT id FROM roles WHERE name = ?',
        [roleName]
      );
      
      if (Array.isArray(roles) && roles.length > 0) {
        const roleId = (roles[0] as any).id;
        await connection.execute(
          'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
          [userId, roleId]
        );
      }
    }
    
    await connection.commit();
    return userId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateUser = async (id: number, userData: any) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Update user data
    await connection.execute(
      `UPDATE users 
       SET username = ?, email = ?, full_name = ?, is_active = ?
       WHERE id = ?`,
      [userData.username, userData.email, userData.full_name, userData.is_active, id]
    );
    
    // Remove existing roles
    await connection.execute(
      'DELETE FROM user_roles WHERE user_id = ?',
      [id]
    );
    
    // Add new roles
    for (const roleName of userData.roles) {
      const [roles] = await connection.execute(
        'SELECT id FROM roles WHERE name = ?',
        [roleName]
      );
      
      if (Array.isArray(roles) && roles.length > 0) {
        const roleId = (roles[0] as any).id;
        await connection.execute(
          'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
          [id, roleId]
        );
      }
    }
    
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const deleteUser = async (id: number) => {
  return executeQuery('DELETE FROM users WHERE id = ?', [id]);
};

// Show related functions
export const getShows = async () => {
  return executeQuery(`
    SELECT s.*, u.full_name as creator_name
    FROM shows s
    LEFT JOIN users u ON s.created_by = u.id
  `);
};

export const getShowById = async (id: number) => {
  const shows = await executeQuery(
    `SELECT s.*, u.full_name as creator_name
     FROM shows s
     LEFT JOIN users u ON s.created_by = u.id
     WHERE s.id = ?`,
    [id]
  );
  return shows[0];
};

export const createShow = async (showData: any) => {
  const [result] = await pool.execute(
    `INSERT INTO shows (title, description, image_url, created_by)
     VALUES (?, ?, ?, ?)`,
    [showData.title, showData.description, showData.image_url, showData.created_by]
  );
  return (result as any).insertId;
};

export const updateShow = async (id: number, showData: any) => {
  await executeQuery(
    `UPDATE shows 
     SET title = ?, description = ?, image_url = ?
     WHERE id = ?`,
    [showData.title, showData.description, showData.image_url, id]
  );
  return true;
};

export const deleteShow = async (id: number) => {
  return executeQuery('DELETE FROM shows WHERE id = ?', [id]);
};

// Schedule related functions
export const getSchedule = async () => {
  return executeQuery(`
    SELECT s.id, s.day_of_week, s.start_time, s.end_time, s.is_recurring,
           sh.id as show_id, sh.title as show_title, sh.description as show_description,
           u.id as host_id, u.full_name as host_name
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
  `);
};

export const getScheduleById = async (id: number) => {
  const schedules = await executeQuery(
    `SELECT s.*, sh.title as show_title, u.full_name as host_name
     FROM schedule s
     JOIN shows sh ON s.show_id = sh.id
     LEFT JOIN users u ON s.host_id = u.id
     WHERE s.id = ?`,
    [id]
  );
  return schedules[0];
};

export const createScheduleItem = async (scheduleData: any) => {
  const [result] = await pool.execute(
    `INSERT INTO schedule (show_id, day_of_week, start_time, end_time, host_id, is_recurring)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      scheduleData.showId, 
      scheduleData.dayOfWeek, 
      scheduleData.startTime, 
      scheduleData.endTime,
      scheduleData.hostId || null,
      scheduleData.isRecurring
    ]
  );
  return (result as any).insertId;
};

export const updateScheduleItem = async (id: number, scheduleData: any) => {
  await executeQuery(
    `UPDATE schedule 
     SET show_id = ?, day_of_week = ?, start_time = ?, end_time = ?, 
         host_id = ?, is_recurring = ?
     WHERE id = ?`,
    [
      scheduleData.showId, 
      scheduleData.dayOfWeek, 
      scheduleData.startTime, 
      scheduleData.endTime,
      scheduleData.hostId || null,
      scheduleData.isRecurring,
      id
    ]
  );
  return true;
};

export const deleteScheduleItem = async (id: number) => {
  return executeQuery('DELETE FROM schedule WHERE id = ?', [id]);
};

// Authentication functions
export const authenticateUser = async (username: string, passwordHash: string) => {
  const users = await executeQuery(
    `SELECT u.id, u.username, u.email, u.full_name, GROUP_CONCAT(r.name) as roles
     FROM users u
     JOIN user_roles ur ON u.id = ur.user_id
     JOIN roles r ON r.id = ur.role_id
     WHERE u.username = ? AND u.password_hash = ? AND u.is_active = 1
     GROUP BY u.id`,
    [username, passwordHash]
  );
  
  if (Array.isArray(users) && users.length > 0) {
    const user = users[0] as any;
    // Update last login
    await executeQuery(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );
    return user;
  }
  
  return null;
};
