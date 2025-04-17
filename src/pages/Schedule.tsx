
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Radio, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { fetchSchedule } from "@/services/radioService";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ScheduleItem {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  day: string;
  host?: string;
}

const Schedule = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<string>("Montag");
  const { toast } = useToast();

  const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

  useEffect(() => {
    const getSchedule = async () => {
      setLoading(true);
      try {
        const data = await fetchSchedule();
        setSchedule(data);
      } catch (error) {
        console.error("Fehler beim Laden des Sendeplans:", error);
        toast({
          title: "Fehler",
          description: "Der Sendeplan konnte nicht geladen werden.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getSchedule();
  }, [toast]);

  const filteredSchedule = schedule.filter(item => item.day === activeDay);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 md:mb-12 flex items-center">
            <Button asChild variant="ghost" className="text-radio-light hover:text-white">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Zurück zur Startseite
              </Link>
            </Button>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sendeplan</h1>
            <p className="text-radio-light/70 max-w-2xl mx-auto">
              Hier finden Sie unseren aktuellen Sendeplan. Alle Sendungen auf einen Blick.
            </p>
          </div>
          
          {/* Day selector */}
          <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide">
            <div className="flex space-x-2">
              {days.map((day) => (
                <Button
                  key={day}
                  variant={activeDay === day ? "default" : "outline"}
                  className={`rounded-full px-4 whitespace-nowrap ${
                    activeDay === day 
                      ? "bg-radio-purple hover:bg-radio-purple/90" 
                      : "border-radio-light/20 hover:border-radio-purple/50"
                  }`}
                  onClick={() => setActiveDay(day)}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-radio-purple border-t-transparent rounded-full"></div>
            </div>
          ) : filteredSchedule.length > 0 ? (
            <div className="bg-card/30 backdrop-blur-sm rounded-xl overflow-hidden">
              <Table>
                <TableCaption>Sendeplan für {activeDay}</TableCaption>
                <TableHeader>
                  <TableRow className="border-b border-white/10">
                    <TableHead className="text-white">Zeit</TableHead>
                    <TableHead className="text-white">Sendung</TableHead>
                    <TableHead className="text-white hidden md:table-cell">Beschreibung</TableHead>
                    <TableHead className="text-white hidden sm:table-cell">Moderator</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedule.map((item, index) => (
                    <TableRow 
                      key={index} 
                      className={`border-b border-white/10 ${
                        index % 2 === 0 ? "bg-card/20" : "bg-transparent"
                      }`}
                    >
                      <TableCell className="font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-radio-purple" />
                        {item.start_time} - {item.end_time} Uhr
                      </TableCell>
                      <TableCell className="font-semibold">{item.title}</TableCell>
                      <TableCell className="hidden md:table-cell text-radio-light/70">
                        {item.description || "-"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {item.host ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-radio-purple" />
                            {item.host}
                          </div>
                        ) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 bg-card/30 backdrop-blur-sm rounded-xl">
              <Calendar className="h-12 w-12 text-radio-purple mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Keine Sendungen gefunden</h3>
              <p className="text-radio-light/70">
                Für {activeDay} sind keine Sendungen geplant.
              </p>
            </div>
          )}
          
          <div className="mt-12 text-center">
            <p className="text-radio-light/70 mb-6">
              Änderungen im Sendeplan vorbehalten. Alle Angaben ohne Gewähr.
            </p>
            <Button 
              asChild
              className="bg-radio-purple hover:bg-radio-purple/90 text-white rounded-full px-8"
            >
              <Link to="/partner">Unsere Partner</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="bg-radio-dark/80 backdrop-blur-sm border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Radio className="h-5 w-5 text-radio-purple" />
              <p className="text-sm text-radio-light/70">
                © 2025 Piper Lee Radio. Alle Rechte vorbehalten.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/datenschutz" className="text-radio-light/70 hover:text-white transition-colors text-sm">
                Datenschutz
              </Link>
              <Link to="/nutzungsbedingungen" className="text-radio-light/70 hover:text-white transition-colors text-sm">
                Nutzungsbedingungen
              </Link>
              <Link to="/impressum" className="text-radio-light/70 hover:text-white transition-colors text-sm">
                Impressum
              </Link>
              <Link to="/kontakt" className="text-radio-light/70 hover:text-white transition-colors text-sm">
                Kontakt
              </Link>
              <Link to="/sendeplan" className="text-radio-light/70 hover:text-white transition-colors text-sm">
                Sendeplan
              </Link>
              <Link to="/partner" className="text-radio-light/70 hover:text-white transition-colors text-sm">
                Partner
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Schedule;
