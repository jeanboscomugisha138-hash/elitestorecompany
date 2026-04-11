
CREATE OR REPLACE FUNCTION public.handle_deposit_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only process when status changes from 'pending' to 'approved'
  IF OLD.status = 'pending' AND NEW.status = 'approved' THEN
    UPDATE public.profiles
    SET main_balance = main_balance + NEW.amount
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_deposit_approved
  BEFORE UPDATE ON public.deposit_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_deposit_approval();
