import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthState, UserProfile } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
  });

  const updateAuthState = (updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      console.log('Making Supabase query...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('Supabase query completed:', { data, error });

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (!data) {
        console.log('No profile found for user:', userId);
        return null;
      }

      console.log('Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  };

  const handleAuthStateChange = async (session: Session | null) => {
    console.log('Auth state change:', { 
      session: session ? 'exists' : 'null', 
      user: session?.user?.email 
    });
    
    if (session?.user) {
      console.log('Session exists, fetching profile...');
      const profile = await fetchUserProfile(session.user.id);
      console.log('Profile fetch completed, updating auth state...');
      
      const newAuthState = {
        user: session.user,
        session,
        profile,
        isAuthenticated: true,
        isAdmin: profile?.is_admin || false,
        isLoading: false,
      };
      
      console.log('New auth state:', newAuthState);
      updateAuthState(newAuthState);
      
      console.log('User authenticated:', { 
        email: session.user.email, 
        isAdmin: profile?.is_admin || false 
      });
    } else {
      console.log('No session, clearing auth state...');
      updateAuthState({
        user: null,
        session: null,
        profile: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
      });
      
      console.log('User signed out');
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await handleAuthStateChange(session);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('SignIn attempt for:', email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('SignIn result:', { error, session: data.session });
      return { error };
    } catch (error) {
      console.error('SignIn exception:', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      // Clear local state immediately
      updateAuthState({
        user: null,
        session: null,
        profile: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
      });

      // Clear localStorage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const refreshProfile = async () => {
    if (authState.user) {
      const profile = await fetchUserProfile(authState.user.id);
      updateAuthState({
        profile,
        isAdmin: profile?.is_admin || false,
      });
    }
  };

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}