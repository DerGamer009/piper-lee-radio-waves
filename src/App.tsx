
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Imprint from "./pages/Imprint";
import Contact from "./pages/Contact";
import Partner from "./pages/Partner";
import Schedule from "./pages/Schedule";
import Admin from "./pages/Admin";
import Moderator from "./pages/Moderator";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/datenschutz" element={<Privacy />} />
          <Route path="/nutzungsbedingungen" element={<Terms />} />
          <Route path="/impressum" element={<Imprint />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/sendeplan" element={<Schedule />} />
          <Route 
            path="/admin" 
            element={<ProtectedRoute element={<Admin />} requiredRoles={["admin"]} />} 
          />
          <Route 
            path="/moderator" 
            element={<ProtectedRoute element={<Moderator />} requiredRoles={["admin", "moderator"]} />} 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
