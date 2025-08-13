import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function AuthRedirect() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthRedirect check:', { isLoading, isAuthenticated, isAdmin });
    if (!isLoading && isAuthenticated) {
      const redirectPath = isAdmin ? '/admin' : '/';
      console.log('AuthRedirect: redirecting to', redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  return null;
}