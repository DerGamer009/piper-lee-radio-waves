
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchEvents } from "@/services/radioService";
import { Calendar, CalendarCheck } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  image_url?: string;
}

export function EventsCalendar() {
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

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return date.toLocaleDateString('de-DE', options);
  };

  // Fallback-Daten, wenn noch keine Events in der Datenbank sind
  const fallbackEvents = [
    { 
      id: "1", 
      title: "Radio-Festival", 
      description: "Live-Musik und DJs den ganzen Tag", 
      event_date: new Date(Date.now() + 7*24*60*60*1000).toISOString(), 
      location: "Stadtpark" 
    },
    { 
      id: "2", 
      title: "Interview mit Musikstar", 
      description: "Exklusives Interview mit bekanntem Künstler", 
      event_date: new Date(Date.now() + 3*24*60*60*1000).toISOString(), 
      location: "Studio 3" 
    },
    { 
      id: "3", 
      title: "Open Mic Night", 
      description: "Zeige dein Talent bei unserer Open Mic Night", 
      event_date: new Date(Date.now() + 10*24*60*60*1000).toISOString(), 
      location: "Radio Bar" 
    },
  ];

  const displayEvents = events.length > 0 ? events : fallbackEvents;

  return (
    <Card className="border border-gray-800/50 bg-gradient-to-br from-[#1c1f2f]/60 to-[#252a40]/60 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-radio-purple" />
          Kommende Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-3 border border-gray-800/30 rounded-md animate-pulse">
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-gray-700 rounded w-3/5"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                </div>
                <div className="h-3 bg-gray-800 rounded mb-1 w-full"></div>
                <div className="h-3 bg-gray-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : displayEvents.length > 0 ? (
          <div className="space-y-3">
            {displayEvents.map((event) => (
              <div key={event.id} className="p-3 border border-gray-800/30 rounded-md hover:bg-gray-800/20 transition-colors">
                <div className="flex justify-between mb-1">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <span className="text-xs text-radio-purple">
                    {formatEventDate(event.event_date)}
                  </span>
                </div>
                {event.description && (
                  <p className="text-xs text-gray-400 line-clamp-2">{event.description}</p>
                )}
                {event.location && (
                  <div className="flex items-center mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-gray-500 mr-1"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="text-xs text-gray-500">{event.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">Keine anstehenden Events</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
