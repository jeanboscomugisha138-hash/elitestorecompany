
CREATE TABLE public.ambassador_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tier text NOT NULL,
  amount numeric NOT NULL,
  referrals_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, tier)
);

GRANT SELECT ON public.ambassador_claims TO authenticated;
GRANT ALL ON public.ambassador_claims TO service_role;

ALTER TABLE public.ambassador_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own claims"
ON public.ambassador_claims FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all claims"
ON public.ambassador_claims FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Qualifying direct referrals count for a given minimum invested amount
CREATE OR REPLACE FUNCTION public.count_qualified_referrals(_user_id uuid, _min_invested numeric)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int
  FROM public.profiles p
  WHERE p.referred_by = _user_id
    AND p.invested_amount >= _min_invested
$$;

-- Ambassador progress for the current user
CREATE OR REPLACE FUNCTION public.get_ambassador_progress()
RETURNS TABLE(tier text, required_referrals integer, min_invested numeric, reward_amount numeric, qualified integer, claimed boolean)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.tier, t.required_referrals, t.min_invested, t.reward_amount,
         public.count_qualified_referrals(auth.uid(), t.min_invested) AS qualified,
         EXISTS (SELECT 1 FROM public.ambassador_claims c WHERE c.user_id = auth.uid() AND c.tier = t.tier) AS claimed
  FROM (VALUES
    ('bronze', 5, 50000::numeric, 10000::numeric),
    ('silver', 10, 50000::numeric, 20000::numeric),
    ('gold', 20, 50000::numeric, 80000::numeric),
    ('diamond', 30, 150000::numeric, 200000::numeric)
  ) AS t(tier, required_referrals, min_invested, reward_amount)
$$;

-- Secure claim
CREATE OR REPLACE FUNCTION public.claim_ambassador_reward(_tier text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  req integer;
  min_inv numeric;
  reward numeric;
  qualified integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Ntabwo winjiye muri konti yawe.';
  END IF;

  SELECT t.required_referrals, t.min_invested, t.reward_amount
  INTO req, min_inv, reward
  FROM (VALUES
    ('bronze', 5, 50000::numeric, 10000::numeric),
    ('silver', 10, 50000::numeric, 20000::numeric),
    ('gold', 20, 50000::numeric, 80000::numeric),
    ('diamond', 30, 150000::numeric, 200000::numeric)
  ) AS t(tier, required_referrals, min_invested, reward_amount)
  WHERE t.tier = _tier;

  IF req IS NULL THEN
    RAISE EXCEPTION 'Igihembo ntikizwi.';
  END IF;

  PERFORM 1 FROM public.profiles WHERE user_id = uid FOR UPDATE;

  qualified := public.count_qualified_referrals(uid, min_inv);

  IF qualified < req THEN
    RAISE EXCEPTION 'Nturauzuza ibisabwa: ukeneye % ba nshuti bashoye byibura % RWF (ufite %).', req, min_inv, qualified;
  END IF;

  IF EXISTS (SELECT 1 FROM public.ambassador_claims WHERE user_id = uid AND tier = _tier) THEN
    RAISE EXCEPTION 'Iki gihembo wamaze kugifata.';
  END IF;

  INSERT INTO public.ambassador_claims (user_id, tier, amount, referrals_count)
  VALUES (uid, _tier, reward, qualified);

  UPDATE public.profiles
  SET main_balance = main_balance + reward
  WHERE user_id = uid;

  RETURN jsonb_build_object('success', true, 'tier', _tier, 'amount', reward, 'qualified', qualified);
END;
$$;

REVOKE ALL ON FUNCTION public.claim_ambassador_reward(text) FROM public;
GRANT EXECUTE ON FUNCTION public.claim_ambassador_reward(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_ambassador_progress() TO authenticated;
GRANT EXECUTE ON FUNCTION public.count_qualified_referrals(uuid, numeric) TO authenticated;
