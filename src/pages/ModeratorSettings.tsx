
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ReloadIcon } from '@radix-ui/react-icons';

const generalFormSchema = z.object({
  websiteName: z.string().min(2, {
    message: "Website name must be at least 2 characters.",
  }),
  websiteDescription: z.string(),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  enableLiveChat: z.boolean(),
  enableNotifications: z.boolean(),
});

const ModeratorSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Load settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['moderator-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*');
      
      if (error) throw error;
      
      // Convert the array of key-value pairs to an object
      const settingsObject = data?.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>) || {};
      
      return settingsObject;
    },
  });
  
  // Form for general settings
  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      websiteName: '',
      websiteDescription: '',
      contactEmail: '',
      enableLiveChat: false,
      enableNotifications: false,
    },
  });
  
  // Update form values when settings are loaded
  React.useEffect(() => {
    if (settings) {
      generalForm.reset({
        websiteName: settings.websiteName || 'Radio Piper-Lee',
        websiteDescription: settings.websiteDescription || 'Your favorite radio station',
        contactEmail: settings.contactEmail || 'contact@piper-lee.com',
        enableLiveChat: settings.enableLiveChat === 'true',
        enableNotifications: settings.enableNotifications === 'true',
      });
    }
  }, [settings, generalForm]);
  
  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (values: z.infer<typeof generalFormSchema>) => {
      // Convert form values to an array of updates
      const updates = [
        { key: 'websiteName', value: values.websiteName },
        { key: 'websiteDescription', value: values.websiteDescription },
        { key: 'contactEmail', value: values.contactEmail },
        { key: 'enableLiveChat', value: values.enableLiveChat.toString() },
        { key: 'enableNotifications', value: values.enableNotifications.toString() },
      ];
      
      // Upsert each setting
      for (const update of updates) {
        const { error } = await supabase
          .from('app_settings')
          .upsert({ key: update.key, value: update.value }, { onConflict: 'key' });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Einstellungen gespeichert",
        description: "Die Änderungen wurden erfolgreich gespeichert.",
      });
      queryClient.invalidateQueries({ queryKey: ['moderator-settings'] });
    },
    onError: (error) => {
      toast({
        title: "Fehler beim Speichern",
        description: `${error}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmitGeneral = (values: z.infer<typeof generalFormSchema>) => {
    saveSettingsMutation.mutate(values);
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Einstellungen</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Allgemein</TabsTrigger>
          <TabsTrigger value="appearance">Erscheinungsbild</TabsTrigger>
          <TabsTrigger value="integration">Integrationen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Allgemeine Einstellungen</CardTitle>
              <CardDescription>
                Grundlegende Einstellungen für die Webseite und den Radio-Stream.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form id="general-settings-form" onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className="space-y-6">
                  <FormField
                    control={generalForm.control}
                    name="websiteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Der Name, der im Browser-Tab und im Header angezeigt wird.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="websiteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beschreibung</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormDescription>
                          Eine kurze Beschreibung der Webseite für Suchmaschinen.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kontakt E-Mail</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>
                          Die E-Mail-Adresse für Kontaktanfragen.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Funktionen</h3>
                    
                    <FormField
                      control={generalForm.control}
                      name="enableLiveChat"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Live-Chat aktivieren</FormLabel>
                            <FormDescription>
                              Erlaubt Besuchern, im Live-Chat zu kommunizieren.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="enableNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Benachrichtigungen aktivieren</FormLabel>
                            <FormDescription>
                              Zeigt Benachrichtigungen über neue Sendungen an.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                form="general-settings-form"
                disabled={saveSettingsMutation.isPending || isLoading}
              >
                {saveSettingsMutation.isPending ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Speichern...
                  </>
                ) : "Speichern"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Erscheinungsbild</CardTitle>
              <CardDescription>
                Einstellungen für das Aussehen der Webseite.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">In Entwicklung. Diese Funktion wird bald verfügbar sein.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>Integrationen</CardTitle>
              <CardDescription>
                Einstellungen für externe Dienste und APIs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">In Entwicklung. Diese Funktion wird bald verfügbar sein.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModeratorSettings;
