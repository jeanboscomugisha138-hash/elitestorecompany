import {
  ArrowUpRight,
  Wallet,
  PiggyBank,
  Bell,
  ScanLine,
  Eye,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { BottomNav } from '@/components/BottomNav';
import { ChannelPopup } from '@/components/ChannelPopup';
import { CustomerServiceButton } from '@/components/CustomerServiceButton';
import { ReferralCommissionListener } from '@/components/ReferralCommissionListener';
import { Link } from 'react-router-dom';
import { DownloadAppInfo } from '@/components/DownloadAppButton';
import { OnlineServiceDialog } from '@/components/OnlineServiceDialog';
import { GiftCodeDialog } from '@/components/GiftCodeDialog';
import { LiveActivity } from '@/components/LiveActivity';
import petaneLogo from '@/assets/petane-logo.png';

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
    { label: 'Ishyura', emoji: '💸', to: '/deposit' },
    { label: 'Kwakira', emoji: '⬇️', to: '/withdraw' },
    { label: 'Amateka', emoji: '🕐', to: '/history' },
    { label: 'Bonus', emoji: '🎁', onClick: () => setGiftDialogOpen(true) },
    { label: 'Abo turi bo', emoji: '👥', to: '/referral' },
    { label: 'Ubufasha', emoji: '🎧', onClick: () => setAboutOpen(true) },
    { label: 'Imirimo', emoji: '📦', to: '/products' },
    { label: 'Imishinga', emoji: '💼', to: '/my-investments' },
  ];

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-[hsl(226_78%_90%)]">
      <ChannelPopup />
      <ReferralCommissionListener />

      {/* Red top header - compact, card overlaps into red band */}
      <div className="gradient-primary px-4 pt-4 pb-20 relative">
        <div className="flex items-center justify-between">
          <img
            src={petaneLogo}
            alt="Petane Shipping"
            className="h-14 w-auto brightness-0 invert"
          />
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-lg border-2 border-primary-foreground/50 flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-primary-foreground" />
            </button>
            <a
              href="https://t.me/+12052657574"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-10 h-10 rounded-lg flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="w-7 h-7 text-primary-foreground" strokeWidth={2} />
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-500 text-[10px] text-white font-bold flex items-center justify-center">1</span>
            </a>
          </div>
        </div>
      </div>

      {/* Overlapping compact account card - Airtel style */}
      <div className="px-3 -mt-14 space-y-3 relative z-10">
        <div className="dashboard-card px-4 pt-4 pb-4">

          {/* Header row: name + account number */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-[16px] font-black text-foreground leading-tight tracking-tight truncate">
                {profile?.full_name || 'Umukiriya'}
              </h2>
              <p className="text-[13px] text-muted-foreground mt-0.5 font-bold">
                Konti - {profile?.phone || '---'}
              </p>
            </div>
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
              className="flex items-center justify-center gap-2 bg-primary/10 text-primary font-black text-[13px] py-2.5 rounded-xl active:scale-[0.98] transition"
            >
              <span aria-hidden>👑</span>
              <PiggyBank className="w-4 h-4" strokeWidth={2.5} /> Gura VIP
            </Link>
            <Link
              to="/deposit"
              className="flex items-center justify-center gap-2 bg-primary/10 text-primary font-black text-[13px] py-2.5 rounded-xl active:scale-[0.98] transition"
            >
              <span aria-hidden>💸</span>
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} /> Ishyura
            </Link>
          </div>
        </div>


        {/* Invested / wallet card - Airtel Money style */}
        <div className="dashboard-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-primary text-sm font-extrabold tracking-tight">{t('dashboard.totalInvested')}</div>
              <div className="text-foreground text-xl font-black leading-tight mt-0.5">
                <span className="text-primary text-xs font-extrabold mr-1">RWF</span>
                {mask(totalInvested)}
              </div>
            </div>
          </div>
          <button
            onClick={() => setBalanceVisible(v => !v)}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-button active:scale-95 transition"
            aria-label="Toggle balance"
          >
            <Eye className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </button>
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
              const inner = (
                <>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition active:scale-95 bg-primary/10 text-primary">
                    <span aria-hidden className="text-2xl leading-none">{a.emoji}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-foreground mt-1.5 text-center leading-tight">{a.label}</span>
                </>
              );
              const cls = 'flex flex-col items-center';
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
              Imishinga ya Petane Shipping
            </div>
          </div>
          <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-full">
            Reba
          </span>
        </Link>

        <div className="mt-3">
          <DownloadAppInfo />
        </div>
      </div>

      <div className="px-3 mt-5 space-y-4">
        <LiveActivity />
      </div>

      <GiftCodeDialog open={giftDialogOpen} onOpenChange={setGiftDialogOpen} onRedeemed={refreshProfile} />
      <OnlineServiceDialog open={aboutOpen} onOpenChange={setAboutOpen} />


      <CustomerServiceButton />
      <BottomNav />
    </div>
  );
}
