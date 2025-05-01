
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, AlertTriangle, RefreshCw, PlusCircle,
  XIcon, Edit, Trash, Activity, Pencil
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<StatusUpdate | null>(null);
  const [formData, setFormData] = useState({
    system_name: '',
    status: 'Operational',
    description: ''
  });
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
      setIsAddDialogOpen(false);
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
      await updateStatusItem(String(currentStatus.id), {
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
      await deleteStatusItem(String(currentStatus.id));
      
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
  };

  const openEditDialog = (status: StatusUpdate) => {
    setCurrentStatus(status);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (status: StatusUpdate) => {
    setCurrentStatus(status);
    setIsDeleteDialogOpen(true);
  };
  
  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        status === 'Operational' ? 'bg-green-100/20 text-green-400' :
        status === 'Degraded Performance' ? 'bg-yellow-100/20 text-yellow-400' :
        status === 'Partial Outage' ? 'bg-orange-100/20 text-orange-400' :
        'bg-red-100/20 text-red-400'
      }`}>
        <span className={`mr-1 h-2 w-2 rounded-full ${
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

  if (error) {
    console.error('Error loading status data:', error);
  }

  return (
    <Card className="bg-[#1A1F2C] border-gray-700 h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-lg text-white flex items-center gap-2">
            System Status verwalten
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="bg-transparent border-gray-600 hover:bg-gray-700 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
          <Button
            size="sm"
            onClick={openAddDialog}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Neuer Status
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {statusItems.map((item) => (
              <div key={item.id} className="p-4 border border-gray-700 rounded-lg bg-gray-800/40">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {item.status === 'Operational' ? (
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                    )}
                    <h3 className="font-medium text-white">{item.system_name}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(item.status)}
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Bearbeiten</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(item)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Löschen</span>
                      </Button>
                    </div>
                  </div>
                </div>
                {item.description && (
                  <p className="mt-2 text-sm text-gray-300">{item.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Zuletzt aktualisiert: {formatDate(item.updated_at)}
                </p>
              </div>
            ))}
            
            {statusItems.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2 text-white">Keine Status-Einträge gefunden</h3>
                <p className="text-gray-400 mb-4">
                  Fügen Sie Ihre ersten System-Status-Einträge hinzu.
                </p>
                <Button onClick={openAddDialog} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Status erstellen
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-[#1A1F2C] text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Neuen Status hinzufügen</DialogTitle>
              <DialogDescription className="text-gray-400">
                Erstellen Sie einen neuen System-Status-Eintrag.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="system_name" className="text-gray-300">Systemname</Label>
                  <Input
                    id="system_name"
                    name="system_name"
                    value={formData.system_name}
                    onChange={handleInputChange}
                    placeholder="z.B. API, Website, Chat-System"
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status" className="text-gray-300">Status</Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Status auswählen" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
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
                  <Label htmlFor="description" className="text-gray-300">Beschreibung (optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Nähere Details zum Systemstatus"
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="bg-transparent border-gray-600 hover:bg-gray-700 text-white">Abbrechen</Button>
              </DialogClose>
              <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700 text-white">
                Erstellen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#1A1F2C] text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">System-Status bearbeiten</DialogTitle>
              <DialogDescription className="text-gray-400">
                Aktualisieren Sie die Details des System-Status.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="edit_system_name" className="text-gray-300">Systemname</Label>
                  <Input
                    id="edit_system_name"
                    name="system_name"
                    value={formData.system_name}
                    onChange={handleInputChange}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit_status" className="text-gray-300">Status</Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Status auswählen" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
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
                  <Label htmlFor="edit_description" className="text-gray-300">Beschreibung (optional)</Label>
                  <Textarea
                    id="edit_description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="bg-transparent border-gray-600 hover:bg-gray-700 text-white">Abbrechen</Button>
              </DialogClose>
              <Button onClick={handleUpdate} className="bg-purple-600 hover:bg-purple-700 text-white">
                Speichern
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-[#1A1F2C] text-white border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">System-Status löschen</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Sind Sie sicher, dass Sie diesen System-Status löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-gray-600 hover:bg-gray-700 text-white">Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
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
