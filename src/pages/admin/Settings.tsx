
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon } from 'lucide-react';
import { SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Einstellungen gespeichert",
      description: "Ihre Einstellungen wurden erfolgreich gespeichert.",
    });
  };

  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Einstellungen</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg pb-4">
              <CardTitle>Allgemeine Einstellungen</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSaveSettings}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stationName">Sendername</Label>
                    <Input id="stationName" defaultValue="Piper Lee Radio" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="streamUrl">Stream URL</Label>
                    <Input id="streamUrl" defaultValue="https://backend.piper-lee.net/listen/piper-lee/radio.mp3" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Kontakt Email</Label>
                    <Input id="contactEmail" type="email" defaultValue="info@piper-lee.de" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance">Wartungsmodus</Label>
                    <Switch id="maintenance" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="darkMode">Dark Mode Standard</Label>
                    <Switch id="darkMode" defaultChecked />
                  </div>
                  
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">Speichern</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white rounded-t-lg pb-4">
              <CardTitle>System Einstellungen</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSaveSettings}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Schlüssel</Label>
                    <Input id="apiKey" defaultValue="*******************" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max. Dateigröße (MB)</Label>
                    <Input id="maxFileSize" type="number" defaultValue="50" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="caching">Caching aktivieren</Label>
                    <Switch id="caching" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analytics">Analytics aktivieren</Label>
                    <Switch id="analytics" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="debug">Debug Modus</Label>
                    <Switch id="debug" />
                  </div>
                  
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Speichern</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Settings;
