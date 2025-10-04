import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { Order } from "./SellerContext";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userDetails: Record<string, any> | null;
  deliveryAddresses: any[];
  orders: Order[];
  allProducts: any[];
  loading: boolean;
  loadingUserData: boolean;
  fetchingAllProducts: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  refetchUserData: () => Promise<void>;
  refetchProducts: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // --- STATE ---
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<Record<string, any> | null>(null);
  const [deliveryAddresses, setDeliveryAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [fetchingAllProducts, setFetchingAllProducts] = useState(false);

  const [hasUserDataBeenFetched, setHasUserDataBeenFetched] = useState(false);
  const [hasProductsBeenFetched, setHasProductsBeenFetched] = useState(false);

  // --- AUTH METHODS (memoized with useCallback to prevent new refs every render) ---
  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success("Check your email for the confirmation link!");
    } catch (error: any) {
      console.log(error.message);
      toast.error("Failed to sign up");
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setHasUserDataBeenFetched(false);
      setHasProductsBeenFetched(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  }, []);

  // --- REFETCH METHODS (also memoized) ---
  const refetchUserData = useCallback(async () => {
    if (!user) return;
    setLoadingUserData(true);
    try {
      const [profile, addresses, userOrders] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("delivery_addresses").select("*").eq("user_id", user.id),
        supabase.from("orders").select("*").eq("user_id", user.id),
      ]);

      setUserDetails(profile?.data || null);
      setDeliveryAddresses(addresses?.data || []);
      setOrders(userOrders?.data || []);
      setHasUserDataBeenFetched(true);
    } catch (error: any) {
      toast.error("Could not fetch your data. Please try again.");
      console.error("Error fetching user data:", error);
    } finally {
      setLoadingUserData(false);
    }
  }, [user]);

  const refetchProducts = useCallback(async () => {
    setFetchingAllProducts(true);
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      setAllProducts(data || []);
      setHasProductsBeenFetched(true);
    } catch (error: any) {
      toast.error(error.message || "Error fetching products");
    } finally {
      setFetchingAllProducts(false);
    }
  }, []);

  // --- EFFECTS ---
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) {
        console.error("Error getting session:", error);
        setLoading(false);
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === "SIGNED_OUT") {
          setHasUserDataBeenFetched(false);
          setHasProductsBeenFetched(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user && !hasUserDataBeenFetched) {
      refetchUserData();
    } else if (!user) {
      setUserDetails(null);
      setDeliveryAddresses([]);
      setOrders([]);
      setHasUserDataBeenFetched(false);
    }
  }, [user, hasUserDataBeenFetched, refetchUserData]);

  useEffect(() => {
    if (!hasProductsBeenFetched) {
      refetchProducts();
    }
  }, [hasProductsBeenFetched, refetchProducts]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            console.log("Page visible again, session still valid");
          }
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // --- CONTEXT VALUE (memoized!) ---
  const value = useMemo(
    () => ({
      user,
      session,
      userDetails,
      deliveryAddresses,
      orders,
      allProducts,
      loading,
      loadingUserData,
      fetchingAllProducts,
      signOut,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      refetchUserData,
      refetchProducts,
    }),
    [
      user,
      session,
      userDetails,
      deliveryAddresses,
      orders,
      allProducts,
      loading,
      loadingUserData,
      fetchingAllProducts,
      signOut,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      refetchUserData,
      refetchProducts,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
