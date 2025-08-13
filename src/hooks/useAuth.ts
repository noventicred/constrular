import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecked, setIsAdminChecked] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email, 'isSigningOut:', isSigningOut);
        
        // If we're in the process of signing out, ignore session restoration
        if (isSigningOut && session) {
          console.log('Ignoring session during signout');
          return;
        }
        setSession(session);
        setUser(session?.user ?? null);
        
        // Reset signing out flag when we get SIGNED_OUT event
        if (event === 'SIGNED_OUT') {
          setIsSigningOut(false);
        }
        
        if (session?.user) {
          // Check if user is admin
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', session.user.id)
              .single();
            
            console.log('Admin check result:', profile, error);
            setIsAdmin(profile?.is_admin || false);
            setIsAdminChecked(true);
          } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
            setIsAdminChecked(true);
          }
        } else {
          setIsAdmin(false);
          setIsAdminChecked(true);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session only if not signing out
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', !!session, 'isSigningOut:', isSigningOut);
      // Only restore session if we're not in the middle of signing out
      if (!isSigningOut && !session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isSigningOut]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
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
  };

  const signOut = async () => {
    console.log('signOut function called');
    setIsSigningOut(true);
    
    try {
      // Clear auth state immediately
      console.log('Clearing auth state immediately');
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsAdminChecked(true);
      
      // Clear localStorage completely
      localStorage.removeItem('sb-jynklrscgeshapzrogfa-auth-token');
      localStorage.clear();
      
      // Force sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload to clear any cached state
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
      console.log('Logout completed successfully');
      return { error: null };
    } catch (err) {
      console.error('SignOut exception:', err);
      // Force reload even on error
      setTimeout(() => {
        window.location.reload();
      }, 100);
      return { error: null };
    }
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    isAdminChecked,
    signIn,
    signUp,
    signOut,
  };
}