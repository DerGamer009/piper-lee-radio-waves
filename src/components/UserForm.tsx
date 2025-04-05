
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { createUser } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

// Define form schema
const formSchema = z.object({
  username: z.string().min(3, { message: 'Benutzername muss mindestens 3 Zeichen lang sein' }),
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse' }),
  fullName: z.string().min(3, { message: 'Name muss mindestens 3 Zeichen lang sein' }),
  roles: z.array(z.string()).min(1, { message: 'Mindestens eine Rolle muss ausgewählt sein' }),
  isActive: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onCancel, onSuccess }) => {
  const { toast } = useToast();
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      fullName: '',
      roles: ['user'],
      isActive: true,
    },
  });

  const roleOptions = [
    { id: 'admin', label: 'Administrator' },
    { id: 'moderator', label: 'Moderator' },
    { id: 'user', label: 'Nutzer' },
  ];

  const onSubmit = async (data: UserFormValues) => {
    try {
      await createUser(data);
      toast({
        title: "Erfolg!",
        description: "Benutzer wurde erfolgreich erstellt.",
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Fehler!",
        description: "Der Benutzer konnte nicht erstellt werden.",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benutzername</FormLabel>
                <FormControl>
                  <Input placeholder="benutzername" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-Mail</FormLabel>
                <FormControl>
                  <Input placeholder="email@beispiel.de" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vollständiger Name</FormLabel>
                <FormControl>
                  <Input placeholder="Max Mustermann" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Aktiv</FormLabel>
                  <FormDescription>
                    Ist dieser Benutzer aktiv?
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="roles"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Rollen</FormLabel>
                <FormDescription>
                  Wählen Sie eine oder mehrere Rollen für diesen Benutzer.
                </FormDescription>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {roleOptions.map((role) => (
                  <FormField
                    key={role.id}
                    control={form.control}
                    name="roles"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={role.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(role.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, role.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== role.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {role.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button type="submit">Benutzer erstellen</Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
