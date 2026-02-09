
CREATE OR REPLACE FUNCTION public.get_team_members(_user_id UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  invested_amount NUMERIC,
  created_at TIMESTAMPTZ,
  level INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Level 1: direct referrals
  SELECT p.id, p.full_name, p.invested_amount, p.created_at, 1 AS level
  FROM public.profiles p
  WHERE p.referred_by = _user_id

  UNION ALL

  -- Level 2: referrals of level 1
  SELECT p2.id, p2.full_name, p2.invested_amount, p2.created_at, 2 AS level
  FROM public.profiles p1
  JOIN public.profiles p2 ON p2.referred_by = p1.user_id
  WHERE p1.referred_by = _user_id

  UNION ALL

  -- Level 3: referrals of level 2
  SELECT p3.id, p3.full_name, p3.invested_amount, p3.created_at, 3 AS level
  FROM public.profiles p1
  JOIN public.profiles p2 ON p2.referred_by = p1.user_id
  JOIN public.profiles p3 ON p3.referred_by = p2.user_id
  WHERE p1.referred_by = _user_id
$$;
