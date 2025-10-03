import { Order } from '@/context/SellerContext';
import { createClient } from '@supabase/supabase-js'
import toast from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// Get profile by ID
export async function getProfileById(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)  // filter by id
    .single();         // ensures only one row is returned

  if (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }
  return data;
}


export async function getVendorName(vendorId: string) {
  const { data, error } = await supabase
    .from("profiles")  // assuming vendors are in "profiles"
    .select("username") // or "name" depending on your schema
    .eq("id", vendorId)
    .single();

  if (error) {
    console.error("Error fetching vendor:", error.message);
    return "Unknown Vendor";
  }

  return data?.username || "Unknown Vendor";
}

export const getSellerOrders = async (
  vendorId: string,
  {
    page = 1,
    limit = 10,
    statusFilter = "",
  }: { page?: number; limit?: number; statusFilter?: string }
): Promise<{ orders: Order[]; total: number; totalPages: number } | undefined> => {
  if (!vendorId) return;

  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    // Optional filter by status
    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    // Apply pagination
    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    const ordersData = data?.map((order) => ({
      id: order.id,
      ...order,
    }));

    return {
      orders: ordersData || [],
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    toast.error("Error fetching orders");
  }
};
