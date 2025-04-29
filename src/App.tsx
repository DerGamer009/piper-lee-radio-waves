
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
import ModeratorDashboard from "./pages/ModeratorDashboard";
import AdminPanel from "./pages/AdminPanel";
import UserDashboard from "./pages/UserDashboard";
import Auth from "./pages/Auth";
import News from "./pages/News";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/login" element={<Layout><Auth /></Layout>} />
            <Route path="/datenschutz" element={<Layout><Privacy /></Layout>} />
            <Route path="/nutzungsbedingungen" element={<Layout><Terms /></Layout>} />
            <Route path="/impressum" element={<Layout><Imprint /></Layout>} />
            <Route path="/kontakt" element={<Layout><Contact /></Layout>} />
            <Route path="/partner" element={<Layout><Partner /></Layout>} />
            <Route path="/sendeplan" element={<Layout><Schedule /></Layout>} />
            <Route path="/podcasts" element={<Layout><Podcasts /></Layout>} />
            <Route path="/charts" element={<Layout><Charts /></Layout>} />
            <Route path="/news" element={<Layout><News /></Layout>} />
            <Route path="/news/:id" element={<Layout><News /></Layout>} />
            <Route 
              path="/user-dashboard" 
              element={<ProtectedRoute element={<Layout><UserDashboard /></Layout>} />} 
            />
            <Route 
              path="/moderator-dashboard" 
              element={<ProtectedRoute element={<Layout><ModeratorDashboard /></Layout>} requiredRoles={["moderator", "admin"]} />} 
            />
            <Route 
              path="/admin" 
              element={<ProtectedRoute element={<Layout><Admin /></Layout>} requiredRoles={["admin"]} />} 
            />
            <Route 
              path="/admin/panel" 
              element={<ProtectedRoute element={<Layout><AdminPanel /></Layout>} requiredRoles={["admin"]} />} 
            />
            <Route 
              path="/moderator" 
              element={<ProtectedRoute element={<Layout><Moderator /></Layout>} requiredRoles={["admin", "moderator"]} />} 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
