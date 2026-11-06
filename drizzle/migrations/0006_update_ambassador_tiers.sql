CREATE OR REPLACE FUNCTION public.get_ambassador_progress()
 RETURNS TABLE(tier text, required_referrals integer, min_invested numeric, reward_amount numeric, qualified integer, claimed boolean)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT t.tier, t.required_referrals, t.min_invested, t.reward_amount,
         public.count_qualified_referrals(auth.uid(), t.min_invested) AS qualified,
         EXISTS (SELECT 1 FROM public.ambassador_claims c WHERE c.user_id = auth.uid() AND c.tier = t.tier) AS claimed
  FROM (VALUES
    ('bronze', 3, 10000::numeric, 1500::numeric),
    ('silver', 7, 30000::numeric, 5000::numeric),
    ('gold', 15, 50000::numeric, 15000::numeric),
    ('diamond', 30, 100000::numeric, 80000::numeric)
  ) AS t(tier, required_referrals, min_invested, reward_amount)
$function$;

CREATE OR REPLACE FUNCTION public.claim_ambassador_reward(_tier text)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  uid uuid := auth.uid();
  req integer; min_inv numeric; reward numeric; qualified integer;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Ntabwo winjiye muri konti yawe.'; END IF;
  SELECT t.required_referrals, t.min_invested, t.reward_amount INTO req, min_inv, reward
  FROM (VALUES
    ('bronze', 3, 10000::numeric, 1500::numeric),
    ('silver', 7, 30000::numeric, 5000::numeric),
    ('gold', 15, 50000::numeric, 15000::numeric),
    ('diamond', 30, 100000::numeric, 80000::numeric)
  ) AS t(tier, required_referrals, min_invested, reward_amount)
  WHERE t.tier = _tier;
  IF req IS NULL THEN RAISE EXCEPTION 'Igihembo ntikizwi.'; END IF;
  PERFORM 1 FROM public.profiles WHERE user_id = uid FOR UPDATE;
  qualified := public.count_qualified_referrals(uid, min_inv);
  IF qualified < req THEN
    RAISE EXCEPTION 'Nturauzuza ibisabwa: ukeneye % ba nshuti bashoye byibura % RWF (ufite %).', req, min_inv, qualified;
  END IF;
  IF EXISTS (SELECT 1 FROM public.ambassador_claims WHERE user_id = uid AND tier = _tier) THEN
    RAISE EXCEPTION 'Iki gihembo wamaze kugifata.';
  END IF;
  INSERT INTO public.ambassador_claims (user_id, tier, amount, referrals_count) VALUES (uid, _tier, reward, qualified);
  UPDATE public.profiles SET main_balance = main_balance + reward WHERE user_id = uid;
  RETURN jsonb_build_object('success', true, 'tier', _tier, 'amount', reward, 'qualified', qualified);
END;
$function$;