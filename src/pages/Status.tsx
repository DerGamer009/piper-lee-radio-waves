
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { InfoIcon, AlertTriangleIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import Header from '@/components/Header';
import { getStatusUpdates, StatusUpdate } from '@/services/apiService';

const StatusPage = () => {
  const [statusItems, setStatusItems] = useState<StatusUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStatusUpdates = async () => {
      try {
        setLoading(true);
        const data = await getStatusUpdates();
        setStatusItems(data);
      } catch (error) {
        console.error('Error fetching status updates:', error);
        toast({
          title: 'Fehler',
          description: 'Status-Daten konnten nicht geladen werden.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatusUpdates();
  }, [toast]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'degraded performance':
        return <InfoIcon className="h-5 w-5 text-yellow-500" />;
      case 'partial outage':
        return <AlertTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'major outage':
        return <AlertCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'degraded performance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'partial outage':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'major outage':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  const allOperational = statusItems.every(item => 
    item.status.toLowerCase() === 'operational'
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#1c1f2f]">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">System Status</h1>
          <p className="text-gray-400 mb-8">
            Überprüfen Sie den aktuellen Status unserer Systeme und Dienste.
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className={`p-4 rounded-lg ${allOperational ? 'bg-green-100 dark:bg-green-900/20' : 'bg-yellow-100 dark:bg-yellow-900/20'}`}>
                <div className="flex items-center">
                  {allOperational ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                  ) : (
                    <AlertTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
                  )}
                  <h2 className={`text-lg font-medium ${allOperational ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'}`}>
                    {allOperational ? 'Alle Systeme funktionieren normal' : 'Einige Systeme haben Probleme'}
                  </h2>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {statusItems.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getStatusIcon(item.status)}
                          <h3 className="ml-2 font-medium text-gray-900 dark:text-white">{item.system_name}</h3>
                        </div>
                        <div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                      {item.description && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                      )}
                      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        Letzte Aktualisierung: {formatDate(item.updated_at)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StatusPage;
