
import { supabase } from "@/integrations/supabase/client";

export interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  is_active: boolean;
  created_at?: string;
  start_date?: string;
  end_date?: string;
  created_by?: string;
}

export const getActivePolls = async (limit = 2): Promise<Poll[]> => {
  try {
    // Hole aktive Umfragen
    const { data: polls, error } = await supabase
      .from('polls')
      .select('id, question, is_active, created_at, start_date, end_date, created_by')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error || !polls) {
      console.error("Fehler beim Laden der Umfragen:", error);
      return [];
    }
    
    // Für jede Umfrage die Optionen laden
    const pollsWithOptions = await Promise.all(
      polls.map(async (poll) => {
        const { data: options, error: optionsError } = await supabase
          .from('poll_options')
          .select('id, poll_id, option_text, votes')
          .eq('poll_id', poll.id)
          .order('votes', { ascending: false });
        
        if (optionsError) {
          console.error(`Fehler beim Laden der Optionen für Umfrage ${poll.id}:`, optionsError);
          return { ...poll, options: [] };
        }
        
        return {
          ...poll,
          options: options || []
        };
      })
    );
    
    return pollsWithOptions;
  } catch (error) {
    console.error("Unerwarteter Fehler beim Laden der Umfragen:", error);
    return [];
  }
};

export const voteForOption = async (optionId: string): Promise<boolean> => {
  try {
    // Hole den aktuellen Stimmwert
    const { data: currentOption, error: fetchError } = await supabase
      .from('poll_options')
      .select('votes')
      .eq('id', optionId)
      .single();
    
    if (fetchError || !currentOption) {
      console.error("Fehler beim Abrufen der Option:", fetchError);
      return false;
    }
    
    // Erhöhe den Stimmwert um 1
    const newVoteCount = (currentOption.votes || 0) + 1;
    
    // Aktualisiere die Stimmen in der Datenbank
    const { error } = await supabase
      .from('poll_options')
      .update({ votes: newVoteCount })
      .eq('id', optionId);
    
    if (error) {
      console.error("Fehler beim Abstimmen:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Unerwarteter Fehler beim Abstimmen:", error);
    return false;
  }
};

export const getAllPolls = async (): Promise<Poll[]> => {
  try {
    const { data: polls, error } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error || !polls) {
      console.error("Fehler beim Laden der Umfragen:", error);
      return [];
    }
    
    // Für jede Umfrage die Optionen laden
    const pollsWithOptions = await Promise.all(
      polls.map(async (poll) => {
        const { data: options, error: optionsError } = await supabase
          .from('poll_options')
          .select('*')
          .eq('poll_id', poll.id);
        
        if (optionsError) {
          console.error(`Fehler beim Laden der Optionen für Umfrage ${poll.id}:`, optionsError);
          return { ...poll, options: [] };
        }
        
        return {
          ...poll,
          options: options || []
        };
      })
    );
    
    return pollsWithOptions;
  } catch (error) {
    console.error("Fehler beim Laden aller Umfragen:", error);
    return [];
  }
};

export const createPoll = async (poll: Omit<Poll, 'id' | 'options'>, options: string[]): Promise<Poll | null> => {
  try {
    // Erstelle die Umfrage
    const { data: newPoll, error } = await supabase
      .from('polls')
      .insert(poll)
      .select()
      .single();
    
    if (error || !newPoll) {
      console.error("Fehler beim Erstellen der Umfrage:", error);
      return null;
    }
    
    // Erstelle die Optionen für die Umfrage
    const optionsToInsert = options.map(option => ({
      poll_id: newPoll.id,
      option_text: option,
      votes: 0
    }));
    
    const { data: pollOptions, error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert)
      .select();
    
    if (optionsError) {
      console.error("Fehler beim Erstellen der Umfrageoptionen:", optionsError);
      // Lösche die erstellte Umfrage wieder, um keine verwaisten Umfragen zu haben
      await supabase.from('polls').delete().eq('id', newPoll.id);
      return null;
    }
    
    return {
      ...newPoll,
      options: pollOptions || []
    };
  } catch (error) {
    console.error("Unerwarteter Fehler beim Erstellen einer Umfrage:", error);
    return null;
  }
};

export const updatePollActivity = async (pollId: string, isActive: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('polls')
      .update({ is_active: isActive })
      .eq('id', pollId);
    
    if (error) {
      console.error("Fehler beim Aktualisieren des Umfragestatus:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Unerwarteter Fehler beim Aktualisieren des Umfragestatus:", error);
    return false;
  }
};

export const deletePoll = async (pollId: string): Promise<boolean> => {
  try {
    // Lösche zuerst alle Optionen
    const { error: optionsError } = await supabase
      .from('poll_options')
      .delete()
      .eq('poll_id', pollId);
    
    if (optionsError) {
      console.error("Fehler beim Löschen der Umfrageoptionen:", optionsError);
      return false;
    }
    
    // Lösche dann die Umfrage selbst
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId);
    
    if (error) {
      console.error("Fehler beim Löschen der Umfrage:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Unerwarteter Fehler beim Löschen der Umfrage:", error);
    return false;
  }
};
