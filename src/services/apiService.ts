import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
}

export interface CreateUserData {
  username: string;
  password: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
}

export const createNewUser = async (userData: CreateUserData): Promise<User> => {
  // Create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true,
    user_metadata: {
      username: userData.username,
      full_name: userData.fullName
    }
  });

  if (authError) throw authError;
  
  // User roles will be created automatically via trigger for 'user' role
  // But we need to add any additional roles
  
  const userId = authData.user.id;
  
  // Remove default 'user' role if needed to avoid duplicates
  await supabase.from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role', 'user');
  
  // Add all selected roles
  for (const role of userData.roles) {
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role
      });
    
    if (error) throw error;
  }
  
  return {
    id: userId,
    username: userData.username,
    email: userData.email,
    fullName: userData.fullName,
    roles: userData.roles,
    isActive: userData.isActive
  };
};

export const updateUser = async (userId: string, userData: Omit<User, 'id'>): Promise<User> => {
  // Update the profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      username: userData.username,
      full_name: userData.fullName
    })
    .eq('id', userId);
  
  if (profileError) throw profileError;
  
  // Update email if changed
  const { data: userData2 } = await supabase.auth.admin.getUserById(userId);
  if (userData2 && userData2.user && userData2.user.email !== userData.email) {
    const { error } = await supabase.auth.admin.updateUserById(
      userId, 
      { email: userData.email, email_confirm: true }
    );
    if (error) throw error;
  }
  
  // Update roles
  // First, remove all existing roles
  await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId);
  
  // Then add the new roles
  for (const role of userData.roles) {
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role
      });
    
    if (error) throw error;
  }
  
  return {
    id: userId,
    ...userData
  };
};
