
import { supabase } from "@/integrations/supabase/client";

// Types
export interface ScheduleItem {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  host_id: string | null;
  host_name?: string;
  show_id: string;
  show?: Show;
  show_title?: string;
}

export interface Show {
  id: string;
  title: string;
  description: string | null;
}

// Schedule API functions
export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    const { data, error } = await supabase
      .from('schedule')
      .select(`
        *,
        shows:show_id (
          id,
          title,
          description
        )
      `)
      .order('day_of_week')
      .order('start_time');

    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      ...item,
      show_title: item.shows?.title || 'Unknown'
    }));
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

export const getShows = async (): Promise<Show[]> => {
  try {
    const { data, error } = await supabase
      .from('shows')
      .select('*')
      .order('title');

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching shows:', error);
    throw error;
  }
};

export const createScheduleItem = async (scheduleItem: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem> => {
  try {
    const { data, error } = await supabase
      .from('schedule')
      .insert(scheduleItem)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating schedule item:', error);
    throw error;
  }
};

export const updateScheduleItem = async (id: string, updates: Partial<ScheduleItem>): Promise<ScheduleItem> => {
  try {
    const { data, error } = await supabase
      .from('schedule')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating schedule item:', error);
    throw error;
  }
};

export const deleteScheduleItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    throw error;
  }
};

// Add other API functions here as needed
