'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: false,
  signOut: async () => {},
});

const supabaseEnabled = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(supabaseEnabled);

  const signOut = useCallback(async () => {
    if (!supabaseEnabled) return;
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
  }, []);

  useEffect(() => {
    if (!supabaseEnabled) return;

    let cancelled = false;
    // Failsafe: stop loading after 5s regardless (Supabase down or slow)
    const timeout = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 5000);

    async function init() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;
        clearTimeout(timeout);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      } catch {
        if (!cancelled) {
          clearTimeout(timeout);
          setLoading(false);
        }
      }
    }

    const cleanupPromise = init();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      cleanupPromise.then(unsub => unsub?.());
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
