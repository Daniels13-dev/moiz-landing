"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getUserRole, logout as authLogout } from "@/app/auth/actions";
import { useRouter } from "next/navigation";

const supabase = createClient();

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const role = await getUserRole();
        setUser({ ...session.user, role });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error al verificar usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      if (session?.user) {
        const role = await getUserRole();
        setUser({ ...session.user, role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await authLogout();
    setUser(null);
    router.refresh();
  };

  return { user, loading, logout, checkUser };
}
