
import { executeQuery, authenticateUser as authUser } from "../services/dbService";

// Type definitions
export interface DBUser {
  id: string; // Changed from number to string to match Supabase UUID format
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

// Authentication function
export const authenticateUser = async (username: string, password: string): Promise<Omit<DBUser, 'password'> | null> => {
  try {
    return await authUser(username, password);
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};

// Get all users
export const getAllUsers = async (): Promise<Omit<DBUser, 'password'>[]> => {
  try {
    // Use type assertion to help TypeScript understand the return type
    const users = await executeQuery("SELECT * FROM users") as unknown as DBUser[];
    return users.map(({ password, ...user }) => user);
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Create user
export const createUser = async (userData: CreateUserData): Promise<Omit<DBUser, 'password'>> => {
  try {
    const result = await executeQuery("INSERT INTO users", [{
      username: userData.username,
      password: userData.password,
      fullName: userData.fullName || null,
      email: userData.email || null,
      roles: userData.roles.join(','),
      isActive: userData.isActive ?? true
    }]);
    
    // Use safe access pattern for insertId
    const newUserId = typeof result[0] === 'object' && result[0] !== null && 'insertId' in result[0] 
      ? result[0].insertId 
      : -1;
    
    if (newUserId === -1) {
      throw new Error("Failed to get inserted ID");
    }
    
    // Use type assertion to help TypeScript understand the return type
    const newUser = await executeQuery("SELECT * FROM users WHERE id = ?", [newUserId]) as unknown as DBUser[];
    
    if (!newUser[0]) {
      throw new Error("Failed to retrieve created user");
    }
    
    const { password, ...userWithoutPassword } = newUser[0];
    return userWithoutPassword;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update user
export const updateUser = async (id: string, userData: Partial<CreateUserData>): Promise<Omit<DBUser, 'password'> | null> => {
  try {
    // Fix the UPDATE query to properly use the id parameter
    // Create an object with only the fields that need to be updated
    const updateData: Record<string, any> = {};
    
    if (userData.username !== undefined) updateData.username = userData.username;
    if (userData.password !== undefined) updateData.password = userData.password;
    if (userData.fullName !== undefined) updateData.fullName = userData.fullName;
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.isActive !== undefined) updateData.isActive = userData.isActive;
    
    // Special handling for roles array
    if (userData.roles !== undefined) {
      updateData.roles = userData.roles.join(',');
    }
    
    // Execute the update query with the correct parameters
    await executeQuery("UPDATE users SET ? WHERE id = ?", [updateData, id]);
    
    // Use type assertion to help TypeScript understand the return type
    const updatedUser = await executeQuery("SELECT * FROM users WHERE id = ?", [id]) as unknown as DBUser[];
    
    if (!updatedUser[0]) {
      return null;
    }
    
    const { password, ...userWithoutPassword } = updatedUser[0];
    return userWithoutPassword;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const result = await executeQuery("DELETE FROM users WHERE id = ?", [id]);
    
    // Use safe access pattern for affectedRows
    const affectedRows = typeof result[0] === 'object' && result[0] !== null && 'affectedRows' in result[0] 
      ? result[0].affectedRows 
      : 0;
    
    return affectedRows > 0;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

export default {
  authenticateUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
