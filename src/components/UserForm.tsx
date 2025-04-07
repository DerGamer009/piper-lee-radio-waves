
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { createNewUser, updateUser, User } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

// Define form schema for new users
const newUserSchema = z.object({
  username: z.string().min(3, { message: 'Benutzername muss mindestens 3 Zeichen lang sein' }),
  password: z.string().min(6, { message: 'Passwort muss mindestens 6 Zeichen lang sein' }),
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse' }),
  fullName: z.string().min(3, { message: 'Name muss mindestens 3 Zeichen lang sein' }),
  roles: z.array(z.string()).min(1, { message: 'Mindestens eine Rolle muss ausgewählt sein' }),
  isActive: z.boolean().default(true),
});

// Define form schema for editing users
const editUserSchema = z.object({
  username: z.string().min(3, { message: 'Benutzername muss mindestens 3 Zeichen lang sein' }),
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse' }),
  fullName: z.string().min(3, { message: 'Name muss mindestens 3 Zeichen lang sein' }),
  roles: z.array(z.string()).min(1, { message: 'Mindestens eine Rolle muss ausgewählt sein' }),
  isActive: z.boolean().default(true),
});

interface UserFormProps {
  user?: User;
  isEditing?: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, isEditing = false, onCancel, onSuccess }) => {
  const { toast } = useToast();
  
  // Use the appropriate schema based on whether we're editing or creating
  const formSchema = isEditing ? editUserSchema : newUserSchema;
  type UserFormValues = z.infer<typeof formSchema>;
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || '',
      ...(isEditing ? {} : { password: '' }),
      email: user?.email || '',
      fullName: user?.fullName || '',
      roles: user?.roles || ['user'],
      isActive: user?.isActive !== undefined ? user.isActive : true,
    } as any,
  });

  const roleOptions = [
    { id: 'admin', label: 'Administrator' },
    { id: 'moderator', label: 'Moderator' },
    { id: 'user', label: 'Nutzer' },
  ];

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (isEditing && user) {
        await updateUser(user.id, data);
        toast({
          title: "Erfolg!",
          description: "Benutzer wurde erfolgreich aktualisiert.",
        });
      } else {
        await createNewUser(data as any);
        toast({
          title: "Erfolg!",
          description: "Benutzer wurde erfolgreich erstellt.",
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error with user operation:', error);
      toast({
        title: "Fehler!",
        description: isEditing 
          ? "Der Benutzer konnte nicht aktualisiert werden." 
          : "Der Benutzer konnte nicht erstellt werden.",
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

          {!isEditing && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
          <Button type="submit">
            {isEditing ? "Benutzer aktualisieren" : "Benutzer erstellen"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
