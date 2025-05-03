
import React from 'react';
import { Card, CardContent } from "@/components/ui/card"; 
import { Users, Radio, FileAudio, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsProps {
  podcastCount: number;
  userCount: number;
  showCount: number;
  nextShow: {
    title: string;
    time: string;
    day: string;
  } | null;
}

interface StatsOverviewProps {
  stats: StatsProps | undefined;
  isLoading: boolean;
}

const StatsOverview = ({ stats, isLoading }: StatsOverviewProps) => {
  const formatDay = (day: string) => {
    const days: Record<string, string> = {
      'monday': 'Montag',
      'tuesday': 'Dienstag',
      'wednesday': 'Mittwoch',
      'thursday': 'Donnerstag',
      'friday': 'Freitag',
      'saturday': 'Samstag',
      'sunday': 'Sonntag'
    };
    
    return days[day.toLowerCase()] || day;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Users Stat */}
      <Card className="shadow-md bg-white border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-1/4" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Benutzer</p>
                  <h3 className="text-3xl font-bold mt-1">{stats?.userCount || 0}</h3>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Registrierte Benutzer</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Shows Stat */}
      <Card className="shadow-md bg-white border-l-4 border-l-purple-500">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-1/4" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sendungen</p>
                  <h3 className="text-3xl font-bold mt-1">{stats?.showCount || 0}</h3>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Radio className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Aktive Sendungen</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Podcasts Stat */}
      <Card className="shadow-md bg-white border-l-4 border-l-green-500">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-1/4" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Podcasts</p>
                  <h3 className="text-3xl font-bold mt-1">{stats?.podcastCount || 0}</h3>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <FileAudio className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Veröffentlichte Podcasts</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Next Show */}
      <Card className="shadow-md bg-white border-l-4 border-l-amber-500">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-2/3" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nächste Sendung</p>
                  <h3 className="text-lg font-bold mt-1 truncate">
                    {stats?.nextShow ? stats.nextShow.title : "Keine geplant"}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-amber-100">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              {stats?.nextShow && (
                <p className="text-xs text-muted-foreground mt-4">
                  {formatDay(stats.nextShow.day)}, {stats.nextShow.time} Uhr
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
