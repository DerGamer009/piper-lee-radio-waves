
import React, { useState, useEffect } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { supabase } from "@/integrations/supabase/client";
import {
  MessageSquare,
  Send,
  MoreVertical,
  Search,
  Bell,
  Trash2,
  Archive,
  Star,
  RefreshCw,
  UserPlus,
  Filter
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
}

interface MessageFilter {
  search: string;
  showStarred: boolean;
  showUnread: boolean;
}

const Messages = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reply, setReply] = useState('');
  const [filter, setFilter] = useState<MessageFilter>({
    search: '',
    showStarred: false,
    showUnread: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading messages from the database
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        // For now, load sample data since we don't have a messages table yet
        setMessages(sampleMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        // Fallback to sample data
        setMessages(sampleMessages);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [activeTab]);

  // Sample data for fallback
  const sampleMessages: Message[] = [
    {
      id: '1',
      sender: 'Max Mustermann',
      avatar: 'https://i.pravatar.cc/150?img=1',
      content: 'Hallo! Ich wollte mich nach dem Status meiner Anfrage erkundigen. Vielen Dank im Voraus!',
      timestamp: '01.05.2025, 14:30',
      read: false,
      starred: true
    },
    {
      id: '2',
      sender: 'Lisa Schmidt',
      avatar: 'https://i.pravatar.cc/150?img=5',
      content: 'Vielen Dank für die schnelle Antwort. Ich habe noch eine Frage bezüglich der Sendezeit...',
      timestamp: '01.05.2025, 12:15',
      read: true,
      starred: false
    },
    {
      id: '3',
      sender: 'Tim Weber',
      avatar: 'https://i.pravatar.cc/150?img=3',
      content: 'Könnten Sie mir bitte mitteilen, wann die nächste Livesendung stattfindet? Ich würde gerne teilnehmen.',
      timestamp: '30.04.2025, 18:45',
      read: true,
      starred: false
    },
    {
      id: '4',
      sender: 'Anna Becker',
      avatar: 'https://i.pravatar.cc/150?img=10',
      content: 'Ich habe einen Song-Wunsch für die nächste Sendung: "Dreams" von Fleetwood Mac.',
      timestamp: '30.04.2025, 16:20',
      read: false,
      starred: false
    },
    {
      id: '5',
      sender: 'Markus Klein',
      avatar: 'https://i.pravatar.cc/150?img=12',
      content: 'Gibt es Möglichkeiten, bei Ihrer Station als freiwilliger Helfer mitzuarbeiten? Ich interessiere mich sehr für Radio und Medien.',
      timestamp: '29.04.2025, 09:10',
      read: true,
      starred: true
    },
    {
      id: '6',
      sender: 'System',
      content: 'Wichtige Systembenachrichtigung: Wartungsarbeiten sind für den 05.05.2025 um 02:00 Uhr geplant. Die Plattform wird voraussichtlich für 2 Stunden nicht verfügbar sein.',
      timestamp: '29.04.2025, 08:00',
      read: false,
      starred: true
    }
  ];

  // Apply filters to messages
  const filteredMessages = messages.filter(msg => {
    if (filter.search && !msg.content.toLowerCase().includes(filter.search.toLowerCase()) && 
        !msg.sender.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    if (filter.showStarred && !msg.starred) return false;
    if (filter.showUnread && msg.read) return false;
    
    // Filter by tab
    if (activeTab === 'inbox') return true;
    if (activeTab === 'starred') return msg.starred;
    if (activeTab === 'system') return msg.sender === 'System';
    
    return true;
  });

  const handleSelectMessage = (message: Message) => {
    // Mark message as read when selected
    setSelectedMessage(message);
    if (!message.read) {
      setMessages(messages.map(msg => 
        msg.id === message.id ? { ...msg, read: true } : msg
      ));
    }
  };

  const handleStarMessage = (id: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === id) {
        return { ...msg, starred: !msg.starred };
      }
      return msg;
    }));
    
    if (selectedMessage?.id === id) {
      setSelectedMessage({ ...selectedMessage, starred: !selectedMessage.starred });
    }
  };

  const handleDeleteMessage = (id: string) => {
    // Remove from UI
    setMessages(messages.filter(msg => msg.id !== id));
    
    // If currently selected, clear selection
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
    
    toast({
      title: "Nachricht gelöscht",
      description: "Die Nachricht wurde erfolgreich gelöscht."
    });
  };

  const handleSendReply = () => {
    if (!selectedMessage || !reply.trim()) return;
    
    toast({
      title: "Antwort gesendet",
      description: "Ihre Antwort wurde erfolgreich gesendet."
    });
    
    // Clear reply field
    setReply('');
  };

  // For table view
  const columns: ColumnDef<Message>[] = [
    {
      id: 'starred',
      header: '',
      cell: ({ row }) => {
        const message = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 text-muted-foreground"
            onClick={() => handleStarMessage(message.id)}
          >
            <Star className={`h-4 w-4 ${message.starred ? 'text-yellow-400 fill-yellow-400' : ''}`} />
          </Button>
        );
      },
    },
    {
      accessorKey: 'sender',
      header: 'Absender',
      cell: ({ row }) => {
        const message = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.avatar} />
              <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{message.sender}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'content',
      header: 'Inhalt',
      cell: ({ row }) => {
        const message = row.original;
        return (
          <div className="max-w-[500px] truncate">
            {!message.read && (
              <Badge variant="outline" className="mr-2 bg-blue-500 text-white">Neu</Badge>
            )}
            {message.content}
          </div>
        );
      },
    },
    {
      accessorKey: 'timestamp',
      header: 'Datum',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const message = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleSelectMessage(message)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => handleDeleteMessage(message.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Nachrichten</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="border-none shadow-md h-full">
              <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-t-lg pb-4">
                <CardTitle className="flex justify-between items-center">
                  <span>Nachrichtenübersicht</span>
                  <Badge variant="outline" className="bg-white/10 text-white">
                    {messages.filter(m => !m.read).length} Ungelesen
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="inbox">Posteingang</TabsTrigger>
                    <TabsTrigger value="starred">Markiert</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="p-4 border-b space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Nachrichten durchsuchen..." 
                      className="pl-8"
                      value={filter.search}
                      onChange={(e) => setFilter({...filter, search: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={filter.showUnread ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => setFilter({...filter, showUnread: !filter.showUnread})}
                    >
                      Ungelesen
                    </Button>
                    <Button
                      variant={filter.showStarred ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => setFilter({...filter, showStarred: !filter.showStarred})}
                    >
                      Markiert
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 ml-auto"
                      onClick={() => setFilter({search: '', showStarred: false, showUnread: false})}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-y-auto max-h-[60vh]">
                  {isLoading ? (
                    <div className="p-4 space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse space-y-2">
                          <div className="flex justify-between">
                            <div className="h-4 bg-muted w-1/3 rounded"></div>
                            <div className="h-4 bg-muted w-1/4 rounded"></div>
                          </div>
                          <div className="h-4 bg-muted w-full rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="mx-auto h-8 w-8 mb-2 opacity-20" />
                      <p>Keine Nachrichten gefunden</p>
                    </div>
                  ) : (
                    <ul className="divide-y">
                      {filteredMessages.map((message) => (
                        <li
                          key={message.id}
                          className={`p-4 hover:bg-muted/20 cursor-pointer ${
                            selectedMessage?.id === message.id ? 'bg-muted/40' : ''
                          } ${!message.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                          onClick={() => handleSelectMessage(message)}
                        >
                          <div className="flex justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={message.avatar} />
                                <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{message.sender}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {!message.read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStarMessage(message.id);
                                }}
                              >
                                <Star className={`h-3 w-3 ${message.starred ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                          <div className="text-xs text-muted-foreground mt-1">{message.timestamp}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="border-none shadow-md h-full">
              <CardHeader className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white rounded-t-lg pb-4">
                <CardTitle className="flex justify-between items-center">
                  <span>Nachricht</span>
                  <div className="flex gap-2">
                    {selectedMessage && (
                      <>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="bg-white/10 hover:bg-white/20 text-white"
                          onClick={() => handleStarMessage(selectedMessage.id)}
                        >
                          <Star className={`h-4 w-4 mr-2 ${selectedMessage.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                          {selectedMessage.starred ? 'Markierung aufheben' : 'Markieren'}
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="bg-white/10 hover:bg-white/20 text-white"
                          onClick={() => handleDeleteMessage(selectedMessage.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Löschen
                        </Button>
                      </>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {selectedMessage ? (
                  <div>
                    <div className="p-6 border-b">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedMessage.avatar} />
                            <AvatarFallback>{selectedMessage.sender.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{selectedMessage.sender}</div>
                            <div className="text-sm text-muted-foreground">{selectedMessage.timestamp}</div>
                          </div>
                        </div>
                      </div>
                      <div className="prose dark:prose-invert max-w-none">
                        <p>{selectedMessage.content}</p>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-medium mb-4">Antwort verfassen</h3>
                      <Textarea 
                        placeholder="Ihre Antwort hier eingeben..." 
                        className="min-h-[150px] mb-4"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleSendReply} disabled={!reply.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Antwort senden
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                    <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium mb-2">Keine Nachricht ausgewählt</h3>
                    <p>Wählen Sie eine Nachricht aus der Liste aus</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-none shadow-md mt-6">
          <CardHeader className="bg-gradient-to-r from-violet-700 to-violet-500 text-white rounded-t-lg pb-4">
            <CardTitle className="flex justify-between items-center">
              <span>Alle Nachrichten</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Neue Nachricht
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={messages}
              searchKey="content"
              searchLabel="Nachrichten durchsuchen"
              showPagination={true}
              pageSize={5}
            />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
};

export default Messages;
