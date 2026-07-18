
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS withdraw_name text;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_withdraw_phone_unique
  ON public.profiles (withdraw_phone)
  WHERE withdraw_phone IS NOT NULL;

CREATE OR REPLACE FUNCTION public.enforce_withdraw_account_immutable()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  IF OLD.withdraw_phone IS NOT NULL AND NEW.withdraw_phone IS DISTINCT FROM OLD.withdraw_phone THEN
    RAISE EXCEPTION 'Konti yo kwakira ntishobora guhindurwa cyangwa gusibwa.';
  END IF;

  IF OLD.withdraw_name IS NOT NULL AND NEW.withdraw_name IS DISTINCT FROM OLD.withdraw_name THEN
    RAISE EXCEPTION 'Amazina yo kwakira ntashobora guhindurwa.';
  END IF;

  IF OLD.withdraw_password IS NOT NULL AND NEW.withdraw_password IS DISTINCT FROM OLD.withdraw_password THEN
    RAISE EXCEPTION 'Ijambobanga ryo kwakira ntirishobora guhindurwa.';
  END IF;

  RETURN NEW;
END;
$$;
