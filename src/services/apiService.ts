
import { executeQuery, authenticateUser } from './dbService';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
}

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
  showId?: number;
  day_of_week: string;
  dayOfWeek?: string;
  start_time: string;
  startTime?: string;
  end_time: string;
  endTime?: string;
  host_id?: number;
  hostId?: number;
  host_name?: string;
  hostName?: string;
  is_recurring: boolean;
  isRecurring?: boolean;
  show_title?: string;
  show_description?: string;
}

// Mock authentication service
export const login = async (username: string, password: string) => {
  try {
    // In production, the password should be hashed on the client side before sending
    // or the authentication should happen via a secure protocol
    const passwordHash = '$2y$10$xLRsIkyaCv5g.QVMn9KJTOELcB9QLsRXpV3Sn1d9S1hcZ6F04Mzx2'; // This is "admin123" for demo
    
    if (username === 'admin' && password === 'admin123') {
      const user = await authenticateUser(username, passwordHash);
      if (user) {
        // Store user info in localStorage (in a real app, use secure HTTP-only cookies)
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
    }
    
    throw new Error('Falscher Benutzername oder Passwort');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    return null;
  }
};

export const hasRole = (requiredRoles: string[]) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const userRoles = Array.isArray(user.roles) ? user.roles : user.roles.split(',');
  return requiredRoles.some(role => userRoles.includes(role));
};

// User API functions
export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await executeQuery(`
      SELECT u.id, u.username, u.email, u.full_name as fullName, u.is_active as isActive, 
             GROUP_CONCAT(r.name) AS roles
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      GROUP BY u.id
    `) as any[];

    // Transform data to match the User interface
    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName || user.full_name,
      isActive: user.isActive !== undefined ? user.isActive : user.is_active === 1,
      roles: user.roles ? user.roles.split(',') : []
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData: Partial<User>): Promise<number> => {
  try {
    // Transform data to match the database schema
    const dbData = {
      username: userData.username,
      password_hash: '$2y$10$xLRsIkyaCv5g.QVMn9KJTOELcB9QLsRXpV3Sn1d9S1hcZ6F04Mzx2', // Default password hash
      email: userData.email,
      full_name: userData.fullName,
      is_active: userData.isActive ? 1 : 0,
      roles: userData.roles
    };
    
    // Insert into users table
    const [result] = await executeQuery(
      `INSERT INTO users (username, password_hash, email, full_name, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [dbData.username, dbData.password_hash, dbData.email, dbData.full_name, dbData.is_active]
    ) as any[];
    
    const userId = result.insertId;
    
    // Insert user roles
    for (const roleName of dbData.roles || []) {
      const [roles] = await executeQuery(
        'SELECT id FROM roles WHERE name = ?',
        [roleName]
      ) as any[];
      
      if (Array.isArray(roles) && roles.length > 0) {
        const roleId = roles[0].id;
        await executeQuery(
          'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
          [userId, roleId]
        );
      }
    }
    
    return userId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<boolean> => {
  try {
    // Transform data to match the database schema
    const dbData = {
      username: userData.username,
      email: userData.email,
      full_name: userData.fullName,
      is_active: userData.isActive ? 1 : 0,
      roles: userData.roles
    };
    
    // Update user data
    await executeQuery(
      `UPDATE users 
       SET username = ?, email = ?, full_name = ?, is_active = ?
       WHERE id = ?`,
      [dbData.username, dbData.email, dbData.full_name, dbData.is_active, id]
    );
    
    // Remove existing roles
    await executeQuery(
      'DELETE FROM user_roles WHERE user_id = ?',
      [id]
    );
    
    // Add new roles
    for (const roleName of dbData.roles || []) {
      const [roles] = await executeQuery(
        'SELECT id FROM roles WHERE name = ?',
        [roleName]
      ) as any[];
      
      if (Array.isArray(roles) && roles.length > 0) {
        const roleId = roles[0].id;
        await executeQuery(
          'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
          [id, roleId]
        );
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    await executeQuery('DELETE FROM users WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

// Show API functions
export const getShows = async (): Promise<Show[]> => {
  try {
    return await executeQuery(`
      SELECT s.*, u.full_name as creator_name
      FROM shows s
      LEFT JOIN users u ON s.created_by = u.id
    `) as Show[];
  } catch (error) {
    console.error('Error fetching shows:', error);
    throw error;
  }
};

// Schedule related functions
export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    const scheduleData = await executeQuery(`
      SELECT s.id, s.day_of_week as dayOfWeek, s.start_time as startTime, s.end_time as endTime,
             s.is_recurring as isRecurring,
             sh.id as showId, sh.title as showTitle, sh.description as showDescription,
             u.id as hostId, u.full_name as hostName
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
    `) as any[];
    
    // Transform data to match the ScheduleItem interface
    return scheduleData.map(item => ({
      id: item.id,
      show_id: item.showId,
      showId: item.showId,
      day_of_week: item.dayOfWeek,
      dayOfWeek: item.dayOfWeek,
      start_time: item.startTime,
      startTime: item.startTime,
      end_time: item.endTime,
      endTime: item.endTime,
      host_id: item.hostId,
      hostId: item.hostId,
      host_name: item.hostName,
      hostName: item.hostName,
      is_recurring: item.isRecurring === 1,
      isRecurring: item.isRecurring === 1,
      show_title: item.showTitle,
      show_description: item.showDescription
    }));
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

export const deleteScheduleItem = async (id: number): Promise<boolean> => {
  try {
    await executeQuery('DELETE FROM schedule WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error(`Error deleting schedule item ${id}:`, error);
    throw error;
  }
};

// Export other functions from dbService
export { executeQuery };
