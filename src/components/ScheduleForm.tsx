
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createScheduleItem, updateScheduleItem, getSchedule, getShows, Show, ScheduleItem } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

// Define form schema
const formSchema = z.object({
  show_id: z.string(),
  day_of_week: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  host_name: z.string().optional(),
  is_recurring: z.boolean().default(true),
});

type ScheduleFormValues = z.infer<typeof formSchema>;

interface ScheduleFormProps {
  scheduleItem?: ScheduleItem;
  shows?: Show[];
  isEditing?: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const dayOptions = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag'
];

const ScheduleForm: React.FC<ScheduleFormProps> = ({ 
  scheduleItem, 
  shows = [], 
  isEditing = false, 
  onCancel, 
  onSuccess 
}) => {
  const { toast } = useToast();
  
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      show_id: scheduleItem?.show_id || '',
      day_of_week: scheduleItem?.day_of_week || 'Montag',
      start_time: scheduleItem?.start_time || '',
      end_time: scheduleItem?.end_time || '',
      host_name: scheduleItem?.host_name || '',
      is_recurring: scheduleItem?.is_recurring !== undefined ? scheduleItem.is_recurring : true,
    },
  });

  const onSubmit = async (data: ScheduleFormValues) => {
    try {
      const scheduleData = {
        show_id: data.show_id,
        day_of_week: data.day_of_week,
        start_time: data.start_time,
        end_time: data.end_time,
        host_id: null, // We keep this field but set it to null as we're using host_name instead
        host_name: data.host_name, // Store the host name directly
        is_recurring: data.is_recurring,
      };
  
      if (isEditing && scheduleItem) {
        await updateScheduleItem(scheduleItem.id, scheduleData);
        toast({
          title: "Erfolg!",
          description: "Zeitplan erfolgreich aktualisiert.",
        });
      } else {
        await createScheduleItem(scheduleData);
        toast({
          title: "Erfolg!",
          description: "Zeitplan erfolgreich erstellt.",
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error with schedule operation:', error);
      toast({
        title: "Fehler!",
        description: isEditing
          ? "Der Zeitplan konnte nicht aktualisiert werden."
          : "Der Zeitplan konnte nicht erstellt werden.",
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
            name="show_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sendung</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sendung auswählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {shows.map((show) => (
                      <SelectItem key={show.id} value={show.id}>
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
            name="day_of_week"
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
                    {dayOptions.map((day) => (
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
            name="start_time"
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
            name="end_time"
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
            name="host_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moderator / Streamer Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Name des Moderators" 
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value || '')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_recurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Wiederkehrend</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Wiederholt sich dieser Termin wöchentlich?
                  </p>
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
            {isEditing ? "Zeitplan aktualisieren" : "Zeitplan erstellen"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ScheduleForm;
