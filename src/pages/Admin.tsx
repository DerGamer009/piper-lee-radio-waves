import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shows } from "@/components/Shows";
import { Schedule } from "@/components/Schedule";
import { Stats } from "@/components/Stats";
import { Settings } from "@/components/Settings";
import { AdminChat } from "@/components/AdminChat";
import { getUsers, deleteUser, getCurrentUser } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { UserForm } from '@/components/UserForm';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Constants for radio stream
const STREAM_URL = "https://backend.piper-lee.net/listen/piper-lee/radio.mp3";
const STATION_NAME = "Piper Lee Radio";

function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // User Management States
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Depeche Mode',
    song: 'Shake the Disease',
    listeners: 2
  });
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Queries
  const { data: users = [], isLoading: isLoadingUsers, error: userError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser
  });

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio('https://backend.piper-lee.net/listen/piper-lee/radio.mp3');
    audio.volume = volume;
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Player Functions
  const togglePlay = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play()
        .catch(error => {
          console.error('Playback failed:', error);
    toast({
            title: "Fehler",
            description: "Der Stream konnte nicht abgespielt werden.",
            variant: "destructive",
          });
        });
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    if (!audioElement) return;
    const value = newVolume[0];
    setVolume(value);
    audioElement.volume = value;
  };

  // User Management Functions
  const handleDeleteClick = (userId: number) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUserId) {
      try {
        await deleteUser(selectedUserId);
        queryClient.invalidateQueries({ queryKey: ['users'] });
        toast({
          title: "Erfolg",
          description: "Benutzer erfolgreich gelöscht",
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Fehler",
          description: "Benutzer konnte nicht gelöscht werden",
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsUserFormOpen(true);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsUserFormOpen(true);
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoadingUsers) return <div className="p-4">Lädt...</div>;
  if (userError) return <div className="p-4 text-red-500">Fehler: {userError instanceof Error ? userError.message : 'Unbekannter Fehler'}</div>;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <Tabs defaultValue="home" className="space-y-4">
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="shows">Shows</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-[#1a1b26] text-white rounded-lg p-6 flex flex-col items-center">
                <h2 className="text-2xl font-bold">Piper Lee Radio</h2>
                <div className="text-gray-400 mb-4">Live Stream</div>
                
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <span>♫</span>
                  <span>Jetzt läuft:</span>
                </div>
                
                <div className="text-lg mb-4">
                  {currentTrack.title} - {currentTrack.song}
                </div>
                
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                  </svg>
                  <span>{currentTrack.listeners} Hörer</span>
                </div>

                <div className="text-gray-400 mb-4">
                  Klicken Sie Play zum Hören
                </div>

                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full border-2 border-purple-600 flex items-center justify-center mb-4 hover:bg-purple-600/10 transition-colors"
                >
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-purple-600">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-purple-600">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                </button>

                <div className="w-full flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-gray-400">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="flex-1"
                  />
          </div>
        </div>
      </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Total Users</div>
                  <div className="text-2xl font-bold">{users.length}</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Active Shows</div>
                  <div className="text-2xl font-bold">0</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Users</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button onClick={handleCreateUser}>Create User</Button>
            </div>
          </div>
          <div className="border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Username</th>
                  <th className="text-left p-4">Full Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Roles</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: any) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-4">{user.username}</td>
                    <td className="p-4">{user.fullName}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.roles.join(', ')}</td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="shows">
          <Shows />
        </TabsContent>

        <TabsContent value="schedule">
          <Schedule />
        </TabsContent>

        <TabsContent value="stats">
          <Stats />
        </TabsContent>

        <TabsContent value="settings">
          <Settings />
        </TabsContent>

        <TabsContent value="chat">
          <AdminChat />
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isUserFormOpen && (
        <UserForm
          user={editingUser}
          onSuccess={() => {
            setIsUserFormOpen(false);
            queryClient.invalidateQueries({ queryKey: ['users'] });
          }}
          onCancel={() => setIsUserFormOpen(false)}
          isEditing={!!editingUser}
        />
      )}
    </div>
  );
}

export default Admin;
