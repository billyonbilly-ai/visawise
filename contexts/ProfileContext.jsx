"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const ProfileContext = createContext();

export function ProfileProvider({ children, initialProfile = null }) {
  const [supabase] = useState(() => createClient());
  const [profile, setProfile] = useState(initialProfile);

  const [loading, setLoading] = useState(!initialProfile);

  useEffect(() => {
    if (initialProfile) return;

    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      setProfile({
        id: user.id,
        email: user.email,
        name: data?.name || null,
      });
      setLoading(false);
    }

    loadProfile();
  }, [supabase, initialProfile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
