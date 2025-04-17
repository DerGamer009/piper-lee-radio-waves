
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute = ({ element, requiredRoles = [] }: ProtectedRouteProps) => {
  // Check if user is logged in
  const userString = localStorage.getItem("user");
  const isLoggedIn = userString !== null;
  
  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for required roles if specified
  if (requiredRoles.length > 0) {
    const user = JSON.parse(userString || "{}");
    const userRoles = user.roles || [];
    
    // Check if the user has at least one of the required roles
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      // User doesn't have the required role, redirect to home
      return <Navigate to="/" replace />;
    }
  }
  
  // User is logged in and has required role, render the protected component
  return <>{element}</>;
};

export default ProtectedRoute;
