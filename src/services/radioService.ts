
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

const API_URL = "https://backend.piper-lee.net/api/";

export const fetchStreamInfo = async (): Promise<StreamInfo> => {
  try {
    const response = await fetch(`${API_URL}nowplaying/1`);
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
    return {};
  }
};

export const fetchSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    // Fetch schedule from Supabase
    const { data: scheduleData, error } = await supabase
      .from('schedule')
      .select(`
        id,
        day_of_week,
        start_time,
        end_time,
        is_recurring,
        host_id,
        shows:show_id (
          id,
          title,
          description
        )
      `)
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
        host: "" // Since we can't get the host name reliably, leave it empty for now
      };
    });
    
    return formattedSchedule;
  } catch (error) {
    console.error("Fehler beim Abrufen des Sendeplans:", error);
    
    // Fallback to placeholder data if there's an error
    return [
      { 
        day: "Montag", 
        title: "Morgenmelodien", 
        description: "Starten Sie Ihren Tag mit den besten Melodien und guter Laune.",
        start_time: "08:00", 
        end_time: "11:00", 
        host: "Maria Müller"
      },
      { 
        day: "Montag", 
        title: "Mittagsbeat", 
        description: "Energiegeladene Musik für Ihre Mittagspause.",
        start_time: "12:00", 
        end_time: "14:00", 
        host: "Thomas Weber"
      },
      { 
        day: "Dienstag", 
        title: "Nachmittagsklänge", 
        description: "Entspannte Musik für den Nachmittag.",
        start_time: "13:00", 
        end_time: "15:00", 
        host: "Laura Schmidt"
      },
      { 
        day: "Mittwoch", 
        title: "Abendechos", 
        description: "Die besten Hits zum Abend.",
        start_time: "19:00", 
        end_time: "21:00", 
        host: "David König"
      },
      { 
        day: "Donnerstag", 
        title: "Nachtlounge", 
        description: "Musik zum Entspannen und Träumen.",
        start_time: "22:00", 
        end_time: "00:00", 
        host: "Sophia Becker"
      },
      { 
        day: "Freitag", 
        title: "Wochenendauftakt", 
        description: "Feiern Sie den Start ins Wochenende mit uns.",
        start_time: "18:00", 
        end_time: "20:00", 
        host: "Max Schneider"
      },
      { 
        day: "Samstag", 
        title: "Partymix", 
        description: "Die heißesten Tracks für Ihre Wochenendparty.",
        start_time: "20:00", 
        end_time: "23:00", 
        host: "Julia Fischer"
      },
      { 
        day: "Sonntag", 
        title: "Sonntagsklassiker", 
        description: "Klassische Hits und Evergreens.",
        start_time: "10:00", 
        end_time: "13:00", 
        host: "Robert Wagner"
      }
    ];
  }
};
