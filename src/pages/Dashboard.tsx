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
import { useApp } from '@/contexts/AppContext';
import { StatCard } from '@/components/StatCard';
import { ActionButton } from '@/components/ActionButton';
import { BottomNav } from '@/components/BottomNav';
import { BonusPopup } from '@/components/BonusPopup';
import { ChannelPopup } from '@/components/ChannelPopup';

export default function Dashboard() {
  const { user, claimDailyBonus } = useApp();

  const formatRWF = (amount: number) => `${amount.toLocaleString()} RWF`;

  const getLastClaimText = () => {
    if (!user?.lastBonusClaim) return 'Never claimed';
    const date = new Date(user.lastBonusClaim);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page-container bg-background">
      <BonusPopup />
      <ChannelPopup />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-button">
            <Drill className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Drilltools Company</h1>
            <p className="text-sm text-muted-foreground">Welcome back!</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          label="Main Balance"
          value={formatRWF(user?.mainBalance || 0)}
          icon={Wallet}
        />
        <StatCard
          label="Referral Balance"
          value={formatRWF(user?.referralBalance || 0)}
          icon={Users}
        />
        <StatCard
          label="Invested"
          value={formatRWF(user?.investedAmount || 0)}
          icon={PiggyBank}
        />
        <StatCard
          label="Total Profit"
          value={formatRWF(user?.totalProfit || 0)}
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
        <button onClick={claimDailyBonus} className="action-btn w-full text-sm">
          Claim Daily Bonus (50 RWF)
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

      <BottomNav />
    </div>
  );
}
