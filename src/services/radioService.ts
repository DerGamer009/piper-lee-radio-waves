
interface StreamInfo {
  title?: string;
  artist?: string;
  listeners?: number;
  current_song?: string;
  show_name?: string;
  show_host?: string;
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
