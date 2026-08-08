CREATE OR REPLACE FUNCTION public.enforce_investment_payout_type()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  p_payout text;
BEGIN
  SELECT payout_type INTO p_payout FROM public.investment_products WHERE id = NEW.product_id;
  IF p_payout IS NOT NULL THEN
    NEW.payout_type := p_payout;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_investment_payout_type_trg ON public.user_investments;
CREATE TRIGGER enforce_investment_payout_type_trg
BEFORE INSERT ON public.user_investments
FOR EACH ROW EXECUTE FUNCTION public.enforce_investment_payout_type();