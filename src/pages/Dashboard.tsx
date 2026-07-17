import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Gift,
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
    { label: t('dashboard.deposit'), icon: ArrowUpRight, to: '/deposit' },
    { label: t('dashboard.withdraw'), icon: ArrowDownLeft, to: '/withdraw' },
    { label: t('nav.products') || 'Products', icon: Package, to: '/products' },
    { label: t('dashboard.referral'), icon: Users, to: '/referral' },
    { label: t('dashboard.bonus'), icon: Gift, onClick: () => setGiftDialogOpen(true) },
    { label: t('nav.history') || 'History', icon: HistoryIcon, to: '/history' },
    { label: t('dashboard.onlineService'), icon: Headphones, onClick: () => setAboutOpen(true) },
    { label: 'App', icon: Download, href: 'https://drive.google.com/uc?export=download&id=1FjLw7Hsp_6yKOp3VQYOrZkL0N7zADQmC' },
  ];

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-[hsl(0_0%_96%)]">
      <AnnouncementPopup />
      <ChannelPopup />
      <ReferralCommissionListener />

      {/* Red top header */}
      <div className="bg-primary px-4 pt-5 pb-16 relative">
        <div className="flex items-center justify-between">
          <div className="text-primary-foreground font-extrabold text-2xl tracking-tight italic">
            petane
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg border border-primary-foreground/40 flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-primary-foreground" />
            </button>
            <a
              href="https://t.me/+12052657574"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-9 h-9 rounded-lg flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6 text-primary-foreground" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-[10px] text-white font-bold flex items-center justify-center">1</span>
            </a>
          </div>
        </div>
      </div>

      {/* Overlapping account card */}
      <div className="px-3 -mt-14 space-y-3">
        <div className="bg-card rounded-2xl shadow-card p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-bold text-foreground text-base leading-tight">{profile?.full_name || 'User'}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Prepaid - <span className="text-foreground font-semibold">{profile?.phone || '---'}</span>
              </div>
            </div>
            <Link to="/settings" className="text-primary text-sm font-semibold">Manage Account</Link>
          </div>

          <div className="grid grid-cols-3 border-t border-border pt-3 gap-2">
            <div>
              <div className="text-lg font-extrabold text-foreground leading-none">{mask(balance)}</div>
              <div className="text-primary text-xs font-bold mt-1">RWF</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{t('dashboard.totalBalance')}</div>
            </div>
            <div className="border-l border-border pl-2">
              <div className="text-lg font-extrabold text-foreground leading-none">{mask(totalProfit)}</div>
              <div className="text-primary text-xs font-bold mt-1">RWF</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{t('dashboard.dailyIncome')}</div>
            </div>
            <div className="border-l border-border pl-2">
              <div className="text-lg font-extrabold text-foreground leading-none">{mask(referralBalance)}</div>
              <div className="text-primary text-xs font-bold mt-1">RWF</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{t('dashboard.referralBalance')}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 bg-primary/10 text-primary font-bold py-2.5 rounded-xl active:scale-[0.98] transition"
            >
              <PiggyBank className="w-4 h-4" /> Buy VIP
            </Link>
            <Link
              to="/deposit"
              className="flex items-center justify-center gap-2 bg-primary/10 text-primary font-bold py-2.5 rounded-xl active:scale-[0.98] transition"
            >
              <ArrowUpRight className="w-4 h-4" /> Self Recharge
            </Link>
          </div>
        </div>

        {/* Invested / wallet card */}
        <div className="bg-card rounded-2xl shadow-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-primary font-extrabold text-sm">{t('dashboard.totalInvested')}</div>
              <div className="text-foreground font-bold text-lg leading-tight">
                <span className="text-primary text-sm font-bold mr-1">RWF</span>
                {mask(totalInvested)}
              </div>
            </div>
          </div>
          <button
            onClick={() => setBalanceVisible(v => !v)}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
            aria-label="Toggle balance"
          >
            <Eye className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Quick actions grid */}
      <div className="px-3 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-secondary">Quick Actions</h2>
          <Link to="/products" className="text-primary text-sm font-semibold">View All</Link>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((a, i) => {
            const inner = (
              <>
                <div className="w-14 h-14 rounded-xl bg-card flex items-center justify-center shadow-card border border-border">
                  <a.icon className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-semibold text-foreground mt-2 text-center leading-tight">{a.label}</span>
              </>
            );
            const cls = 'flex flex-col items-center';
            if (a.to) return <Link key={i} to={a.to} className={cls}>{inner}</Link>;
            if (a.href) return <a key={i} href={a.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
            return <button key={i} onClick={a.onClick} className={cls}>{inner}</button>;
          })}
        </div>
        <DownloadAppInfo />
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
