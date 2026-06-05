
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site settings"
  ON public.site_settings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (key, value) VALUES
  ('payment_phone', '*182*8*1*1978296#'),
  ('payment_name', 'Thacienne'),
  ('whatsapp_group_url', 'https://chat.whatsapp.com/HAWV3a3MW9G8ErOVRRdPSX?s=cl&p=a&ilr=1'),
  ('customer_service_url', 'https://chat.whatsapp.com/HAWV3a3MW9G8ErOVRRdPSX?s=cl&p=a&ilr=1'),
  ('min_deposit', '10000'),
  ('max_deposit', '1000000'),
  ('min_withdraw', '1000'),
  ('max_withdraw', '1000000');
