import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Send,
  Gift,
  Users,
  Info,
  Headphones,
  TrendingUp,
  PiggyBank,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BottomNav } from '@/components/BottomNav';
import { ChannelPopup } from '@/components/ChannelPopup';
import { AnnouncementPopup } from '@/components/AnnouncementPopup';
import { CustomerServiceButton } from '@/components/CustomerServiceButton';
import { ReferralCommissionListener } from '@/components/ReferralCommissionListener';
import { Link } from 'react-router-dom';
import { InvestmentNewsCarousel } from '@/components/InvestmentNewsCarousel';
import { DownloadAppButton, DownloadAppInfo } from '@/components/DownloadAppButton';
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
    { label: 'Total Balance', value: balance, icon: Wallet, gradient: 'from-primary to-primary/70' },
    { label: 'Daily Income', value: totalProfit, icon: TrendingUp, gradient: 'from-secondary to-secondary/70' },
    { label: 'Referral Balance', value: referralBalance, icon: Sparkles, gradient: 'from-primary via-secondary to-secondary' },
    { label: 'Total Invested', value: totalInvested, icon: PiggyBank, gradient: 'from-secondary via-primary to-primary' },
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-5 max-w-md mx-auto bg-background">
      <AnnouncementPopup />
      <ChannelPopup />
      <ReferralCommissionListener />


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
          <span className="text-xs font-medium text-foreground mt-2">Bonus</span>
        </button>

        <Link to="/referral" className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center shadow-card">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <span className="text-xs font-medium text-foreground mt-2">Referral</span>
        </Link>

        <button onClick={() => setAboutOpen(true)} className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary/15 to-primary/15 rounded-2xl flex items-center justify-center shadow-card">
            <Info className="w-7 h-7 text-secondary" />
          </div>
          <span className="text-xs font-medium text-foreground mt-2">About Us</span>
        </button>
      </div>
      <DownloadAppInfo />

      {/* Investment news section */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Investment News</h2>
        <a
          href={settings.whatsapp_group_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-button"
        >
          <Headphones className="w-5 h-5 text-primary-foreground" />
        </a>
      </div>

      <InvestmentNewsCarousel />

      {/* Balance Card with Withdraw/Deposit (moved to bottom) */}
      <div className="bg-card rounded-3xl p-5 shadow-card mt-5 animate-fade-in border border-primary/10">
        <div className="flex items-start justify-between mb-1">
          <p className="text-sm text-muted-foreground">Balance</p>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-button">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
            {balance.toLocaleString()}
          </span>
          <span className="text-base text-muted-foreground font-medium">RWF</span>
        </div>

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

      {/* About Us dialog */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" /> About ELITESTORE
            </DialogTitle>
            <DialogDescription>The trusted way to grow your money in Rwanda.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-foreground">
            <p>ELITESTORE COMPANY is a leading digital investment platform helping thousands of Rwandans earn daily passive income through smart device-rental plans.</p>
            <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
              <li><span className="text-foreground font-semibold">128,450+</span> active investors</li>
              <li><span className="text-foreground font-semibold">4.2B RWF</span> paid out</li>
              <li>Daily profits credited automatically</li>
              <li>Withdrawals processed within 24 hours</li>
              <li>3-level referral commissions: 10% / 3% / 1%</li>
            </ul>
            <p className="text-xs text-muted-foreground pt-2 border-t border-border">© ELITESTORE COMPANY · Kigali, Rwanda</p>
          </div>
        </DialogContent>
      </Dialog>


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
