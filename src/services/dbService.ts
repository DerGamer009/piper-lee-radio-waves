
// This file simulates database operations in the browser

// Mock data storage
let users = [
  {
    id: 1,
    username: 'admin',
    password_hash: '$2y$10$xLRsIkyaCv5g.QVMn9KJTOELcB9QLsRXpV3Sn1d9S1hcZ6F04Mzx2', // admin123
    email: 'admin@example.com',
    full_name: 'Administrator',
    is_active: 1,
    last_login: '2023-01-01T00:00:00.000Z',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    username: 'moderator',
    password_hash: '$2y$10$xLRsIkyaCv5g.QVMn9KJTOELcB9QLsRXpV3Sn1d9S1hcZ6F04Mzx2', // admin123
    email: 'moderator@example.com',
    full_name: 'Moderator User',
    is_active: 1,
    last_login: '2023-01-01T00:00:00.000Z',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  }
];

let roles = [
  { id: 1, name: 'admin', description: 'Administrator role' },
  { id: 2, name: 'moderator', description: 'Moderator role' },
  { id: 3, name: 'user', description: 'Standard user role' }
];

let userRoles = [
  { user_id: 1, role_id: 1 },
  { user_id: 2, role_id: 2 }
];

let shows = [
  {
    id: 1,
    title: 'Morning Show',
    description: 'Wake up with our morning show',
    image_url: '/placeholder.svg',
    created_by: 1,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    title: 'Afternoon Relaxation',
    description: 'Relax with smooth tunes in the afternoon',
    image_url: '/placeholder.svg',
    created_by: 2,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
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
    is_recurring: 1,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    show_id: 2,
    day_of_week: 'Dienstag',
    start_time: '14:00',
    end_time: '16:00',
    host_id: 2,
    is_recurring: 1,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  }
];

// Mock function to execute SQL-like queries
export const executeQuery = async (query: string, params: any[] = []) => {
  console.log('Executing query:', query, 'with params:', params);
  
  // Simple query execution simulation
  if (query.includes('SELECT') && query.includes('FROM users')) {
    // Handle user queries
    if (query.includes('WHERE u.id = ?')) {
      const userId = params[0];
      const user = users.find(u => u.id === userId);
      if (!user) return [];
      
      const userRolesList = userRoles
        .filter(ur => ur.user_id === userId)
        .map(ur => {
          const role = roles.find(r => r.id === ur.role_id);
          return role ? role.name : null;
        })
        .filter(Boolean);
      
      return [{
        ...user,
        roles: userRolesList.join(',')
      }];
    }
    
    // Get all users with roles
    return users.map(user => {
      const userRolesList = userRoles
        .filter(ur => ur.user_id === user.id)
        .map(ur => {
          const role = roles.find(r => r.id === ur.role_id);
          return role ? role.name : null;
        })
        .filter(Boolean);
      
      return {
        ...user,
        roles: userRolesList.join(',')
      };
    });
  }
  
  if (query.includes('SELECT') && query.includes('FROM shows')) {
    // Handle show queries
    if (query.includes('WHERE s.id = ?')) {
      const showId = params[0];
      const show = shows.find(s => s.id === showId);
      if (!show) return [];
      
      const creator = users.find(u => u.id === show.created_by);
      
      return [{
        ...show,
        creator_name: creator ? creator.full_name : null
      }];
    }
    
    // Get all shows with creator names
    return shows.map(show => {
      const creator = users.find(u => u.id === show.created_by);
      
      return {
        ...show,
        creator_name: creator ? creator.full_name : null
      };
    });
  }
  
  if (query.includes('SELECT') && query.includes('FROM schedule')) {
    // Handle schedule queries
    if (query.includes('WHERE s.id = ?')) {
      const scheduleId = params[0];
      const scheduleItem = schedule.find(s => s.id === scheduleId);
      if (!scheduleItem) return [];
      
      const show = shows.find(s => s.id === scheduleItem.show_id);
      const host = users.find(u => u.id === scheduleItem.host_id);
      
      return [{
        ...scheduleItem,
        show_title: show ? show.title : null,
        show_description: show ? show.description : null,
        host_name: host ? host.full_name : null
      }];
    }
    
    // Get all schedule items with show and host details
    return schedule.map(scheduleItem => {
      const show = shows.find(s => s.id === scheduleItem.show_id);
      const host = users.find(u => u.id === scheduleItem.host_id);
      
      return {
        ...scheduleItem,
        show_title: show ? show.title : null,
        show_description: show ? show.description : null,
        host_name: host ? host.full_name : null
      };
    });
  }
  
  if (query.includes('INSERT INTO users')) {
    const [username, passwordHash, email, fullName, isActive] = params;
    const newUser = {
      id: users.length + 1,
      username,
      password_hash: passwordHash,
      email,
      full_name: fullName,
      is_active: isActive,
      last_login: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    users.push(newUser);
    return [{ insertId: newUser.id }];
  }
  
  if (query.includes('INSERT INTO user_roles')) {
    const [userId, roleId] = params;
    userRoles.push({ user_id: userId, role_id: roleId });
    return [{ affectedRows: 1 }];
  }
  
  if (query.includes('UPDATE users')) {
    const id = params[params.length - 1];
    const index = users.findIndex(u => u.id === id);
    
    if (index !== -1) {
      const [username, email, fullName, isActive] = params;
      
      users[index] = {
        ...users[index],
        username,
        email,
        full_name: fullName,
        is_active: isActive,
        updated_at: new Date().toISOString()
      };
      
      return [{ affectedRows: 1 }];
    }
    
    return [{ affectedRows: 0 }];
  }
  
  if (query.includes('DELETE FROM user_roles')) {
    const userId = params[0];
    userRoles = userRoles.filter(ur => ur.user_id !== userId);
    return [{ affectedRows: 1 }];
  }
  
  if (query.includes('DELETE FROM users')) {
    const userId = params[0];
    const initialLength = users.length;
    users = users.filter(u => u.id !== userId);
    userRoles = userRoles.filter(ur => ur.user_id !== userId);
    
    return [{ affectedRows: initialLength - users.length }];
  }
  
  // Add support for schedule operations
  if (query.includes('INSERT INTO schedule')) {
    const [showId, dayOfWeek, startTime, endTime, hostId, isRecurring, createdAt, updatedAt] = params;
    const newScheduleItem = {
      id: schedule.length + 1,
      show_id: showId,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
      host_id: hostId,
      is_recurring: isRecurring,
      created_at: createdAt,
      updated_at: updatedAt
    };
    
    schedule.push(newScheduleItem);
    return [{ insertId: newScheduleItem.id }];
  }
  
  if (query.includes('UPDATE schedule')) {
    const id = params[params.length - 1];
    const index = schedule.findIndex(s => s.id === id);
    
    if (index !== -1) {
      const [showId, dayOfWeek, startTime, endTime, hostId, isRecurring, updatedAt] = params;
      
      schedule[index] = {
        ...schedule[index],
        show_id: showId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        host_id: hostId,
        is_recurring: isRecurring,
        updated_at: updatedAt
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
  
  if (query.includes('SELECT id FROM roles WHERE name = ?')) {
    const roleName = params[0];
    const role = roles.find(r => r.name === roleName);
    
    return role ? [[role]] : [[]];
  }
  
  // Default fallback
  return [];
};

// Authentication functions
export const authenticateUser = async (username: string, passwordHash: string) => {
  const user = users.find(u => u.username === username && u.password_hash === passwordHash && u.is_active === 1);
  
  if (user) {
    const userRolesList = userRoles
      .filter(ur => ur.user_id === user.id)
      .map(ur => {
        const role = roles.find(r => r.id === ur.role_id);
        return role ? role.name : null;
      })
      .filter(Boolean);
    
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
      fullName: user.full_name,
      roles: userRolesList
    };
  }
  
  return null;
};
