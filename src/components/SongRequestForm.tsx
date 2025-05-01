
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitSongRequest } from "@/services/radioService";

const formSchema = z.object({
  song_name: z.string().min(1, "Der Songname wird benötigt"),
  artist_name: z.string().optional(),
  requested_by: z.string().optional(),
  message: z.string().max(200, "Die Nachricht darf maximal 200 Zeichen lang sein").optional()
});

type FormValues = z.infer<typeof formSchema>;

export function SongRequestForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      song_name: "",
      artist_name: "",
      requested_by: "",
      message: ""
    }
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const success = await submitSongRequest({
        song_name: values.song_name,
        artist_name: values.artist_name || undefined,
        requested_by: values.requested_by || undefined,
        message: values.message || undefined
      });
      
      if (success) {
        toast({
          title: "Musikwunsch gesendet!",
          description: "Vielen Dank für deinen Musikwunsch.",
          variant: "default",
        });
        form.reset();
      } else {
        toast({
          title: "Fehler",
          description: "Der Musikwunsch konnte nicht gesendet werden. Bitte versuche es später erneut.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting song request:", error);
      toast({
        title: "Fehler",
        description: "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border border-gray-800/50 bg-gradient-to-br from-[#1c1f2f]/60 to-[#252a40]/60 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Song-Wunsch</CardTitle>
        <CardDescription>Welchen Song sollen wir für dich spielen?</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="song_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Songname*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Stairway to Heaven" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="artist_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Künstler</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Led Zeppelin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="requested_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dein Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dein Name (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nachricht</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Grüße oder Widmungen (optional)" 
                      {...field} 
                      className="resize-none"
                      maxLength={200}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-radio-purple hover:bg-radio-purple/80"
            >
              {loading ? "Wird gesendet..." : "Song wünschen"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
