import {
  Wallet,
  Users,
  TrendingUp,
  PiggyBank,
  ArrowDownToLine,
  ArrowUpFromLine,
  Package,
  Share2,
  Clock,
  Settings,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { StatCard } from '@/components/StatCard';
import { ActionButton } from '@/components/ActionButton';
import { BottomNav } from '@/components/BottomNav';
import { ChannelPopup } from '@/components/ChannelPopup';
import { AnnouncementPopup } from '@/components/AnnouncementPopup';
import { CustomerServiceButton } from '@/components/CustomerServiceButton';

export default function Dashboard() {
  const { profile } = useAuth();

  const formatRWF = (amount: number) => `${amount.toLocaleString()} RWF`;

  return (
    <div className="page-container bg-background">
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
