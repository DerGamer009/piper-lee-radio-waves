
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
      `);
    
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
