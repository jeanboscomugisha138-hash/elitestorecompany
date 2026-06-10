import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Send,
  Gift,
  Users,
  Headphones,
  TrendingUp,
  PiggyBank,
  Sparkles,
  Loader2,
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
import { InvestmentNewsCarousel } from '@/components/InvestmentNewsCarousel';
import { DownloadAppButton, DownloadAppInfo } from '@/components/DownloadAppButton';
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
import { LiveActivity, CompanyAchievements } from '@/components/LiveActivity';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Dashboard() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
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

  const statBoxes = [
    { label: t('dashboard.totalBalance'), value: balance, icon: Wallet, gradient: 'from-primary to-primary/70' },
    { label: t('dashboard.dailyIncome'), value: totalProfit, icon: TrendingUp, gradient: 'from-secondary to-secondary/70' },
    { label: t('dashboard.referralBalance'), value: referralBalance, icon: Sparkles, gradient: 'from-primary via-secondary to-secondary' },
    { label: t('dashboard.totalInvested'), value: totalInvested, icon: PiggyBank, gradient: 'from-secondary via-primary to-primary' },
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-5 max-w-md mx-auto bg-background">
      <AnnouncementPopup />
      <ChannelPopup />
      <ReferralCommissionListener />

      {/* Investment news section */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t('dashboard.investmentNews')}</h2>
        <a
          href="https://t.me/+12052657574"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram Online Services"
          className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-button"
        >
          <Send className="w-5 h-5 text-primary-foreground" />
        </a>
      </div>

      <InvestmentNewsCarousel />

      {/* 2x2 stat boxes */}
      <div className="grid grid-cols-2 gap-3 mb-5 animate-fade-in">
        {statBoxes.map((s, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 bg-gradient-to-br ${s.gradient} text-primary-foreground shadow-button relative overflow-hidden`}
          >
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-primary-foreground/10 rounded-full" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium opacity-90">{s.label}</span>
                <s.icon className="w-4 h-4 opacity-90" />
              </div>
              <p className="text-xl font-extrabold tracking-tight">
                {s.value.toLocaleString()}
              </p>
              <p className="text-[10px] opacity-80 mt-0.5">RWF</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick app icons */}
      <div className="grid grid-cols-4 gap-3 mb-5 animate-fade-in">
        <DownloadAppButton />

        <button
          onClick={() => setGiftDialogOpen(true)}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl flex items-center justify-center shadow-card">
            <Gift className="w-7 h-7 text-secondary" />
          </div>
          <span className="text-xs font-medium text-foreground mt-2">{t('dashboard.bonus')}</span>
        </button>

        <Link to="/referral" className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center shadow-card">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <span className="text-xs font-medium text-foreground mt-2">{t('dashboard.referral')}</span>
        </Link>

        <button onClick={() => setAboutOpen(true)} className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary/15 to-primary/15 rounded-2xl flex items-center justify-center shadow-card">
            <Headphones className="w-7 h-7 text-secondary" />
          </div>
          <span className="text-xs font-medium text-foreground mt-2">{t('dashboard.onlineService')}</span>
        </button>
      </div>
      <DownloadAppInfo />

      {/* Compact action card: Withdraw / Deposit */}
      <div className="mt-5 animate-fade-in rounded-2xl p-3 bg-gradient-to-r from-primary to-secondary shadow-button">
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/withdraw"
            className="flex items-center justify-center gap-2 bg-background/95 text-foreground font-semibold py-2.5 rounded-xl hover:bg-background transition-all active:scale-[0.98]"
          >
            <ArrowDownLeft className="w-4 h-4" /> {t('dashboard.withdraw')}
          </Link>
          <Link
            to="/deposit"
            className="flex items-center justify-center gap-2 bg-foreground text-background font-semibold py-2.5 rounded-xl hover:opacity-90 transition-all active:scale-[0.98]"
          >
            <ArrowUpRight className="w-4 h-4" /> {t('dashboard.deposit')}
          </Link>
        </div>
      </div>

      <CompanyAchievements />
      <LiveActivity />



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

      {/* Online Service dialog */}
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
