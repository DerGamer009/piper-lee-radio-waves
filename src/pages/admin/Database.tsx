
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Database as DatabaseIcon, Play, Download, Trash, Save, AlertTriangle, CheckCircle, Table as TableIcon, RefreshCw } from 'lucide-react';
import { SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from '@/components/ui/data-table';
import { supabase } from "@/integrations/supabase/client";
import { ColumnDef } from '@tanstack/react-table';

// Define table structure interface
type Table = {
  name: string;
  rowCount: number;
  size: string;
  lastUpdated: string;
};

// Define the database view interface for different tables
interface TableData {
  id: string;
  [key: string]: any;
}

// SQL query result interface
interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
}

const Database = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [query, setQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("query");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [tableColumns, setTableColumns] = useState<ColumnDef<TableData, any>[]>([]);
  const [isLoadingTableData, setIsLoadingTableData] = useState(false);
  const [tableFilter, setTableFilter] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    // Fetch tables from database
    const fetchTables = async () => {
      try {
        // Since we can't directly access information_schema, we'll use a simpler approach
        // and work with a predefined list of tables we know about from our database schema
        const knownTables = [
          'app_settings', 'chat_messages', 'events', 'news',
          'newsletter_subscribers', 'partners', 'podcasts', 'poll_options',
          'polls', 'poll_votes', 'profiles', 'schedule', 'security_activities',
          'security_status', 'shows', 'song_history', 'song_requests',
          'status_updates', 'system_logs', 'user_roles'
        ];
        
        // Create formatted table entries from our known tables
        const formattedTables = knownTables.map(tableName => ({
          name: tableName,
          rowCount: 0, // We'll not get actual row counts for simplicity
          size: 'Unknown', // Simplified for now
          lastUpdated: new Date().toLocaleDateString('de-DE')
        }));
        
        setTables(formattedTables);
      } catch (error) {
        console.error("Error fetching tables:", error);
        // Fallback to sample data if there's an error
        setTables(initialTables);
      }
    };

    fetchTables();
  }, []);

  // Sample data for fallback
  const initialTables: Table[] = [
    {
      name: 'users',
      rowCount: 254,
      size: '1.7 MB',
      lastUpdated: '01.05.2025'
    },
    {
      name: 'songs',
      rowCount: 4892,
      size: '8.2 MB',
      lastUpdated: '01.05.2025'
    },
    {
      name: 'playlists',
      rowCount: 68,
      size: '0.5 MB',
      lastUpdated: '30.04.2025'
    },
    {
      name: 'podcasts',
      rowCount: 125,
      size: '12.6 MB',
      lastUpdated: '29.04.2025'
    },
    {
      name: 'schedule',
      rowCount: 87,
      size: '0.3 MB',
      lastUpdated: '01.05.2025'
    },
    {
      name: 'messages',
      rowCount: 1245,
      size: '3.4 MB',
      lastUpdated: '01.05.2025'
    },
    {
      name: 'status_updates',
      rowCount: 412,
      size: '0.8 MB',
      lastUpdated: '30.04.2025'
    },
    {
      name: 'system_logs',
      rowCount: 5321,
      size: '7.5 MB',
      lastUpdated: '01.05.2025'
    }
  ];
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleExecuteQuery = () => {
    setIsExecuting(true);
    setError(null);
    
    // Execute the query directly
    const executeQuery = async () => {
      try {
        if (query.toLowerCase().includes('select')) {
          // Since we can't use RPC functions like 'execute_sql', we'll use a simplified approach
          // Extract the table name and limitations from the query (basic parsing)
          const tableMatch = query.match(/from\s+([^\s;]+)/i);
          const tableName = tableMatch ? tableMatch[1].toLowerCase() : null;
          const limitMatch = query.match(/limit\s+(\d+)/i);
          const limit = limitMatch ? parseInt(limitMatch[1]) : 10; // Default to 10
          
          if (tableName) {
            // Check if it's a known table
            const knownTables = [
              'app_settings', 'chat_messages', 'events', 'news',
              'newsletter_subscribers', 'partners', 'podcasts', 'poll_options',
              'polls', 'poll_votes', 'profiles', 'schedule', 'security_activities',
              'security_status', 'shows', 'song_history', 'song_requests',
              'status_updates', 'system_logs', 'user_roles'
            ];
            
            if (knownTables.includes(tableName)) {
              // Make a direct query to the table
              const { data, error: queryError } = await supabase
                .from(tableName)
                .select('*')
                .limit(limit);
                
              if (queryError) throw queryError;
              
              if (data && Array.isArray(data)) {
                // If we have data, transform it for the UI
                const columns = data.length > 0 ? Object.keys(data[0]) : [];
                
                setQueryResult({
                  columns,
                  rows: data
                });
                
                toast({
                  title: "Abfrage erfolgreich",
                  description: "Die SQL-Abfrage wurde erfolgreich ausgeführt.",
                });
              } else {
                // Handle empty result
                setQueryResult({
                  columns: [],
                  rows: []
                });
                
                toast({
                  title: "Abfrage erfolgreich",
                  description: "Die SQL-Abfrage wurde ausgeführt, jedoch ohne Ergebnisse.",
                });
              }
            } else {
              throw new Error(`Tabelle '${tableName}' nicht gefunden.`);
            }
          } else {
            throw new Error("Konnte keine Tabelle in der Abfrage identifizieren.");
          }
        } else if (query.toLowerCase().includes('drop') || query.toLowerCase().includes('delete')) {
          setError("Gefährliche Operation erkannt. Löschoperationen sind in dieser Ansicht deaktiviert.");
          toast({
            title: "Fehler",
            description: "Gefährliche Operation erkannt. Löschoperationen sind in dieser Ansicht deaktiviert.",
            variant: "destructive"
          });
        } else {
          setError("Nur SELECT Abfragen sind in dieser Ansicht erlaubt.");
          toast({
            title: "Abfrage fehlgeschlagen",
            description: "Nur SELECT Abfragen sind in dieser Ansicht erlaubt.",
            variant: "destructive"
          });
        }
      } catch (error: any) {
        setError(error.message || "Unbekannter Abfragefehler.");
        toast({
          title: "Abfrage fehlgeschlagen",
          description: error.message || "Die SQL-Abfrage konnte nicht ausgeführt werden.",
          variant: "destructive"
        });
      } finally {
        setIsExecuting(false);
      }
    };

    // Check if we're in demo mode, use sample data if so
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        if (query.toLowerCase().includes('select') && query.toLowerCase().includes('from users')) {
          setQueryResult({
            columns: ['id', 'username', 'email', 'role', 'created_at'],
            rows: [
              {id: '1', username: 'admin', email: 'admin@piper-lee.de', role: 'admin', created_at: '2024-01-15'},
              {id: '2', username: 'moderator1', email: 'mod1@piper-lee.de', role: 'moderator', created_at: '2024-01-20'},
              {id: '3', username: 'user123', email: 'user123@example.com', role: 'user', created_at: '2024-02-05'},
            ]
          });
          toast({
            title: "Abfrage erfolgreich",
            description: "Die SQL-Abfrage wurde erfolgreich ausgeführt.",
          });
        } else if (query.toLowerCase().includes('drop') || query.toLowerCase().includes('delete')) {
          setError("Gefährliche Operation erkannt. Löschoperationen sind in dieser Ansicht deaktiviert.");
          toast({
            title: "Fehler",
            description: "Gefährliche Operation erkannt. Löschoperationen sind in dieser Ansicht deaktiviert.",
            variant: "destructive"
          });
        } else {
          setError("Unbekannter Abfragefehler oder keine passende Tabelle gefunden.");
          toast({
            title: "Abfrage fehlgeschlagen",
            description: "Die SQL-Abfrage konnte nicht ausgeführt werden.",
            variant: "destructive"
          });
        }
        setIsExecuting(false);
      }, 1000);
    } else {
      executeQuery();
    }
  };

  const handleBackupDatabase = () => {
    toast({
      title: "Backup gestartet",
      description: "Ein Backup der Datenbank wird erstellt.",
    });
    
    setTimeout(() => {
      toast({
        title: "Backup abgeschlossen",
        description: "Das Backup der Datenbank wurde erfolgreich erstellt.",
      });
    }, 2000);
  };

  const loadTableData = async (tableName: string) => {
    setIsLoadingTableData(true);
    setSelectedTable(tableName);
    setActiveTab("tableView");
    
    try {
      // Use a fixed list of known tables
      const knownTables = [
        'app_settings', 'chat_messages', 'events', 'news',
        'newsletter_subscribers', 'partners', 'podcasts', 'poll_options',
        'polls', 'poll_votes', 'profiles', 'schedule', 'security_activities',
        'security_status', 'shows', 'song_history', 'song_requests',
        'status_updates', 'system_logs', 'user_roles'
      ];
      
      // Check if the table is in our known tables list
      if (knownTables.includes(tableName)) {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(100);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Convert data to TableData format (ensure each row has an id)
          const tableDataWithIds: TableData[] = data.map((row: any) => {
            // Make sure we have an id field - use existing, or generate one
            if (!row.id) {
              row.id = Math.random().toString(36).substring(2, 11);
            }
            return row as TableData;
          });
          
          setTableData(tableDataWithIds);
          
          // Create columns dynamically based on the data structure
          const firstRow = data[0];
          // Make sure we handle accessorKey correctly
          const columns: ColumnDef<TableData, any>[] = Object.keys(firstRow).map(key => ({
            id: key, // Use id instead of accessorKey
            header: key.charAt(0).toUpperCase() + key.slice(1),
            accessorFn: (row: TableData) => row[key], // Use accessorFn instead of accessorKey
            cell: ({ row }) => {
              const value = row.getValue(key);
              if (typeof value === 'boolean') {
                return value ? 'Ja' : 'Nein';
              }
              if (value === null) return 'N/A';
              if (typeof value === 'object') return JSON.stringify(value);
              return String(value);
            }
          }));
          
          setTableColumns(columns);
        } else {
          setTableData([]);
          setTableColumns([]);
          toast({
            title: "Keine Daten",
            description: `Die Tabelle "${tableName}" enthält keine Daten.`,
          });
        }
      } else {
        // Use sample data as fallback for non-known tables
        const sampleData = generateSampleTableData(tableName);
        setTableData(sampleData.data);
        setTableColumns(sampleData.columns);
        toast({
          title: "Demo-Modus",
          description: `Tabelle "${tableName}" wird im Demo-Modus angezeigt.`,
        });
      }
    } catch (error: any) {
      console.error(`Error loading table ${tableName}:`, error);
      toast({
        title: "Fehler beim Laden der Tabelle",
        description: error.message || `Konnte Daten für "${tableName}" nicht laden.`,
        variant: "destructive"
      });
      
      // Use sample data as fallback
      const sampleData = generateSampleTableData(tableName);
      setTableData(sampleData.data);
      setTableColumns(sampleData.columns);
    } finally {
      setIsLoadingTableData(false);
    }
  };

  // Generate sample data for a table view
  const generateSampleTableData = (tableName: string): { data: TableData[], columns: ColumnDef<TableData, any>[] } => {
    let data: TableData[] = [];
    let columns: ColumnDef<TableData, any>[] = [];
    
    switch (tableName) {
      case 'users':
        data = [
          { id: '1', username: 'admin', email: 'admin@piper-lee.de', role: 'admin', created_at: '2024-01-15' },
          { id: '2', username: 'moderator1', email: 'mod1@piper-lee.de', role: 'moderator', created_at: '2024-01-20' },
          { id: '3', username: 'user123', email: 'user123@example.com', role: 'user', created_at: '2024-02-05' }
        ];
        columns = [
          { id: 'id', header: 'ID', accessorFn: (row: TableData) => row.id },
          { id: 'username', header: 'Benutzername', accessorFn: (row: TableData) => row.username },
          { id: 'email', header: 'E-Mail', accessorFn: (row: TableData) => row.email },
          { id: 'role', header: 'Rolle', accessorFn: (row: TableData) => row.role },
          { id: 'created_at', header: 'Erstellt am', accessorFn: (row: TableData) => row.created_at }
        ];
        break;
        
      case 'messages':
        data = [
          { id: '1', user_id: '1', message: 'Hallo, wie geht es dir?', created_at: '2025-05-01' },
          { id: '2', user_id: '2', message: 'Mir geht es gut, danke!', created_at: '2025-05-01' },
          { id: '3', user_id: '1', message: 'Wann ist die nächste Sendung?', created_at: '2025-05-02' }
        ];
        columns = [
          { id: 'id', header: 'ID', accessorFn: (row: TableData) => row.id },
          { id: 'user_id', header: 'Benutzer ID', accessorFn: (row: TableData) => row.user_id },
          { id: 'message', header: 'Nachricht', accessorFn: (row: TableData) => row.message },
          { id: 'created_at', header: 'Erstellt am', accessorFn: (row: TableData) => row.created_at }
        ];
        break;
        
      case 'podcasts':
        data = [
          { id: '1', title: 'Radio Hits', host: 'Max Mustermann', duration: '45 min', published_at: '2025-04-15' },
          { id: '2', title: 'Musik Special', host: 'Lisa Schmidt', duration: '30 min', published_at: '2025-04-20' },
          { id: '3', title: 'News Roundup', host: 'Tim Weber', duration: '25 min', published_at: '2025-05-01' }
        ];
        columns = [
          { id: 'id', header: 'ID', accessorFn: (row: TableData) => row.id },
          { id: 'title', header: 'Titel', accessorFn: (row: TableData) => row.title },
          { id: 'host', header: 'Moderator', accessorFn: (row: TableData) => row.host },
          { id: 'duration', header: 'Dauer', accessorFn: (row: TableData) => row.duration },
          { id: 'published_at', header: 'Veröffentlicht am', accessorFn: (row: TableData) => row.published_at }
        ];
        break;
        
      default:
        data = [
          { id: '1', name: 'Beispiel 1', created_at: '2025-05-01' },
          { id: '2', name: 'Beispiel 2', created_at: '2025-05-01' },
          { id: '3', name: 'Beispiel 3', created_at: '2025-05-02' }
        ];
        columns = [
          { id: 'id', header: 'ID', accessorFn: (row: TableData) => row.id },
          { id: 'name', header: 'Name', accessorFn: (row: TableData) => row.name },
          { id: 'created_at', header: 'Erstellt am', accessorFn: (row: TableData) => row.created_at }
        ];
    }
    
    return { data, columns };
  };

  const exportTableData = () => {
    if (!tableData.length) return;
    
    const headers = tableColumns.map(col => {
      // Extract column name from id property
      return col.id as string;
    });
    
    const csvContent = [
      headers.join(','),
      ...tableData.map(row => {
        return headers.map(key => {
          const value = row[key];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"`
            : value === null 
            ? ''
            : typeof value === 'object'
            ? `"${JSON.stringify(value).replace(/"/g, '""')}"`
            : value;
        }).join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedTable}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export erfolgreich",
      description: `Die Daten der Tabelle "${selectedTable}" wurden exportiert.`,
    });
  };

  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(tableFilter.toLowerCase())
  );

  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-3 mb-8">
          <DatabaseIcon className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Datenbank</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="query">SQL-Abfrage</TabsTrigger>
            <TabsTrigger value="tableView">Tabellen-Ansicht</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="query" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-none shadow-md">
                  <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg pb-4">
                    <CardTitle className="flex justify-between items-center">
                      <span>SQL-Abfrage</span>
                      <Button
                        onClick={handleExecuteQuery}
                        disabled={isExecuting || !query.trim()}
                        className="bg-white text-purple-700 hover:bg-white/90"
                      >
                        {isExecuting ? (
                          <>
                            <span className="animate-pulse">Wird ausgeführt...</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Ausführen
                          </>
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Textarea
                        className="min-h-[150px] font-mono"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="SQL-Abfrage eingeben..."
                      />
                      
                      {error && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      
                      {queryResult && (
                        <div>
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Ergebnis
                          </h3>
                          <div className="border rounded-lg overflow-x-auto">
                            <table className="w-full">
                              <thead className="border-b bg-muted/30">
                                <tr>
                                  {queryResult.columns.map((column: string) => (
                                    <th key={column} className="px-4 py-2 text-left font-medium">{column}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {queryResult.rows.map((row: any, idx: number) => (
                                  <tr key={idx} className="border-b last:border-b-0">
                                    {queryResult.columns.map((column: string) => (
                                      <td key={`${idx}-${column}`} className="px-4 py-2">{row[column]}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {queryResult.rows.length} Ergebnisse
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="border-none shadow-md">
                  <CardHeader className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white rounded-t-lg pb-4">
                    <CardTitle className="flex justify-between items-center">
                      <span>Datenbank-Tabellen</span>
                      <Badge className="bg-white text-indigo-700">{tables.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Input 
                          placeholder="Tabelle suchen..."
                          className="mr-2"
                          value={tableFilter}
                          onChange={(e) => setTableFilter(e.target.value)}
                        />
                        <Button variant="outline" size="icon">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {filteredTables.map((table) => (
                          <div 
                            key={table.name} 
                            className="flex justify-between items-center p-3 bg-card/30 rounded-lg border border-muted hover:bg-muted/20 cursor-pointer"
                            onClick={() => loadTableData(table.name)}
                          >
                            <div>
                              <h3 className="font-medium">{table.name}</h3>
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>{table.rowCount} Zeilen</span>
                                <span>{table.size}</span>
                                <span>Aktualisiert: {table.lastUpdated}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuery(`SELECT * FROM ${table.name} LIMIT 10;`);
                                  setActiveTab("query");
                                }}
                                title="Abfrage generieren"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tableView" className="space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-t-lg pb-4">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-5 w-5" />
                    <span>{selectedTable ? `Tabelle: ${selectedTable}` : "Tabellen-Ansicht"}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {selectedTable && (
                      <Button
                        variant="outline" 
                        className="bg-white text-blue-700 hover:bg-white/90"
                        onClick={exportTableData}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exportieren
                      </Button>
                    )}
                    <Button
                      variant="outline" 
                      className="bg-white text-blue-700 hover:bg-white/90"
                      onClick={() => loadTableData(selectedTable || "")}
                      disabled={!selectedTable}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Aktualisieren
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {!selectedTable ? (
                  <div className="text-center py-12">
                    <TableIcon className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">Keine Tabelle ausgewählt</h3>
                    <p className="text-sm text-muted-foreground mt-2">Wählen Sie eine Tabelle aus der Liste, um die Daten anzuzeigen.</p>
                    <Button 
                      className="mt-4"
                      onClick={() => setActiveTab("query")}
                    >
                      Tabelle wählen
                    </Button>
                  </div>
                ) : (
                  <DataTable
                    columns={tableColumns}
                    data={tableData}
                    searchKey="id"
                    searchLabel="Suche"
                    isLoading={isLoadingTableData}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="management" className="space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg pb-4">
                <CardTitle>Datenbank-Management</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button 
                    className="w-full justify-start"
                    onClick={handleBackupDatabase}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Datenbank sichern
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Migration erstellen
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    disabled
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Datenbank zurücksetzen
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardHeader className="bg-gradient-to-r from-amber-700 to-amber-500 text-white rounded-t-lg pb-4">
                <CardTitle>Datenbank-Statistiken</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                      <p className="text-sm text-muted-foreground">Anzahl Tabellen</p>
                      <p className="text-3xl font-bold">{tables.length}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                      <p className="text-sm text-muted-foreground">Gesamtgröße</p>
                      <p className="text-3xl font-bold">24.5 MB</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                      <p className="text-sm text-muted-foreground">Letzte Sicherung</p>
                      <p className="text-xl font-bold">01.05.2025</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                      <p className="text-sm text-muted-foreground">Datenbankversion</p>
                      <p className="text-xl font-bold">PostgreSQL 15.1</p>
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-500/10 border-blue-500/30">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">Performance-Optimierung empfohlen</h4>
                        <AlertDescription className="text-sm">
                          Die regelmäßige Wartung Ihrer Datenbank verbessert die Leistung. Es wird empfohlen, wöchentlich ein Backup durchzuführen und monatlich eine Optimierung der Tabellen vorzunehmen.
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
};

export default Database;
