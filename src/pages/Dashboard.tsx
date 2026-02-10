import {
  Wallet,
  Users,
  TrendingUp,
  PiggyBank,
  Gift,
  ArrowDownToLine,
  ArrowUpFromLine,
  Package,
  Share2,
  Clock,
  Settings,
  Drill,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { StatCard } from '@/components/StatCard';
import { ActionButton } from '@/components/ActionButton';
import { BottomNav } from '@/components/BottomNav';
import { BonusPopup } from '@/components/BonusPopup';
import { ChannelPopup } from '@/components/ChannelPopup';
import { AnnouncementPopup } from '@/components/AnnouncementPopup';
import { CustomerServiceButton } from '@/components/CustomerServiceButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Dashboard() {
  const { profile, refreshProfile } = useAuth();

  const formatRWF = (amount: number) => `${amount.toLocaleString()} RWF`;

  const getLastClaimText = () => {
    if (!profile?.last_bonus_claim) return 'Never claimed';
    const date = new Date(profile.last_bonus_claim);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canClaimBonus = () => {
    if (!profile?.last_bonus_claim) return true;
    const lastClaim = new Date(profile.last_bonus_claim);
    const now = new Date();
    const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastClaim >= 24;
  };

  const claimDailyBonus = async () => {
    if (!canClaimBonus()) {
      toast.error('You can only claim once every 24 hours');
      return;
    }

    const { error: bonusError } = await supabase
      .from('daily_bonuses')
      .insert({ user_id: profile?.user_id, amount: 50 });

    if (bonusError) {
      toast.error('Failed to claim bonus');
      return;
    }

    // Update profile balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        main_balance: (profile?.main_balance || 0) + 50,
        last_bonus_claim: new Date().toISOString()
      })
      .eq('user_id', profile?.user_id);

    if (updateError) {
      toast.error('Failed to update balance');
      return;
    }

    toast.success('Daily bonus of 50 RWF claimed!');
    refreshProfile();
  };

  return (
    <div className="page-container bg-background">
      <BonusPopup />
      <ChannelPopup />
      <AnnouncementPopup />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-button">
            <Drill className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Drilltools Company</h1>
            <p className="text-sm text-muted-foreground">Welcome, {profile?.full_name || 'User'}!</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          label="Main Balance"
          value={formatRWF(profile?.main_balance || 0)}
          icon={Wallet}
        />
        <StatCard
          label="Referral Balance"
          value={formatRWF(profile?.referral_balance || 0)}
          icon={Users}
        />
        <StatCard
          label="Invested"
          value={formatRWF(profile?.invested_amount || 0)}
          icon={PiggyBank}
        />
        <StatCard
          label="Total Profit"
          value={formatRWF(profile?.total_profit || 0)}
          icon={TrendingUp}
        />
      </div>

      {/* Daily Bonus */}
      <div className="bg-card rounded-2xl p-4 shadow-card mb-6 animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Daily Bonus</h3>
              <p className="text-xs text-muted-foreground">Last claim: {getLastClaimText()}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={claimDailyBonus} 
          className="action-btn w-full text-sm"
          disabled={!canClaimBonus()}
        >
          {canClaimBonus() ? 'Claim Daily Bonus (50 RWF)' : 'Already Claimed Today'}
        </button>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <ActionButton icon={ArrowDownToLine} label="Deposit" to="/deposit" />
        <ActionButton icon={ArrowUpFromLine} label="Withdraw" to="/withdraw" />
        <ActionButton icon={Package} label="Products" to="/products" />
        <ActionButton icon={Share2} label="Referral" to="/referral" />
        <ActionButton icon={Clock} label="History" to="/history" />
        <ActionButton icon={Settings} label="Settings" to="/settings" />
      </div>

      <CustomerServiceButton />
      <BottomNav />
    </div>
  );
}
