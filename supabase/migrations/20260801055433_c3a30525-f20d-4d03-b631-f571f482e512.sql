ALTER TABLE public.withdrawal_transactions
  ADD COLUMN IF NOT EXISTS fee_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS net_amount numeric NOT NULL DEFAULT 0;

INSERT INTO public.site_settings (key, value)
VALUES ('withdraw_fee_percent', '10')
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.set_withdrawal_net_amounts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  fee_pct numeric := 10;
BEGIN
  SELECT COALESCE(NULLIF(value, '')::numeric, 10) INTO fee_pct
  FROM public.site_settings WHERE key = 'withdraw_fee_percent';

  IF fee_pct IS NULL OR fee_pct < 0 OR fee_pct > 100 THEN
    fee_pct := 10;
  END IF;

  NEW.fee_amount := ROUND(NEW.amount * fee_pct / 100);
  NEW.net_amount := NEW.amount - NEW.fee_amount;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_withdrawal_net_amounts_trg ON public.withdrawal_transactions;
CREATE TRIGGER set_withdrawal_net_amounts_trg
BEFORE INSERT ON public.withdrawal_transactions
FOR EACH ROW EXECUTE FUNCTION public.set_withdrawal_net_amounts();

UPDATE public.withdrawal_transactions
SET fee_amount = ROUND(amount * 0.1),
    net_amount = amount - ROUND(amount * 0.1)
WHERE net_amount = 0;