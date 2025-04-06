
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { createScheduleItem, updateSchedule, ScheduleItem } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

// Define form schema
const formSchema = z.object({
  showId: z.coerce.number().positive({ message: 'Bitte wählen Sie eine Sendung' }),
  dayOfWeek: z.string().min(1, { message: 'Bitte wählen Sie einen Tag' }),
  startTime: z.string().min(1, { message: 'Bitte geben Sie eine Startzeit ein' }),
  endTime: z.string().min(1, { message: 'Bitte geben Sie eine Endzeit ein' }),
  hostName: z.string().optional(),
  isRecurring: z.boolean().default(true),
});

type ScheduleFormValues = z.infer<typeof formSchema>;

interface Show {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  createdBy: number;
}

interface ScheduleFormProps {
  shows: Show[];
  scheduleItem?: ScheduleItem; // Make this optional for create mode
  onCancel: () => void;
  onSuccess: () => void;
  isEditing?: boolean; // Make this optional with default false
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ 
  shows, 
  scheduleItem, 
  onCancel, 
  onSuccess, 
  isEditing = false 
}) => {
  const { toast } = useToast();
  
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      showId: scheduleItem?.showId || 0,
      dayOfWeek: scheduleItem?.dayOfWeek || '',
      startTime: scheduleItem?.startTime || '',
      endTime: scheduleItem?.endTime || '',
      hostName: scheduleItem?.hostName || '',
      isRecurring: scheduleItem?.isRecurring !== undefined ? scheduleItem.isRecurring : true,
    },
  });

  const weekdays = [
    'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'
  ];

  const onSubmit = async (data: ScheduleFormValues) => {
    try {
      // Find the show title
      const selectedShow = shows.find(show => show.id === data.showId);
      
      // Ensure required fields are present
      const scheduleData = {
        showId: data.showId,
        showTitle: selectedShow?.title || '',
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        hostName: data.hostName,
        isRecurring: data.isRecurring
      };
      
      if (isEditing && scheduleItem) {
        // Update existing schedule
        await updateSchedule(scheduleItem.id, scheduleData);
        toast({
          title: "Erfolg!",
          description: "Sendeplan wurde erfolgreich aktualisiert.",
        });
      } else {
        // Create new schedule
        await createScheduleItem(scheduleData);
        toast({
          title: "Erfolg!",
          description: "Sendeplan wurde erfolgreich erstellt.",
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error with schedule:', error);
      toast({
        title: "Fehler!",
        description: isEditing 
          ? "Der Sendeplan konnte nicht aktualisiert werden."
          : "Der Sendeplan konnte nicht erstellt werden.",
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
                  defaultValue={field.value ? field.value.toString() : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sendung auswählen" />
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
                      <SelectValue placeholder="Tag auswählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {weekdays.map((day) => (
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
                  <Input placeholder="Max Mustermann" {...field} />
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
                  <FormDescription>
                    Diese Sendung jede Woche ausstrahlen
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button type="submit">
            {isEditing ? 'Sendeplan aktualisieren' : 'Sendeplan erstellen'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ScheduleForm;
