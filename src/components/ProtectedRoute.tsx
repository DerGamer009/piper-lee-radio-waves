
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute = ({ element, requiredRoles = [] }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  
  // Show loading or placeholder while auth state is being determined
  if (loading) {
    return <div className="p-8 flex justify-center">Wird geladen...</div>;
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for required roles if specified
  if (requiredRoles.includes("admin") && !isAdmin) {
    // User doesn't have admin role, redirect to home
    return <Navigate to="/" replace />;
  }
  
  // User is logged in and has required role, render the protected component
  return <>{element}</>;
};

export default ProtectedRoute;
