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
    2000,
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

CREATE OR REPLACE FUNCTION public.require_investment_before_withdrawal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_invested NUMERIC;
BEGIN
  SELECT COALESCE(invested_amount, 0) INTO v_invested
  FROM public.profiles
  WHERE user_id = NEW.user_id;
  IF COALESCE(v_invested, 0) <= 0 THEN
    RAISE EXCEPTION 'Kugira ngo ubikuze amafaranga, ugomba kubanza kugura umushinga. Bonus ntibikuza itaraneshwa.';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS require_investment_before_withdrawal_trg ON public.withdrawal_transactions;
CREATE TRIGGER require_investment_before_withdrawal_trg
BEFORE INSERT ON public.withdrawal_transactions
FOR EACH ROW
EXECUTE FUNCTION public.require_investment_before_withdrawal();