
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
}

export const getActivePolls = async (limit = 2): Promise<Poll[]> => {
  try {
    // Hole aktive Umfragen
    const { data: polls, error } = await supabase
      .from('polls')
      .select('id, question, is_active')
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
