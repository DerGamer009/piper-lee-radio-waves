import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createNewUser } from "@/services/apiService";
import { EyeIcon, EyeOffIcon, UserPlusIcon, AlertTriangleIcon, ServerIcon } from "lucide-react";
import { checkServerStatus, getServerStartInstructions } from "@/services/serverStarter";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isServerRunning, setIsServerRunning] = useState<boolean | null>(null);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    roles: ["user"],
    isActive: true
  });

  useEffect(() => {
    const checkServer = async () => {
      const running = await checkServerStatus();
      setIsServerRunning(running);
    };
    
    checkServer();
    
    const interval = setInterval(checkServer, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, roles: [value] }));
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isServerRunning = await checkServerStatus();
      if (!isServerRunning) {
        toast({
          variant: "destructive",
          title: "API-Server nicht erreichbar",
          description: "Der API-Server scheint nicht zu laufen. Bitte starte ihn manuell und versuche es erneut."
        });
        setIsLoading(false);
        return;
      }
      
      const result = await createNewUser(formData);
      
      if (result) {
        toast({
          title: "Registrierung erfolgreich",
          description: "Du kannst dich jetzt einloggen.",
        });
        navigate("/login");
      } else {
        toast({
          variant: "destructive",
          title: "Registrierung fehlgeschlagen",
          description: "Bitte überprüfe deine Eingaben und versuche es erneut.",
        });
      }
    } catch (error) {
      console.error("Registrierungsfehler:", error);
      toast({
        variant: "destructive",
        title: "Registrierung fehlgeschlagen",
        description: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      {isServerRunning === false && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>API-Server nicht erreichbar</AlertTitle>
          <AlertDescription>
            Der API-Server ist nicht erreichbar. Die Registrierung wird nicht funktionieren.
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                  <ServerIcon className="h-4 w-4 mr-2" />
                  Wie starte ich den Server?
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>API-Server starten</AlertDialogTitle>
                  <AlertDialogDescription className="whitespace-pre-line">
                    {getServerStartInstructions()}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>OK</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <UserPlusIcon className="h-6 w-6" />
            Registrieren
          </CardTitle>
          <CardDescription>
            Erstelle ein neues Konto für das Radio-System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Benutzername</Label>
              <Input
                id="username"
                name="username"
                placeholder="benutzername"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                  </span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Vollständiger Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Max Mustermann"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Rolle</Label>
              <Select onValueChange={handleRoleChange} defaultValue="user">
                <SelectTrigger>
                  <SelectValue placeholder="Rolle auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Benutzer</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isActive" 
                checked={formData.isActive}
                onCheckedChange={handleActiveChange}
              />
              <Label htmlFor="isActive">Konto aktivieren</Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isServerRunning === false}
            >
              {isLoading ? "Registriere..." : "Registrieren"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate("/login")}>
            Bereits registriert? Zum Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
