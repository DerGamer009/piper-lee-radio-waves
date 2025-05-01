
import { useState, useEffect } from "react";
import { fetchEvents } from "@/services/radioService";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  image_url?: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const eventList = await fetchEvents();
        setEvents(eventList);
      } catch (error) {
        console.error("Fehler beim Laden der Events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Fallback-Events, falls keine Events in der Datenbank sind
  const fallbackEvents = [
    { 
      id: "1", 
      title: "Radio-Festival", 
      description: "Erlebe Live-Musik und DJ-Sets den ganzen Tag über. Genieße Essen, Trinken und tolle Atmosphäre im Stadtpark. Tickets sind im Vorverkauf und an der Tageskasse erhältlich.", 
      event_date: new Date(Date.now() + 7*24*60*60*1000).toISOString(), 
      location: "Stadtpark" 
    },
    { 
      id: "2", 
      title: "Interview mit Musikstar", 
      description: "Exklusives Interview mit bekanntem Künstler. Stelle deine Fragen live im Chat und gewinne signierte Merchandise-Artikel.", 
      event_date: new Date(Date.now() + 3*24*60*60*1000).toISOString(), 
      location: "Studio 3" 
    },
    { 
      id: "3", 
      title: "Open Mic Night", 
      description: "Zeige dein Talent bei unserer Open Mic Night. Egal ob Gesang, Comedy oder Poesie - die Bühne gehört dir! Anmeldung im Voraus erforderlich.", 
      event_date: new Date(Date.now() + 10*24*60*60*1000).toISOString(), 
      location: "Radio Bar" 
    },
    { 
      id: "4", 
      title: "Musik-Workshop", 
      description: "Lerne die Grundlagen der Musikproduktion von unseren erfahrenen Produzenten. Mit praktischen Übungen und Tipps für den Einstieg.", 
      event_date: new Date(Date.now() + 14*24*60*60*1000).toISOString(), 
      location: "Medienzentrum" 
    },
    { 
      id: "5", 
      title: "Live-Übertragung: Stadtfest", 
      description: "Wir übertragen live vom jährlichen Stadtfest mit Interviews, Live-Musik und Reportagen direkt aus dem Zentrum des Geschehens.", 
      event_date: new Date(Date.now() + 21*24*60*60*1000).toISOString(), 
      location: "Marktplatz" 
    },
  ];

  const displayEvents = events.length > 0 ? events : fallbackEvents;

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric',
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return date.toLocaleDateString('de-DE', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Veranstaltungen</h1>
      <p className="text-radio-light/70 mb-8 max-w-3xl">
        Hier findest du alle kommenden Veranstaltungen und Events rund um unser Radio. 
        Von Live-Übertragungen bis hin zu Konzerten und Workshops - sei dabei!
      </p>
      
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-gray-800/50 bg-gradient-to-br from-[#1c1f2f]/60 to-[#252a40]/60 backdrop-blur-sm shadow-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-800"></div>
              <CardContent className="p-5">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-800 rounded mb-2 w-1/2"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-800 rounded w-full"></div>
                  <div className="h-3 bg-gray-800 rounded w-full"></div>
                  <div className="h-3 bg-gray-800 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : displayEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayEvents.map((event) => (
            <Card key={event.id} className="border border-gray-800/50 bg-gradient-to-br from-[#1c1f2f]/60 to-[#252a40]/60 backdrop-blur-sm shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-800 relative">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-radio-purple/20 to-radio-blue/20">
                    <Calendar className="h-12 w-12 text-radio-purple/60" />
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
                <div className="flex items-center text-sm text-radio-purple mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-1"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {formatEventDate(event.event_date)}
                </div>
                {event.location && (
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-1"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {event.location}
                  </div>
                )}
                {event.description && (
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {event.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Keine Events vorhanden</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Derzeit sind keine Veranstaltungen geplant. Schau bald wieder vorbei!
          </p>
        </div>
      )}
    </div>
  );
};

export default Events;
