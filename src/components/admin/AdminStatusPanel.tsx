
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, RefreshCcw, Plus, Edit, Trash, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type StatusItem = {
  id: string;
  name: string;
  status: 'operational' | 'issue' | 'outage';
  lastUpdated: string;
  description: string;
};

interface AdminStatusPanelProps {
  streamUrl?: string;
}

const initialStatuses: StatusItem[] = [
  {
    id: '1',
    name: 'API',
    status: 'operational',
    lastUpdated: '01.05.2025, 15:06',
    description: 'API services have been restored.'
  },
  {
    id: '2',
    name: 'Website',
    status: 'operational',
    lastUpdated: '01.05.2025, 14:40',
    description: 'Die Website läuft ohne Probleme'
  },
  {
    id: '3',
    name: 'Chat-System',
    status: 'operational',
    lastUpdated: '01.05.2025, 14:39',
    description: 'Der Live-Chat funktioniert einwandfrei'
  },
  {
    id: '4',
    name: 'Streaming-Dienst',
    status: 'operational',
    lastUpdated: '01.05.2025, 14:24',
    description: 'Der Streaming-Dienst ist verfügbar'
  },
  {
    id: '5',
    name: 'Datenbank',
    status: 'operational',
    lastUpdated: '01.05.2025, 14:15',
    description: 'Die Datenbank ist verfügbar'
  }
];

const AdminStatusPanel: React.FC<AdminStatusPanelProps> = ({ streamUrl }) => {
  const [statuses, setStatuses] = useState<StatusItem[]>(initialStatuses);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Status aktualisiert",
        description: "Alle Systeme wurden aktualisiert.",
      });
    }, 1000);
  };

  const handleNewStatus = () => {
    toast({
      title: "Neuer Status",
      description: "Diese Funktionalität ist noch in Entwicklung.",
    });
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white rounded-t-lg pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white text-indigo-600 p-1 rounded-full">
              <Activity className="h-4 w-4" />
            </span>
            System Status verwalten
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm"
              disabled={isRefreshing}
              className="bg-white/20 text-white border-white/40 hover:bg-white/30"
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> 
              Aktualisieren
            </Button>
            <Button 
              onClick={handleNewStatus} 
              variant="outline" 
              size="sm"
              className="bg-white/20 text-white border-white/40 hover:bg-white/30"
            >
              <Plus className="h-4 w-4 mr-2" /> 
              Neuer Status
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {statuses.map(status => (
            <div key={status.id} className="flex justify-between items-center p-4 bg-card/30 rounded-lg border border-muted">
              <div className="flex items-center gap-3">
                {status.status === 'operational' && (
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                )}
                {status.status === 'issue' && (
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                )}
                {status.status === 'outage' && (
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                )}
                <div>
                  <h3 className="font-medium">{status.name}</h3>
                  <p className="text-sm text-muted-foreground">{status.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Zuletzt aktualisiert: {status.lastUpdated}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {streamUrl && (
          <div className="mt-6 p-4 bg-card/30 rounded-lg border border-muted">
            <h3 className="font-medium mb-2">Stream URL</h3>
            <p className="text-sm text-muted-foreground break-all">{streamUrl}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminStatusPanel;
