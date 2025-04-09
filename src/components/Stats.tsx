import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getShows, getSchedule } from '@/services/apiService';

export function Stats() {
  const { data: shows = [] } = useQuery({
    queryKey: ['shows'],
    queryFn: getShows
  });

  const { data: schedule = [] } = useQuery({
    queryKey: ['schedule'],
    queryFn: getSchedule
  });

  // Calculate statistics
  const totalShows = shows.length;
  const totalScheduledShows = schedule.length;
  const upcomingShows = schedule.filter(item => new Date(item.start_time) > new Date()).length;
  const recurringShows = schedule.filter(item => item.is_recurring).length;
  const uniqueHosts = new Set(schedule.map(item => item.host_id)).size;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Shows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalShows}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scheduled Shows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalScheduledShows}</div>
          <p className="text-xs text-muted-foreground">
            {upcomingShows} upcoming shows
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recurring Shows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recurringShows}</div>
          <p className="text-xs text-muted-foreground">
            {((recurringShows / totalScheduledShows) * 100).toFixed(1)}% of total shows
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Hosts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueHosts}</div>
          <p className="text-xs text-muted-foreground">
            Hosting {totalScheduledShows} shows
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Shows per Host</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {uniqueHosts ? (totalScheduledShows / uniqueHosts).toFixed(1) : '0'}
          </div>
          <p className="text-xs text-muted-foreground">
            Average shows per host
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Schedule Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {((totalScheduledShows / (7 * 24)) * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Of weekly time slots filled
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 