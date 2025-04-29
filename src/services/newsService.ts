
import { supabase } from '@/integrations/supabase/client';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  author: string | null;
  published_at: string;
  is_published: boolean;
  tags: string[] | null;
  created_at: string;
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
    
    return data as NewsItem[];
  } catch (error) {
    console.error('Failed to fetch news:', error);
    // Return demo data as fallback for development
    return [
      {
        id: '1',
        title: 'Neue Website gelauncht',
        content: 'Wir freuen uns, unsere neue Website vorzustellen! Entdecken Sie alle neuen Funktionen und Features.',
        image_url: 'https://images.unsplash.com/photo-1516057747705-0609711c1b31?q=80&w=1000',
        author: 'Webmaster',
        published_at: new Date().toISOString(),
        is_published: true,
        tags: ['Website', 'Launch'],
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Neue Radiosendung startet nächste Woche',
        content: 'Ab nächster Woche gibt es eine spannende neue Radiosendung in unserem Programm. Schalten Sie ein und lassen Sie sich überraschen!',
        image_url: 'https://images.unsplash.com/photo-1598295893312-749990ac2ff2?q=80&w=1000',
        author: 'Programmleitung',
        published_at: new Date(Date.now() - 86400000).toISOString(),
        is_published: true,
        tags: ['Radio', 'Sendung', 'Neu'],
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        title: 'Interview mit lokalen Künstlern',
        content: 'In unserer letzten Sendung hatten wir die Gelegenheit, mit einigen lokalen Künstlern zu sprechen. Hier können Sie das Interview nachhören.',
        image_url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000',
        author: 'Redaktion',
        published_at: new Date(Date.now() - 172800000).toISOString(),
        is_published: true,
        tags: ['Interview', 'Kunst', 'Lokal'],
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  }
}

export async function fetchNewsById(id: number | string): Promise<NewsItem> {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching news item:', error);
      throw error;
    }
    
    return data as NewsItem;
  } catch (error) {
    console.error(`Failed to fetch news item with id ${id}:`, error);
    // Return demo data as fallback for development
    return {
      id: String(id),
      title: 'Beispiel News Artikel',
      content: 'Dies ist ein Beispiel-Artikel, der angezeigt wird, wenn die Daten nicht aus der Datenbank geladen werden können. Normalerweise würden hier die Details zum angeforderten News-Eintrag stehen.',
      image_url: 'https://images.unsplash.com/photo-1516057747705-0609711c1b31?q=80&w=1000',
      author: 'System',
      published_at: new Date().toISOString(),
      is_published: true,
      tags: ['Beispiel', 'Fehler'],
      created_at: new Date().toISOString()
    };
  }
}
