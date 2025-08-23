-- Enable the "uuid-ossp" extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Users
-- This table will store user-specific information.
-- The 'id' column is linked to Supabase Auth's 'auth.users' table.
CREATE TABLE public.users (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    username text,
    email text UNIQUE,
    phone_number text,
    profile_picture_url text,
    -- Role can be 'user', 'seller', 'admin', 'driver'
    role text DEFAULT 'user'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Row Level Security (RLS) for 'users' table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users are viewable by everyone." ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own user data." ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own user data." ON public.users FOR UPDATE USING (auth.uid() = id);
-- Admins might need policies to manage other users, but for simplicity, starting with user-only access.

-- Table for Product Categories
CREATE TABLE public.categories (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    name text UNIQUE NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS for 'categories' table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone." ON public.categories FOR SELECT USING (true);
-- Only admins should manage categories, so no insert/update/delete policies for public.

-- Table for Products
CREATE TABLE public.products (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric NOT NULL CHECK (price >= 0),
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL, -- Link to categories table
    image_urls text[], -- Array of image URLs
    seller_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    stock_quantity integer DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS for 'products' table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Sellers can insert their own products." ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their own products." ON public.products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete their own products." ON public.products FOR DELETE USING (auth.uid() = seller_id);

-- Table for Delivery Addresses
CREATE TABLE public.delivery_addresses (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    address_line1 text NOT NULL,
    address_line2 text,
    city text NOT NULL,
    state text NOT NULL,
    zip_code text NOT NULL,
    country text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS for 'delivery_addresses' table
ALTER TABLE public.delivery_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own addresses." ON public.delivery_addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own addresses." ON public.delivery_addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addresses." ON public.delivery_addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own addresses." ON public.delivery_addresses FOR DELETE USING (auth.uid() = user_id);

-- Table for Orders
CREATE TABLE public.orders (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    order_date timestamp with time zone DEFAULT now() NOT NULL,
    total_amount numeric NOT NULL CHECK (total_amount >= 0),
    status text DEFAULT 'pending'::text NOT NULL, -- e.g., 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    delivery_address_id uuid REFERENCES public.delivery_addresses(id) ON DELETE SET NULL,
    driver_id uuid REFERENCES public.users(id) ON DELETE SET NULL, -- Nullable, assigned later
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS for 'orders' table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders." ON public.orders FOR SELECT USING (auth.uid() = user_id OR auth.uid() = driver_id);
CREATE POLICY "Users can insert orders." ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders (e.g., status changes)." ON public.orders FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = driver_id);

-- Table for Order Items (details of products within an order)
CREATE TABLE public.order_items (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    quantity integer NOT NULL CHECK (quantity > 0),
    price_at_purchase numeric NOT NULL CHECK (price_at_purchase >= 0), -- Price at the time of order
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS for 'order_items' table
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order items are viewable by order owner or driver." ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.driver_id = auth.uid())));
CREATE POLICY "Users can insert order items." ON public.order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Table for Product Reviews
CREATE TABLE public.reviews (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (product_id, user_id) -- A user can only review a product once
);

-- RLS for 'reviews' table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone." ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reviews." ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews." ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews." ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Table for Liked Items (Wishlist)
CREATE TABLE public.liked_items (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, product_id) -- A user can only like a product once
);

-- RLS for 'liked_items' table
ALTER TABLE public.liked_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own liked items." ON public.liked_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own liked items." ON public.liked_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own liked items." ON public.liked_items FOR DELETE USING (auth.uid() = user_id);

-- Table for Transactions (for seller payouts, withdrawals, etc.)
CREATE TABLE public.transactions (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL, -- The user involved in the transaction (seller, admin, etc.)
    type text NOT NULL, -- e.g., 'payout', 'withdrawal', 'deposit', 'refund'
    amount numeric NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL, -- e.g., 'pending', 'completed', 'failed'
    reference_id text, -- e.g., Stripe transaction ID, bank transfer ID
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS for 'transactions' table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions." ON public.transactions FOR SELECT USING (auth.uid() = user_id);
-- Insert/update/delete policies for transactions would typically be handled by backend functions/triggers.
