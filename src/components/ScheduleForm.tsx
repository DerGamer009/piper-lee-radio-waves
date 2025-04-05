
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { createScheduleItem } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Show {
  id: number;
  title: string;
}

// Define form schema
const formSchema = z.object({
  showId: z.number({
    required_error: "Bitte wählen Sie eine Show aus",
  }),
  dayOfWeek: z.string({
    required_error: "Bitte wählen Sie einen Tag aus",
  }),
  startTime: z.string().min(1, { message: 'Startzeit ist erforderlich' }),
  endTime: z.string().min(1, { message: 'Endzeit ist erforderlich' }),
  hostName: z.string().optional(),
  isRecurring: z.boolean().default(true),
});

type ScheduleFormValues = z.infer<typeof formSchema>;

interface ScheduleFormProps {
  shows: Show[];
  onCancel: () => void;
  onSuccess: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ shows, onCancel, onSuccess }) => {
  const { toast } = useToast();
  
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      hostName: '',
      isRecurring: true,
    },
  });

  const days = [
    "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"
  ];

  const onSubmit = async (data: ScheduleFormValues) => {
    try {
      // Get the show title for the selected show ID
      const selectedShow = shows.find(show => show.id === data.showId);
      if (!selectedShow) {
        throw new Error("Selected show not found");
      }

      // Create the schedule item with the show title
      await createScheduleItem({
        ...data,
        showTitle: selectedShow.title,
      });

      toast({
        title: "Erfolg!",
        description: "Sendeplan wurde erfolgreich erstellt.",
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating schedule item:', error);
      toast({
        title: "Fehler!",
        description: "Der Sendeplan konnte nicht erstellt werden.",
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
            name="showId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sendung</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wähle eine Sendung" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {shows.map((show) => (
                      <SelectItem key={show.id} value={show.id.toString()}>
                        {show.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dayOfWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wähle einen Tag" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Startzeit</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endzeit</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hostName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moderator (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Name des Moderators" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isRecurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Wöchentlich wiederholen</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button type="submit">Sendeplan erstellen</Button>
        </div>
      </form>
    </Form>
  );
};

export default ScheduleForm;
