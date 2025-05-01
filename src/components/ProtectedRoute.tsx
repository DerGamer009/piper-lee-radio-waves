
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute = ({ element, requiredRoles = [] }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isModerator, roles, isMaintenanceMode } = useAuth();
  
  // Show loading or placeholder while auth state is being determined
  if (loading) {
    return <div className="p-8 flex justify-center">Wird geladen...</div>;
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check for maintenance mode - only admins can bypass
  if (isMaintenanceMode && !isAdmin) {
    return <Navigate to="/maintenance" replace />;
  }
  
  // Check for required roles if specified - but always allow admins to access any protected route
  if (requiredRoles.length > 0 && !isAdmin) {
    const hasRequiredRole = requiredRoles.some(role => {
      if (role === 'admin' && isAdmin) return true;
      if (role === 'moderator' && isModerator) return true;
      return roles.includes(role as any);
    });

    if (!hasRequiredRole) {
      // User doesn't have required role, redirect to user dashboard
      return <Navigate to="/user-dashboard" replace />;
    }
  }
  
  // User is logged in and has required role (or is admin), render the protected component
  return <>{element}</>;
};

export default ProtectedRoute;
