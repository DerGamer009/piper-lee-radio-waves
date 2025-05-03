import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "@/components/ui/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Imprint from "./pages/Imprint";
import Contact from "./pages/Contact";
import Partner from "./pages/Partner";
import Schedule from "./pages/Schedule";
import ScheduleAdmin from "./pages/ScheduleAdmin";
import Podcasts from "./pages/Podcasts";
import Charts from "./pages/Charts";
import Admin from "./pages/Admin";
import AdminSidebar from "./components/admin/AdminSidebar";
import Moderator from "./pages/Moderator";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import UserDashboard from "./pages/UserDashboard";
import Auth from "./pages/Auth";
import News from "./pages/News";
import Maintenance from "./pages/Maintenance";
import Download from "./pages/Download";
import ProtectedRoute from "./components/ProtectedRoute";
import SongRequests from "./pages/SongRequests";
import Chat from "./pages/Chat";
import Events from "./pages/Events";
import Status from './pages/Status';
import UsersPage from './pages/UsersPage';
import ModeratorSettings from './pages/ModeratorSettings';
import ModeratorRadio from './pages/ModeratorRadio';
import WeatherWidget from "./components/WeatherWidget";

// Import admin components
import AdminSettings from "./components/admin/AdminSettings";
import AdminNotifications from "./components/admin/AdminNotifications";
import AdminMessages from "./components/admin/AdminMessages";
import AdminDatabase from "./components/admin/AdminDatabase";
import AdminUsers from "./components/admin/AdminUsers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Custom Layout with Weather for Home page
const HomeLayout = ({ children }: { children: React.ReactNode }) => (
  <Layout>
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {children}
        </div>
        <div className="lg:col-span-1">
          <div className="mb-6">
            <WeatherWidget />
          </div>
          {/* Add other sidebar widgets here if needed */}
        </div>
      </div>
    </div>
  </Layout>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomeLayout><Index /></HomeLayout>} />
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
                <Route path="/download" element={<Layout><Download /></Layout>} />
                <Route path="/songwunsch" element={<Layout><SongRequests /></Layout>} />
                <Route path="/chat" element={<Layout><Chat /></Layout>} />
                <Route path="/events" element={<Layout><Events /></Layout>} />
                <Route path="/status" element={<Status />} />
                {/* The maintenance page should be accessible to everyone without authentication */}
                <Route path="/maintenance" element={<Layout><Maintenance /></Layout>} />
                <Route 
                  path="/user-dashboard" 
                  element={<ProtectedRoute element={<Layout><UserDashboard /></Layout>} />} 
                />
                
                {/* Redirect from old moderator-dashboard to new moderator route */}
                <Route 
                  path="/moderator-dashboard"
                  element={<Navigate to="/moderator" replace />} 
                />
                
                {/* New moderator routes with nested structure and sidebar */}
                <Route 
                  path="/moderator" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <ModeratorDashboard />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["moderator", "admin"]} 
                    />
                  } 
                />
                <Route 
                  path="/moderator/users" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <ModeratorDashboard />
                            <div className="flex-1">
                              <UsersPage />
                            </div>
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["moderator", "admin"]} 
                    />
                  } 
                />
                <Route 
                  path="/moderator/settings" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <ModeratorDashboard />
                            <div className="flex-1">
                              <ModeratorSettings />
                            </div>
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["moderator", "admin"]} 
                    />
                  } 
                />
                <Route 
                  path="/moderator/radio" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <ModeratorDashboard />
                            <div className="flex-1">
                              <ModeratorRadio />
                            </div>
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["moderator", "admin"]} 
                    />
                  } 
                />
                
                {/* Admin routes with SidebarProvider */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <Admin />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["admin"]} 
                    />
                  } 
                />
                <Route 
                  path="/sendeplan-admin" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <ScheduleAdmin />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["admin", "moderator"]} 
                    />
                  } 
                />
                
                {/* New Admin Pages */}
                <Route 
                  path="/admin/settings" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <AdminSettings />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["admin"]} 
                    />
                  } 
                />
                <Route 
                  path="/admin/notifications" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <AdminNotifications />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["admin"]} 
                    />
                  } 
                />
                <Route 
                  path="/admin/messages" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <AdminMessages />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["admin"]} 
                    />
                  } 
                />
                <Route 
                  path="/admin/database" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <AdminDatabase />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["admin"]} 
                    />
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <AdminUsers />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["admin"]} 
                    />
                  } 
                />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
