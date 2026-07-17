
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS withdraw_phone TEXT,
  ADD COLUMN IF NOT EXISTS withdraw_password TEXT;

CREATE OR REPLACE FUNCTION public.enforce_withdraw_account_immutable()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admins can always modify
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  IF OLD.withdraw_phone IS NOT NULL AND NEW.withdraw_phone IS DISTINCT FROM OLD.withdraw_phone THEN
    RAISE EXCEPTION 'Konti yo kwakira ntishobora guhindurwa cyangwa gusibwa.';
  END IF;

  IF OLD.withdraw_password IS NOT NULL AND NEW.withdraw_password IS DISTINCT FROM OLD.withdraw_password THEN
    RAISE EXCEPTION 'Ijambobanga ryo kwakira ntirishobora guhindurwa.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_withdraw_account_immutable_trg ON public.profiles;
CREATE TRIGGER enforce_withdraw_account_immutable_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.enforce_withdraw_account_immutable();
