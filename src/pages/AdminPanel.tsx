
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, FileText, BarChart3, CalendarDays, 
  Database, Radio, PanelLeft, LogOut, Activity,
  LayoutDashboard, Download, Save, RefreshCcw, Clock,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserManagement from '@/components/dashboard/UserManagement';
import NewsManagement from '@/components/dashboard/NewsManagement';
import PollManagement from '@/components/dashboard/PollManagement';
import PodcastManagement from '@/components/dashboard/PodcastManagement';
import PartnerManagement from '@/components/dashboard/PartnerManagement';
import DashboardStats from '@/components/dashboard/DashboardStats';
import StatusManagement from '@/components/dashboard/StatusManagement';
import { createBackup, getBackups, downloadBackup, restoreBackup, BackupInfo } from '@/services/apiService';

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [backupLoading, setBackupLoading] = useState(false);
  const [refreshingBackups, setRefreshingBackups] = useState(false);
  const [backupToRestore, setBackupToRestore] = useState<string | null>(null);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'users', label: 'Benutzer', icon: <Users className="h-5 w-5" /> },
    { id: 'news', label: 'News', icon: <FileText className="h-5 w-5" /> },
    { id: 'polls', label: 'Umfragen', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'podcasts', label: 'Podcasts', icon: <Radio className="h-5 w-5" /> },
    { id: 'partners', label: 'Partner', icon: <Users className="h-5 w-5" /> },
    { id: 'status', label: 'Status', icon: <Activity className="h-5 w-5" /> },
    { id: 'backups', label: 'Backups', icon: <Database className="h-5 w-5" /> },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'backups') {
      fetchBackups();
    }
  };
  
  const fetchBackups = async () => {
    try {
      setRefreshingBackups(true);
      const backupsList = await getBackups();
      setBackups(backupsList);
    } catch (error) {
      console.error('Error fetching backups:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Die Backups konnten nicht geladen werden.",
      });
    } finally {
      setRefreshingBackups(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'backups') {
      fetchBackups();
    }
  }, [activeTab]);

  const handleCreateBackup = async () => {
    try {
      setBackupLoading(true);
      const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
      const backupName = `backup_${timestamp}`;
      
      await createBackup(backupName);
      
      toast({
        title: "Backup erstellt",
        description: `Backup wurde erfolgreich unter /piper-lee/backups/${backupName} gespeichert.`,
      });
      
      // Refresh backup list
      fetchBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Das Backup konnte nicht erstellt werden.",
      });
    } finally {
      setBackupLoading(false);
    }
  };

  const handleDownloadBackup = async (backupName: string) => {
    try {
      const blob = await downloadBackup(backupName);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = backupName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download gestartet",
        description: `Das Backup ${backupName} wird heruntergeladen.`,
      });
    } catch (error) {
      console.error('Error downloading backup:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Das Backup konnte nicht heruntergeladen werden.",
      });
    }
  };

  const openRestoreDialog = (backupName: string) => {
    setBackupToRestore(backupName);
    setIsRestoreDialogOpen(true);
  };

  const handleRestoreBackup = async () => {
    if (!backupToRestore) return;
    
    try {
      await restoreBackup(backupToRestore);
      
      toast({
        title: "Backup wiederhergestellt",
        description: `Das Backup ${backupToRestore} wurde erfolgreich wiederhergestellt.`,
      });
      
      setIsRestoreDialogOpen(false);
      setBackupToRestore(null);
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Das Backup konnte nicht wiederhergestellt werden.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-[#1c1f2f] flex flex-col transition-width duration-300 ease-in-out fixed h-screen border-r border-border`}>
        <div className="p-4 flex items-center justify-between border-b border-border">
          <h2 className={`font-semibold text-white ${sidebarCollapsed ? 'hidden' : 'block'}`}>Admin Panel</h2>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
            className="p-1 rounded-md hover:bg-accent/50 text-white"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          {/* Navigation links */}
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                  activeTab === item.id 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                } ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                onClick={() => handleTabChange(item.id)}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-border">
          <button className={`w-full flex items-center px-3 py-2 rounded-md text-gray-300 hover:bg-accent/50 hover:text-white ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span className="ml-2">Abmelden</span>}
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-margin duration-300 ease-in-out px-6 py-8`}>
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Verwalten Sie Ihre Seite und Inhalte.</p>
          </header>
          
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="hidden">
              {navItems.map(item => (
                <TabsTrigger key={item.id} value={item.id}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="dashboard">
              <DashboardStats />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="news">
              <NewsManagement />
            </TabsContent>
            
            <TabsContent value="polls">
              <PollManagement />
            </TabsContent>
            
            <TabsContent value="podcasts">
              <PodcastManagement />
            </TabsContent>
            
            <TabsContent value="partners">
              <PartnerManagement />
            </TabsContent>
            
            <TabsContent value="status">
              <StatusManagement />
            </TabsContent>
            
            <TabsContent value="backups">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Database className="h-6 w-6 mr-2 text-purple-500" />
                    Server Backups
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={fetchBackups}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      disabled={refreshingBackups}
                    >
                      <RefreshCcw className={`h-5 w-5 ${refreshingBackups ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
                
                <p className="text-muted-foreground">
                  Verwalten Sie Backups des Systems. Backups werden im Server-Verzeichnis '/piper-lee/backups/' gespeichert.
                </p>
                
                <div className="bg-slate-50 dark:bg-slate-900/50 border rounded-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-1">Backup erstellen</h3>
                      <p className="text-sm text-muted-foreground">
                        Erstellen Sie eine Sicherungskopie der aktuellen Daten.
                      </p>
                    </div>
                    <button
                      onClick={handleCreateBackup}
                      disabled={backupLoading}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      {backupLoading ? (
                        <>
                          <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                          Backup wird erstellt...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Neues Backup erstellen
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b">
                    <h3 className="text-lg font-medium flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Vorhandene Backups
                    </h3>
                  </div>
                  {refreshingBackups ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                    </div>
                  ) : backups.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Erstellt am</TableHead>
                            <TableHead>Größe</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {backups.map((backup) => (
                            <TableRow key={backup.name}>
                              <TableCell className="font-medium">{backup.name}</TableCell>
                              <TableCell>{formatDate(backup.created_at)}</TableCell>
                              <TableCell>{backup.size}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={() => handleDownloadBackup(backup.name)}
                                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                          <Download className="h-4 w-4" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Backup herunterladen</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={() => openRestoreDialog(backup.name)}
                                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-amber-500"
                                        >
                                          <RefreshCcw className="h-4 w-4" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Backup wiederherstellen</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Database className="h-12 w-12 text-gray-300 mb-4" />
                      <h4 className="text-lg font-medium mb-2">Keine Backups vorhanden</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Erstellen Sie Ihr erstes Backup, um Ihre Daten zu sichern.
                      </p>
                      <button
                        onClick={handleCreateBackup}
                        disabled={backupLoading}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Backup erstellen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Restore Confirmation Dialog */}
      <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              Backup wiederherstellen
            </AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie das Backup <strong>{backupToRestore}</strong> wiederherstellen möchten? Dies überschreibt alle aktuellen Daten und kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreBackup}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Wiederherstellen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPanel;
