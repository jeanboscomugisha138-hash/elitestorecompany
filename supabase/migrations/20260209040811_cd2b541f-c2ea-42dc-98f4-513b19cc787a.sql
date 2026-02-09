-- Create a function to process referral commissions when an investment is made
CREATE OR REPLACE FUNCTION public.process_referral_commission()
RETURNS TRIGGER
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
  -- Get Level 1 referrer (direct referrer)
  SELECT referred_by INTO level1_referrer_id
  FROM public.profiles
  WHERE user_id = NEW.user_id;

  IF level1_referrer_id IS NOT NULL THEN
    -- Calculate 15% commission for Level 1
    level1_commission := NEW.amount * 0.15;
    
    -- Insert referral earning record
    INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id)
    VALUES (level1_referrer_id, NEW.user_id, level1_commission, 1, NEW.id);
    
    -- Update referrer's referral_balance
    UPDATE public.profiles
    SET referral_balance = referral_balance + level1_commission
    WHERE user_id = level1_referrer_id;

    -- Get Level 2 referrer
    SELECT referred_by INTO level2_referrer_id
    FROM public.profiles
    WHERE user_id = level1_referrer_id;

    IF level2_referrer_id IS NOT NULL THEN
      -- Calculate 4% commission for Level 2
      level2_commission := NEW.amount * 0.04;
      
      INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id)
      VALUES (level2_referrer_id, NEW.user_id, level2_commission, 2, NEW.id);
      
      UPDATE public.profiles
      SET referral_balance = referral_balance + level2_commission
      WHERE user_id = level2_referrer_id;

      -- Get Level 3 referrer
      SELECT referred_by INTO level3_referrer_id
      FROM public.profiles
      WHERE user_id = level2_referrer_id;

      IF level3_referrer_id IS NOT NULL THEN
        -- Calculate 1% commission for Level 3
        level3_commission := NEW.amount * 0.01;
        
        INSERT INTO public.referral_earnings (user_id, from_user_id, amount, level, source_investment_id)
        VALUES (level3_referrer_id, NEW.user_id, level3_commission, 3, NEW.id);
        
        UPDATE public.profiles
        SET referral_balance = referral_balance + level3_commission
        WHERE user_id = level3_referrer_id;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for processing referral commissions on new investments
DROP TRIGGER IF EXISTS process_referral_on_investment ON public.user_investments;
CREATE TRIGGER process_referral_on_investment
  AFTER INSERT ON public.user_investments
  FOR EACH ROW
  EXECUTE FUNCTION public.process_referral_commission();