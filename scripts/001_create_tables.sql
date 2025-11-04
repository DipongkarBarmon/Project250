-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  date_of_birth date,
  gender text,
  user_type text DEFAULT 'patient', -- 'patient', 'doctor', 'admin'
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_name text NOT NULL,
  hospital_name text NOT NULL,
  appointment_date timestamp NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments_select_own" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "appointments_insert_own" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "appointments_update_own" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "appointments_delete_own" ON public.appointments FOR DELETE USING (auth.uid() = user_id);

-- Create medicines table
CREATE TABLE IF NOT EXISTS public.medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10, 2) NOT NULL,
  stock integer DEFAULT 0,
  category text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "medicines_select_all" ON public.medicines FOR SELECT USING (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount decimal(10, 2) NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered'
  delivery_address text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_own" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_own" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  medicine_id uuid NOT NULL REFERENCES public.medicines(id),
  quantity integer NOT NULL,
  price decimal(10, 2) NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select_own" ON public.order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));

-- Create ambulance requests table
CREATE TABLE IF NOT EXISTS public.ambulance_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location text NOT NULL,
  destination text,
  status text DEFAULT 'pending', -- 'pending', 'accepted', 'on_the_way', 'arrived', 'completed', 'cancelled'
  emergency_level text DEFAULT 'normal', -- 'normal', 'urgent', 'critical'
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.ambulance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ambulance_select_own" ON public.ambulance_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ambulance_insert_own" ON public.ambulance_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ambulance_update_own" ON public.ambulance_requests FOR UPDATE USING (auth.uid() = user_id);

-- Create hospitals table (public data)
CREATE TABLE IF NOT EXISTS public.hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  phone text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  specialties text[], -- array of specialties
  rating decimal(3, 2),
  beds_available integer,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hospitals_select_all" ON public.hospitals FOR SELECT USING (true);
