
-- Block duplicate pending deposits
CREATE OR REPLACE FUNCTION public.prevent_duplicate_pending_deposit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'pending' AND EXISTS (
    SELECT 1 FROM public.deposit_transactions d
    WHERE d.user_id = NEW.user_id AND d.status = 'pending'
  ) THEN
    RAISE EXCEPTION 'Ufite ubwishyu bugitegereje kwemezwa. Tegereza bwemezwe mbere yo gukora ubundi.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_duplicate_pending_deposit_trg ON public.deposit_transactions;
CREATE TRIGGER prevent_duplicate_pending_deposit_trg
BEFORE INSERT ON public.deposit_transactions
FOR EACH ROW EXECUTE FUNCTION public.prevent_duplicate_pending_deposit();

-- Block duplicate pending withdrawals
CREATE OR REPLACE FUNCTION public.prevent_duplicate_pending_withdrawal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'pending' AND EXISTS (
    SELECT 1 FROM public.withdrawal_transactions w
    WHERE w.user_id = NEW.user_id AND w.status = 'pending'
  ) THEN
    RAISE EXCEPTION 'Ufite ibikuza bigitegereje kwemezwa. Tegereza byemezwe mbere yo gukora ibindi.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_duplicate_pending_withdrawal_trg ON public.withdrawal_transactions;
CREATE TRIGGER prevent_duplicate_pending_withdrawal_trg
BEFORE INSERT ON public.withdrawal_transactions
FOR EACH ROW EXECUTE FUNCTION public.prevent_duplicate_pending_withdrawal();

-- Safe balance deduction: never allow negative balance
CREATE OR REPLACE FUNCTION public.handle_withdrawal_deduction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  updated_rows integer;
BEGIN
  UPDATE public.profiles
  SET main_balance = main_balance - NEW.amount
  WHERE user_id = NEW.user_id
    AND main_balance >= NEW.amount;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;

  IF updated_rows = 0 THEN
    RAISE EXCEPTION 'Ntufite amafaranga ahagije kuri konti yawe.';
  END IF;

  RETURN NEW;
END;
$$;

-- Deposit approval: only credit once (guard against repeated approvals)
CREATE OR REPLACE FUNCTION public.handle_deposit_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status = 'approved' THEN
    UPDATE public.profiles
    SET main_balance = main_balance + NEW.amount
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;
