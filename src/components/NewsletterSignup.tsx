
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { subscribeToNewsletter } from "@/services/radioService";
import { MailPlus } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  name: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export function NewsletterSignup() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: ""
    }
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      await subscribeToNewsletter({
        email: values.email,
        name: values.name || undefined
      });
      
      setSuccess(true);
      form.reset();
      
      toast({
        title: "Anmeldung erfolgreich!",
        description: "Du hast dich erfolgreich für den Newsletter angemeldet.",
        variant: "default",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Es ist ein Fehler aufgetreten.";
      
      toast({
        title: "Fehler bei der Anmeldung",
        description: errorMsg.includes("bereits angemeldet") ? 
          "Diese E-Mail-Adresse ist bereits für den Newsletter angemeldet." : 
          "Beim Anmelden zum Newsletter ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border border-gray-800/50 bg-gradient-to-br from-[#1c1f2f]/60 to-[#252a40]/60 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <MailPlus className="h-5 w-5 text-radio-purple" />
          Newsletter
        </CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-center py-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-500 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-gray-300 mb-2">Vielen Dank!</p>
            <p className="text-sm text-gray-400">
              Du erhältst jetzt Neuigkeiten zu unseren Shows und Events.
            </p>
            <Button 
              className="mt-4 text-sm"
              variant="outline"
              onClick={() => setSuccess(false)}
            >
              Zurück zum Formular
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Melde dich für unseren Newsletter an und erhalte Neuigkeiten zu unseren Shows und Events.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Name (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Dein Name" {...field} />
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
                      <FormLabel className="text-sm">E-Mail*</FormLabel>
                      <FormControl>
                        <Input placeholder="deine@email.de" {...field} type="email" />
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
                  {loading ? "Wird verarbeitet..." : "Anmelden"}
                </Button>
                
                <p className="text-xs text-gray-400 text-center">
                  Durch die Anmeldung stimmst du dem Erhalt von E-Mails zu. Du kannst dich jederzeit wieder abmelden.
                </p>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
