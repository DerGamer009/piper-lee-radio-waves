
interface StreamInfo {
  title?: string;
  artist?: string;
  listeners?: number;
  current_song?: string;
  show_name?: string;
  show_host?: string;
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
      show_host: ""
    };
  } catch (error) {
    console.error("Fehler beim Abrufen der Stream-Informationen:", error);
    return {};
  }
};

export const fetchSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    // This is a fallback schedule since the actual API endpoint isn't specified
    // Replace ${API_URL}schedule with the actual endpoint when available
    
    // Placeholder schedule data
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
  } catch (error) {
    console.error("Fehler beim Abrufen des Sendeplans:", error);
    return [];
  }
};
