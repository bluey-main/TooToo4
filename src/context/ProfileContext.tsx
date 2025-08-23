import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

interface ProfileContextType {
  profile: any | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  isWriter: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ useCallback so refreshProfile reference is stable
  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  // ✅ fetch only when user changes
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ✅ derived value memoized
  const isWriter = useMemo(() => {
    return profile?.is_writer ?? false;
  }, [profile?.is_writer]);

  // ✅ context value memoized to avoid triggering re-renders
  const value = useMemo(
    () => ({
      profile,
      loading,
      refreshProfile,
      isWriter,
    }),
    [profile, loading, refreshProfile, isWriter]
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
