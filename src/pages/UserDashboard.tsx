import React from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Mail, MessageCircle, User, Radio, Headphones, Bell, Music, Settings } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import PollWidget from '@/components/PollWidget';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import DashboardCard from '@/components/dashboard/DashboardCard';

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
          const { count, error: votesError } = await supabase
            .from('poll_votes')
            .select('*', { count: 'exact', head: true })
            .eq('option_id', option.id);

          if (votesError) {
            console.error('Error counting votes:', votesError);
            return {
              id: option.id,
              text: option.option_text,
              votes: 0
            };
          }

          return {
            id: option.id,
            text: option.option_text,
            votes: count || 0
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
    <div className="container mx-auto py-8 px-4 bg-radio-dark/5 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-radio-purple to-radio-blue bg-clip-text text-transparent">
          <User className="h-8 w-8 text-radio-purple" />
          Mein Dashboard
        </h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="mb-4 bg-background border rounded-lg p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Übersicht</TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Einstellungen</TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Kontakt</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
              title="Willkommen zurück!"
              icon={<User className="h-5 w-5 text-radio-purple" />}
              className="bg-gradient-to-br from-card to-card/80 hover:shadow-md transition-all duration-300"
              actionButton={
                <Button variant="outline" size="sm">
                  Profil bearbeiten
                </Button>
              }
            >
              <CardDescription className="mb-4">
                Schön, dass Sie wieder da sind. Hier sehen Sie Ihre persönliche Übersicht.
              </CardDescription>
              <div className="p-4 bg-background/50 backdrop-blur-sm rounded-md border border-muted">
                <h3 className="font-medium text-lg mb-2">Ihr Profil</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="purple">Benutzername</Badge>
                    <span className="font-medium">{user.user_metadata.username || user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="purple">Name</Badge>
                    <span className="font-medium">{user.user_metadata.full_name || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="purple">E-Mail</Badge>
                    <span className="font-medium">{user.email}</span>
                  </div>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="Kommende Sendungen"
              icon={<Calendar className="h-5 w-5 text-radio-purple" />}
              className="bg-gradient-to-br from-card to-card/80 hover:shadow-md transition-all duration-300"
              actionButton={
                <Button variant="outline" size="sm" asChild>
                  <a href="/sendeplan">Kompletter Sendeplan</a>
                </Button>
              }
            >
              <div className="space-y-3">
                <div className="p-3 border rounded-md bg-background/30 backdrop-blur-sm hover:bg-radio-purple/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Morgenmelodien</div>
                      <div className="text-sm text-muted-foreground">Montag, 08:00 - 11:00 Uhr</div>
                    </div>
                    <Badge variant="info">Live</Badge>
                  </div>
                </div>
                <div className="p-3 border rounded-md bg-background/30 backdrop-blur-sm hover:bg-radio-purple/5 transition-colors">
                  <div className="font-medium">Mittagsbeat</div>
                  <div className="text-sm text-muted-foreground">Montag, 12:00 - 14:00 Uhr</div>
                </div>
                <div className="p-3 border rounded-md bg-background/30 backdrop-blur-sm hover:bg-radio-purple/5 transition-colors">
                  <div className="font-medium">Nachmittagsklänge</div>
                  <div className="text-sm text-muted-foreground">Dienstag, 13:00 - 15:00 Uhr</div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {activePoll && (
            <DashboardCard
              title="Ihre Meinung zählt"
              icon={<Radio className="h-5 w-5 text-radio-purple" />}
              className="bg-gradient-to-br from-card to-card/80 hover:shadow-md transition-all duration-300"
            >
              <CardDescription className="mb-4">
                Nehmen Sie an unserer aktuellen Umfrage teil und teilen Sie uns Ihre Meinung mit.
              </CardDescription>
              <PollWidget 
                question={activePoll.question} 
                options={activePoll.options} 
              />
            </DashboardCard>
          )}

          <DashboardCard
            title="Aktuelle Podcasts"
            icon={<Headphones className="h-5 w-5 text-radio-purple" />}
            className="bg-gradient-to-br from-card to-card/80 hover:shadow-md transition-all duration-300"
            actionButton={
              <Button variant="outline" size="sm" asChild>
                <a href="/podcasts">Alle Podcasts</a>
              </Button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md bg-background/30 backdrop-blur-sm hover:bg-radio-purple/5 transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="h-4 w-4 text-radio-purple" />
                  <div className="font-medium group-hover:text-radio-purple transition-colors">Musik-News der Woche</div>
                </div>
                <div className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  <span>25 Min • Musik</span>
                </div>
                <Button variant="outline" size="sm" className="w-full hover:bg-radio-purple hover:text-white transition-colors">
                  Anhören
                </Button>
              </div>

              <div className="p-4 border rounded-md bg-background/30 backdrop-blur-sm hover:bg-radio-purple/5 transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="h-4 w-4 text-radio-purple" />
                  <div className="font-medium group-hover:text-radio-purple transition-colors">Interview mit lokalen Künstlern</div>
                </div>
                <div className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  <span>42 Min • Talk</span>
                </div>
                <Button variant="outline" size="sm" className="w-full hover:bg-radio-purple hover:text-white transition-colors">
                  Anhören
                </Button>
              </div>

              <div className="p-4 border rounded-md bg-background/30 backdrop-blur-sm hover:bg-radio-purple/5 transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="h-4 w-4 text-radio-purple" />
                  <div className="font-medium group-hover:text-radio-purple transition-colors">Hinter den Kulissen</div>
                </div>
                <div className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  <span>18 Min • Doku</span>
                </div>
                <Button variant="outline" size="sm" className="w-full hover:bg-radio-purple hover:text-white transition-colors">
                  Anhören
                </Button>
              </div>
            </div>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="preferences">
          <DashboardCard
            title="Ihre Einstellungen"
            icon={<Settings className="h-5 w-5 text-radio-purple" />}
            className="bg-gradient-to-br from-card to-card/80 hover:shadow-md transition-all duration-300"
          >
            <CardDescription className="mb-6">
              Passen Sie Ihr Nutzererlebnis an Ihre Bedürfnisse an.
            </CardDescription>
            <div className="flex items-center justify-center">
              <p className="py-12 text-center text-muted-foreground">
                Diese Funktion wird in Kürze verfügbar sein.
              </p>
            </div>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="contact">
          <DashboardCard
            title="Kontaktieren Sie uns"
            icon={<MessageCircle className="h-5 w-5 text-radio-purple" />}
            className="bg-gradient-to-br from-card to-card/80 hover:shadow-md transition-all duration-300"
          >
            <CardDescription className="mb-4">
              Haben Sie Fragen oder Anregungen? Schreiben Sie uns!
            </CardDescription>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                  Betreff
                </label>
                <Input id="subject" placeholder="Worum geht es?" required className="bg-background/30 backdrop-blur-sm" />
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
                  className="bg-background/30 backdrop-blur-sm"
                />
              </div>
              
              <div className="flex gap-4 items-center">
                <Button className="bg-radio-purple hover:bg-radio-blue transition-colors flex gap-2" type="submit">
                  <Mail className="h-4 w-4" />
                  Nachricht senden
                </Button>
                <p className="text-xs text-muted-foreground">
                  Wir antworten in der Regel innerhalb von 24 Stunden.
                </p>
              </div>
            </form>
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
