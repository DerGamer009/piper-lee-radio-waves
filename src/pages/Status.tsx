
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { InfoIcon, AlertTriangleIcon, AlertCircleIcon, CheckCircleIcon, PlusCircleIcon } from "lucide-react";
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStatusUpdates, createStatusItem, StatusUpdate } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';
import { StatusTimeline } from '@/components/StatusTimeline';

// Mock data to use when API fails
const mockStatusItems: StatusUpdate[] = [
  {
    id: 1,
    system_name: 'Website',
    status: 'Operational',
    description: 'Website is functioning normally.',
    created_at: new Date(Date.now() - 40 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 40 * 60000).toISOString()
  },
  {
    id: 2,
    system_name: 'Streaming Service',
    status: 'Degraded Performance',
    description: 'Some users may experience slower streaming.',
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 3,
    system_name: 'Database',
    status: 'Partial Outage',
    description: 'Database connectivity issues affecting some features.',
    created_at: new Date(Date.now() - 20 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 60000).toISOString()
  },
  {
    id: 4,
    system_name: 'API',
    status: 'Operational',
    description: 'API services have been restored.',
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 60000).toISOString()
  }
];

const statusOptions = [
  { value: 'Operational', label: 'Operational', color: 'bg-green-500' },
  { value: 'Degraded Performance', label: 'Eingeschränkte Leistung', color: 'bg-yellow-500' },
  { value: 'Partial Outage', label: 'Teilweiser Ausfall', color: 'bg-orange-500' },
  { value: 'Major Outage', label: 'Größerer Ausfall', color: 'bg-red-500' }
];

const StatusPage = () => {
  const [statusItems, setStatusItems] = useState<StatusUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const { user, isAdmin, isModerator } = useAuth();
  
  const form = useForm({
    defaultValues: {
      system_name: '',
      status: 'Degraded Performance',
      description: ''
    }
  });

  useEffect(() => {
    const fetchStatusUpdates = async () => {
      try {
        setLoading(true);
        const data = await getStatusUpdates();
        setStatusItems(data);
      } catch (error) {
        console.error('Error fetching status updates:', error);
        // Use mock data when API fails
        setStatusItems(mockStatusItems);
        toast({
          title: 'Hinweis',
          description: 'Demo-Daten werden angezeigt, da keine Verbindung zum Server hergestellt werden konnte.',
          variant: 'default'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatusUpdates();
  }, [toast]);

  const handleCreateIncident = async (values: any) => {
    try {
      await createStatusItem({
        system_name: values.system_name,
        status: values.status,
        description: values.description
      });
      
      // If API call fails, we would catch it in the catch block
      // For now, add the new item to the local state
      const newItem: StatusUpdate = {
        id: Date.now(), // Mock ID
        system_name: values.system_name,
        status: values.status,
        description: values.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setStatusItems([...statusItems, newItem]);
      
      toast({
        title: "Vorfall erstellt",
        description: "Der neue Vorfall wurde erfolgreich eingetragen.",
      });
      
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating incident:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Der Vorfall konnte nicht erstellt werden.",
      });
    }
  };

  // Helper functions to determine status icon and colors
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
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-white">System Status</h1>
            
            {(isAdmin || isModerator) && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1">
                    <PlusCircleIcon className="h-4 w-4" />
                    Vorfall melden
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Neuer Vorfall</DialogTitle>
                    <DialogDescription>
                      Tragen Sie einen neuen Vorfall oder Statusaktualisierung ein.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateIncident)} className="space-y-4 mt-2">
                      <FormField
                        control={form.control}
                        name="system_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Systemname</FormLabel>
                            <FormControl>
                              <Input placeholder="z.B. Website, Streaming-Dienst" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Status auswählen" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {statusOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center">
                                      <span className={`h-2 w-2 rounded-full ${option.color} mr-2`}></span>
                                      {option.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beschreibung (optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Details zum Vorfall oder zur Statusaktualisierung" className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit">Vorfall melden</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
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

              {/* Status Timeline */}
              <StatusTimeline incidents={statusItems} />

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
                  
                  {statusItems.length === 0 && (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-10">
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
                        <CardTitle>Keine Vorfälle</CardTitle>
                        <CardDescription className="text-center mt-2">
                          Aktuell gibt es keine gemeldeten Vorfälle oder Wartungsarbeiten.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  )}
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
