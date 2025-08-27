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
      const { data, error } = await supabase
        .rpc('get_user_complete_profile', { target_user_id: userId });

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log('No profile found for user:', userId);
        return null;
      }

      return data[0];
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  };

  const handleAuthStateChange = (session: Session | null) => {
    if (session?.user) {
      // Update auth state immediately with basic info
      updateAuthState({
        user: session.user,
        session,
        profile: null,
        isAuthenticated: true,
        isAdmin: false,
        isLoading: false,
      });

      // Fetch profile separately
      fetchUserProfile(session.user.id).then(profile => {
        console.log('Fetched profile:', profile);
        updateAuthState({
          profile,
          isAdmin: profile?.is_admin || false,
        });
        console.log('isAdmin set to:', profile?.is_admin || false);
      });
      
    } else {
      updateAuthState({
        user: null,
        session: null,
        profile: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only process certain events to avoid loops
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          handleAuthStateChange(session);
        }
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
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
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