
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchChatMessages, sendChatMessage } from "@/services/radioService";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  id?: string;
  user_name: string;
  message: string;
  created_at?: string;
}

export function LiveChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameSaved, setIsUsernameSaved] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Lade Chat-Nachrichten beim ersten Rendern
  useEffect(() => {
    loadMessages();
    
    // Initialisiere den Benutzernamen aus LocalStorage, falls vorhanden
    const savedUsername = localStorage.getItem("chat_username");
    if (savedUsername) {
      setUsername(savedUsername);
      setIsUsernameSaved(true);
    }
    
    // Abonniere Änderungen an Chat-Nachrichten in Echtzeit
    const channel = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: 'is_moderated=eq.true' }, 
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages(prevMessages => [newMsg, ...prevMessages]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Scrolle automatisch nach unten, wenn neue Nachrichten hinzugefügt werden
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const chatMessages = await fetchChatMessages(100);
      setMessages(chatMessages.reverse()); // Neueste Nachrichten unten anzeigen
    } catch (error) {
      console.error("Fehler beim Laden der Chat-Nachrichten:", error);
      toast({
        title: "Fehler",
        description: "Chat-Nachrichten konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveUsername = () => {
    if (username.trim().length < 2) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Namen mit mindestens 2 Zeichen ein.",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem("chat_username", username);
    setIsUsernameSaved(true);
    
    toast({
      title: "Name gespeichert",
      description: "Du kannst jetzt am Chat teilnehmen.",
      variant: "default",
    });
  };

  const changeUsername = () => {
    setIsUsernameSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === "") return;
    
    try {
      // Optimistisch UI aktualisieren
      const optimisticMsg: ChatMessage = {
        user_name: username,
        message: newMessage,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, optimisticMsg]);
      setNewMessage("");
      
      // An den Server senden
      const success = await sendChatMessage({
        user_name: username,
        message: newMessage
      });
      
      if (!success) {
        // Bei Fehler die optimistische UI-Aktualisierung rückgängig machen
        setMessages(prevMessages => prevMessages.filter(msg => msg !== optimisticMsg));
        
        toast({
          title: "Fehler",
          description: "Deine Nachricht konnte nicht gesendet werden.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Fehler beim Senden der Chat-Nachricht:", error);
      toast({
        title: "Fehler",
        description: "Deine Nachricht konnte nicht gesendet werden.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    // Einfache Hash-Funktion zur Generierung einer konstanten Farbe für jeden Benutzernamen
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      "bg-red-500", "bg-orange-500", "bg-amber-500", 
      "bg-yellow-500", "bg-lime-500", "bg-green-500", 
      "bg-emerald-500", "bg-teal-500", "bg-cyan-500", 
      "bg-sky-500", "bg-blue-500", "bg-indigo-500", 
      "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", 
      "bg-pink-500", "bg-rose-500"
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="border border-gray-800/50 bg-gradient-to-br from-[#1c1f2f]/60 to-[#252a40]/60 backdrop-blur-sm shadow-lg h-[450px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <div className="relative mr-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse absolute right-0 top-0"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-400 h-5 w-5"
            >
              <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
              <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
            </svg>
          </div>
          Live-Chat
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-hidden p-0">
        {!isUsernameSaved ? (
          <div className="p-4 h-full flex flex-col justify-center">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-300 mb-4">
                Bitte gib deinen Namen ein, um am Chat teilzunehmen
              </p>
              <Input
                type="text"
                placeholder="Dein Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-3"
                maxLength={30}
              />
              <Button onClick={saveUsername} className="bg-radio-purple hover:bg-radio-purple/80">
                Chat beitreten
              </Button>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[320px] p-4" ref={scrollAreaRef}>
            {loading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-start gap-3 animate-pulse">
                    <div className="h-8 w-8 rounded-full bg-gray-700"></div>
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-800 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length > 0 ? (
              <div className="flex flex-col gap-4">
                {messages.map((message, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Avatar className={`h-8 w-8 ${getAvatarColor(message.user_name)}`}>
                      <AvatarFallback>{getInitials(message.user_name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-sm">{message.user_name}</span>
                        {message.created_at && (
                          <span className="text-xs text-gray-400">{formatTimestamp(message.created_at)}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 break-words">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-sm">Noch keine Nachrichten. Sei der Erste!</p>
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
      
      {isUsernameSaved && (
        <CardFooter className="border-t border-gray-800/50 p-3 flex flex-col">
          <div className="flex justify-between items-center w-full mb-2">
            <div className="flex items-center gap-1">
              <div className={`h-6 w-6 rounded-full ${getAvatarColor(username)} flex items-center justify-center text-xs font-medium`}>
                {getInitials(username)}
              </div>
              <span className="text-xs font-medium">{username}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={changeUsername}
              className="h-6 text-xs text-gray-400 hover:text-gray-100 p-0"
            >
              Ändern
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full">
            <Input
              type="text"
              placeholder="Nachricht schreiben..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow"
              maxLength={200}
            />
            <Button type="submit" size="sm" disabled={newMessage.trim() === ""} className="bg-radio-purple hover:bg-radio-purple/80">
              Senden
            </Button>
          </form>
        </CardFooter>
      )}
    </Card>
  );
}
