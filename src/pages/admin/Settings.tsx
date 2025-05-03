
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Settings, BellRing, Globe, Shield, Layout, Palette } from 'lucide-react';

const AdminSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample settings data - in a real app, this would be loaded from an API
  const [settings, setSettings] = useState({
    siteName: 'Piper-Lee Radio',
    siteDescription: 'Die beste Online-Radio-Plattform für alle Musikliebhaber',
    contactEmail: 'kontakt@piper-lee.de',
    enableRegistration: true,
    enablePublicChat: true,
    maintenanceMode: false,
    analyticsEnabled: true,
    theme: 'auto',
    language: 'de',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Einstellungen gespeichert",
        description: "Ihre Änderungen wurden erfolgreich gespeichert.",
      });
    }, 800);
  };
  
  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-background/95 p-6">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gradient">System-Einstellungen</h1>
          <p className="text-muted-foreground">Konfigurieren Sie wichtige Einstellungen für Ihre Plattform</p>
        </header>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Allgemein</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <BellRing className="h-4 w-4" />
              <span className="hidden sm:inline">Benachrichtigungen</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Aussehen</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Sicherheit</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              <span className="hidden sm:inline">Erweitert</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 fade-in">
            <Card className="p-6 glass-card hover-lift">
              <h2 className="text-xl font-semibold mb-6">Allgemeine Einstellungen</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Seitenname</Label>
                    <Input 
                      id="siteName" 
                      name="siteName"
                      value={settings.siteName} 
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Kontakt E-Mail</Label>
                    <Input 
                      id="contactEmail" 
                      name="contactEmail"
                      type="email" 
                      value={settings.contactEmail} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Seitenbeschreibung</Label>
                  <Textarea 
                    id="siteDescription" 
                    name="siteDescription"
                    value={settings.siteDescription} 
                    onChange={handleInputChange} 
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Sprache</Label>
                  <select 
                    id="language" 
                    name="language"
                    value={settings.language}
                    onChange={(e) => handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    <option value="de">Deutsch</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? 'Speichert...' : 'Einstellungen speichern'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6 fade-in">
            <Card className="p-6 glass-card hover-lift">
              <h2 className="text-xl font-semibold mb-6">Benachrichtigungseinstellungen</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">E-Mail-Benachrichtigungen</h3>
                    <p className="text-sm text-muted-foreground">Sende automatische E-Mail-Benachrichtigungen an Benutzer</p>
                  </div>
                  <Switch 
                    checked={settings.analyticsEnabled} 
                    onCheckedChange={(checked) => handleSwitchChange('analyticsEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Push-Benachrichtigungen</h3>
                    <p className="text-sm text-muted-foreground">Sende Push-Benachrichtigungen an Benutzer-Browser</p>
                  </div>
                  <Switch 
                    checked={true} 
                    onCheckedChange={() => {}}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Benachrichtigungen für neue Benutzer</h3>
                    <p className="text-sm text-muted-foreground">Sende Benachrichtigungen, wenn sich neue Benutzer registrieren</p>
                  </div>
                  <Switch 
                    checked={true} 
                    onCheckedChange={() => {}}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6 fade-in">
            <Card className="p-6 glass-card hover-lift">
              <h2 className="text-xl font-semibold mb-6">Erscheinungsbild</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Design-Modus</Label>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className={`border rounded-lg p-4 text-center cursor-pointer ${settings.theme === 'light' ? 'border-primary bg-primary/10' : 'border-input'}`} 
                         onClick={() => setSettings({...settings, theme: 'light'})}>
                      <div className="h-16 mb-2 rounded bg-white"></div>
                      <span>Hell</span>
                    </div>
                    <div className={`border rounded-lg p-4 text-center cursor-pointer ${settings.theme === 'dark' ? 'border-primary bg-primary/10' : 'border-input'}`}
                         onClick={() => setSettings({...settings, theme: 'dark'})}>
                      <div className="h-16 mb-2 rounded bg-gray-800"></div>
                      <span>Dunkel</span>
                    </div>
                    <div className={`border rounded-lg p-4 text-center cursor-pointer ${settings.theme === 'auto' ? 'border-primary bg-primary/10' : 'border-input'}`}
                         onClick={() => setSettings({...settings, theme: 'auto'})}>
                      <div className="h-16 mb-2 rounded bg-gradient-to-r from-white to-gray-800"></div>
                      <span>Automatisch</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6 fade-in">
            <Card className="p-6 glass-card hover-lift">
              <h2 className="text-xl font-semibold mb-6">Sicherheitseinstellungen</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Benutzerregistrierung</h3>
                    <p className="text-sm text-muted-foreground">Erlaube neuen Benutzern, sich zu registrieren</p>
                  </div>
                  <Switch 
                    checked={settings.enableRegistration} 
                    onCheckedChange={(checked) => handleSwitchChange('enableRegistration', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Öffentlicher Chat</h3>
                    <p className="text-sm text-muted-foreground">Erlaube Benutzern, den öffentlichen Chat zu nutzen</p>
                  </div>
                  <Switch 
                    checked={settings.enablePublicChat} 
                    onCheckedChange={(checked) => handleSwitchChange('enablePublicChat', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Zwei-Faktor-Authentifizierung</h3>
                    <p className="text-sm text-muted-foreground">Erzwinge 2FA für alle Administratoren</p>
                  </div>
                  <Switch 
                    checked={false} 
                    onCheckedChange={() => {}}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6 fade-in">
            <Card className="p-6 glass-card hover-lift">
              <h2 className="text-xl font-semibold mb-6">Erweiterte Einstellungen</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Wartungsmodus</h3>
                    <p className="text-sm text-muted-foreground">Aktiviere den Wartungsmodus für die gesamte Website</p>
                  </div>
                  <Switch 
                    checked={settings.maintenanceMode} 
                    onCheckedChange={(checked) => handleSwitchChange('maintenanceMode', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cacheTime">Cache-Dauer (Minuten)</Label>
                  <Input 
                    id="cacheTime"
                    type="number" 
                    defaultValue="60"
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="destructive" onClick={() => 
                    toast({
                      title: "Cache geleert",
                      description: "Der Cache wurde erfolgreich geleert.",
                    })
                  }>
                    Cache leeren
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
