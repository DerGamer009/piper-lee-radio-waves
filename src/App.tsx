
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Imprint from "./pages/Imprint";
import Contact from "./pages/Contact";
import Partner from "./pages/Partner";
import Schedule from "./pages/Schedule";
import Podcasts from "./pages/Podcasts";
import Charts from "./pages/Charts";
import Admin from "./pages/Admin";
import Moderator from "./pages/Moderator";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { checkApiServer } from "./services/serverStarter";
import { toast } from "./hooks/use-toast";

const queryClient = new QueryClient();

const App = () => {
  // Check if the API server is running when the app loads
  useEffect(() => {
    const checkServer = async () => {
      const isRunning = await checkApiServer();
      if (!isRunning) {
        toast({
          title: "API Server nicht erreichbar",
          description: "Der API-Server scheint nicht zu laufen. Bitte starte ihn manuell.",
          variant: "destructive"
        });
      }
    };
    
    checkServer();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/datenschutz" element={<Layout><Privacy /></Layout>} />
            <Route path="/nutzungsbedingungen" element={<Layout><Terms /></Layout>} />
            <Route path="/impressum" element={<Layout><Imprint /></Layout>} />
            <Route path="/kontakt" element={<Layout><Contact /></Layout>} />
            <Route path="/partner" element={<Layout><Partner /></Layout>} />
            <Route path="/sendeplan" element={<Layout><Schedule /></Layout>} />
            <Route path="/podcasts" element={<Layout><Podcasts /></Layout>} />
            <Route path="/charts" element={<Layout><Charts /></Layout>} />
            <Route 
              path="/admin" 
              element={<ProtectedRoute element={<Layout><Admin /></Layout>} requiredRoles={["admin"]} />} 
            />
            <Route 
              path="/moderator" 
              element={<ProtectedRoute element={<Layout><Moderator /></Layout>} requiredRoles={["admin", "moderator"]} />} 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
