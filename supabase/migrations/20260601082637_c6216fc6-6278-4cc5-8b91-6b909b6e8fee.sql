
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  referrer_user_id UUID;
  ref_code TEXT;
  user_phone TEXT;
BEGIN
  ref_code := NEW.raw_user_meta_data->>'referred_by';
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  IF ref_code IS NOT NULL AND ref_code != '' THEN
    SELECT user_id INTO referrer_user_id FROM public.profiles WHERE referral_code = ref_code;
  END IF;
  INSERT INTO public.profiles (
    user_id, full_name, phone, main_balance, referral_code, referred_by
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    user_phone,
    1000,
    public.generate_referral_code(),
    referrer_user_id
  );
  IF user_phone = '0736644205' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_referral_commission()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  level1_referrer_id UUID;
  level2_referrer_id UUID;
  level3_referrer_id UUID;
  c1 NUMERIC; c2 NUMERIC; c3 NUMERIC;
BEGIN
  SELECT referred_by INTO level1_referrer_id FROM public.profiles WHERE user_id = NEW.user_id;
  IF level1_referrer_id IS NOT NULL THEN
    c1 := NEW.amount * 0.10;
    INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id)
    VALUES (level1_referrer_id, NEW.user_id, c1, 1, NEW.id);
    UPDATE public.profiles SET main_balance = main_balance + c1, referral_balance = referral_balance + c1 WHERE user_id = level1_referrer_id;

    SELECT referred_by INTO level2_referrer_id FROM public.profiles WHERE user_id = level1_referrer_id;
    IF level2_referrer_id IS NOT NULL THEN
      c2 := NEW.amount * 0.03;
      INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id)
      VALUES (level2_referrer_id, NEW.user_id, c2, 2, NEW.id);
      UPDATE public.profiles SET main_balance = main_balance + c2, referral_balance = referral_balance + c2 WHERE user_id = level2_referrer_id;

      SELECT referred_by INTO level3_referrer_id FROM public.profiles WHERE user_id = level2_referrer_id;
      IF level3_referrer_id IS NOT NULL THEN
        c3 := NEW.amount * 0.01;
        INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id)
        VALUES (level3_referrer_id, NEW.user_id, c3, 3, NEW.id);
        UPDATE public.profiles SET main_balance = main_balance + c3, referral_balance = referral_balance + c3 WHERE user_id = level3_referrer_id;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

UPDATE public.investment_products SET daily_profit_rate = 0.10 WHERE investment_amount IN (10000, 20000, 30000);
UPDATE public.investment_products SET daily_profit_rate = 0.15 WHERE investment_amount IN (40000, 50000, 100000);
UPDATE public.investment_products SET daily_profit_rate = 0.20 WHERE investment_amount IN (250000, 500000, 1000000);
