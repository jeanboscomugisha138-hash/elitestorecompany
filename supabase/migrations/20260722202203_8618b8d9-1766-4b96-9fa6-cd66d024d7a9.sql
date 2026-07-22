CREATE OR REPLACE FUNCTION public.process_daily_profits_kigali()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  kigali_today date := (now() AT TIME ZONE 'Africa/Kigali')::date;
  processed_count integer := 0;
  completed_count integer := 0;
BEGIN
  UPDATE public.user_investments
  SET status = 'completed'
  WHERE status = 'active'
    AND end_date <= now();

  GET DIAGNOSTICS completed_count = ROW_COUNT;

  WITH payable AS (
    UPDATE public.user_investments ui
    SET last_profit_paid_on = kigali_today
    WHERE ui.status = 'active'
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
    'completed_count', completed_count
  );
END;
$$;

REVOKE ALL ON FUNCTION public.process_daily_profits_kigali() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.process_daily_profits_kigali() FROM anon;
REVOKE ALL ON FUNCTION public.process_daily_profits_kigali() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.process_daily_profits_kigali() TO service_role;