
import { Navigate } from "react-router-dom";
import { getCurrentUser, hasRole } from "@/services/apiService";

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute = ({ element, requiredRoles = [] }: ProtectedRouteProps) => {
  // Check if user is logged in
  const user = getCurrentUser();
  const isLoggedIn = !!user;
  
  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for required roles if specified
  if (requiredRoles.length > 0) {
    const hasRequiredRole = hasRole(requiredRoles);
    
    if (!hasRequiredRole) {
      // User doesn't have the required role, redirect to home
      return <Navigate to="/" replace />;
    }
  }
  
  // User is logged in and has required role, render the protected component
  return <>{element}</>;
};

export default ProtectedRoute;
