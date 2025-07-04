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
import Kids from "./pages/Kids";

// Import admin pages
import AdminSettings from './pages/admin/Settings';
import AdminNotifications from './pages/admin/Notifications';
import AdminMessages from './pages/admin/Messages';
import AdminDatabase from './pages/admin/Database';
import AdminUsers from './pages/admin/Users';
import ContentManagement from './pages/admin/ContentManagement';
import Analytics from './pages/admin/Analytics';
import BackupManagement from './pages/admin/BackupManagement';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/kids" element={<Layout><Kids /></Layout>} />
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
                
                {/* Admin Pages */}
                <Route 
                  path="/admin/content" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <ContentManagement />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["admin"]} 
                    />
                  } 
                />
                <Route 
                  path="/admin/analytics" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <Analytics />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["admin"]} 
                    />
                  } 
                />
                <Route 
                  path="/admin/backup" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <BackupManagement />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["admin"]} 
                    />
                  } 
                />
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
                <Route 
                  path="/admin/server" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <Status />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["admin"]} 
                    />
                  } 
                />
                <Route 
                  path="/admin/podcasts" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <Podcasts />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["admin"]} 
                    />
                  } 
                />
                <Route 
                  path="/admin/news" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <News />
                          </div>
                        </SidebarProvider>
                      } 
                      requiredRoles={["admin"]} 
                    />
                  } 
                />
                <Route 
                  path="/admin/radio" 
                  element={
                    <ProtectedRoute 
                      element={
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full">
                            <AdminSidebar />
                            <ModeratorRadio />
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
