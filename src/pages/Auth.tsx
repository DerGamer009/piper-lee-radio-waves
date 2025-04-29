
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User, Mail, Lock } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  password: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen lang sein."),
});

// Register form schema
const registerSchema = z.object({
  username: z.string().min(3, "Benutzername muss mindestens 3 Zeichen lang sein."),
  fullName: z.string().min(3, "Name muss mindestens 3 Zeichen lang sein."),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  password: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen lang sein."),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam === "register" ? "register" : "login");
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [isFirstUser, setIsFirstUser] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
    },
  });

  // Check if registration is enabled
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      // Check if there are any users in the profiles table
      const { data: profileCount, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      setIsFirstUser(profileCount?.length === 0);

      if (!isFirstUser) {
        // If not the first user, check if registration is enabled in settings
        const { data: settings, error: settingsError } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'registration_enabled')
          .single();

        if (settingsError) {
          console.error('Error fetching registration status:', settingsError);
          return;
        }

        setRegistrationEnabled(settings?.value === 'true');
      } else {
        // First user can always register
        setRegistrationEnabled(true);
      }
    };

    checkRegistrationStatus();
  }, [isFirstUser]);

  // Handle login form submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    const { error } = await signIn(data.email, data.password);
    if (!error) {
      navigate("/");
    }
  };

  // Handle register form submission
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    const { error } = await signUp(data.email, data.password, {
      username: data.username,
      full_name: data.fullName,
    });
    
    if (!error) {
      toast({
        title: "Registrierung erfolgreich",
        description: isFirstUser 
          ? "Sie wurden als Administrator registriert. Die Registrierung ist jetzt für andere Benutzer deaktiviert."
          : "Ihre Registrierung war erfolgreich. Sie können sich jetzt anmelden.",
      });
      setActiveTab("login");
    }
  };

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-radio-dark to-black py-10">
      <Card className="w-full max-w-md shadow-lg border-radio-purple">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {activeTab === "login" ? "Anmeldung" : "Registrierung"}
          </CardTitle>
          <CardDescription className="text-center">
            {activeTab === "login" 
              ? "Melden Sie sich mit Ihren Zugangsdaten an"
              : "Erstellen Sie ein neues Benutzerkonto"}
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Anmelden</TabsTrigger>
            <TabsTrigger value="register" disabled={!registrationEnabled && !isFirstUser}>
              {!registrationEnabled && !isFirstUser ? "Registrierung deaktiviert" : "Registrieren"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6 p-6">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-Mail</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="mail@example.com" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passwort</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input type="password" placeholder="••••••••" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-radio-purple hover:bg-radio-blue" disabled={loginForm.formState.isSubmitting}>
                  {loginForm.formState.isSubmitting ? "Anmelden..." : "Anmelden"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="register">
            {registrationEnabled || isFirstUser ? (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 p-6">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benutzername</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="username" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vollständiger Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Max Mustermann" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="mail@example.com" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passwort</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-radio-purple hover:bg-radio-blue" disabled={registerForm.formState.isSubmitting}>
                    {registerForm.formState.isSubmitting ? "Registrieren..." : "Registrieren"}
                  </Button>
                  
                  {isFirstUser && (
                    <p className="text-sm text-center text-muted-foreground">
                      Als erster Benutzer erhalten Sie automatisch Administrator-Rechte.
                    </p>
                  )}
                </form>
              </Form>
            ) : (
              <CardContent className="p-6">
                <div className="text-center p-4">
                  <p className="text-muted-foreground">
                    Die Registrierung ist derzeit deaktiviert. Bitte kontaktieren Sie einen Administrator.
                  </p>
                </div>
              </CardContent>
            )}
          </TabsContent>
        </Tabs>
        
        <CardFooter className="border-t p-4">
          <div className="text-xs text-center w-full text-muted-foreground">
            {activeTab === "login" ? (
              <p>Durch die Anmeldung akzeptieren Sie unsere Nutzungsbedingungen und Datenschutzrichtlinien.</p>
            ) : (
              <p>Durch die Registrierung stimmen Sie unseren Nutzungsbedingungen und Datenschutzrichtlinien zu.</p>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
