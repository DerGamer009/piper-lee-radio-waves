
import { supabase } from "@/integrations/supabase/client";

export interface Podcast {
  id: string;
  title: string;
  host: string;
  description: string;
  audio_url: string;
  image_url: string;
  duration: string;
  category: string;
  published_at: string;
  is_published: boolean;
}

export const getLatestPodcasts = async (limit = 4): Promise<Podcast[]> => {
  try {
    const { data, error } = await supabase
      .from('podcasts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Fehler beim Laden der Podcasts:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Unerwarteter Fehler beim Laden der Podcasts:", error);
    return [];
  }
};
