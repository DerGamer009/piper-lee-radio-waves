
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
  const [liveListenersLoading, setLiveListenersLoading] = useState(true);
  const [liveListenersError, setLiveListenersError] = useState<string | null>(null);

  // Fetch active users count
  const { data: activeUsers, isLoading: loadingUsers } = useQuery({
    queryKey: ['active-users-count'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_sign_in_at', thirtyDaysAgo.toISOString());
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch podcast downloads
  const { data: podcastDownloads, isLoading: loadingPodcasts } = useQuery({
    queryKey: ['podcast-downloads-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('podcast_downloads')
        .select('count')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return 0; // No data found
        }
        throw error;
      }
      
      return data?.count || 0;
    }
  });

  // Fetch upcoming shows count
  const { data: upcomingShows, isLoading: loadingShows } = useQuery({
    queryKey: ['upcoming-shows-count'],
    queryFn: async () => {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const { count, error } = await supabase
        .from('schedule')
        .select('*', { count: 'exact', head: true })
        .gte('date', today.toISOString())
        .lte('date', nextWeek.toISOString());
      
      if (error) throw error;
      return count || 0;
    }
  });

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
          setLiveListeners(data.listeners.current);
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
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatsCard 
        title="Aktive Benutzer" 
        value={loadingUsers ? "..." : String(activeUsers || 0)}
        changeText="+12% seit letztem Monat" 
        changeType="positive"
        icon={<Users className="h-5 w-5 text-purple-400" />} 
        iconBgColor="bg-purple-900/30" 
      />
      
      <StatsCard 
        title="Live-Hörer" 
        value={liveListenersLoading ? "..." : String(liveListeners || 0)}
        changeText="+5% seit letzter Woche" 
        changeType="positive"
        icon={<Headphones className="h-5 w-5 text-green-400" />} 
        iconBgColor="bg-green-900/30" 
      />
      
      <StatsCard 
        title="Podcast Downloads" 
        value={loadingPodcasts ? "..." : String(podcastDownloads || 0)}
        changeText="-2% seit letztem Monat" 
        changeType="negative"
        icon={<Headphones className="h-5 w-5 text-blue-400" />} 
        iconBgColor="bg-blue-900/30" 
      />
      
      <StatsCard 
        title="Geplante Sendungen" 
        value={loadingShows ? "..." : String(upcomingShows || 0)}
        subText="Für die nächste Woche"
        icon={<Calendar className="h-5 w-5 text-pink-400" />} 
        iconBgColor="bg-pink-900/30" 
      />
    </div>
  );
};

export default DashboardStats;
