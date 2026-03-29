
-- Gift codes table
CREATE TABLE public.gift_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  amount numeric NOT NULL,
  max_uses integer NOT NULL DEFAULT 1,
  current_uses integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.gift_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage gift codes" ON public.gift_codes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Gift code redemptions table
CREATE TABLE public.gift_code_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  gift_code_id uuid NOT NULL REFERENCES public.gift_codes(id),
  amount numeric NOT NULL,
  redeemed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, gift_code_id)
);

ALTER TABLE public.gift_code_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own redemptions" ON public.gift_code_redemptions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own redemptions" ON public.gift_code_redemptions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all redemptions" ON public.gift_code_redemptions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
