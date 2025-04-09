import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getCurrentUser } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  content: string;
  created_at: string;
}

export function AdminChat() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser
  });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      // TODO: Implement message fetching
      return [];
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      // TODO: Implement message sending
      return { id: Date.now(), content, created_at: new Date().toISOString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setMessage('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.sender_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Admin Chat</CardTitle>
          <div className="w-64">
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ScrollArea className="h-[400px] rounded-md border p-4">
            {isLoading ? (
              <div className="text-center">Loading messages...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center text-muted-foreground">No messages found</div>
            ) : (
              filteredMessages.map((msg: Message) => (
                <div
                  key={msg.id}
                  className={`mb-4 ${
                    msg.sender_id === currentUser?.id ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className="text-sm font-medium">{msg.sender_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                  <div className="mt-1 p-2 rounded-lg bg-muted inline-block">
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <Button type="submit" disabled={!message.trim()}>
              Send
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
} 