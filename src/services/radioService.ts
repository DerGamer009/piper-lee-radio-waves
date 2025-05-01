
import { supabase } from "@/integrations/supabase/client";

interface StreamInfo {
  title?: string;
  artist?: string;
  listeners?: number;
  current_song?: string;
  show_name?: string;
  show_host?: string;
  is_live?: boolean;
  streamer_name?: string;
  elapsed?: number;
  duration?: number;
  remaining?: number;
}

interface ScheduleItem {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  day: string;
  host?: string;
}

interface Partner {
  id: string;
  name: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  is_active?: boolean;
}

interface SongRequest {
  song_name: string;
  artist_name?: string;
  requested_by?: string;
  message?: string;
}

interface ChatMessage {
  user_name: string;
  message: string;
}

interface SongHistoryItem {
  id: string;
  song_name: string;
  artist_name?: string;
  played_at: string;
  image_url?: string;
  duration?: number;
}

interface NewsletterSubscription {
  email: string;
  name?: string;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  image_url?: string;
  is_featured?: boolean;
}

const API_URL = "https://backend.piper-lee.net/api/";

export const fetchStreamInfo = async (): Promise<StreamInfo> => {
  try {
    // Set timeout to avoid long hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_URL}nowplaying/1`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Stream-Informationen: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the relevant information from the complex API response
    return {
      title: data.now_playing?.song?.title || "",
      artist: data.now_playing?.song?.artist || "",
      listeners: data.listeners?.current || 0,
      current_song: data.now_playing?.song?.text || "",
      show_name: data.live?.is_live ? data.live?.streamer_name : "",
      show_host: "",
      is_live: data.live?.is_live || false,
      streamer_name: data.live?.streamer_name || "",
      elapsed: data.now_playing?.elapsed || 0,
      duration: data.now_playing?.duration || 0,
      remaining: data.now_playing?.remaining || 0
    };
  } catch (error) {
    console.error("Fehler beim Abrufen der Stream-Informationen:", error);
    // Return empty object when fetch fails
    return {};
  }
};

export const fetchSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    // Fetch schedule from Supabase with show information
    const { data: scheduleData, error } = await supabase
      .from('schedule')
      .select(`
        id,
        day_of_week,
        start_time,
        end_time,
        is_recurring,
        host_id,
        host_name,
        shows:show_id (
          id,
          title,
          description
        )
      `)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error("Fehler beim Abrufen des Sendeplans:", error);
      throw error;
    }
    
    // Transform the data to match the ScheduleItem interface
    const formattedSchedule: ScheduleItem[] = scheduleData.map(item => {
      return {
        title: item.shows?.title || "Unbenannte Sendung",
        description: item.shows?.description || "",
        start_time: item.start_time,
        end_time: item.end_time,
        day: item.day_of_week,
        host: item.host_name || "Kein Moderator" // Use host_name field
      };
    });
    
    return formattedSchedule;
  } catch (error) {
    console.error("Fehler beim Abrufen des Sendeplans:", error);
    
    // Return empty array to prevent UI errors
    return [];
  }
};

// Funktion zum Abrufen der Partner aus Supabase
export const fetchPartners = async (): Promise<Partner[]> => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) {
      console.error("Fehler beim Abrufen der Partner:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Fehler beim Abrufen der Partner:", error);
    return [];
  }
};

export const createPartner = async (partner: Omit<Partner, 'id'>): Promise<Partner | null> => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .insert(partner)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Fehler beim Erstellen des Partners:", error);
    return null;
  }
};

export const updatePartner = async (id: string, partner: Partial<Partner>): Promise<Partner | null> => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .update(partner)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Partners:", error);
    return null;
  }
};

export const deletePartner = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Fehler beim Löschen des Partners:", error);
    return false;
  }
};

// Neue Funktionen für Song-Wünsche
export const submitSongRequest = async (request: SongRequest): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('song_requests')
      .insert(request);
    
    if (error) {
      console.error("Fehler beim Einreichen des Song-Wunsches:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Fehler beim Einreichen des Song-Wunsches:", error);
    return false;
  }
};

export const fetchSongRequests = async (): Promise<SongRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('song_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Fehler beim Abrufen der Song-Wünsche:", error);
    return [];
  }
};

// Funktionen für Live-Chat
export const sendChatMessage = async (message: ChatMessage): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert(message);
    
    if (error) {
      console.error("Fehler beim Senden der Chat-Nachricht:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Fehler beim Senden der Chat-Nachricht:", error);
    return false;
  }
};

export const fetchChatMessages = async (limit: number = 50): Promise<ChatMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('is_moderated', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Fehler beim Abrufen der Chat-Nachrichten:", error);
    return [];
  }
};

// Funktionen für Song-Historie
export const fetchSongHistory = async (limit: number = 10): Promise<SongHistoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('song_history')
      .select('*')
      .order('played_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Fehler beim Abrufen der Song-Historie:", error);
    return [];
  }
};

// Funktion für Newsletter-Anmeldung
export const subscribeToNewsletter = async (subscription: NewsletterSubscription): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert(subscription);
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation (email already exists)
        throw new Error("Diese E-Mail-Adresse ist bereits angemeldet.");
      }
      console.error("Fehler bei der Newsletter-Anmeldung:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Fehler bei der Newsletter-Anmeldung:", error);
    throw error;
  }
};

// Funktionen für Events/Veranstaltungen
export const fetchEvents = async (featuredOnly: boolean = false): Promise<Event[]> => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    
    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Fehler beim Abrufen der Events:", error);
    return [];
  }
};

// Fetch und speichere aktuelle Wetterdaten
export const fetchWeatherData = async (city: string = "Berlin"): Promise<any> => {
  try {
    // Hier würde normalerweise ein API-Call zu einem Wetterdienst erfolgen
    // Da wir keine echte Wetter-API verwenden, liefern wir Mock-Daten zurück
    return {
      city: city,
      temperature: Math.floor(Math.random() * 15) + 10, // 10-25°C
      condition: ["sonnig", "bewölkt", "regnerisch", "windig"][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
      updated: new Date().toISOString()
    };
  } catch (error) {
    console.error("Fehler beim Abrufen der Wetterdaten:", error);
    return null;
  }
};
