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
};

const DEFAULTS: SiteSettings = {
  payment_phone: '*182*8*1*1978296#',
  payment_name: 'Thacienne',
  whatsapp_group_url: 'https://chat.whatsapp.com/HAWV3a3MW9G8ErOVRRdPSX?s=cl&p=a&ilr=1',
  customer_service_url: 'https://chat.whatsapp.com/HAWV3a3MW9G8ErOVRRdPSX?s=cl&p=a&ilr=1',
  min_deposit: '10000',
  max_deposit: '1000000',
  min_withdraw: '1000',
  max_withdraw: '1000000',
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
