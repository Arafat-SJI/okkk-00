import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(supabase.auth.getSession ? null : null);
  const [user, setUser] = useState<User | null>(supabase.auth.user ? supabase.auth.user() : null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then((res) => {
      if (!mounted) return;
      setSession(res.data.session);
      setUser(res.data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub?.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    const res = await supabase.auth.signUp({ email, password }, { data: { name } });
    if (res.error) throw res.error;
    return res;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (res.error) throw res.error;
    return res;
  }, []);

  const signOut = useCallback(async () => {
    const res = await supabase.auth.signOut();
    if (res.error) throw res.error;
    return res;
  }, []);

  return { session, user, loading, signUp, signIn, signOut };
}
