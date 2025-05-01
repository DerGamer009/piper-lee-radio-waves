
import { executeQuery, authenticateUser as authUser } from "../services/dbService";

// Type definitions
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
    const users = await executeQuery("SELECT * FROM users") as DBUser[];
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
    
    const newUserId = result[0].insertId;
    const newUser = await executeQuery("SELECT * FROM users WHERE id = ?", [newUserId]) as DBUser[];
    
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
export const updateUser = async (id: number, userData: Partial<CreateUserData>): Promise<Omit<DBUser, 'password'> | null> => {
  try {
    await executeQuery("UPDATE users", [userData, id]);
    
    const updatedUser = await executeQuery("SELECT * FROM users WHERE id = ?", [id]) as DBUser[];
    
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
export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const result = await executeQuery("DELETE FROM users", [id]);
    return result[0].affectedRows > 0;
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
