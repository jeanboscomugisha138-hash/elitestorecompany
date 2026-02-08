-- Create app_role enum for admin system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  main_balance NUMERIC DEFAULT 0 NOT NULL,
  referral_balance NUMERIC DEFAULT 0 NOT NULL,
  invested_amount NUMERIC DEFAULT 0 NOT NULL,
  total_profit NUMERIC DEFAULT 0 NOT NULL,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES auth.users(id),
  last_bonus_claim TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create investment_products table
CREATE TABLE public.investment_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_amount NUMERIC NOT NULL,
  daily_profit_rate NUMERIC NOT NULL DEFAULT 0.30,
  duration_days INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_investments table
CREATE TABLE public.user_investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.investment_products(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  daily_profit NUMERIC NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deposit_transactions table
CREATE TABLE public.deposit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phone TEXT NOT NULL,
  full_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create withdrawal_transactions table
CREATE TABLE public.withdrawal_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phone TEXT NOT NULL,
  full_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_bonuses table
CREATE TABLE public.daily_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 50,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referral_earnings table
CREATE TABLE public.referral_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 3),
  amount NUMERIC NOT NULL,
  source_investment_id UUID REFERENCES public.user_investments(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_earnings ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    code := upper(substr(md5(random()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  RETURN code;
END;
$$;

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_user_id UUID;
  ref_code TEXT;
BEGIN
  -- Get referral code from metadata
  ref_code := NEW.raw_user_meta_data->>'referred_by';
  
  -- Find referrer if code provided
  IF ref_code IS NOT NULL AND ref_code != '' THEN
    SELECT user_id INTO referrer_user_id FROM public.profiles WHERE referral_code = ref_code;
  END IF;

  INSERT INTO public.profiles (
    user_id,
    full_name,
    phone,
    main_balance,
    referral_code,
    referred_by
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    1500, -- Welcome bonus
    public.generate_referral_code(),
    referrer_user_id
  );

  -- Create default user role
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_investment_products_updated_at BEFORE UPDATE ON public.investment_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_investments_updated_at BEFORE UPDATE ON public.user_investments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_deposit_transactions_updated_at BEFORE UPDATE ON public.deposit_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_withdrawal_transactions_updated_at BEFORE UPDATE ON public.withdrawal_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for investment_products
CREATE POLICY "Anyone can view active products" ON public.investment_products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON public.investment_products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_investments
CREATE POLICY "Users can view their own investments" ON public.user_investments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create investments" ON public.user_investments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all investments" ON public.user_investments FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for deposit_transactions
CREATE POLICY "Users can view their own deposits" ON public.deposit_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create deposits" ON public.deposit_transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all deposits" ON public.deposit_transactions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for withdrawal_transactions
CREATE POLICY "Users can view their own withdrawals" ON public.withdrawal_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create withdrawals" ON public.withdrawal_transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all withdrawals" ON public.withdrawal_transactions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for daily_bonuses
CREATE POLICY "Users can view their own bonuses" ON public.daily_bonuses FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can claim bonuses" ON public.daily_bonuses FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all bonuses" ON public.daily_bonuses FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for referral_earnings
CREATE POLICY "Users can view their own earnings" ON public.referral_earnings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all earnings" ON public.referral_earnings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Insert default products
INSERT INTO public.investment_products (investment_amount, daily_profit_rate, duration_days) VALUES
  (10000, 0.30, 30),
  (20000, 0.30, 30),
  (30000, 0.30, 30),
  (40000, 0.30, 30),
  (50000, 0.30, 30),
  (100000, 0.30, 30),
  (250000, 0.30, 30),
  (500000, 0.30, 30),
  (1000000, 0.30, 30);