import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
  children: ReactNode;
  fallback?: string;
}

export function AdminRoute({ children, fallback = '/' }: AdminRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to fallback if not admin
  if (!isAdmin) {
    return <Navigate to={fallback} replace />;
  }

  // User is authenticated and admin, show content
  return <>{children}</>;
}