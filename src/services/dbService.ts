// This file provides mock database services for frontend development
// In a real application, these would be API calls to a backend server

/**
 * Mock database users with password credentials
 * Note: In a real application, passwords would be hashed and never stored in plain text
 */
const mockDbUsers = [
  {
    id: 1,
    username: "admin",
    password: "admin123", // In real app, this would be hashed
    email: "admin@radiostation.de",
    fullName: "Admin User",
    roles: ["admin"],
    isActive: true
  },
  {
    id: 2,
    username: "moderator1",
    password: "mod123", // In real app, this would be hashed
    email: "mod1@radiostation.de",
    fullName: "Moderator Eins",
    roles: ["moderator"],
    isActive: true
  },
  {
    id: 3,
    username: "user1",
    password: "user123", // In real app, this would be hashed
    email: "user1@example.com",
    fullName: "Regular User",
    roles: ["user"],
    isActive: false
  }
];

/**
 * Mock database connection info 
 * This is just for demonstration - in a real app this would be server-side only
 */
const dbConfig = {
  host: "127.0.0.1",
  user: "radio_station",
  password: "Gamer09!!",
  database: "radio_station"
};

/**
 * Mock database shows
 */
const mockDbShows = [
  {
    id: 1,
    title: "Morgenmelodien",
    description: "Starten Sie Ihren Tag mit den besten Melodien und guter Laune.",
    imageUrl: null,
    createdBy: 1
  },
  {
    id: 2,
    title: "Mittagsbeat",
    description: "Energiegeladene Musik für Ihre Mittagspause.",
    imageUrl: null,
    createdBy: 1
  },
  {
    id: 3,
    title: "Nachmittagsklänge",
    description: "Entspannte Musik für den Nachmittag.",
    imageUrl: null,
    createdBy: 1
  },
  {
    id: 4,
    title: "Abendechos",
    description: "Die besten Hits zum Abend.",
    imageUrl: null,
    createdBy: 1
  },
  {
    id: 5,
    title: "Nachtlounge",
    description: "Musik zum Entspannen und Träumen.",
    imageUrl: null,
    createdBy: 1
  }
];

/**
 * Mock database schedule
 */
const mockDbSchedule = [
  {
    id: 1,
    showId: 1,
    showTitle: "Morgenmelodien",
    dayOfWeek: "Montag",
    startTime: "08:00:00",
    endTime: "11:00:00",
    hostId: 1,
    hostName: "Admin User",
    isRecurring: true
  },
  {
    id: 2,
    showId: 2,
    showTitle: "Mittagsbeat",
    dayOfWeek: "Montag",
    startTime: "12:00:00",
    endTime: "14:00:00",
    hostId: 1,
    hostName: "Admin User",
    isRecurring: true
  },
  {
    id: 3,
    showId: 3,
    showTitle: "Nachmittagsklänge",
    dayOfWeek: "Dienstag",
    startTime: "13:00:00",
    endTime: "15:00:00",
    hostId: 1,
    hostName: "Admin User",
    isRecurring: true
  },
  {
    id: 4,
    showId: 4,
    showTitle: "Abendechos",
    dayOfWeek: "Mittwoch",
    startTime: "19:00:00",
    endTime: "21:00:00",
    hostId: 1,
    hostName: "Admin User",
    isRecurring: true
  },
  {
    id: 5,
    showId: 5,
    showTitle: "Nachtlounge",
    dayOfWeek: "Donnerstag",
    startTime: "22:00:00",
    endTime: "00:00:00",
    hostId: 1,
    hostName: "Admin User",
    isRecurring: true
  }
];

// Simulate database delay
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));

/**
 * Verify username and password against mock DB
 */
export async function verifyUserCredentials(username: string, password: string) {
  await simulateDelay();
  // In a real application, this would query the database and check password hash
  const user = mockDbUsers.find(u => 
    u.username === username && 
    u.password === password && 
    u.isActive === true
  );
  
  if (user) {
    // Don't return the password in the response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

/**
 * Get all users from the mock database
 */
export async function getDbUsers() {
  await simulateDelay();
  // Return users without passwords
  return mockDbUsers.map(({ password, ...user }) => user);
}

/**
 * Create a new user in the mock database
 */
export async function createDbUser(user: {
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
}) {
  await simulateDelay();
  const newUser = {
    ...user,
    id: mockDbUsers.length + 1,
    password: "default123" // This would be hashed in a real app
  };
  mockDbUsers.push(newUser);
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

/**
 * Get all shows from the mock database
 */
export async function getDbShows() {
  await simulateDelay();
  return [...mockDbShows];
}

/**
 * Get the schedule from the mock database
 */
export async function getDbSchedule() {
  await simulateDelay();
  return [...mockDbSchedule];
}

/**
 * Create a new schedule item in the mock database
 */
export async function createDbScheduleItem(schedule: {
  showId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  hostId?: number;
  isRecurring: boolean;
}) {
  await simulateDelay();
  
  // Find the show to get the title
  const show = mockDbShows.find(s => s.id === schedule.showId);
  if (!show) {
    throw new Error(`Show with ID ${schedule.showId} not found`);
  }
  
  // Find the host name if hostId is provided
  let hostName = undefined;
  if (schedule.hostId) {
    const host = mockDbUsers.find(u => u.id === schedule.hostId);
    if (host) {
      hostName = host.fullName;
    }
  }
  
  const newSchedule = {
    id: mockDbSchedule.length + 1,
    showId: schedule.showId,
    showTitle: show.title,
    dayOfWeek: schedule.dayOfWeek,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    hostId: schedule.hostId,
    hostName,
    isRecurring: schedule.isRecurring
  };
  
  mockDbSchedule.push(newSchedule);
  return newSchedule;
}
