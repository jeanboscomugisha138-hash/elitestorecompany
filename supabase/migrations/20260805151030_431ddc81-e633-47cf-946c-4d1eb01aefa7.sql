ALTER TABLE public.investment_products
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'regular',
  ADD COLUMN IF NOT EXISTS payout_type text NOT NULL DEFAULT 'daily',
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS tier_label text,
  ADD COLUMN IF NOT EXISTS image_key text,
  ADD COLUMN IF NOT EXISTS max_purchases integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS available_until timestamptz,
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

ALTER TABLE public.investment_products
  DROP CONSTRAINT IF EXISTS investment_products_category_check;
ALTER TABLE public.investment_products
  ADD CONSTRAINT investment_products_category_check CHECK (category IN ('regular','compound','bonus'));

ALTER TABLE public.investment_products
  DROP CONSTRAINT IF EXISTS investment_products_payout_type_check;
ALTER TABLE public.investment_products
  ADD CONSTRAINT investment_products_payout_type_check CHECK (payout_type IN ('daily','maturity'));

ALTER TABLE public.user_investments
  ADD COLUMN IF NOT EXISTS payout_type text NOT NULL DEFAULT 'daily';

CREATE OR REPLACE FUNCTION public.process_daily_profits_kigali()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  kigali_today date := (now() AT TIME ZONE 'Africa/Kigali')::date;
  processed_count integer := 0;
  completed_count integer := 0;
  matured_count integer := 0;
BEGIN
  -- 1) Maturity payouts (compound / bonus): capital + all profit at the end
  WITH matured AS (
    UPDATE public.user_investments ui
    SET status = 'completed'
    WHERE ui.status = 'active'
      AND ui.payout_type = 'maturity'
      AND ui.end_date <= now()
    RETURNING ui.user_id, ui.amount, ui.daily_profit,
              GREATEST(1, (ui.end_date::date - ui.start_date::date)) AS days
  ), matured_totals AS (
    SELECT user_id,
           SUM(amount) AS capital,
           SUM(daily_profit * days) AS profit
    FROM matured
    GROUP BY user_id
  ), matured_credit AS (
    UPDATE public.profiles p
    SET main_balance = p.main_balance + t.capital + t.profit,
        total_profit = p.total_profit + t.profit
    FROM matured_totals t
    WHERE p.user_id = t.user_id
    RETURNING p.user_id
  )
  SELECT COUNT(*) INTO matured_count FROM matured_totals;

  -- 2) Close finished daily investments
  UPDATE public.user_investments
  SET status = 'completed'
  WHERE status = 'active'
    AND payout_type = 'daily'
    AND end_date <= now();

  GET DIAGNOSTICS completed_count = ROW_COUNT;

  -- 3) Daily profits (regular products only)
  WITH payable AS (
    UPDATE public.user_investments ui
    SET last_profit_paid_on = kigali_today
    WHERE ui.status = 'active'
      AND ui.payout_type = 'daily'
      AND ui.end_date > now()
      AND (ui.last_profit_paid_on IS NULL OR ui.last_profit_paid_on < kigali_today)
    RETURNING ui.user_id, ui.daily_profit
  ), credited AS (
    UPDATE public.profiles p
    SET
      main_balance = p.main_balance + totals.amount,
      total_profit = p.total_profit + totals.amount
    FROM (
      SELECT user_id, SUM(daily_profit) AS amount
      FROM payable
      GROUP BY user_id
    ) totals
    WHERE p.user_id = totals.user_id
    RETURNING p.user_id
  )
  SELECT COUNT(*) INTO processed_count FROM payable;

  RETURN jsonb_build_object(
    'success', true,
    'kigali_date', kigali_today,
    'processed_count', processed_count,
    'completed_count', completed_count,
    'matured_count', matured_count
  );
END;
$function$;