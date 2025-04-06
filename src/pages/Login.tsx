
import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import { login } from "@/services/apiService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  const isLoggedIn = localStorage.getItem("user") !== null;
  const userData = isLoggedIn ? JSON.parse(localStorage.getItem("user") || "{}") : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(username, password);
      
      if (result) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(result.user));
        
        // Safely get user roles as an array regardless of how they're stored
        const userRoles = Array.isArray(result.user.roles) 
          ? result.user.roles 
          : typeof result.user.roles === 'string' && result.user.roles
            ? result.user.roles.split(',') 
            : [];
            
        if (userRoles.includes("admin")) {
          navigate("/admin");
        } else if (userRoles.includes("moderator")) {
          navigate("/moderator");
        } else {
          navigate("/");
        }
        
        toast({
          title: "Erfolgreich angemeldet",
          description: `Willkommen zurück, ${result.user.fullName || result.user.username}!`,
          variant: "default",
        });
      } else {
        toast({
          title: "Anmeldung fehlgeschlagen",
          description: "Ungültiger Benutzername oder Passwort.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Fehler bei der Anmeldung",
        description: "Es gab ein Problem bei der Verarbeitung Ihrer Anfrage.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, redirect based on role
  if (isLoggedIn && userData) {
    // Safely handle user roles as an array
    const userRoles = Array.isArray(userData.roles) 
      ? userData.roles 
      : typeof userData.roles === 'string' && userData.roles
        ? userData.roles.split(',') 
        : [];
        
    if (userRoles.includes("admin")) {
      return <Navigate to="/admin" replace />;
    } else if (userRoles.includes("moderator")) {
      return <Navigate to="/moderator" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex justify-center items-center gap-2">
            <Lock className="h-6 w-6" />
            Anmelden
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Benutzername</Label>
              <Input
                id="username"
                placeholder="Benutzername eingeben"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                placeholder="Passwort eingeben"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Anmelden..." : "Anmelden"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
