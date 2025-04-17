
// This file simulates database operations in the browser

// Mock data storage
let users = [
  {
    id: 1,
    username: 'admin',
    password_hash: '$2y$10$xLRsIkyaCv5g.QVMn9KJTOELcB9QLsRXpV3Sn1d9S1hcZ6F04Mzx2', // admin123
    email: 'admin@example.com',
    fullName: 'Administrator',
    roles: ['admin'],
    isActive: true,
    last_login: '2023-01-01T00:00:00.000Z',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    username: 'moderator',
    password_hash: '$2y$10$xLRsIkyaCv5g.QVMn9KJTOELcB9QLsRXpV3Sn1d9S1hcZ6F04Mzx2', // admin123
    email: 'moderator@example.com',
    fullName: 'Moderator User',
    roles: ['moderator'],
    isActive: true,
    last_login: '2023-01-01T00:00:00.000Z',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  }
];

let shows = [
  {
    id: 1,
    title: 'Morning Show',
    description: 'Wake up with our morning show',
    image_url: '/placeholder.svg',
    created_by: 1,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    creator_name: 'Administrator'
  },
  {
    id: 2,
    title: 'Afternoon Relaxation',
    description: 'Relax with smooth tunes in the afternoon',
    image_url: '/placeholder.svg',
    created_by: 2,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    creator_name: 'Moderator User'
  }
];

let schedule = [
  {
    id: 1,
    show_id: 1,
    day_of_week: 'Montag',
    start_time: '08:00',
    end_time: '10:00',
    host_id: 1,
    is_recurring: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    show_title: 'Morning Show',
    show_description: 'Wake up with our morning show',
    host_name: 'Administrator'
  },
  {
    id: 2,
    show_id: 2,
    day_of_week: 'Dienstag',
    start_time: '14:00',
    end_time: '16:00',
    host_id: 2,
    is_recurring: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    show_title: 'Afternoon Relaxation',
    show_description: 'Relax with smooth tunes in the afternoon',
    host_name: 'Moderator User'
  }
];

// Mock function to execute queries
export const executeQuery = async (query: string, params: any[] = []) => {
  console.log('Executing query:', query, 'with params:', params);
  
  // Simple query execution simulation
  if (query.includes('SELECT') && query.includes('FROM users')) {
    // Get all users
    return users;
  }
  
  if (query.includes('SELECT') && query.includes('FROM shows')) {
    // Get all shows
    return shows;
  }
  
  if (query.includes('SELECT') && query.includes('FROM schedule')) {
    // Get all schedule items
    return schedule;
  }
  
  if (query.includes('INSERT INTO users')) {
    const userData = params[0];
    const newUser = {
      id: users.length + 1,
      username: userData.username,
      password_hash: userData.password, // In a real app, we would hash this
      email: userData.email || null,
      fullName: userData.fullName || null,
      roles: userData.roles,
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      last_login: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    users.push(newUser);
    return [{ insertId: newUser.id }];
  }
  
  if (query.includes('UPDATE users')) {
    const userData = params[0];
    const id = params[1];
    const index = users.findIndex(u => u.id === id);
    
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...userData,
        updated_at: new Date().toISOString()
      };
      
      return [{ affectedRows: 1 }];
    }
    
    return [{ affectedRows: 0 }];
  }
  
  if (query.includes('DELETE FROM users')) {
    const userId = params[0];
    const initialLength = users.length;
    users = users.filter(u => u.id !== userId);
    
    return [{ affectedRows: initialLength - users.length }];
  }
  
  if (query.includes('INSERT INTO shows')) {
    const showData = params[0];
    const newShow = {
      id: shows.length + 1,
      ...showData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    shows.push(newShow);
    return [{ insertId: newShow.id }];
  }
  
  if (query.includes('UPDATE shows')) {
    const showData = params[0];
    const id = params[1];
    const index = shows.findIndex(s => s.id === id);
    
    if (index !== -1) {
      shows[index] = {
        ...shows[index],
        ...showData,
        updated_at: new Date().toISOString()
      };
      
      return [{ affectedRows: 1 }];
    }
    
    return [{ affectedRows: 0 }];
  }
  
  if (query.includes('DELETE FROM shows')) {
    const showId = params[0];
    const initialLength = shows.length;
    shows = shows.filter(s => s.id !== showId);
    // Also delete related schedule items
    schedule = schedule.filter(s => s.show_id !== showId);
    
    return [{ affectedRows: initialLength - shows.length }];
  }
  
  if (query.includes('INSERT INTO schedule')) {
    const scheduleData = params[0];
    const relatedShow = shows.find(s => s.id === scheduleData.show_id);
    const host = users.find(u => u.id === scheduleData.host_id);
    
    const newScheduleItem = {
      id: schedule.length + 1,
      ...scheduleData,
      show_title: relatedShow ? relatedShow.title : null,
      show_description: relatedShow ? relatedShow.description : null,
      host_name: host ? host.fullName : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    schedule.push(newScheduleItem);
    return [{ insertId: newScheduleItem.id }];
  }
  
  if (query.includes('UPDATE schedule')) {
    const scheduleData = params[0];
    const id = params[1];
    const index = schedule.findIndex(s => s.id === id);
    
    if (index !== -1) {
      // Get updated related data if needed
      let showTitle = schedule[index].show_title;
      let showDescription = schedule[index].show_description;
      let hostName = schedule[index].host_name;
      
      if (scheduleData.show_id) {
        const relatedShow = shows.find(s => s.id === scheduleData.show_id);
        showTitle = relatedShow ? relatedShow.title : null;
        showDescription = relatedShow ? relatedShow.description : null;
      }
      
      if (scheduleData.host_id) {
        const host = users.find(u => u.id === scheduleData.host_id);
        hostName = host ? host.fullName : null;
      }
      
      schedule[index] = {
        ...schedule[index],
        ...scheduleData,
        show_title: showTitle,
        show_description: showDescription,
        host_name: hostName,
        updated_at: new Date().toISOString()
      };
      
      return [{ affectedRows: 1 }];
    }
    
    return [{ affectedRows: 0 }];
  }
  
  if (query.includes('DELETE FROM schedule')) {
    const scheduleId = params[0];
    const initialLength = schedule.length;
    schedule = schedule.filter(s => s.id !== scheduleId);
    
    return [{ affectedRows: initialLength - schedule.length }];
  }
  
  // Default fallback
  return [];
};

// Authentication functions for browser environment
export const authenticateUser = async (username: string, password: string) => {
  // This is a simplified authentication function for browser environment
  // In a real application, we would send the credentials to a secure backend
  const user = users.find(u => u.username === username && u.password_hash === password && u.isActive);
  
  if (user) {
    // Update last login
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        last_login: new Date().toISOString()
      };
    }
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
      isActive: user.isActive
    };
  }
  
  return null;
};
