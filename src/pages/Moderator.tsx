import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ModeratorSidebar from "@/components/ModeratorSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getCurrentUser } from "@/services/apiService";

const Moderator = () => {
  const currentUser = getCurrentUser();
  
  const myShows = [
    { id: 1, title: "Morning Show", dayOfWeek: "Montag", startTime: "08:00", endTime: "10:00" },
    { id: 2, title: "Evening Vibes", dayOfWeek: "Mittwoch", startTime: "18:00", endTime: "20:00" },
  ];
  
  const upcomingShows = [
    { id: 1, title: "Morning Show", date: "10.04.2023", startTime: "08:00", endTime: "10:00" },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <ModeratorSidebar />
        
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Moderator Dashboard</h1>
            </div>
          </header>

          <main className="container mx-auto p-4 sm:p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Willkommen zurück</CardTitle>
                  <CardDescription>
                    Hallo {currentUser?.fullName || currentUser?.username}! Hier ist dein Dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rollen:</span>
                      <span className="text-sm">{currentUser?.roles.join(', ')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nächste Sendung</CardTitle>
                  <CardDescription>
                    Deine nächste Sendung ist:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingShows.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingShows.map(show => (
                        <div key={show.id} className="rounded-lg border p-3">
                          <div className="font-medium">{show.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {show.date}, {show.startTime} - {show.endTime} Uhr
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Keine bevorstehenden Sendungen.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistiken</CardTitle>
                  <CardDescription>
                    Deine Sendungsstatistiken
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Sendungen gesamt:</span>
                      <span className="text-sm">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Hörer (Durchschnitt):</span>
                      <span className="text-sm">312</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Beliebteste Sendung:</span>
                      <span className="text-sm">Evening Vibes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Meine Sendungen</CardTitle>
                <CardDescription>
                  Alle Sendungen, die du moderierst
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titel</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead>Startzeit</TableHead>
                      <TableHead>Endzeit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myShows.map(show => (
                      <TableRow key={show.id}>
                        <TableCell className="font-medium">{show.title}</TableCell>
                        <TableCell>{show.dayOfWeek}</TableCell>
                        <TableCell>{show.startTime}</TableCell>
                        <TableCell>{show.endTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Moderator;
