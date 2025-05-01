// This file handles database operations using Supabase

import { supabase } from "../integrations/supabase/client";

// Authentication functions
export const authenticateUser = async (username: string, password: string) => {
  console.log('Authenticating user:', username);
  
  try {
    // Sign in with username/email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username.includes('@') ? username : `${username}@example.com`,
      password: password
    });
    
    if (error) throw error;
    
    if (data.user) {
      // Get user profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      // Get user roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id);
      
      let roles = ['user']; // Default role
      if (rolesData && rolesData.length > 0) {
        // Make sure we're accessing the data correctly
        roles = rolesData.map(r => r.role);
      }
      
      return {
        id: data.user.id,
        username: profileData?.username || username,
        email: data.user.email,
        fullName: profileData?.full_name || "",
        roles: roles.join(','),
        isActive: profileData?.is_active !== false, // Default to true if undefined
        createdAt: profileData?.created_at || data.user.created_at
      };
    }
    
    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};

// Query execution function that now uses Supabase
export const executeQuery = async (query: string, params: any[] = []) => {
  console.log('Executing query:', query, 'with params:', params);
  
  // Parse query to determine what operation to perform
  const queryLower = query.toLowerCase();
  
  try {
    if (queryLower.includes('select') && queryLower.includes('from users')) {
      // Get all users or specific user from profiles and user_roles
      let queryBuilder = supabase
        .from('profiles')
        .select('*, user_roles(role)');
      
      if (params.length > 0 && queryLower.includes('where id =')) {
        const userId = params[0];
        queryBuilder = queryBuilder.eq('id', userId);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      
      return data.map(user => {
        // Handle the case where user_roles might be null, an array, or an object
        let roles = 'user'; // Default role
        
        // Safely handle user_roles which might be null
        if (user.user_roles) {
          if (Array.isArray(user.user_roles)) {
            // If it's an array of role objects
            roles = user.user_roles
              .map((r: any) => r.role)
              .filter(Boolean)
              .join(',') || 'user';
          } 
          else if (typeof user.user_roles === 'object') {
            // If it's a single object
            roles = (user.user_roles as any).role || 'user';
          }
        }
        
        return {
          id: user.id,
          username: user.username,
          password: 'REDACTED', // Password hash not exposed
          email: user.email,
          fullName: user.full_name,
          roles: roles,
          isActive: user.is_active,
          createdAt: user.created_at
        };
      });
    }
    
    if (queryLower.includes('select') && queryLower.includes('from shows')) {
      // Get all shows or specific show
      let queryBuilder = supabase.from('shows').select('*');
      
      if (params.length > 0 && queryLower.includes('where id =')) {
        const showId = params[0];
        queryBuilder = queryBuilder.eq('id', showId);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      
      return data;
    }
    
    if (queryLower.includes('select') && queryLower.includes('from schedule')) {
      // Get all schedule items or specific schedule item
      let queryBuilder = supabase
        .from('schedule')
        .select(`
          *,
          shows:show_id (
            id,
            title,
            description
          )
        `);
      
      if (params.length > 0 && queryLower.includes('where id =')) {
        const scheduleId = params[0];
        queryBuilder = queryBuilder.eq('id', scheduleId);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        show_title: item.shows?.title || 'Unknown',
        show_description: item.shows?.description || ''
      }));
    }
    
    if (queryLower.includes('insert into users')) {
      const userData = params[0];
      
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email || `${userData.username}@example.com`,
        password: userData.password
      });
      
      if (authError) throw authError;
      
      if (!authData.user) throw new Error("Failed to create user");
      
      // Create profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: userData.username,
          full_name: userData.fullName || null,
          email: userData.email || null,
          is_active: userData.isActive !== undefined ? userData.isActive : true
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add roles
      if (userData.roles && Array.isArray(userData.roles)) {
        const rolePromises = userData.roles.map(role => 
          supabase
            .from('user_roles')
            .insert({
              user_id: authData.user!.id,
              role: role
            })
        );
        
        await Promise.all(rolePromises);
      }
      
      return [{ insertId: authData.user.id }];
    }
    
    if (queryLower.includes('update users')) {
      const userData = params[0];
      const id = params[1];
      
      // Update profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: userData.username,
          full_name: userData.fullName,
          email: userData.email,
          is_active: userData.isActive
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update roles if provided
      if (userData.roles) {
        // First delete all existing roles
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', id);
        
        // Then insert new roles
        const roles = Array.isArray(userData.roles) ? userData.roles : userData.roles.split(',');
        const rolePromises = roles.map(role => 
          supabase
            .from('user_roles')
            .insert({
              user_id: id,
              role: role.trim()
            })
        );
        
        await Promise.all(rolePromises);
      }
      
      return [{ affectedRows: 1 }];
    }
    
    if (queryLower.includes('delete from users')) {
      const userId = params[0];
      
      // Delete from auth.users will cascade to profiles and user_roles
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      return [{ affectedRows: 1 }];
    }
    
    if (queryLower.includes('insert into shows')) {
      const showData = params[0];
      
      const { data, error } = await supabase
        .from('shows')
        .insert(showData)
        .select()
        .single();
      
      if (error) throw error;
      
      return [{ insertId: data.id }];
    }
    
    if (queryLower.includes('update shows')) {
      const showData = params[0];
      const id = params[1];
      
      const { data, error } = await supabase
        .from('shows')
        .update(showData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return [{ affectedRows: 1 }];
    }
    
    if (queryLower.includes('delete from shows')) {
      const showId = params[0];
      
      // Delete the show
      const { error } = await supabase
        .from('shows')
        .delete()
        .eq('id', showId);
      
      if (error) throw error;
      
      // Delete related schedule items
      await supabase
        .from('schedule')
        .delete()
        .eq('show_id', showId);
      
      return [{ affectedRows: 1 }];
    }
    
    if (queryLower.includes('insert into schedule')) {
      const scheduleData = params[0];
      
      const { data, error } = await supabase
        .from('schedule')
        .insert(scheduleData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Get related show and host information
      const { data: showData } = await supabase
        .from('shows')
        .select('title, description')
        .eq('id', scheduleData.show_id)
        .single();
      
      let hostName = 'Nicht zugewiesen';
      if (scheduleData.host_id) {
        const { data: hostData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', scheduleData.host_id)
          .single();
        
        if (hostData) {
          hostName = hostData.full_name;
        }
      }
      
      // Return the created item with additional information
      return [{
        insertId: data.id,
        show_title: showData?.title || null,
        show_description: showData?.description || null,
        host_name: hostName
      }];
    }
    
    if (queryLower.includes('update schedule')) {
      const scheduleData = params[0];
      const id = params[1];
      
      const { data, error } = await supabase
        .from('schedule')
        .update(scheduleData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return [{ affectedRows: 1 }];
    }
    
    if (queryLower.includes('delete from schedule')) {
      const scheduleId = params[0];
      
      const { error } = await supabase
        .from('schedule')
        .delete()
        .eq('id', scheduleId);
      
      if (error) throw error;
      
      return [{ affectedRows: 1 }];
    }
    
    // Default fallback for unsupported queries
    console.warn('Unsupported query:', query);
    return [];
    
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
};

export default {
  authenticateUser,
  executeQuery
};
