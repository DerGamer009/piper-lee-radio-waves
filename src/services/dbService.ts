
import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'Gamer09!!',
  database: 'radio_station'
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Execute a query and return the results
 * @param query SQL query
 * @param params Query parameters
 * @returns Query results
 */
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  try {
    const connection = await pool.getConnection();
    try {
      const [results] = await connection.execute(query, params);
      return results as T;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

/**
 * Get all users from the database
 */
export async function getDbUsers() {
  const query = `
    SELECT u.id, u.username, u.email, u.full_name as fullName, 
           GROUP_CONCAT(r.name) as roles, u.is_active as isActive
    FROM users u
    JOIN user_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    GROUP BY u.id
  `;
  
  const users = await executeQuery<any[]>(query);
  return users.map(user => ({
    ...user,
    roles: user.roles.split(','),
    isActive: Boolean(user.isActive)
  }));
}

/**
 * Create a new user
 */
export async function createDbUser(user: {
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
}) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Insert user
    const insertUser = `
      INSERT INTO users (username, password_hash, email, full_name, is_active) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [userResult] = await connection.execute(
      insertUser, 
      [user.username, '$2y$10$tempPasswordHash', user.email, user.fullName, user.isActive]
    );
    
    const userId = (userResult as any).insertId;
    
    // Insert roles
    for (const role of user.roles) {
      const insertRole = `
        INSERT INTO user_roles (user_id, role_id)
        SELECT ?, id FROM roles WHERE name = ?
      `;
      await connection.execute(insertRole, [userId, role]);
    }
    
    await connection.commit();
    
    return {
      id: userId,
      ...user
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Get all shows from the database
 */
export async function getDbShows() {
  const query = `
    SELECT 
      id, title, description, image_url as imageUrl, 
      created_by as createdBy
    FROM shows
  `;
  
  return executeQuery<any[]>(query);
}

/**
 * Get the schedule from the database
 */
export async function getDbSchedule() {
  const query = `
    SELECT 
      s.id, s.show_id as showId, sh.title as showTitle,
      s.day_of_week as dayOfWeek, s.start_time as startTime, 
      s.end_time as endTime, s.host_id as hostId,
      u.full_name as hostName, s.is_recurring as isRecurring
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
      END,
      s.start_time
  `;
  
  const schedules = await executeQuery<any[]>(query);
  return schedules.map(schedule => ({
    ...schedule,
    isRecurring: Boolean(schedule.isRecurring)
  }));
}

/**
 * Create a new schedule item
 */
export async function createDbScheduleItem(schedule: {
  showId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  hostId?: number;
  isRecurring: boolean;
}) {
  const query = `
    INSERT INTO schedule 
    (show_id, day_of_week, start_time, end_time, host_id, is_recurring)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await pool.execute(
    query, 
    [
      schedule.showId, 
      schedule.dayOfWeek, 
      schedule.startTime, 
      schedule.endTime, 
      schedule.hostId || null, 
      schedule.isRecurring
    ]
  );
  
  const id = (result as any).insertId;
  
  // Get the inserted schedule with show information
  const newSchedule = await executeQuery<any[]>(`
    SELECT 
      s.id, s.show_id as showId, sh.title as showTitle,
      s.day_of_week as dayOfWeek, s.start_time as startTime, 
      s.end_time as endTime, s.host_id as hostId,
      u.full_name as hostName, s.is_recurring as isRecurring
    FROM schedule s
    JOIN shows sh ON s.show_id = sh.id
    LEFT JOIN users u ON s.host_id = u.id
    WHERE s.id = ?
  `, [id]);
  
  return {
    ...newSchedule[0],
    isRecurring: Boolean(newSchedule[0].isRecurring)
  };
}
