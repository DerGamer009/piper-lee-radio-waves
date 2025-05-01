
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangleIcon, CheckCircleIcon, RefreshCwIcon, PlusIcon, 
  XIcon, EditIcon, TrashIcon, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { getStatusUpdates, updateStatusItem, createStatusItem, deleteStatusItem, StatusUpdate } from '@/services/apiService';

const statusOptions = [
  { value: 'Operational', label: 'Operational', color: 'bg-green-500' },
  { value: 'Degraded Performance', label: 'Eingeschränkte Leistung', color: 'bg-yellow-500' },
  { value: 'Partial Outage', label: 'Teilweiser Ausfall', color: 'bg-orange-500' },
  { value: 'Major Outage', label: 'Größerer Ausfall', color: 'bg-red-500' }
];

const StatusManagement: React.FC = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<StatusUpdate | null>(null);
  const [formData, setFormData] = useState({
    system_name: '',
    status: 'Operational',
    description: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: statusItems = [], isLoading, error } = useQuery({
    queryKey: ['status-updates'],
    queryFn: getStatusUpdates
  });

  useEffect(() => {
    if (currentStatus) {
      setFormData({
        system_name: currentStatus.system_name,
        status: currentStatus.status,
        description: currentStatus.description || ''
      });
    }
  }, [currentStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleCreate = async () => {
    try {
      await createStatusItem({
        system_name: formData.system_name,
        status: formData.status,
        description: formData.description
      });
      
      queryClient.invalidateQueries({ queryKey: ['status-updates'] });
      toast({
        title: "Status erstellt",
        description: "Der neue Systemstatus wurde erfolgreich erstellt.",
      });
      resetForm();
    } catch (error) {
      console.error('Error creating status:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Der Status konnte nicht erstellt werden.",
      });
    }
  };

  const handleUpdate = async () => {
    if (!currentStatus) return;
    
    try {
      await updateStatusItem(currentStatus.id, {
        system_name: formData.system_name,
        status: formData.status,
        description: formData.description
      });
      
      queryClient.invalidateQueries({ queryKey: ['status-updates'] });
      toast({
        title: "Status aktualisiert",
        description: "Der Systemstatus wurde erfolgreich aktualisiert.",
      });
      setIsEditDialogOpen(false);
      setCurrentStatus(null);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Der Status konnte nicht aktualisiert werden.",
      });
    }
  };

  const handleDelete = async () => {
    if (!currentStatus) return;
    
    try {
      await deleteStatusItem(currentStatus.id);
      
      queryClient.invalidateQueries({ queryKey: ['status-updates'] });
      toast({
        title: "Status gelöscht",
        description: "Der Systemstatus wurde erfolgreich gelöscht.",
      });
      setIsDeleteDialogOpen(false);
      setCurrentStatus(null);
    } catch (error) {
      console.error('Error deleting status:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Der Status konnte nicht gelöscht werden.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      system_name: '',
      status: 'Operational',
      description: ''
    });
    setIsCreating(false);
  };

  const openEditDialog = (status: StatusUpdate) => {
    setCurrentStatus(status);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (status: StatusUpdate) => {
    setCurrentStatus(status);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'Operational' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
        status === 'Degraded Performance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
        status === 'Partial Outage' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      }`}>
        <span className={`mr-1.5 h-2 w-2 rounded-full ${
          status === 'Operational' ? 'bg-green-500' :
          status === 'Degraded Performance' ? 'bg-yellow-500' :
          status === 'Partial Outage' ? 'bg-orange-500' :
          'bg-red-500'
        }`}></span>
        {status}
      </span>
    );
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['status-updates'] });
  };

  if (error) {
    console.error('Error loading status data:', error);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            System Status verwalten
          </CardTitle>
          <CardDescription>
            Aktualisieren Sie den Status Ihrer Systemkomponenten.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCwIcon className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreating(true)}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Neuer Status
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : statusItems.length > 0 ? (
          <div className="space-y-4">
            {statusItems.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg shadow-sm bg-card hover:bg-accent/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {item.status === 'Operational' ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <AlertTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                    )}
                    <h3 className="font-medium">{item.system_name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                        className="h-8 w-8 p-0"
                      >
                        <EditIcon className="h-4 w-4" />
                        <span className="sr-only">Bearbeiten</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(item)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Löschen</span>
                      </Button>
                    </div>
                  </div>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                )}
                <div className="text-xs text-muted-foreground mt-2">
                  Zuletzt aktualisiert: {new Date(item.updated_at).toLocaleString('de-DE')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">Keine Status-Einträge gefunden</h3>
            <p className="text-muted-foreground mb-4">
              Fügen Sie Ihre ersten System-Status-Einträge hinzu.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Status erstellen
            </Button>
          </div>
        )}

        {/* Create Status Form */}
        {isCreating && (
          <div className="mt-6 border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Neuen System-Status erstellen</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="h-8 w-8 p-0"
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Abbrechen</span>
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="system_name">Systemname</Label>
                <Input
                  id="system_name"
                  name="system_name"
                  value={formData.system_name}
                  onChange={handleInputChange}
                  placeholder="z.B. Website, Streaming-Dienst"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Status auswählen" />
                  </SelectTrigger>
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
              </div>
              
              <div>
                <Label htmlFor="description">Beschreibung (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nähere Details zum Systemstatus"
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>Abbrechen</Button>
                <Button onClick={handleCreate}>Erstellen</Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>System-Status bearbeiten</DialogTitle>
              <DialogDescription>
                Aktualisieren Sie die Details des System-Status.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="edit_system_name">Systemname</Label>
                  <Input
                    id="edit_system_name"
                    name="system_name"
                    value={formData.system_name}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit_status">Status</Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Status auswählen" />
                    </SelectTrigger>
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
                </div>
                
                <div>
                  <Label htmlFor="edit_description">Beschreibung (optional)</Label>
                  <Textarea
                    id="edit_description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Abbrechen</Button>
              </DialogClose>
              <Button onClick={handleUpdate}>Speichern</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>System-Status löschen</AlertDialogTitle>
              <AlertDialogDescription>
                Sind Sie sicher, dass Sie diesen System-Status löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default StatusManagement;
