DROP FUNCTION IF EXISTS public.get_team_members(uuid);
CREATE FUNCTION public.get_team_members(_user_id uuid)
RETURNS TABLE(id uuid, full_name text, phone text, invested_amount numeric, created_at timestamptz, level integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT * FROM (
    SELECT p.id, p.full_name, p.phone, p.invested_amount, p.created_at, 1 AS level
    FROM public.profiles p WHERE p.referred_by = _user_id
    UNION ALL
    SELECT p2.id, p2.full_name, p2.phone, p2.invested_amount, p2.created_at, 2
    FROM public.profiles p1 JOIN public.profiles p2 ON p2.referred_by = p1.user_id
    WHERE p1.referred_by = _user_id
    UNION ALL
    SELECT p3.id, p3.full_name, p3.phone, p3.invested_amount, p3.created_at, 3
    FROM public.profiles p1 JOIN public.profiles p2 ON p2.referred_by = p1.user_id
    JOIN public.profiles p3 ON p3.referred_by = p2.user_id
    WHERE p1.referred_by = _user_id
  ) t
  WHERE _user_id = auth.uid() OR public.has_role(auth.uid(), 'admin');
$$;
GRANT EXECUTE ON FUNCTION public.get_team_members(uuid) TO authenticated;