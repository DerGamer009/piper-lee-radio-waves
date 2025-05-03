
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Database as DatabaseIcon, Play, Download, Trash, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Table = {
  name: string;
  rowCount: number;
  size: string;
  lastUpdated: string;
};

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
  }
];

const Database = () => {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [query, setQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [queryResult, setQueryResult] = useState<any | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleExecuteQuery = () => {
    setIsExecuting(true);
    setError(null);
    
    // Simulate query execution
    setTimeout(() => {
      setIsExecuting(false);
      
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
    }, 1000);
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

  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-3 mb-8">
          <DatabaseIcon className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Datenbank</h1>
        </div>

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
                    />
                    <Button variant="outline" size="icon">
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {tables.map((table) => (
                      <div 
                        key={table.name} 
                        className="flex justify-between items-center p-3 bg-card/30 rounded-lg border border-muted hover:bg-muted/20"
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
                            onClick={() => setQuery(`SELECT * FROM ${table.name} LIMIT 10;`)}
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
            
            <Card className="border-none shadow-md mt-6">
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
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Database;
