
-- Create stores table first for multi-store support
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  phone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expenses table (now stores exists)
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id),
  expense_category TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add store_id to existing tables for multi-store support
ALTER TABLE public.inventory ADD COLUMN store_id UUID REFERENCES public.stores(id);
ALTER TABLE public.purchase_invoices ADD COLUMN store_id UUID REFERENCES public.stores(id);
ALTER TABLE public.vendors ADD COLUMN store_id UUID REFERENCES public.stores(id);

-- Create user_stores junction table for user-store access
CREATE TABLE public.user_stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'manager',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, store_id)
);

-- Add RLS policies for stores
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their assigned stores" 
  ON public.stores 
  FOR SELECT 
  USING (
    id IN (
      SELECT store_id FROM public.user_stores WHERE user_id = auth.uid()
    ) OR 
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
    )
  );

CREATE POLICY "Admins can manage all stores" 
  ON public.stores 
  FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
    )
  );

-- Add RLS policies for expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view expenses for their stores" 
  ON public.expenses 
  FOR SELECT 
  USING (
    store_id IN (
      SELECT store_id FROM public.user_stores WHERE user_id = auth.uid()
    ) OR 
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
    )
  );

CREATE POLICY "Users can create expenses for their stores" 
  ON public.expenses 
  FOR INSERT 
  WITH CHECK (
    store_id IN (
      SELECT store_id FROM public.user_stores WHERE user_id = auth.uid()
    ) OR 
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
    )
  );

CREATE POLICY "Users can update expenses for their stores" 
  ON public.expenses 
  FOR UPDATE 
  USING (
    store_id IN (
      SELECT store_id FROM public.user_stores WHERE user_id = auth.uid()
    ) OR 
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
    )
  );

CREATE POLICY "Users can delete expenses for their stores" 
  ON public.expenses 
  FOR DELETE 
  USING (
    store_id IN (
      SELECT store_id FROM public.user_stores WHERE user_id = auth.uid()
    ) OR 
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
    )
  );

-- Add RLS policies for user_stores
ALTER TABLE public.user_stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their store assignments" 
  ON public.user_stores 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
    )
  );

CREATE POLICY "Admins can manage store assignments" 
  ON public.user_stores 
  FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_expenses_updated_at 
  BEFORE UPDATE ON public.expenses 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_stores_updated_at 
  BEFORE UPDATE ON public.stores 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Insert a default store
INSERT INTO public.stores (name, address, city, state, country) 
VALUES ('Main Store', 'Default Address', 'Default City', 'Default State', 'India');
