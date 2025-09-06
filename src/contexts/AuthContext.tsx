import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthState, UserProfile } from '@/types/auth';
import { useAppFocus } from '@/hooks/useAppFocus';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAppActive, shouldRefresh } = useAppFocus();
  
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
  });
  
  // Cache do perfil para evitar refetch desnecessário
  const [profileCache, setProfileCache] = useState<Map<string, UserProfile>>(new Map());
  
  // Flag para controlar se já foi inicializado
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Ref para controlar se deve ignorar próximo auth change
  const shouldIgnoreNextChange = useRef(false);

  const updateAuthState = (updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  };

  const fetchUserProfile = async (userId: string, useCache: boolean = true): Promise<UserProfile | null> => {
    // Verificar cache primeiro se permitido
    if (useCache && profileCache.has(userId)) {
      return profileCache.get(userId) || null;
    }

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

      const profile = data[0];
      
      // Atualizar cache
      setProfileCache(prev => new Map(prev).set(userId, profile));
      
      return profile;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  };

  const handleAuthStateChange = (session: Session | null, event?: string) => {
    if (session?.user) {
      // Verificar se é o mesmo usuário para evitar refetch desnecessário
      const isSameUser = authState.user?.id === session.user.id;
      const shouldFetchProfile = !isSameUser || !authState.profile || event === 'SIGNED_IN';

      // Update auth state immediately with basic info
      updateAuthState({
        user: session.user,
        session,
        profile: isSameUser ? authState.profile : null,
        isAuthenticated: true,
        isAdmin: isSameUser ? authState.isAdmin : false,
        isLoading: false,
      });

      // Fetch profile apenas se necessário
      if (shouldFetchProfile) {
        fetchUserProfile(session.user.id, !shouldFetchProfile).then(profile => {
          updateAuthState({
            profile,
            isAdmin: profile?.is_admin || false,
          });
        });
      }
      
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
    // Evitar múltiplas inicializações
    if (isInitialized) return;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Ignorar mudanças quando a app não está ativa (exceto logout)
        if (!isAppActive() && event !== 'SIGNED_OUT') {
          return;
        }

        // Ignorar se foi marcado para ignorar
        if (shouldIgnoreNextChange.current) {
          shouldIgnoreNextChange.current = false;
          return;
        }

        // Filtrar eventos que realmente precisam de ação
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
          handleAuthStateChange(session, event);
        }
        // TOKEN_REFRESHED não precisa refazer tudo, apenas atualizar session
        else if (event === 'TOKEN_REFRESHED' && session) {
          updateAuthState({ session });
        }
      }
    );

    // Check for existing session apenas uma vez
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange(session, 'INITIAL_SESSION');
      setIsInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, [isInitialized]);

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