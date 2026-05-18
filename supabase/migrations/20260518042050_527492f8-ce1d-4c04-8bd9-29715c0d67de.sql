
DO $$
DECLARE
  admin_uid uuid;
BEGIN
  SELECT user_id INTO admin_uid FROM public.profiles WHERE phone = '0736644205' LIMIT 1;

  -- Delete all dependent data for non-admin users
  DELETE FROM public.daily_bonuses WHERE user_id IS DISTINCT FROM admin_uid;
  DELETE FROM public.referral_earnings WHERE user_id IS DISTINCT FROM admin_uid OR from_user_id IS DISTINCT FROM admin_uid;
  DELETE FROM public.user_investments WHERE user_id IS DISTINCT FROM admin_uid;
  DELETE FROM public.deposit_transactions WHERE user_id IS DISTINCT FROM admin_uid;
  DELETE FROM public.withdrawal_transactions WHERE user_id IS DISTINCT FROM admin_uid;
  DELETE FROM public.gift_code_redemptions WHERE user_id IS DISTINCT FROM admin_uid;
  DELETE FROM public.user_roles WHERE user_id IS DISTINCT FROM admin_uid;
  UPDATE public.profiles SET referred_by = NULL WHERE referred_by IS NOT NULL AND referred_by != admin_uid;
  DELETE FROM public.profiles WHERE user_id IS DISTINCT FROM admin_uid;
  DELETE FROM auth.users WHERE id IS DISTINCT FROM admin_uid;

  -- Reset admin balances
  IF admin_uid IS NOT NULL THEN
    UPDATE public.profiles
    SET main_balance = 0, referral_balance = 0, invested_amount = 0, total_profit = 0, referred_by = NULL
    WHERE user_id = admin_uid;

    -- Ensure admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_uid, 'admin')
    ON CONFLICT DO NOTHING;
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_uid, 'user')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
