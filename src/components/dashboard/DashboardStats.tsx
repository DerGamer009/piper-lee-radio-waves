import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Headphones, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface StatsCardProps {
  title: string;
  value: string | number;
  changeText?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBgColor: string;
  subText?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  changeText, 
  changeType = 'neutral', 
  icon, 
  iconBgColor,
  subText 
}: StatsCardProps) => {
  const getChangeColorClass = () => {
    switch(changeType) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="relative rounded-xl bg-gradient-to-br from-[#1c1f2f] to-[#252a40] border border-gray-800/50 p-5 overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-1">{title}</h3>
          <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
            {value}
          </p>
          {changeText && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${getChangeColorClass()}`}>
              {changeType === 'positive' && <span className="text-lg">↑</span>}
              {changeType === 'negative' && <span className="text-lg">↓</span>}
              {changeText}
            </p>
          )}
          {subText && <p className="text-xs text-gray-400 mt-1">{subText}</p>}
        </div>
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          {icon}
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-20"></div>
    </div>
  );
};

const DashboardStats = () => {
  const [liveListeners, setLiveListeners] = useState<number | null>(null);
  const [previousListeners, setPreviousListeners] = useState<number | null>(null);
  const [listenerChangePercent, setListenerChangePercent] = useState<number>(5); // Default to 5%
  const [listenerChangeType, setListenerChangeType] = useState<'positive' | 'negative' | 'neutral'>('positive');
  const [liveListenersLoading, setLiveListenersLoading] = useState(true);
  const [liveListenersError, setLiveListenersError] = useState<string | null>(null);
  
  // New state for active users tracking
  const [previousActiveUsers, setPreviousActiveUsers] = useState<number | null>(null);
  const [userChangePercent, setUserChangePercent] = useState<number>(12); // Default to 12%
  const [userChangeType, setUserChangeType] = useState<'positive' | 'negative' | 'neutral'>('positive');

  // Fetch active users count
  const { data: activeUsers, isLoading: loadingUsers } = useQuery({
    queryKey: ['active-users-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      const currentUsers = count || 0;
      
      // Calculate change percentage if we have previous data
      const storedPreviousUsers = localStorage.getItem('previousActiveUsers');
      if (storedPreviousUsers) {
        const prevUsers = parseInt(storedPreviousUsers, 10);
        const changePercent = prevUsers > 0 
          ? Math.round(((currentUsers - prevUsers) / prevUsers) * 100) 
          : 0;
        
        setUserChangePercent(Math.abs(changePercent));
        setUserChangeType(changePercent >= 0 ? 'positive' : 'negative');
      }
      
      // Store current users count as previous for next comparison
      // We'll update localStorage once per day to track daily changes
      const lastUserUpdateTime = localStorage.getItem('lastUsersUpdateTime');
      const currentTime = Date.now();
      if (!lastUserUpdateTime || (currentTime - parseInt(lastUserUpdateTime, 10)) > 24 * 60 * 60 * 1000) {
        localStorage.setItem('previousActiveUsers', currentUsers.toString());
        localStorage.setItem('lastUsersUpdateTime', currentTime.toString());
        setPreviousActiveUsers(currentUsers);
      }
      
      return currentUsers;
    }
  });

  // Fetch podcast downloads - using podcasts table count instead of podcast_downloads
  const { data: podcastDownloads, isLoading: loadingPodcasts } = useQuery({
    queryKey: ['podcast-downloads-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('podcasts')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);
      
      if (error) throw error;
      
      return count || 0;
    }
  });

  // Fetch upcoming shows count
  const { data: upcomingShows, isLoading: loadingShows } = useQuery({
    queryKey: ['upcoming-shows-count'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      
      const { count, error } = await supabase
        .from('schedule')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Load previous listeners count from localStorage on component mount
  useEffect(() => {
    const storedPreviousListeners = localStorage.getItem('previousLiveListeners');
    if (storedPreviousListeners) {
      setPreviousListeners(parseInt(storedPreviousListeners, 10));
    }
    
    const storedPreviousUsers = localStorage.getItem('previousActiveUsers');
    if (storedPreviousUsers) {
      setPreviousActiveUsers(parseInt(storedPreviousUsers, 10));
    }
  }, []);

  // Fetch live listener data from external API
  useEffect(() => {
    const fetchLiveListeners = async () => {
      setLiveListenersLoading(true);
      setLiveListenersError(null);
      try {
        const response = await fetch('https://backend.piper-lee.net/api/nowplaying/1');
        
        if (!response.ok) {
          throw new Error('Failed to fetch live listeners data');
        }
        
        const data = await response.json();
        // Extract listeners count from API response
        if (data && data.listeners && typeof data.listeners.current === 'number') {
          const currentListeners = data.listeners.current;
          
          // If we have previous listeners data, calculate the change percentage
          if (previousListeners) {
            const changePercent = previousListeners > 0 
              ? Math.round(((currentListeners - previousListeners) / previousListeners) * 100) 
              : 0;
            
            setListenerChangePercent(Math.abs(changePercent));
            setListenerChangeType(changePercent >= 0 ? 'positive' : 'negative');
          }
          
          // Store current listeners as previous for next comparison
          // We'll update localStorage every 30 minutes to avoid too frequent updates
          const lastUpdateTime = localStorage.getItem('lastListenersUpdateTime');
          const currentTime = Date.now();
          if (!lastUpdateTime || (currentTime - parseInt(lastUpdateTime, 10)) > 30 * 60 * 1000) {
            localStorage.setItem('previousLiveListeners', currentListeners.toString());
            localStorage.setItem('lastListenersUpdateTime', currentTime.toString());
            setPreviousListeners(currentListeners);
          }
          
          setLiveListeners(currentListeners);
        } else {
          setLiveListeners(0);
          console.warn('Live listeners data format unexpected:', data);
        }
      } catch (error) {
        console.error('Error fetching live listeners:', error);
        setLiveListenersError('Failed to load live listeners data');
        // Show error toast
        toast({
          title: "Fehler",
          description: "Live-Hörer-Daten konnten nicht geladen werden.",
          variant: "destructive",
        });
      } finally {
        setLiveListenersLoading(false);
      }
    };

    fetchLiveListeners();
    
    // Refresh every 2 minutes
    const interval = setInterval(fetchLiveListeners, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [previousListeners]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatsCard 
        title="Aktive Benutzer" 
        value={loadingUsers ? "..." : String(activeUsers || 0)}
        changeText={`${userChangeType === 'positive' ? '+' : '-'}${userChangePercent}% seit letztem Monat`} 
        changeType={userChangeType}
        icon={<Users className="h-5 w-5 text-purple-400" />} 
        iconBgColor="bg-purple-900/30" 
      />
      
      <StatsCard 
        title="Live-Hörer" 
        value={liveListenersLoading ? "..." : String(liveListeners || 0)}
        changeText={`${listenerChangeType === 'positive' ? '+' : '-'}${listenerChangePercent}% seit letzter Woche`} 
        changeType={listenerChangeType}
        icon={<Headphones className="h-5 w-5 text-green-400" />} 
        iconBgColor="bg-green-900/30" 
      />
      
      <StatsCard 
        title="Podcast Downloads" 
        value={loadingPodcasts ? "..." : String(podcastDownloads || 0)}
        changeText="Veröffentlichte Podcasts" 
        changeType="neutral"
        icon={<Headphones className="h-5 w-5 text-blue-400" />} 
        iconBgColor="bg-blue-900/30" 
      />
      
      <StatsCard 
        title="Geplante Sendungen" 
        value={loadingShows ? "..." : String(upcomingShows || 0)}
        subText="Insgesamt geplant"
        icon={<Calendar className="h-5 w-5 text-pink-400" />} 
        iconBgColor="bg-pink-900/30" 
      />
    </div>
  );
};

export default DashboardStats;
