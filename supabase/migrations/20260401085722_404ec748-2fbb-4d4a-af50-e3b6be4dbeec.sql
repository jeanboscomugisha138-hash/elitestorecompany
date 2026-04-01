
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  referrer_user_id UUID;
  ref_code TEXT;
  user_phone TEXT;
BEGIN
  ref_code := NEW.raw_user_meta_data->>'referred_by';
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  
  IF ref_code IS NOT NULL AND ref_code != '' THEN
    SELECT user_id INTO referrer_user_id FROM public.profiles WHERE referral_code = ref_code;
  END IF;

  INSERT INTO public.profiles (
    user_id,
    full_name,
    phone,
    main_balance,
    referral_code,
    referred_by
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    user_phone,
    1500,
    public.generate_referral_code(),
    referrer_user_id
  );

  IF user_phone = '0736644205' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$function$;
