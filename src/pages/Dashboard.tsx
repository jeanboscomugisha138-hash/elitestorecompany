import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Send,
  Gift,
  Users,
  Megaphone,
  Bell,
  Headphones,
  Package,
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
  const balance = profile?.main_balance || 0;

  return (
    <div className="min-h-screen pb-24 px-4 pt-5 max-w-md mx-auto bg-background">
      <AnnouncementPopup />
      <ChannelPopup />
      <ReferralCommissionListener />

      {/* Balance Card */}
      <div className="bg-card rounded-3xl p-5 shadow-card mb-5 animate-fade-in">
        <div className="flex items-start justify-between mb-1">
          <p className="text-sm text-muted-foreground">Balance</p>
          <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-5xl font-extrabold text-foreground tracking-tight">
            {balance.toLocaleString()}
          </span>
          <span className="text-base text-muted-foreground font-medium">RWF</span>
        </div>
        <p className="text-xs text-muted-foreground -mt-4 mb-4">Account balance</p>

        <div className="flex gap-3">
          <Link
            to="/withdraw"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-foreground/80 text-foreground font-semibold py-3 rounded-full hover:bg-foreground hover:text-background transition-all"
          >
            <ArrowDownLeft className="w-4 h-4" /> Withdraw
          </Link>
          <Link
            to="/deposit"
            className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background font-semibold py-3 rounded-full hover:opacity-90 transition-all"
          >
            <ArrowUpRight className="w-4 h-4" /> Deposit
          </Link>
        </div>
      </div>

      {/* Quick app icons */}
      <div className="grid grid-cols-4 gap-3 mb-5 animate-fade-in">
        {[
          { icon: Send, label: 'Channel', bg: 'bg-card', color: 'text-foreground', badge: '!', href: 'https://chat.whatsapp.com/DRmt2Kr4cA4LGt4z0V7uMj?mode=gi_t', external: true },
          { icon: Gift, label: 'Bonus', bg: 'bg-yellow-100', color: 'text-yellow-700', href: '/settings' },
          { icon: Users, label: 'Referral', bg: 'bg-green-100', color: 'text-green-700', href: '/referral' },
          { icon: Megaphone, label: 'News', bg: 'bg-red-100', color: 'text-red-600', href: '/history' },
        ].map((item, i) => {
          const inner = (
            <>
              <div className={`relative w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center shadow-card`}>
                <item.icon className={`w-7 h-7 ${item.color}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-foreground mt-2">{item.label}</span>
            </>
          );
          return item.external ? (
            <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
              {inner}
            </a>
          ) : (
            <Link key={i} to={item.href} className="flex flex-col items-center">
              {inner}
            </Link>
          );
        })}
      </div>

      {/* Ticker / latest activity */}
      <div className="flex items-center gap-3 bg-card rounded-full pl-2 pr-4 py-2 shadow-card mb-6 animate-fade-in">
        <span className="bg-foreground text-background text-xs font-semibold px-3 py-1 rounded-full">News</span>
        <p className="text-xs text-foreground truncate flex-1">
          ****{(profile?.referral_code || 'XXXX').slice(-4)} earned a new investment bonus
        </p>
        <Bell className="w-4 h-4 text-muted-foreground shrink-0" />
      </div>

      {/* Investment news section */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-extrabold text-foreground">Investment News</h2>
        <a
          href="https://wa.me/qr/7UR4HRZZ63QFE1"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center"
        >
          <Headphones className="w-5 h-5 text-background" />
        </a>
      </div>

      <Link
        to="/products"
        className="relative block rounded-3xl overflow-hidden shadow-card mb-5 animate-fade-in aspect-[16/10] bg-gradient-to-br from-primary/30 via-secondary/20 to-accent"
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <Package className="w-32 h-32 text-foreground" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-foreground/80 to-transparent">
          <h3 className="text-2xl font-extrabold text-background">PREMIUM PRODUCTS</h3>
          <p className="text-sm text-background/80">Daily profits guaranteed</p>
        </div>
      </Link>

      <CustomerServiceButton />
      <BottomNav />
    </div>
  );
}
