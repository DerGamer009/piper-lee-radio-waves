
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
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Abrufen der Stream-Informationen:", error);
    return {};
  }
};
