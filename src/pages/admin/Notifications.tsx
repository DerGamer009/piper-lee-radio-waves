
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Bell, Send, Trash, Check, AlertCircle } from 'lucide-react';
import { SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  isRead: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Neue Version verfügbar',
    message: 'Die Version 2.5.0 ist verfügbar mit neuen Funktionen und Bugfixes.',
    type: 'info',
    timestamp: '2025-05-01T14:30:00',
    isRead: false
  },
  {
    id: '2',
    title: 'Wartungsarbeiten abgeschlossen',
    message: 'Die geplanten Wartungsarbeiten wurden erfolgreich abgeschlossen.',
    type: 'success',
    timestamp: '2025-05-01T10:15:00',
    isRead: true
  },
  {
    id: '3',
    title: 'Serverupdate geplant',
    message: 'Ein Serverupdate ist für den 05.05.2025 um 03:00 Uhr geplant. Es kann zu kurzen Ausfällen kommen.',
    type: 'warning',
    timestamp: '2025-04-30T16:45:00',
    isRead: false
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error'
  });
  const [broadcastEnabled, setBroadcastEnabled] = useState(false);
  
  const { toast } = useToast();

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    const notification: Notification = {
      id: Date.now().toString(),
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    setNotifications([notification, ...notifications]);
    setNewNotification({
      title: '',
      message: '',
      type: 'info'
    });
    
    toast({
      title: "Benachrichtigung gesendet",
      description: broadcastEnabled 
        ? "Die Benachrichtigung wurde an alle Benutzer gesendet."
        : "Die Benachrichtigung wurde erstellt.",
    });
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast({
      title: "Benachrichtigung gelöscht",
      description: "Die Benachrichtigung wurde erfolgreich gelöscht.",
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

  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'info': return <Bell className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'success': return <Check className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Benachrichtigungen</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg pb-4">
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Neue Benachrichtigung
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSendNotification}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titel</Label>
                    <Input 
                      id="title" 
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Nachricht</Label>
                    <Textarea 
                      id="message" 
                      rows={4}
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Typ</Label>
                    <select 
                      id="type"
                      className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background rounded-md"
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({...newNotification, type: e.target.value as any})}
                    >
                      <option value="info">Information</option>
                      <option value="warning">Warnung</option>
                      <option value="success">Erfolg</option>
                      <option value="error">Fehler</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="broadcast"
                      checked={broadcastEnabled}
                      onCheckedChange={setBroadcastEnabled}
                    />
                    <Label htmlFor="broadcast">An alle Benutzer senden</Label>
                  </div>
                  
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    <Send className="h-4 w-4 mr-2" />
                    Benachrichtigung senden
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white rounded-t-lg pb-4">
              <CardTitle className="flex justify-between items-center">
                <span>Benachrichtigungsprotokoll</span>
                <Badge className="bg-white text-indigo-700">{notifications.filter(n => !n.isRead).length} Ungelesen</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg border ${notification.isRead ? 'bg-muted/30' : 'bg-card'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`p-1 rounded-full ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </span>
                          <h3 className="font-medium">{notification.title}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-green-50 hover:text-green-600"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(notification.timestamp)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Keine Benachrichtigungen vorhanden
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Notifications;
