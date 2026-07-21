import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SiteSettings = {
  payment_phone: string;
  payment_name: string;
  whatsapp_group_url: string;
  customer_service_url: string;
  telegram_admin_url: string;
  telegram_group_url: string;
  telegram_meeting_url: string;
  min_deposit: string;
  max_deposit: string;
  min_withdraw: string;
  min_withdraw_first: string;
  max_withdraw: string;
  withdraw_start_hour: string;
  withdraw_end_hour: string;
  announcements: string;
};

const DEFAULTS: SiteSettings = {
  payment_phone: '0799599856',
  payment_name: 'Cedric KWIBUKWANIMANA',
  whatsapp_group_url: 'https://t.me/+SS_wfux-pzI0OTRh',
  customer_service_url: 'https://t.me/petaneshipping',
  telegram_admin_url: 'https://t.me/petaneshipping',
  telegram_group_url: 'https://t.me/+SS_wfux-pzI0OTRh',
  telegram_meeting_url: 'https://t.me/+SS_wfux-pzI0OTRh',
  min_deposit: '3500',
  max_deposit: '2000000',
  min_withdraw: '3000',
  min_withdraw_first: '1000',
  max_withdraw: '1000000',
  withdraw_start_hour: '7',
  withdraw_end_hour: '22',
  announcements: [
    'Welcome to PETANE SHIPPING!',
  ].join('\n'),
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.from('site_settings').select('key, value');
      if (mounted && data) {
        const merged = { ...DEFAULTS };
        for (const row of data as { key: string; value: string }[]) {
          if (row.value) (merged as any)[row.key] = row.value;
        }
        setSettings(merged);
      }
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  return { settings, loading };
}
