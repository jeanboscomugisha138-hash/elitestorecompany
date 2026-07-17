import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Gift,
  Users,
  Headphones,
  PiggyBank,
  Bell,
  ScanLine,
  Eye,
  Download,
  Loader2,
  Package,
  History as HistoryIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { BottomNav } from '@/components/BottomNav';
import { ChannelPopup } from '@/components/ChannelPopup';
import { AnnouncementPopup } from '@/components/AnnouncementPopup';
import { CustomerServiceButton } from '@/components/CustomerServiceButton';
import { ReferralCommissionListener } from '@/components/ReferralCommissionListener';
import { Link } from 'react-router-dom';
import { DownloadAppInfo } from '@/components/DownloadAppButton';
import { OnlineServiceDialog } from '@/components/OnlineServiceDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SuccessNotification } from '@/components/SuccessNotification';
import { LiveActivity } from '@/components/LiveActivity';
import petaneLogo from '@/assets/petane-logo.png';

export default function Dashboard() {
  const { t } = useTranslation();
  const { profile, refreshProfile } = useAuth();
  const balance = profile?.main_balance || 0;
  const totalInvested = profile?.invested_amount || 0;
  const referralBalance = profile?.referral_balance || 0;
  const totalProfit = profile?.total_profit || 0;

  const [giftDialogOpen, setGiftDialogOpen] = useState(false);
  const [giftCode, setGiftCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [giftSuccess, setGiftSuccess] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 });
  const [aboutOpen, setAboutOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const handleRedeemGiftCode = async () => {
    const code = giftCode.trim();
    if (!code) {
      toast({ title: 'Please enter a gift code', variant: 'destructive' });
      return;
    }
    setIsRedeeming(true);
    try {
      const { data, error } = await supabase.functions.invoke('redeem-gift-code', {
        body: { code },
      });
      if (error || data?.error) {
        toast({ title: data?.error || 'Failed to redeem code', variant: 'destructive' });
      } else {
        setGiftCode('');
        setGiftDialogOpen(false);
        await refreshProfile();
        setGiftSuccess({ show: true, amount: data.amount || 0 });
      }
    } catch {
      toast({ title: 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsRedeeming(false);
    }
  };

  const mask = (v: number) => (balanceVisible ? v.toLocaleString() : 'XXXXXX');

  const quickActions = [
    { label: 'Ishyura', icon: ArrowUpRight, to: '/deposit', variant: 'solid' as const },
    { label: 'Kwakira', icon: Download, to: '/withdraw', variant: 'soft' as const },
    { label: 'Amateka', icon: HistoryIcon, to: '/history', variant: 'soft' as const },
    { label: 'Bonus', icon: Gift, onClick: () => setGiftDialogOpen(true), variant: 'solid' as const },
    { label: 'Abo turi bo', icon: Users, to: '/referral', variant: 'soft' as const },
    { label: 'Ubufasha', icon: Headphones, onClick: () => setAboutOpen(true), variant: 'soft' as const },
    { label: 'Imirimo', icon: Package, to: '/products', variant: 'solid' as const },
    { label: 'Imishinga', icon: Wallet, to: '/products', variant: 'soft' as const },
  ];

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-[hsl(0_0%_96%)]">
      <AnnouncementPopup />
      <ChannelPopup />
      <ReferralCommissionListener />

      {/* Red top header - compact, card overlaps into red band */}
      <div className="bg-primary px-4 pt-4 pb-16 relative">
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
      <div className="px-3 -mt-12 space-y-3">

        <div className="bg-card rounded-2xl shadow-card p-4 border border-border/40">
          {/* Header row: name + account number */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-[16px] font-black text-foreground leading-tight tracking-tight truncate">
                {profile?.full_name || 'Umukiriya'}
              </h2>
              <p className="text-[13px] text-foreground mt-0.5 font-bold">
                Konti - {profile?.phone || '---'}
              </p>
            </div>
            <Link
              to="/settings"
              className="text-[#1a73e8] text-[13px] font-bold whitespace-nowrap ml-3 hover:underline"
            >
              Genzura Konti
            </Link>
          </div>

          {/* Balance columns - compact */}
          <div className="grid grid-cols-2 border-t border-border pt-3 gap-1">
            <div className="pr-1">
              <div className="text-[22px] font-black text-foreground leading-none tracking-tight">{mask(balance)}</div>
              <div className="text-primary text-[13px] font-black mt-1">RWF</div>
              <div className="text-[11px] text-muted-foreground mt-1 font-medium leading-tight">Ayo ufiteho</div>
            </div>
            <div className="border-l border-border pl-3">
              <div className="text-[22px] font-black text-foreground leading-none tracking-tight">{mask(totalProfit)}</div>
              <div className="text-primary text-[13px] font-black mt-1">RWF</div>
              <div className="text-[11px] text-muted-foreground mt-1 font-medium leading-tight">Inyungu zose</div>
            </div>
          </div>

          {/* Action buttons - compact pills */}
          <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-border">
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 bg-primary/10 text-primary font-black text-[13px] py-2.5 rounded-xl active:scale-[0.98] transition"
            >
              <PiggyBank className="w-4 h-4" strokeWidth={2.5} /> Gura VIP
            </Link>
            <Link
              to="/deposit"
              className="flex items-center justify-center gap-2 bg-primary/10 text-primary font-black text-[13px] py-2.5 rounded-xl active:scale-[0.98] transition"
            >
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} /> Ishyura
            </Link>
          </div>
        </div>


        {/* Invested / wallet card - Airtel Money style */}
        <div className="bg-card rounded-2xl shadow-card p-4 flex items-center justify-between border border-border/40">
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
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-[0_4px_12px_-3px_hsl(var(--primary)/0.5)] active:scale-95 transition"
            aria-label="Toggle balance"
          >
            <Eye className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Quick actions grid */}
      <div className="px-3 mt-6">
        <div className="text-xs font-extrabold tracking-[0.15em] text-muted-foreground mb-3">
          IBIKORWA
        </div>

        <div className="bg-card rounded-2xl shadow-card p-4 border border-border/60">
          <div className="grid grid-cols-4 gap-y-5 gap-x-2">
            {quickActions.map((a, i) => {
              const isSolid = a.variant === 'solid';
              const iconWrap = isSolid
                ? 'bg-primary text-primary-foreground shadow-[0_6px_14px_-4px_hsl(var(--primary)/0.55)]'
                : 'bg-primary/10 text-primary';
              const inner = (
                <>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition active:scale-95 ${iconWrap}`}>
                    <a.icon className="w-6 h-6" strokeWidth={2.2} />
                  </div>
                  <span className="text-[11px] font-semibold text-foreground mt-2 text-center leading-tight">{a.label}</span>
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
          className="mt-4 flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-3 active:scale-[0.99] transition"
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
          <span className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-full">
            Reba
          </span>
        </Link>

        <div className="mt-4">
          <DownloadAppInfo />
        </div>
      </div>

      <div className="px-3 mt-5 space-y-4">
        <LiveActivity />
      </div>

      {/* Gift Code Dialog */}
      <Dialog open={giftDialogOpen} onOpenChange={setGiftDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" /> Redeem Gift Code
            </DialogTitle>
            <DialogDescription>Enter your gift code to receive bonus money instantly.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <Input
              placeholder="Enter gift code"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
              maxLength={50}
              className="text-center uppercase tracking-widest font-bold text-lg"
            />
            <Button onClick={handleRedeemGiftCode} disabled={isRedeeming || !giftCode.trim()}>
              {isRedeeming ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Redeeming...</> : 'Redeem Code'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <OnlineServiceDialog open={aboutOpen} onOpenChange={setAboutOpen} />

      <SuccessNotification
        isOpen={giftSuccess.show}
        onClose={() => setGiftSuccess({ show: false, amount: 0 })}
        type="gift"
        amount={giftSuccess.amount}
      />

      <CustomerServiceButton />
      <BottomNav />
    </div>
  );
}
