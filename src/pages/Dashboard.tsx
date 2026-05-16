import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Package,
  Share2,
  Clock,
  Settings,
  Smartphone,
  Bell,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { BottomNav } from '@/components/BottomNav';
import { ChannelPopup } from '@/components/ChannelPopup';
import { AnnouncementPopup } from '@/components/AnnouncementPopup';
import { CustomerServiceButton } from '@/components/CustomerServiceButton';
import { ReferralCommissionListener } from '@/components/ReferralCommissionListener';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { profile } = useAuth();

  const formatRWF = (amount: number) => `${amount.toLocaleString()} RWF`;

  return (
    <div className="page-container bg-background">
      <AnnouncementPopup />
      <ChannelPopup />
      <ReferralCommissionListener />

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 animate-fade-in">
        <div className="text-sm font-medium text-foreground">{profile?.full_name || 'User'}</div>
        <Link to="/settings" className="text-sm font-semibold text-primary">
          Logout →
        </Link>
      </div>

      {/* Header Card */}
      <div className="gradient-primary rounded-2xl p-4 mb-4 animate-fade-in">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-primary-foreground">ELITESTORE COMPANY</h1>
              <p className="text-xs text-primary-foreground/80">Welcome, {profile?.full_name || 'User'}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-foreground/80" />
            <a
              href="https://chat.whatsapp.com/DRmt2Kr4cA4LGt4z0V7uMj?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-foreground/20 rounded-lg px-3 py-1 text-xs font-medium text-primary-foreground flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-card rounded-2xl p-5 shadow-card mb-4 animate-fade-in">
        <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
        <p className="text-3xl font-extrabold text-foreground mb-3">
          {formatRWF(profile?.main_balance || 0)}
        </p>
        <Link
          to="/deposit"
          className="inline-block border-2 border-primary text-primary font-semibold text-sm py-2 px-6 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
        >
          Recharge
        </Link>
      </div>

      {/* WhatsApp Banner */}
      <a
        href="https://chat.whatsapp.com/DRmt2Kr4cA4LGt4z0V7uMj?mode=gi_t"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-accent rounded-2xl p-4 mb-5 hover:shadow-card transition-all animate-fade-in"
      >
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">Join Our WhatsApp Group</p>
          <p className="text-xs text-muted-foreground">Get updates & support from the community</p>
        </div>
        <span className="text-xs font-bold text-primary">JOIN →</span>
      </a>

      {/* Online Service Button */}
      <a
        href="https://wa.me/qr/7UR4HRZZ63QFE1"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-card rounded-2xl p-4 mb-5 shadow-card hover:shadow-lg-custom transition-all animate-fade-in border border-primary/20"
      >
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">Online Service</p>
          <p className="text-xs text-muted-foreground">Chat with us on WhatsApp for instant support</p>
        </div>
        <span className="text-xs font-bold text-primary">CHAT →</span>
      </a>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-card rounded-xl p-3 text-center shadow-card">
          <p className="text-lg font-extrabold text-primary">{formatRWF(profile?.referral_balance || 0)}</p>
          <p className="text-xs text-muted-foreground">Referral Balance</p>
        </div>
        <div className="bg-card rounded-xl p-3 text-center shadow-card">
          <p className="text-lg font-extrabold text-primary">{formatRWF(profile?.invested_amount || 0)}</p>
          <p className="text-xs text-muted-foreground">Invested</p>
        </div>
        <div className="bg-card rounded-xl p-3 text-center shadow-card">
          <p className="text-lg font-extrabold text-primary">{formatRWF(profile?.total_profit || 0)}</p>
          <p className="text-xs text-muted-foreground">Total Profit</p>
        </div>
      </div>

      {/* Investment Plans heading */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link
          to="/deposit"
          className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg-custom transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <ArrowDownToLine className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">Deposit</span>
        </Link>
        <Link
          to="/withdraw"
          className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg-custom transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <ArrowUpFromLine className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">Withdraw</span>
        </Link>
        <Link
          to="/products"
          className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg-custom transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">Products</span>
        </Link>
        <Link
          to="/referral"
          className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg-custom transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <Share2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">Referral</span>
        </Link>
        <Link
          to="/history"
          className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg-custom transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">History</span>
        </Link>
        <Link
          to="/settings"
          className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg-custom transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">Settings</span>
        </Link>
      </div>

      <CustomerServiceButton />
      <BottomNav />
    </div>
  );
}
