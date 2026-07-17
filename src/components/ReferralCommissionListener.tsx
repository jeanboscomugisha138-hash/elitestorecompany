import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PopupModal } from './PopupModal';
import { Users, CheckCircle2 } from 'lucide-react';

interface CommissionData {
  amount: number;
  level: number;
}

export function ReferralCommissionListener() {
  const { user, refreshProfile } = useAuth();
  const [commission, setCommission] = useState<CommissionData | null>(null);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('referral-commissions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'referral_earnings',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const { amount, level } = payload.new as { amount: number; level: number };
          setCommission({ amount, level });
          refreshProfile();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const levelLabels: Record<number, string> = {
    1: 'Urwego rwa 1 (10%)',
    2: 'Urwego rwa 2 (3%)',
    3: 'Urwego rwa 3 (1%)',
  };

  return (
    <PopupModal isOpen={!!commission} onClose={() => setCommission(null)} accent="success">
      {commission && (
        <>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Komisiyo Nshya</span>
              </div>
              <h3 className="text-lg font-black text-foreground leading-tight">Wabonye Komisiyo</h3>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-muted/60 px-4 py-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Amafaranga wakiriye</span>
              <span className="text-xl font-black text-foreground tabular-nums">
                +{commission.amount.toLocaleString()} <span className="text-xs font-bold text-primary">RWF</span>
              </span>
            </div>
            <div className="mt-1.5 text-[11px] font-bold text-emerald-600 text-right">
              {levelLabels[commission.level] || `Urwego rwa ${commission.level}`}
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Umuntu mwatumiye yashoye amafaranga — wabonye komisiyo. Komeza gutumira ubone n'ibindi.
          </p>

          <button
            onClick={() => setCommission(null)}
            className="mt-5 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-3.5 rounded-2xl transition active:scale-[0.98]"
          >
            Byumvikanye
          </button>
        </>
      )}
    </PopupModal>
  );
}
