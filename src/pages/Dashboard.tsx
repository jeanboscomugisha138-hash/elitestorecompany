import { toast } from 'sonner';
import {
  ArrowUpRight,
  Wallet,
  PiggyBank,
  Bell,
  Eye,
  Crown,
  Banknote,
  ArrowDownToLine,
  History,
  Gift,
  Trophy,
  Headset,
  Smartphone,
  Briefcase,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { BottomNav } from '@/components/BottomNav';
import { ChannelPopup } from '@/components/ChannelPopup';
import { ReferralCommissionListener } from '@/components/ReferralCommissionListener';
import { Link } from 'react-router-dom';
import { OnlineServiceDialog } from '@/components/OnlineServiceDialog';
import { GiftCodeDialog } from '@/components/GiftCodeDialog';
import { LiveActivity } from '@/components/LiveActivity';
import { NotificationBell } from '@/components/NotificationCenter';
import { AppDownloadDialog, startAppInstall } from '@/components/AppDownloadDialog';
import petaneLogo from '@/assets/rubis-logo-square.png';

export default function Dashboard() {
  const { t } = useTranslation();
  const { profile, refreshProfile } = useAuth();
  const balance = profile?.main_balance || 0;
  const totalInvested = profile?.invested_amount || 0;
  const dailyProfit = Number(profile?.total_profit || 0);
  const referralEarned = Number(profile?.referral_balance || 0);
  const [giftEarned, setGiftEarned] = useState(0);
  const totalEarnings = dailyProfit + referralEarned + giftEarned;

  const [giftDialogOpen, setGiftDialogOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [appDialogOpen, setAppDialogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (!profile?.user_id) return;
      const { data } = await supabase
        .from('gift_code_redemptions')
        .select('amount')
        .eq('user_id', profile.user_id);
      const sum = (data || []).reduce((s, r: any) => s + Number(r.amount || 0), 0);
      setGiftEarned(sum);
    })();
  }, [profile?.user_id]);

  const mask = (v: number) => (balanceVisible ? v.toLocaleString() : 'XXXXXX');

  const quickActions = [
    { label: 'Bitsa', icon: Banknote, to: '/deposit' },
    { label: 'Bikuza', icon: ArrowDownToLine, to: '/withdraw' },
    { label: 'Amateka', icon: History, to: '/history' },
    { label: 'Bonus', icon: Gift, onClick: () => setGiftDialogOpen(true) },
    { label: 'Shaka ibihembo', icon: Trophy, to: '/rewards' },
    { label: 'Ubufasha', icon: Headset, onClick: () => setAboutOpen(true) },
    { label: 'App', icon: Smartphone, onClick: () => { if (!startAppInstall()) setAppDialogOpen(true); } },
    { label: 'Ibyaguzwe', icon: Briefcase, to: '/my-investments' },
  ];

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-background">
      <ChannelPopup />
      <ReferralCommissionListener />

      {/* Red top header - compact, card overlaps into red band */}
      <div className="gradient-primary px-4 pt-4 pb-20 relative">
        <div className="flex items-center justify-between">
          <img
            src={petaneLogo}
            alt="Rubis Company"
            className="logo-halo h-14 w-14 object-contain shrink-0"
          />
          <div className="flex-1 min-w-0 ml-3">
            <h2 className="text-[16px] font-black text-primary-foreground leading-tight truncate">
              {profile?.full_name || 'Umukiriya'}
            </h2>
            <p className="text-[13px] text-primary-foreground font-bold mt-0.5">
              Konti - {profile?.phone || '---'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
          </div>
        </div>
      </div>

      {/* Overlapping compact account card - Airtel style */}
      <div className="px-3 -mt-14 space-y-3 relative z-10">
        <div className="dashboard-card px-4 pt-4 pb-4">

          {/* Header row: name + account number */}
          <div className="flex items-start justify-end mb-3">
            <Link
              to="/settings"
              className="text-primary text-[13px] font-bold whitespace-nowrap ml-3 hover:underline"
            >
              Genzura Konti
            </Link>
          </div>

          {/* Balance columns - compact */}
          <div className="grid grid-cols-2 border-t border-border/60 pt-3 gap-1">
            <div className="pr-1">
              <div className="text-[22px] font-black text-foreground leading-none tracking-tight">{mask(balance)}</div>
              <div className="text-primary text-[13px] font-black mt-1">RWF</div>
              <div className="text-[11px] text-muted-foreground mt-1 font-medium leading-tight">Ayo ufiteho</div>
            </div>
            <div className="border-l border-border/60 pl-3">
              <div className="text-[22px] font-black text-foreground leading-none tracking-tight">{mask(totalEarnings)}</div>
              <div className="text-primary text-[13px] font-black mt-1">RWF</div>
              <div className="text-[11px] text-muted-foreground mt-1 font-medium leading-tight">Inyungu zose</div>
            </div>
          </div>

          {/* Action buttons - compact pills */}
          <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-border/60">
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-black text-[13px] py-2.5 rounded-xl active:scale-[0.98] transition shadow-button"
            >
              <Crown className="w-4 h-4" strokeWidth={2.5} /> Gura VIP
            </Link>
            <Link
              to="/deposit"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-black text-[13px] py-2.5 rounded-xl active:scale-[0.98] transition shadow-button"
            >
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} /> Bitsa
            </Link>
          </div>
        </div>


      </div>

      {/* Quick actions grid */}
      <div className="px-3 mt-5">
        <div className="text-xs font-extrabold tracking-[0.12em] text-muted-foreground mb-2.5">
          IBIKORWA
        </div>

        <div className="dashboard-card p-4">
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {quickActions.map((a, i) => {
              const Icon = a.icon;
              const inner = (
                <>
                  <div className="relative w-14 h-14 rounded-full flex items-center justify-center bg-primary border border-primary shadow-[0_6px_16px_-6px_hsl(var(--primary)/0.6)] group-hover:-translate-y-0.5 group-active:scale-90 transition-transform">
                    <Icon className="relative w-6 h-6 text-primary-foreground" strokeWidth={2.3} aria-hidden />
                  </div>
                  <span className="text-[11px] font-bold text-foreground mt-2 text-center leading-tight">{a.label}</span>
                </>
              );
              const cls = 'group flex flex-col items-center rounded-xl py-1';
              if (a.to) return <Link key={i} to={a.to} className={cls}>{inner}</Link>;
              return <button key={i} onClick={a.onClick} className={cls}>{inner}</button>;
            })}
          </div>
        </div>

        {/* Promo banner */}
        <Link
          to="/products"
          className="mt-3 flex items-center gap-3 bg-card border border-border/60 rounded-2xl p-3 shadow-card active:scale-[0.99] transition"
        >
          <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
            <PiggyBank className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-foreground leading-tight">
              Shora ubone inyungu buri munsi!
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Imishinga ya Rubis Company
            </div>
          </div>
          <span className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-full">
            Reba
          </span>
        </Link>

      </div>

      <div className="px-3 mt-5 space-y-4">
        <LiveActivity />
      </div>

      <GiftCodeDialog open={giftDialogOpen} onOpenChange={setGiftDialogOpen} onRedeemed={refreshProfile} />
      <OnlineServiceDialog open={aboutOpen} onOpenChange={setAboutOpen} />
      <AppDownloadDialog isOpen={appDialogOpen} onClose={() => setAppDialogOpen(false)} />

      <BottomNav />
    </div>
  );
}
