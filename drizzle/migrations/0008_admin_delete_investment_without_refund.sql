CREATE OR REPLACE FUNCTION public.admin_delete_investment(_investment_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_amount numeric;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Iki gikorwa cyemerewe admin gusa.' USING ERRCODE = '42501';
  END IF;
  SELECT user_id, amount INTO v_user_id, v_amount FROM public.user_investments WHERE id = _investment_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Ishoramari ntiribonetse cyangwa ryamaze gusibwa.';
  END IF;
  PERFORM 1 FROM public.profiles WHERE user_id = v_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Konti y’uyu muntu ntibonetse.'; END IF;
  SELECT amount INTO v_amount FROM public.user_investments WHERE id = _investment_id AND user_id = v_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Ishoramari ryamaze gusibwa.'; END IF;
  UPDATE public.referral_earnings SET source_investment_id = NULL WHERE source_investment_id = _investment_id;
  DELETE FROM public.user_investments WHERE id = _investment_id AND user_id = v_user_id;
  UPDATE public.profiles
  SET main_balance = 0, referral_balance = 0, invested_amount = GREATEST(0, invested_amount - v_amount)
  WHERE user_id = v_user_id;
  RETURN jsonb_build_object('success', true, 'user_id', v_user_id, 'investment_id', _investment_id, 'balance', 0, 'refunded_amount', 0);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_delete_investment(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_investment(uuid) TO authenticated;