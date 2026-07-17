import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SiteSettings = {
  payment_phone: string;
  payment_name: string;
  whatsapp_group_url: string;
  customer_service_url: string;
  min_deposit: string;
  max_deposit: string;
  min_withdraw: string;
  max_withdraw: string;
  withdraw_start_hour: string;
  withdraw_end_hour: string;
  announcements: string;
};

const DEFAULTS: SiteSettings = {
  payment_phone: '*182*8*1*1978296#',
  payment_name: 'Thacienne',
  whatsapp_group_url: 'https://chat.whatsapp.com/HAWV3a3MW9G8ErOVRRdPSX?s=cl&p=a&ilr=1',
  customer_service_url: 'https://t.me/+12052657574',
  min_deposit: '10000',
  max_deposit: '1000000',
  min_withdraw: '1000',
  max_withdraw: '1000000',
  withdraw_start_hour: '7',
  withdraw_end_hour: '22',
  announcements: [
    'Welcome to PETANE SHIPPING!',
    'Registration BONUS: 1,000 RWF',
    'Withdrawal hours: 07:00 - 22:00 daily',
    'Daily profit: 7.14% VIP 1 (30 days) · 7% VIP 2-4 (50 days) · 7.5% VIP 5-7 (90 days) · 8% VIP 8-10 (365 days)',
    'If you have any problem, please contact online customer services.',
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
          (merged as any)[row.key] = row.value;
        }
        setSettings(merged);
      }
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  return { settings, loading };
}
