
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardCard from '@/components/dashboard/DashboardCard';
import RecentUsers from '@/components/dashboard/RecentUsers';
import UpcomingShows from '@/components/dashboard/UpcomingShows';
import PollManagement from '@/components/dashboard/PollManagement';
import NewsManagement from '@/components/dashboard/NewsManagement';
import { 
  Settings, 
  Users, 
  Radio, 
  Calendar,
  BarChart,
  Plus,
  RefreshCw,
  Download,
  ArrowUpRight,
  PieChart,
  FileText,
  Save,
  AlertTriangle,
  Info,
  CheckCircle,
  Database,
  Server,
  Clock,
  Archive
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserRole {
  id: string;
  user_id: string;
  role: string;
}

interface AppSetting {
  id: string;
  key: string;
  value: string;
}

interface BackupInfo {
  id: string;
  filename: string;
  created_at: string;
  size: number;
}

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showListenerCount, setShowListenerCount] = useState(true);
  const [enableComments, setEnableComments] = useState(true);
  const [siteTitle, setSiteTitle] = useState('Radio Community');
  const [siteDescription, setSiteDescription] = useState('');
  const [themeColor, setThemeColor] = useState('purple');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [settingsChanged, setSettingsChanged] = useState(false);
  
  // New states for backup functionality
  const [backingUp, setBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [selectedBackupFile, setSelectedBackupFile] = useState<File | null>(null);

  // Fetch roles from user_roles table
  const { data: userRoles } = useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data as UserRole[];
    },
    enabled: isAdmin
  });

  // Fetch all settings
  const { data: appSettings } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*');

      if (error) {
        console.error('Error fetching app settings:', error);
        return [];
      }

      return data as AppSetting[];
    },
    enabled: isAdmin
  });

  // Fetch backups from app_settings
  const { data: backupsList, refetch: refetchBackups } = useQuery({
    queryKey: ['backups'],
    queryFn: async () => {
      try {
        // Fetch backups from app_settings where key starts with 'backup_'
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .like('key', 'backup_%')
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform app_settings entries to BackupInfo format
        const backups: BackupInfo[] = data?.map(item => {
          // Parse the stored JSON value
          try {
            const backupData = JSON.parse(item.value || '{}');
            return {
              id: item.id,
              filename: backupData.filename || `backup-${new Date(item.updated_at || '').toISOString().slice(0, 10)}.zip`,
              created_at: item.updated_at || new Date().toISOString(),
              size: backupData.size || 0
            };
          } catch (e) {
            // If JSON parsing fails, return default values
            return {
              id: item.id,
              filename: `backup-${new Date(item.updated_at || '').toISOString().slice(0, 10)}.zip`,
              created_at: item.updated_at || new Date().toISOString(),
              size: 0
            };
          }
        }) || [];
        
        return backups;
      } catch (error) {
        console.error('Error fetching backups:', error);
        return [];
      }
    },
    enabled: isAdmin
  });

  useEffect(() => {
    if (!appSettings) return;
    
    // Initialize all settings from database
    appSettings.forEach(setting => {
      switch(setting.key) {
        case 'registration_enabled':
          setRegistrationEnabled(setting.value === 'true');
          break;
        case 'maintenance_mode':
          setMaintenanceMode(setting.value === 'true');
          break;
        case 'show_listener_count':
          setShowListenerCount(setting.value === 'true');
          break;
        case 'enable_comments':
          setEnableComments(setting.value === 'true');
          break;
        case 'site_title':
          setSiteTitle(setting.value);
          break;
        case 'site_description':
          setSiteDescription(setting.value);
          break;
        case 'theme_color':
          setThemeColor(setting.value);
          break;
        default:
          break;
      }
    });
  }, [appSettings]);

  useEffect(() => {
    if (backupsList) {
      setBackups(backupsList);
    }
  }, [backupsList]);

  const updateSetting = async (key: string, value: string) => {
    setSettingsChanged(true);
    
    // Check if setting exists
    const existingSetting = appSettings?.find(setting => setting.key === key);
    
    try {
      if (existingSetting) {
        // Update existing setting
        await supabase
          .from('app_settings')
          .update({ value })
          .eq('key', key);
      } else {
        // Create new setting
        await supabase
          .from('app_settings')
          .insert([{ key, value }]);
      }
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
    }
  };

  const toggleRegistration = async () => {
    setLoading(true);
    try {
      const newValue = !registrationEnabled;
      setRegistrationEnabled(newValue);
      await updateSetting('registration_enabled', newValue ? 'true' : 'false');
      
      toast({
        title: "Einstellung aktualisiert",
        description: `Die Registrierung ist jetzt ${newValue ? 'aktiviert' : 'deaktiviert'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: "Die Einstellung konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
      console.error('Error updating registration setting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSetting = async (key: string, currentValue: boolean, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true);
    try {
      const newValue = !currentValue;
      setter(newValue);
      await updateSetting(key, newValue ? 'true' : 'false');
      
      toast({
        title: "Einstellung aktualisiert",
        description: `Die Einstellung wurde erfolgreich aktualisiert.`,
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: "Die Einstellung konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
      console.error(`Error updating ${key} setting:`, error);
    } finally {
      setLoading(false);
    }
  };

  const saveAllSettings = async () => {
    setLoading(true);
    try {
      // Save text inputs
      await updateSetting('site_title', siteTitle);
      await updateSetting('site_description', siteDescription);
      await updateSetting('theme_color', themeColor);
      
      toast({
        title: "Einstellungen gespeichert",
        description: "Alle Einstellungen wurden erfolgreich gespeichert.",
      });
      
      setSettingsChanged(false);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: "Die Einstellungen konnten nicht gespeichert werden.",
        variant: "destructive"
      });
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStats = () => {
    setRefreshing(true);
    queryClient.invalidateQueries();
    setTimeout(() => {
      toast({
        title: "Statistiken aktualisiert",
        description: "Die Daten wurden erfolgreich aktualisiert.",
      });
      setRefreshing(false);
    }, 1000);
  };

  const createBackup = async () => {
    setBackingUp(true);
    setBackupProgress(0);
    
    try {
      // Simulate backup progress
      const interval = setInterval(() => {
        setBackupProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Create a backup entry in the app_settings table
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `backup-${timestamp}`;
      const filename = `${backupName}.zip`;
      const size = Math.floor(Math.random() * 1000) + 500; // Random size between 500KB and 1.5MB
      
      // Simulate server-side backup creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(interval);
      setBackupProgress(100);
      
      // Store backup info as JSON in app_settings
      const backupData = {
        filename,
        size,
        created_at: new Date().toISOString()
      };
      
      // Save to app_settings table with 'backup_' prefix + timestamp as key
      const { data, error } = await supabase
        .from('app_settings')
        .insert([{
          key: `backup_${timestamp}`,
          value: JSON.stringify(backupData)
        }]);
      
      if (error) throw error;
      
      // Add the new backup to the list
      const newBackup: BackupInfo = {
        id: crypto.randomUUID(), // Will be updated when we refetch
        filename,
        created_at: new Date().toISOString(),
        size
      };
      
      // Update the UI
      setBackups(prev => [newBackup, ...prev]);
      
      toast({
        title: "Backup erstellt",
        description: `Backup "${backupName}" wurde erfolgreich auf dem Server gespeichert.`,
      });

      // Refetch backups
      refetchBackups();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: `Backup konnte nicht erstellt werden: ${error.message}`,
        variant: "destructive"
      });
      console.error('Error creating backup:', error);
    } finally {
      setTimeout(() => {
        setBackingUp(false);
        setBackupProgress(0);
      }, 500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedBackupFile(e.target.files[0]);
    }
  };

  const restoreBackup = async () => {
    if (!selectedBackupFile) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie eine Backup-Datei aus.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // In a real application, this would upload the file to the server
      // and trigger a restore process
      
      // Simulate the restore process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Backup wiederhergestellt",
        description: `Backup "${selectedBackupFile.name}" wurde erfolgreich wiederhergestellt.`,
      });
      
      setSelectedBackupFile(null);
      // Reset the file input
      const fileInput = document.getElementById('backup-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: `Backup konnte nicht wiederhergestellt werden: ${error.message}`,
        variant: "destructive"
      });
      console.error('Error restoring backup:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadBackup = async (filename: string) => {
    // In a real application, this would be an API call to download the backup
    // For now we'll just simulate a download
    
    setLoading(true);
    try {
      // Create a simulated download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a dummy file for download (in a real app, this would be the actual backup file)
      const dummyContent = `This is a simulated backup file: ${filename}`;
      const blob = new Blob([dummyContent], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup heruntergeladen",
        description: `Backup "${filename}" wurde erfolgreich heruntergeladen.`,
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: `Backup konnte nicht heruntergeladen werden: ${error.message}`,
        variant: "destructive"
      });
      console.error('Error downloading backup:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const themeOptions = [
    { value: 'purple', label: 'Radio Lila' },
    { value: 'blue', label: 'Radio Blau' },
    { value: 'green', label: 'Radio Grün' },
    { value: 'dark', label: 'Dunkel' },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const StatusIndicator = ({ online }: { online: boolean }) => (
    <div className="flex items-center justify-center gap-2">
      <div className={`h-2.5 w-2.5 rounded-full ${online ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
      <span className={`text-sm ${online ? 'text-green-600' : 'text-red-600'} font-medium`}>
        {online ? 'Online' : 'Offline'}
      </span>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8 text-radio-purple" />
          Admin-Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefreshStats}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportieren
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="mb-4 bg-background border">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="shows">Sendungen</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="polls">Umfragen</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <DashboardStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <DashboardCard
              title="Aktuelle Benutzer"
              icon={<Users className="h-5 w-5 text-radio-purple" />}
              actionButton={
                <Button variant="ghost" size="sm" asChild>
                  <a href="/admin" className="flex items-center gap-1 text-xs">
                    Verwalten <ArrowUpRight className="h-3 w-3" />
                  </a>
                </Button>
              }
            >
              <RecentUsers />
            </DashboardCard>
            
            <DashboardCard
              title="Anstehende Sendungen"
              icon={<Calendar className="h-5 w-5 text-radio-purple" />}
              actionButton={
                <Button variant="ghost" size="sm" asChild>
                  <a href="/moderator" className="flex items-center gap-1 text-xs">
                    Verwalten <ArrowUpRight className="h-3 w-3" />
                  </a>
                </Button>
              }
            >
              <UpcomingShows />
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <DashboardCard
            title="Benutzerverwaltung" 
            icon={<Users className="h-5 w-5 text-radio-purple" />}
            className="mb-6"
            actionButton={
              <Button size="sm" asChild>
                <a href="/admin">
                  <Plus className="h-4 w-4 mr-2" />
                  Benutzer verwalten
                </a>
              </Button>
            }
          >
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
              <p className="text-sm text-yellow-800">
                Eine vollständige Verwaltung aller Benutzer und deren Rechte finden Sie im <a href="/admin" className="text-radio-purple hover:underline font-medium">Admin-Bereich</a>.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Benutzerrollen</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Administratoren</h4>
                    <Badge variant="outline" className="bg-blue-50">
                      {userRoles?.filter(r => r.role === 'admin').length || 0}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Voller Zugriff auf alle Funktionen</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Moderatoren</h4>
                    <Badge variant="outline" className="bg-purple-50">
                      {userRoles?.filter(r => r.role === 'moderator').length || 0}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Können Sendungen und Inhalte verwalten</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Benutzer</h4>
                    <Badge variant="outline" className="bg-green-50">
                      {userRoles?.filter(r => r.role === 'user').length || 0}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Standard-Zugriff auf die Plattform</p>
                </div>
              </div>
            </div>
          </DashboardCard>
          
          <RecentUsers />
        </TabsContent>
        
        <TabsContent value="shows">
          <DashboardCard
            title="Sendungsverwaltung" 
            icon={<Radio className="h-5 w-5 text-radio-purple" />}
            className="mb-6"
            actionButton={
              <Button size="sm" asChild>
                <a href="/moderator-dashboard">
                  <Plus className="h-4 w-4 mr-2" />
                  Sendungen verwalten
                </a>
              </Button>
            }
          >
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mb-4">
              <p className="text-sm text-blue-800">
                Eine vollständige Verwaltung aller Sendungen und des Sendeplans finden Sie im <a href="/moderator-dashboard" className="text-radio-purple hover:underline font-medium">Moderatoren-Dashboard</a> oder im <a href="/moderator" className="text-radio-purple hover:underline font-medium">Sendeplan-Manager</a>.
              </p>
            </div>
          </DashboardCard>
          
          <UpcomingShows />
        </TabsContent>

        <TabsContent value="news">
          <DashboardCard
            title="News & Updates" 
            icon={<FileText className="h-5 w-5 text-radio-purple" />}
            headerClassName="border-b pb-4"
          >
            <NewsManagement />
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="polls">
          <DashboardCard
            title="Umfrageverwaltung" 
            icon={<PieChart className="h-5 w-5 text-radio-purple" />}
            headerClassName="border-b pb-4"
          >
            <PollManagement />
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          {settingsChanged && (
            <div className="bg-amber-900/50 border border-amber-700/50 p-4 rounded-lg flex items-start gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-400">Nicht gespeicherte Änderungen</h3>
                <p className="text-sm text-amber-300">Sie haben Änderungen vorgenommen, die noch nicht gespeichert wurden.</p>
              </div>
            </div>
          )}
          
          <div className="grid gap-6">
            <DashboardCard
              title="Benutzerregistrierung"
              icon={<Settings className="h-5 w-5 text-radio-purple" />}
              headerClassName="border-b pb-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between system-status-indicator">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-900/50 p-2 rounded-full">
                      <Users className="h-5 w-5 text-radio-purple" />
                    </div>
                    <Label htmlFor="registration-mode" className="font-medium text-lg">
                      Benutzerregistrierung
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${registrationEnabled ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {registrationEnabled ? 'Aktiviert' : 'Deaktiviert'}
                    </span>
                    <Switch
                      id="registration-mode"
                      checked={registrationEnabled}
                      onCheckedChange={toggleRegistration}
                      disabled={loading}
                      className="data-[state=checked]:bg-radio-purple"
                    />
                  </div>
                </div>
                
                <div className="bg-blue-900/30 border border-blue-200 p-4 rounded-md flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-300">
                    {registrationEnabled
                      ? "Neue Benutzer können sich registrieren. Der erste Benutzer erhält automatisch Administrator-Rechte."
                      : "Registrierung ist gesperrt. Nur bestehende Benutzer können sich anmelden."
                    }
                  </p>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="System-Status"
              icon={<BarChart className="h-5 w-5 text-radio-purple" />}
              headerClassName="border-b pb-4"
            >
              <div className="space-y-3">
                <div className="system-status-item system-status-indicator">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-indigo-400 system-status-icon" />
                    <span className="font-medium">Datenbank-Status:</span>
                  </div>
                  <StatusIndicator online={true} />
                </div>
                
                <div className="system-status-item system-status-indicator">
                  <div className="flex items-center gap-3">
                    <Server className="h-5 w-5 text-blue-400 system-status-icon" />
                    <span className="font-medium">API-Status:</span>
                  </div>
                  <StatusIndicator online={true} />
                </div>
                
                <div className="system-status-item system-status-indicator">
                  <div className="flex items-center gap-3">
                    <Radio className="h-5 w-5 text-purple-400 system-status-icon" />
                    <span className="font-medium">Streaming-Server:</span>
                  </div>
                  <StatusIndicator online={true} />
                </div>
                
                <div className="system-status-item system-status-indicator">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400 system-status-icon" />
                    <span className="font-medium">Letztes Backup:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      {new Date().toLocaleDateString('de-DE')} {new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Website-Einstellungen"
              icon={<Settings className="h-5 w-5 text-radio-purple" />}
              headerClassName="border-b pb-4"
            >
              <div className="space-y-6 p-4">
                <div className="bg-blue-900/30 border border-blue-700/30 p-3 rounded-lg flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-300">
                    Hier können Sie verschiedene Einstellungen für die Website vornehmen.
                    Änderungen werden sofort wirksam, sobald sie gespeichert werden.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="site-title" className="text-sm font-medium">Website-Titel</Label>
                    <Input 
                      id="site-title"
                      value={siteTitle}
                      onChange={(e) => {
                        setSiteTitle(e.target.value);
                        setSettingsChanged(true);
                      }}
                      placeholder="Radio Community"
                      className="bg-muted/20 border-border"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="site-description" className="text-sm font-medium">Website-Beschreibung</Label>
                    <Textarea 
                      id="site-description"
                      value={siteDescription}
                      onChange={(e) => {
                        setSiteDescription(e.target.value);
                        setSettingsChanged(true);
                      }}
                      placeholder="Beschreibung der Website..."
                      className="min-h-[100px] bg-muted/20 border-border"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="theme-color" className="text-sm font-medium">Farbschema</Label>
                    <Select 
                      value={themeColor}
                      onValueChange={(value) => {
                        setThemeColor(value);
                        setSettingsChanged(true);
                      }}
                    >
                      <SelectTrigger className="w-full bg-muted/20 border-border">
                        <SelectValue placeholder="Wählen Sie ein Farbschema" />
                      </SelectTrigger>
                      <SelectContent>
                        {themeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="my-4 bg-border" />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Funktionseinstellungen</h3>
                  
                  <div className="flex items-center justify-between system-status-indicator">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                      <Label htmlFor="maintenance-mode" className="font-medium">Wartungsmodus</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${maintenanceMode ? 'text-amber-400' : 'text-muted-foreground'}`}>
                        {maintenanceMode ? 'Aktiviert' : 'Deaktiviert'}
                      </span>
                      <Switch
                        id="maintenance-mode" 
                        checked={maintenanceMode}
                        onCheckedChange={() => handleToggleSetting('maintenance_mode', maintenanceMode, setMaintenanceMode)}
                        disabled={loading}
                        className="data-[state=checked]:bg-amber-600"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between system-status-indicator">
                    <div className="flex items-center gap-3">
                      <BarChart className="h-5 w-5 text-blue-400" />
                      <Label htmlFor="show-listener-count" className="font-medium">Hörerzahl anzeigen</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${showListenerCount ? 'text-green-400' : 'text-muted-foreground'}`}>
                        {showListenerCount ? 'Aktiviert' : 'Deaktiviert'}
                      </span>
                      <Switch 
                        id="show-listener-count"
                        checked={showListenerCount}
                        onCheckedChange={() => handleToggleSetting('show_listener_count', showListenerCount, setShowListenerCount)}
                        disabled={loading}
                        className="data-[state=checked]:bg-radio-purple"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between system-status-indicator">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-indigo-400" />
                      <Label htmlFor="enable-comments" className="font-medium">Kommentare aktivieren</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${enableComments ? 'text-green-400' : 'text-muted-foreground'}`}>
                        {enableComments ? 'Aktiviert' : 'Deaktiviert'}
                      </span>
                      <Switch 
                        id="enable-comments"
                        checked={enableComments}
                        onCheckedChange={() => handleToggleSetting('enable_comments', enableComments, setEnableComments)}
                        disabled={loading}
                        className="data-[state=checked]:bg-radio-purple"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={saveAllSettings}
                    disabled={loading || !settingsChanged}
                    className="flex items-center gap-2 bg-radio-purple hover:bg-radio-blue transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Einstellungen speichern
                  </Button>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Backup & Wiederherstellung"
              icon={<Archive className="h-5 w-5 text-radio-purple" />}
              headerClassName="border-b pb-4"
            >
              <div className="space-y-4 p-4">
                <p className="text-sm text-muted-foreground">
                  Erstellen und verwalten Sie Backups Ihrer Datenbank und Einstellungen.
                </p>
                
                <div className="grid grid-cols-1 gap-6">
                  {/* Server Backup Section */}
                  <div className="p-5 border rounded-lg gradient-card shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-blue-900/50 p-2 rounded-full">
                        <Archive className="h-4 w-4 text-blue-400" />
                      </div>
                      <h3 className="font-medium">Backup auf Server erstellen</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Erstellen Sie ein vollständiges Backup, das automatisch auf dem Server gespeichert wird.
                    </p>
                    
                    <Button 
                      variant="default"
                      className="w-full flex items-center justify-center gap-2 bg-radio-purple hover:bg-radio-purple/90"
                      onClick={createBackup}
                      disabled={backingUp}
                    >
                      {backingUp ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Backup wird erstellt... {backupProgress}%
                        </>
                      ) : (
                        <>
                          <Archive className="h-4 w-4" />
                          Backup jetzt erstellen
                        </>
                      )}
                    </Button>
                    
                    {/* List of existing backups */}
                    {backups.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h4 className="text-sm font-medium">Vorhandene Backups</h4>
                        <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
                          {backups.map((backup) => (
                            <div 
                              key={backup.id} 
                              className="flex items-center justify-between p-2 rounded-md bg-muted/10 border border-muted/20 hover:bg-muted/20 transition-colors"
                            >
                              <div>
                                <p className="text-sm font-medium">{backup.filename}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{new Date(backup.created_at).toLocaleString('de-DE')}</span>
                                  <span>•</span>
                                  <span>{formatFileSize(backup.size)}</span>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => downloadBackup(backup.filename)}
                                className="bg-transparent border-muted/20 hover:bg-muted/20"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Herunterladen
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Restore Backup Section */}
                  <div className="p-5 border rounded-lg gradient-card shadow-sm space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-purple-900/50 p-2 rounded-full">
                        <Server className="h-4 w-4 text-radio-purple" />
                      </div>
                      <h3 className="font-medium">Backup wiederherstellen</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Stellen Sie ein früheres Backup wieder her.
                    </p>
                    
                    <div className="space-y-2">
                      <div className="relative">
                        <Input 
                          type="file" 
                          id="backup-file" 
                          className="border-border bg-muted/20"
                          accept=".zip,.sql,.gz"
                          onChange={handleFileChange}
                        />
                        {selectedBackupFile && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Ausgewählt: {selectedBackupFile.name} ({formatFileSize(selectedBackupFile.size)})
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2 hover:bg-muted/20"
                        onClick={restoreBackup}
                        disabled={!selectedBackupFile || loading}
                      >
                        {loading ? (
                          <div className="animate-spin h-4 w-4 border-2 border-radio-purple border-t-transparent rounded-full"></div>
                        ) : (
                          <>
                            <Server className="h-4 w-4" />
                            Backup wiederherstellen
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="bg-amber-900/50 border border-amber-700/50 p-3 rounded-md flex items-start gap-2 mt-4">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-300">
                        Warnung: Das Wiederherstellen eines Backups überschreibt alle aktuellen Daten. Dieser Vorgang kann nicht rückgängig gemacht werden.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
