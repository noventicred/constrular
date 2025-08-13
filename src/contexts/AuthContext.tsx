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

  const handleAuthStateChange = (session: Session | null) => {
    console.log('Auth state change:', { 
      session: session ? 'exists' : 'null', 
      user: session?.user?.email 
    });
    
    if (session?.user) {
      console.log('Session exists, updating auth state directly...');
      
      // Update auth state immediately with basic info
      updateAuthState({
        user: session.user,
        session,
        profile: null, // Will be fetched separately
        isAuthenticated: true,
        isAdmin: false, // Will be updated after profile fetch
        isLoading: false,
      });

      // Fetch profile separately
      console.log('Fetching profile separately...');
      fetchUserProfile(session.user.id).then(profile => {
        console.log('Profile fetch result:', profile);
        updateAuthState({
          profile,
          isAdmin: profile?.is_admin || false,
        });
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
      (event, session) => {
        console.log('Auth event:', event, 'Session:', session ? 'exists' : 'null');
        // Use setTimeout to avoid potential issues with immediate state updates
        setTimeout(() => {
          handleAuthStateChange(session);
        }, 0);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'exists' : 'null');
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