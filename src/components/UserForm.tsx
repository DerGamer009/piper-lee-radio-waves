
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createNewUser, updateUser, User, CreateUserData } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

// Define form schema for new users with password
const newUserSchema = z.object({
  username: z.string().min(3, { message: 'Benutzername muss mindestens 3 Zeichen lang sein' }),
  password: z.string().min(6, { message: 'Passwort muss mindestens 6 Zeichen lang sein' }),
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse' }),
  fullName: z.string().min(3, { message: 'Name muss mindestens 3 Zeichen lang sein' }),
  roles: z.array(z.string()).min(1, { message: 'Mindestens eine Rolle muss ausgewählt sein' }),
  isActive: z.boolean().default(true),
});

// Define form schema for editing users (no password field)
const editUserSchema = z.object({
  username: z.string().min(3, { message: 'Benutzername muss mindestens 3 Zeichen lang sein' }),
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse' }),
  fullName: z.string().min(3, { message: 'Name muss mindestens 3 Zeichen lang sein' }),
  roles: z.array(z.string()).min(1, { message: 'Mindestens eine Rolle muss ausgewählt sein' }),
  isActive: z.boolean().default(true),
});

// Define the types for both schemas
type NewUserFormValues = z.infer<typeof newUserSchema>;
type EditUserFormValues = z.infer<typeof editUserSchema>;

// Type that can represent either form values based on isEditing flag
type UserFormValues<T extends boolean> = T extends true ? EditUserFormValues : NewUserFormValues;

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
  
  // Set default values for the form
  const defaultValues: Partial<UserFormValues<typeof isEditing>> = {
    username: user?.username || '',
    email: user?.email || '',
    fullName: user?.fullName || '',
    roles: user?.roles || ['user'],
    isActive: user?.isActive !== undefined ? user.isActive : true,
  };

  // Add password field only for new users
  if (!isEditing) {
    (defaultValues as Partial<NewUserFormValues>).password = '';
  }
  
  const form = useForm<UserFormValues<typeof isEditing>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as UserFormValues<typeof isEditing>,
  });

  const roleOptions = [
    { id: 'admin', label: 'Administrator' },
    { id: 'moderator', label: 'Moderator' },
    { id: 'user', label: 'Nutzer' },
  ];

  const onSubmit = async (data: UserFormValues<typeof isEditing>) => {
    try {
      if (isEditing && user) {
        await updateUser(user.id, data as EditUserFormValues);
        toast({
          title: "Erfolg!",
          description: "Benutzer wurde erfolgreich aktualisiert.",
        });
      } else {
        // Ensure we're passing properly typed data with required fields
        const newUserData: CreateUserData = {
          username: data.username,
          password: (data as NewUserFormValues).password,
          email: data.email,
          fullName: data.fullName,
          roles: data.roles,
          isActive: data.isActive
        };
        await createNewUser(newUserData);
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
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      onChange={field.onChange}
                      value={field.value as string}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
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
                    checked={field.value as boolean}
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
                              checked={(field.value as string[])?.includes(role.id)}
                              onCheckedChange={(checked) => {
                                const currentValues = field.value as string[];
                                return checked
                                  ? field.onChange([...currentValues, role.id])
                                  : field.onChange(
                                      currentValues?.filter(
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
