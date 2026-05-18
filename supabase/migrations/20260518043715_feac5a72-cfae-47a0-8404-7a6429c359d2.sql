
-- Remove 6500 product
DELETE FROM public.investment_products WHERE investment_amount = 6500;

-- Update all products to 20% daily
UPDATE public.investment_products SET daily_profit_rate = 0.20;

-- Update referral commission function: L1 = 30%
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
  level1_commission NUMERIC;
  level2_commission NUMERIC;
  level3_commission NUMERIC;
BEGIN
  SELECT referred_by INTO level1_referrer_id FROM public.profiles WHERE user_id = NEW.user_id;

  IF level1_referrer_id IS NOT NULL THEN
    level1_commission := NEW.amount * 0.30;
    INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id)
    VALUES (level1_referrer_id, NEW.user_id, level1_commission, 1, NEW.id);
    UPDATE public.profiles
    SET main_balance = main_balance + level1_commission,
        referral_balance = referral_balance + level1_commission
    WHERE user_id = level1_referrer_id;

    SELECT referred_by INTO level2_referrer_id FROM public.profiles WHERE user_id = level1_referrer_id;
    IF level2_referrer_id IS NOT NULL THEN
      level2_commission := NEW.amount * 0.04;
      INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id)
      VALUES (level2_referrer_id, NEW.user_id, level2_commission, 2, NEW.id);
      UPDATE public.profiles
      SET main_balance = main_balance + level2_commission,
          referral_balance = referral_balance + level2_commission
      WHERE user_id = level2_referrer_id;

      SELECT referred_by INTO level3_referrer_id FROM public.profiles WHERE user_id = level2_referrer_id;
      IF level3_referrer_id IS NOT NULL THEN
        level3_commission := NEW.amount * 0.01;
        INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id)
        VALUES (level3_referrer_id, NEW.user_id, level3_commission, 3, NEW.id);
        UPDATE public.profiles
        SET main_balance = main_balance + level3_commission,
            referral_balance = referral_balance + level3_commission
        WHERE user_id = level3_referrer_id;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

-- Ensure admin role for 0736644205
DO $$
DECLARE admin_uid UUID;
BEGIN
  SELECT user_id INTO admin_uid FROM public.profiles WHERE phone = '0736644205' LIMIT 1;
  IF admin_uid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (admin_uid, 'admin') ON CONFLICT DO NOTHING;
    INSERT INTO public.user_roles (user_id, role) VALUES (admin_uid, 'user') ON CONFLICT DO NOTHING;
  END IF;
END $$;
