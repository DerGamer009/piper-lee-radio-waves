
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { StatusUpdate } from '@/services/apiService';

interface TimelineProps {
  incidents: StatusUpdate[];
}

interface TimelineSegment {
  status: string;
  width: number;
  tooltipText: string;
}

export const StatusTimeline: React.FC<TimelineProps> = ({ incidents = [] }) => {
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded performance':
        return 'bg-yellow-500';
      case 'partial outage':
        return 'bg-orange-500';
      case 'major outage':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Sort incidents by date
  const sortedIncidents = [...incidents].sort((a, b) => 
    new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
  );

  // Generate time labels for minutes
  const generateTimeLabels = () => {
    const labels = [];
    for (let i = 0; i <= 45; i += 5) {
      labels.push(
        <div key={i} className="absolute text-xs text-gray-400" style={{ left: `${(i / 45) * 100}%`, transform: 'translateX(-50%)' }}>
          {i} Min
        </div>
      );
    }
    // Add "Jetzt" label at the end
    labels.push(
      <div key="now" className="absolute text-xs text-gray-400" style={{ right: '0', transform: 'translateX(50%)' }}>
        Jetzt
      </div>
    );
    return labels;
  };

  // Create timeline segments
  const generateTimelineSegments = (): TimelineSegment[] => {
    // If no incidents, create one "operational" segment
    if (sortedIncidents.length === 0) {
      return [{
        status: 'operational',
        width: 100,
        tooltipText: 'Alle Systeme funktionieren normal'
      }];
    }
    
    // Create segments based on status changes
    const segments: TimelineSegment[] = [];
    
    sortedIncidents.forEach((incident, i) => {
      const segmentWidth = i === sortedIncidents.length - 1 
        ? 100 / sortedIncidents.length 
        : (i + 1) * (100 / sortedIncidents.length);
      
      segments.push({
        status: incident.status,
        width: segmentWidth,
        tooltipText: `${incident.system_name}: ${incident.status} (${new Date(incident.updated_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })})`
      });
    });
    
    return segments;
  };

  const timeLabels = generateTimeLabels();
  const segments = generateTimelineSegments();

  return (
    <div className="relative pt-6 pb-10">
      <div className="text-white text-sm mb-1">System-Status-Verlauf (letzte 45 Minuten)</div>
      
      {/* Time labels */}
      <div className="relative h-6 mb-2">
        {timeLabels}
      </div>
      
      {/* Custom timeline bar */}
      <div className="flex h-8 w-full rounded-md overflow-hidden">
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`${getStatusColor(segment.status)} relative group cursor-help`}
            style={{ width: `${segment.width}%` }}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
              {segment.tooltipText}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end mt-4 space-x-4">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
          <span className="text-xs text-gray-400">Operational</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
          <span className="text-xs text-gray-400">Degraded</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-orange-500 mr-1"></div>
          <span className="text-xs text-gray-400">Partial Outage</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
          <span className="text-xs text-gray-400">Major Outage</span>
        </div>
      </div>
    </div>
  );
};
