
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Send, Trash, ArrowLeft, CornerDownRight } from 'lucide-react';
import { SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'inbox' | 'sent' | 'draft';
  subject: string;
  replies?: Reply[];
};

type Reply = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
};

const initialMessages: Message[] = [
  {
    id: '1',
    senderId: 'user1',
    senderName: 'Max Mustermann',
    senderAvatar: '',
    subject: 'Frage zum Sendeplan',
    content: 'Hallo, ich hätte eine Frage zum aktuellen Sendeplan. Wann wird die neue Show "Musikwelten" zum ersten Mal ausgestrahlt?',
    timestamp: '2025-05-01T14:30:00',
    isRead: false,
    type: 'inbox',
    replies: []
  },
  {
    id: '2',
    senderId: 'user2',
    senderName: 'Anna Schmidt',
    subject: 'Feedback zur letzten Sendung',
    content: 'Die gestrige Sendung war wirklich großartig! Besonders der Gast hat spannende Einblicke gegeben. Wäre es möglich, mehr solcher Interviews zu planen?',
    timestamp: '2025-05-01T10:15:00',
    isRead: true,
    type: 'inbox',
    replies: [
      {
        id: 'r1',
        senderId: 'admin',
        senderName: 'Admin',
        content: 'Vielen Dank für dein positives Feedback! Wir planen tatsächlich weitere Interviews in diesem Format.',
        timestamp: '2025-05-01T11:30:00'
      }
    ]
  },
  {
    id: '3',
    senderId: 'admin',
    senderName: 'Admin',
    subject: 'Update zu kommenden Funktionen',
    content: 'Wir möchten Sie über die neuen Funktionen informieren, die in den kommenden Wochen hinzugefügt werden.',
    timestamp: '2025-04-30T16:45:00',
    isRead: true,
    type: 'sent'
  },
];

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'draft'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reply, setReply] = useState('');
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: ''
  });
  
  const { toast } = useToast();

  const handleSendReply = () => {
    if (!selectedMessage || !reply.trim()) return;
    
    const newReply: Reply = {
      id: Date.now().toString(),
      senderId: 'admin',
      senderName: 'Admin',
      content: reply,
      timestamp: new Date().toISOString()
    };
    
    setMessages(messages.map(message => 
      message.id === selectedMessage.id
        ? { 
            ...message, 
            replies: [...(message.replies || []), newReply]
          }
        : message
    ));
    
    setReply('');
    
    toast({
      title: "Antwort gesendet",
      description: "Ihre Antwort wurde erfolgreich gesendet.",
    });
  };

  const handleSendNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'admin',
      senderName: 'Admin',
      subject: newMessage.subject,
      content: newMessage.content,
      timestamp: new Date().toISOString(),
      isRead: true,
      type: 'sent'
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage({
      recipient: '',
      subject: '',
      content: ''
    });
    
    toast({
      title: "Nachricht gesendet",
      description: `Nachricht an ${newMessage.recipient} wurde gesendet.`,
    });
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter(message => message.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
    
    toast({
      title: "Nachricht gelöscht",
      description: "Die Nachricht wurde erfolgreich gelöscht.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const filteredMessages = messages.filter(message => message.type === activeTab);
  const unreadCount = messages.filter(message => message.type === 'inbox' && !message.isRead).length;

  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Nachrichten</h1>
        </div>

        {!selectedMessage ? (
          <>
            <Tabs defaultValue="inbox" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger 
                  value="inbox" 
                  onClick={() => setActiveTab('inbox')}
                  className="relative"
                >
                  Posteingang
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white">{unreadCount}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="sent" 
                  onClick={() => setActiveTab('sent')}
                >
                  Gesendet
                </TabsTrigger>
                <TabsTrigger 
                  value="draft" 
                  onClick={() => setActiveTab('draft')}
                >
                  Entwürfe
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="inbox" className="mt-6">
                <Card className="border-none shadow-md">
                  <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg pb-4">
                    <CardTitle className="flex justify-between items-center">
                      <span>Posteingang</span>
                      {unreadCount > 0 && (
                        <Badge className="bg-white text-purple-700">{unreadCount} Ungelesen</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {filteredMessages.length > 0 ? (
                        filteredMessages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`p-4 rounded-lg border ${message.isRead ? 'bg-muted/30' : 'bg-card'} cursor-pointer hover:bg-muted/50`}
                            onClick={() => {
                              setSelectedMessage(message);
                              if (!message.isRead) {
                                setMessages(messages.map(m => 
                                  m.id === message.id ? { ...m, isRead: true } : m
                                ));
                              }
                            }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={message.senderAvatar} />
                                  <AvatarFallback>
                                    {message.senderName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">{message.subject}</h3>
                                  <p className="text-sm text-muted-foreground">{message.senderName}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(message.timestamp)}
                                </span>
                                {!message.isRead && (
                                  <Badge className="ml-2 bg-purple-600">Neu</Badge>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMessage(message.id);
                                  }}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {message.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Keine Nachrichten im {activeTab === 'inbox' ? 'Posteingang' : activeTab === 'sent' ? 'Postausgang' : 'Entwürfe'}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sent">
                <Card className="border-none shadow-md">
                  <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg pb-4">
                    <CardTitle>Gesendete Nachrichten</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {filteredMessages.length > 0 ? (
                        filteredMessages.map((message) => (
                          <div 
                            key={message.id} 
                            className="p-4 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{message.subject}</h3>
                                <p className="text-sm text-muted-foreground">An: {message.senderName}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(message.timestamp)}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMessage(message.id);
                                  }}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {message.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Keine gesendeten Nachrichten
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="draft">
                <Card className="border-none shadow-md">
                  <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg pb-4">
                    <CardTitle>Entwürfe</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {filteredMessages.length > 0 ? (
                        filteredMessages.map((message) => (
                          <div 
                            key={message.id} 
                            className="p-4 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{message.subject || 'Kein Betreff'}</h3>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(message.timestamp)}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMessage(message.id);
                                  }}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {message.content || 'Kein Inhalt'}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Keine Entwürfe vorhanden
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Card className="border-none shadow-md">
              <CardHeader className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white rounded-t-lg pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Neue Nachricht
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSendNewMessage}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient">Empfänger</Label>
                      <Input 
                        id="recipient" 
                        placeholder="Empfänger eingeben..."
                        value={newMessage.recipient}
                        onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Betreff</Label>
                      <Input 
                        id="subject" 
                        placeholder="Betreff eingeben..."
                        value={newMessage.subject}
                        onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Nachricht</Label>
                      <Textarea 
                        id="content" 
                        rows={6}
                        placeholder="Nachricht eingeben..."
                        value={newMessage.content}
                        onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          if (newMessage.recipient || newMessage.subject || newMessage.content) {
                            const draftMsg: Message = {
                              id: Date.now().toString(),
                              senderId: 'admin',
                              senderName: 'Admin',
                              subject: newMessage.subject,
                              content: newMessage.content,
                              timestamp: new Date().toISOString(),
                              isRead: true,
                              type: 'draft'
                            };
                            
                            setMessages([...messages, draftMsg]);
                            setNewMessage({
                              recipient: '',
                              subject: '',
                              content: ''
                            });
                            
                            toast({
                              title: "Entwurf gespeichert",
                              description: "Der Entwurf wurde gespeichert.",
                            });
                          }
                        }}
                      >
                        Als Entwurf speichern
                      </Button>
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                        <Send className="h-4 w-4 mr-2" />
                        Senden
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg pb-4">
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-white/20 hover:bg-white/30"
                    onClick={() => setSelectedMessage(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span>{selectedMessage.subject}</span>
                </div>
                <Button 
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white/20 hover:bg-white/30"
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedMessage.senderAvatar} />
                        <AvatarFallback>
                          {selectedMessage.senderName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedMessage.senderName}</h3>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(selectedMessage.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pl-12 text-foreground">
                    <p>{selectedMessage.content}</p>
                  </div>
                </div>
                
                {/* Replies */}
                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    {selectedMessage.replies.map((replyItem) => (
                      <div key={replyItem.id} className="pl-8 mb-4 border-l-2 border-muted">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={replyItem.senderAvatar} />
                              <AvatarFallback>
                                {replyItem.senderName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{replyItem.senderName}</h3>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(replyItem.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="pl-12 text-foreground">
                          <p>{replyItem.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Reply form */}
                {selectedMessage.type === 'inbox' && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                      <Label>Antwort verfassen</Label>
                    </div>
                    <div className="space-y-4">
                      <Textarea 
                        rows={4}
                        placeholder="Antwort eingeben..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleSendReply}
                          disabled={!reply.trim()}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Antworten
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarInset>
  );
};

export default Messages;
