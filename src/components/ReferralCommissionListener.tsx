import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PopupModal } from './PopupModal';
import { Users, CheckCircle, Sparkles } from 'lucide-react';

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
    1: 'Level 1 (15%)',
    2: 'Level 2 (4%)',
    3: 'Level 3 (1%)',
  };

  return (
    <PopupModal isOpen={!!commission} onClose={() => setCommission(null)}>
      {commission && (
        <div className="text-center py-2">
          {/* Animated icon */}
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center shadow-lg animate-scale-in">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center shadow-md animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Success badge */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-green-500 uppercase tracking-wide">Commission Earned</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-foreground mb-1">Referral Bonus! 💰</h3>

          {/* Amount */}
          <div className="my-4 py-3 px-4 bg-gradient-to-r from-violet-500/10 to-purple-400/10 rounded-2xl border border-violet-200/30">
            <p className="text-sm text-muted-foreground mb-1">Commission Received</p>
            <p className="text-3xl font-extrabold text-primary">
              +{commission.amount.toLocaleString()} <span className="text-lg">RWF</span>
            </p>
            <p className="text-xs font-medium text-violet-600 mt-1">
              {levelLabels[commission.level] || `Level ${commission.level}`}
            </p>
          </div>

          <p className="text-sm text-muted-foreground mb-5">
            Your team member just invested and you earned a commission! Keep sharing to earn more.
          </p>

          <button onClick={() => setCommission(null)} className="action-btn w-full text-base py-3">
            Awesome! 🎉
          </button>
        </div>
      )}
    </PopupModal>
  );
}
