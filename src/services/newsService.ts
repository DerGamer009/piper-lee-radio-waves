
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  author?: string;
  published_at: string;
  tags?: string[];
}

// Simulierte Daten für die News
const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "Neues Morgenprogramm ab nächster Woche",
    content: "Ab kommender Woche begrüßt dich unser neuer Moderator Max Mustermensch jeden Morgen zwischen 6 und 10 Uhr mit den besten Hits und aktuellen Themen.",
    image_url: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=1470&auto=format&fit=crop",
    author: "Redaktion",
    published_at: "2025-04-25T08:00:00Z",
    tags: ["Programm", "Moderator", "Morgenshow"]
  },
  {
    id: 2,
    title: "Sommergewinnspiel startet am 1. Juni",
    content: "Gewinne einen von zehn Urlauben an der Ostsee! Unser großes Sommergewinnspiel startet am 1. Juni. Höre täglich rein, um nichts zu verpassen.",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1473&auto=format&fit=crop",
    author: "Marketing-Team",
    published_at: "2025-04-22T14:30:00Z",
    tags: ["Gewinnspiel", "Sommer", "Urlaub"]
  },
  {
    id: 3,
    title: "Neue App-Version verfügbar",
    content: "Unsere neue App-Version ist jetzt im App-Store und bei Google Play verfügbar. Mit verbessertem Player, Songwünschen und personalisierten Playlists!",
    image_url: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1471&auto=format&fit=crop",
    author: "Entwicklerteam",
    published_at: "2025-04-18T11:45:00Z",
    tags: ["App", "Technologie", "Update"]
  },
  {
    id: 4,
    title: "Star-DJ kommt zu unserem Sommerfestival",
    content: "Wir freuen uns bekannt zu geben, dass der international bekannte DJ Martin Wave bei unserem diesjährigen Sommerfestival auflegen wird!",
    image_url: "https://images.unsplash.com/photo-1571266028243-e9e32914abb0?q=80&w=1170&auto=format&fit=crop",
    author: "Veranstaltungsteam",
    published_at: "2025-04-15T16:20:00Z",
    tags: ["Festival", "DJ", "Sommer", "Event"]
  },
  {
    id: 5,
    title: "Interview mit Newcomer-Band 'Electric Skies'",
    content: "Die aufsteigende Band 'Electric Skies' war bei uns im Studio und hat über ihr neues Album und ihre kommende Tour gesprochen. Das vollständige Interview gibt es jetzt in unserem Podcast.",
    image_url: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=1576&auto=format&fit=crop",
    author: "Musikredaktion",
    published_at: "2025-04-10T09:15:00Z",
    tags: ["Interview", "Band", "Musik", "Podcast"]
  }
];

export const fetchAllNews = async (): Promise<NewsItem[]> => {
  // Hier würde normalerweise ein API-Aufruf stehen
  // Wir simulieren eine Verzögerung für die API-Anfrage
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...mockNews].sort((a, b) => 
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      ));
    }, 500);
  });
};

export const fetchNewsById = async (id: number): Promise<NewsItem | null> => {
  // Auch hier würde normalerweise ein API-Aufruf stehen
  return new Promise(resolve => {
    setTimeout(() => {
      const news = mockNews.find(item => item.id === id);
      resolve(news || null);
    }, 300);
  });
};
