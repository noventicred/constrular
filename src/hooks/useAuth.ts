import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecked, setIsAdminChecked] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
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

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // This will trigger the auth state change event above if there's a session
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
    try {
      // Set timeout to force logout if Supabase doesn't respond
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Logout timeout')), 5000)
      );
      
      const signOutPromise = supabase.auth.signOut();
      
      const result = await Promise.race([signOutPromise, timeoutPromise]);
      console.log('Supabase signOut result:', result);
      
      // Force clear auth state regardless of Supabase response
      console.log('Clearing auth state manually');
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsAdminChecked(true);
      
      return { error: null };
    } catch (err) {
      console.error('SignOut exception:', err);
      // Force clear auth state even on error
      console.log('Forcing auth state clear due to error');
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsAdminChecked(true);
      return { error: null }; // Return success to complete logout flow
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