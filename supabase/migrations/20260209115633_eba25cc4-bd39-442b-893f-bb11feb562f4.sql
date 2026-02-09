
-- 1. Trigger to auto-deduct main_balance when a withdrawal is created
CREATE OR REPLACE FUNCTION public.handle_withdrawal_deduction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.profiles
  SET main_balance = main_balance - NEW.amount
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_withdrawal_deduct_balance
AFTER INSERT ON public.withdrawal_transactions
FOR EACH ROW
EXECUTE FUNCTION public.handle_withdrawal_deduction();

-- 2. Update referral commission function to credit main_balance instead of referral_balance
CREATE OR REPLACE FUNCTION public.process_referral_commission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  level1_referrer_id UUID;
  level2_referrer_id UUID;
  level3_referrer_id UUID;
  level1_commission NUMERIC;
  level2_commission NUMERIC;
  level3_commission NUMERIC;
BEGIN
  SELECT referred_by INTO level1_referrer_id
  FROM public.profiles
  WHERE user_id = NEW.user_id;

  IF level1_referrer_id IS NOT NULL THEN
    level1_commission := NEW.amount * 0.15;
    
    INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id)
    VALUES (level1_referrer_id, NEW.user_id, level1_commission, 1, NEW.id);
    
    UPDATE public.profiles
    SET main_balance = main_balance + level1_commission,
        referral_balance = referral_balance + level1_commission
    WHERE user_id = level1_referrer_id;

    SELECT referred_by INTO level2_referrer_id
    FROM public.profiles
    WHERE user_id = level1_referrer_id;

    IF level2_referrer_id IS NOT NULL THEN
      level2_commission := NEW.amount * 0.04;
      
      INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id)
      VALUES (level2_referrer_id, NEW.user_id, level2_commission, 2, NEW.id);
      
      UPDATE public.profiles
      SET main_balance = main_balance + level2_commission,
          referral_balance = referral_balance + level2_commission
      WHERE user_id = level2_referrer_id;

      SELECT referred_by INTO level3_referrer_id
      FROM public.profiles
      WHERE user_id = level2_referrer_id;

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
$$;
