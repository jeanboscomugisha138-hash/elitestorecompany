CREATE OR REPLACE FUNCTION public.process_referral_commission()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE l1 UUID; l2 UUID; l3 UUID; c NUMERIC;
BEGIN
  SELECT referred_by INTO l1 FROM public.profiles WHERE user_id = NEW.user_id;
  IF l1 IS NOT NULL THEN
    c := NEW.amount * 0.15;
    INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id) VALUES (l1, NEW.user_id, c, 1, NEW.id);
    UPDATE public.profiles SET main_balance = main_balance + c, referral_balance = referral_balance + c WHERE user_id = l1;
    SELECT referred_by INTO l2 FROM public.profiles WHERE user_id = l1;
    IF l2 IS NOT NULL THEN
      c := NEW.amount * 0.02;
      INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id) VALUES (l2, NEW.user_id, c, 2, NEW.id);
      UPDATE public.profiles SET main_balance = main_balance + c, referral_balance = referral_balance + c WHERE user_id = l2;
      SELECT referred_by INTO l3 FROM public.profiles WHERE user_id = l2;
      IF l3 IS NOT NULL THEN
        c := NEW.amount * 0.01;
        INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id) VALUES (l3, NEW.user_id, c, 3, NEW.id);
        UPDATE public.profiles SET main_balance = main_balance + c, referral_balance = referral_balance + c WHERE user_id = l3;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;