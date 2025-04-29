
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Mail, MessageCircle, User, Radio } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import PollWidget from '@/components/PollWidget';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const UserDashboard = () => {
  const { user } = useAuth();
  
  // Fetch active poll
  const { data: activePoll } = useQuery({
    queryKey: ['active-poll'],
    queryFn: async () => {
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (pollsError) {
        if (pollsError.code === 'PGRST116') {
          // No active polls
          return null;
        }
        throw pollsError;
      }

      // Fetch options for the poll
      const { data: optionsData, error: optionsError } = await supabase
        .from('poll_options')
        .select('*')
        .eq('poll_id', pollsData.id);

      if (optionsError) {
        throw optionsError;
      }

      // Fetch votes for each option
      const optionsWithVotes = await Promise.all(
        optionsData.map(async (option) => {
          const { data: votesData } = await supabase
            .from('poll_votes')
            .select('count')
            .eq('option_id', option.id)
            .count();

          return {
            id: option.id,
            text: option.option_text,
            votes: votesData || 0
          };
        })
      );

      return {
        question: pollsData.question,
        options: optionsWithVotes
      };
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Nachricht gesendet",
      description: "Ihre Nachricht wurde erfolgreich übermittelt. Wir werden uns so schnell wie möglich bei Ihnen melden.",
    });
    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8 text-radio-purple" />
          Mein Dashboard
        </h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="mb-4 bg-background border">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="preferences">Einstellungen</TabsTrigger>
          <TabsTrigger value="contact">Kontakt</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Willkommen zurück!</CardTitle>
                <CardDescription>
                  Schön, dass Sie wieder da sind. Hier sehen Sie Ihre persönliche Übersicht.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium text-lg mb-2">Ihr Profil</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Benutzername:</span> {user.user_metadata.username || user.email}</p>
                      <p><span className="font-medium">Name:</span> {user.user_metadata.full_name || '-'}</p>
                      <p><span className="font-medium">E-Mail:</span> {user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline">
                      Profil bearbeiten
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Kommende Sendungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <div className="font-medium">Morgenmelodien</div>
                    <div className="text-sm text-gray-500">Montag, 08:00 - 11:00 Uhr</div>
                  </div>
                  <div className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <div className="font-medium">Mittagsbeat</div>
                    <div className="text-sm text-gray-500">Montag, 12:00 - 14:00 Uhr</div>
                  </div>
                  <div className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <div className="font-medium">Nachmittagsklänge</div>
                    <div className="text-sm text-gray-500">Dienstag, 13:00 - 15:00 Uhr</div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/sendeplan">Kompletter Sendeplan</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {activePoll && (
            <Card>
              <CardHeader>
                <CardTitle>Ihre Meinung zählt</CardTitle>
                <CardDescription>
                  Nehmen Sie an unserer aktuellen Umfrage teil und teilen Sie uns Ihre Meinung mit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PollWidget 
                  question={activePoll.question} 
                  options={activePoll.options} 
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-radio-purple" />
                Aktuelle Podcasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Musik-News der Woche</div>
                  <div className="text-sm text-gray-500 mt-1">25 Min • Musik</div>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Anhören
                  </Button>
                </div>
                <div className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Interview mit lokalen Künstlern</div>
                  <div className="text-sm text-gray-500 mt-1">42 Min • Talk</div>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Anhören
                  </Button>
                </div>
                <div className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Hinter den Kulissen</div>
                  <div className="text-sm text-gray-500 mt-1">18 Min • Doku</div>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Anhören
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" asChild>
                  <a href="/podcasts">Alle Podcasts</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Ihre Einstellungen</CardTitle>
              <CardDescription>
                Passen Sie Ihr Nutzererlebnis an Ihre Bedürfnisse an.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-center text-muted-foreground">
                Diese Funktion wird in Kürze verfügbar sein.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Kontaktieren Sie uns
              </CardTitle>
              <CardDescription>
                Haben Sie Fragen oder Anregungen? Schreiben Sie uns!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                    Betreff
                  </label>
                  <Input id="subject" placeholder="Worum geht es?" required />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium">
                    Nachricht
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Ihre Nachricht an uns..." 
                    required 
                    rows={5}
                  />
                </div>
                
                <div className="flex gap-4 items-center">
                  <Button className="flex gap-2" type="submit">
                    <Mail className="h-4 w-4" />
                    Nachricht senden
                  </Button>
                  <p className="text-xs text-gray-500">
                    Wir antworten in der Regel innerhalb von 24 Stunden.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
