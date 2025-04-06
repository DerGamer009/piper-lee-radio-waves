
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
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/datenschutz" element={<Layout><Privacy /></Layout>} />
          <Route path="/nutzungsbedingungen" element={<Layout><Terms /></Layout>} />
          <Route path="/impressum" element={<Layout><Imprint /></Layout>} />
          <Route path="/kontakt" element={<Layout><Contact /></Layout>} />
          <Route path="/partner" element={<Layout><Partner /></Layout>} />
          <Route path="/sendeplan" element={<Layout><Schedule /></Layout>} />
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

export default App;
