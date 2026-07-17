
INSERT INTO public.site_settings(key,value) VALUES ('min_withdraw_first','1000')
ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
UPDATE public.site_settings SET value='3000' WHERE key='min_withdraw';
