import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
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
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Lock,
  LogOut,
  Gift,
  Wallet,
  Loader2,
} from 'lucide-react';
import { SuccessNotification } from '@/components/SuccessNotification';

export default function Settings() {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [giftDialogOpen, setGiftDialogOpen] = useState(false);
  const [giftCode, setGiftCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [giftSuccess, setGiftSuccess] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 });

  const formatRWF = (amount: number) => `${amount.toLocaleString()} RWF`;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

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

  return (
    <div className="page-container bg-background">
      {/* Balance Section */}
      <div className="gradient-primary rounded-2xl p-5 mb-4 animate-fade-in">
        <p className="text-sm text-primary-foreground/80">Account Balance (RWF)</p>
        <p className="text-3xl font-extrabold text-primary-foreground mb-4">
          {formatRWF(profile?.main_balance || 0)}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <Link
            to="/deposit"
            className="flex items-center justify-center gap-2 bg-primary-foreground/20 border border-primary-foreground/30 rounded-xl py-3 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/30 transition-all"
          >
            <Wallet className="w-4 h-4" /> Recharge
          </Link>
          <Link
            to="/withdraw"
            className="flex items-center justify-center gap-2 bg-primary-foreground/20 border border-primary-foreground/30 rounded-xl py-3 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/30 transition-all"
          >
            <ArrowUpFromLine className="w-4 h-4" /> Withdraw
          </Link>
        </div>

        {/* Redeem Gift Code */}
        <button
          onClick={() => setGiftDialogOpen(true)}
          className="w-full bg-pink-400 rounded-xl p-4 flex items-center gap-3 hover:bg-pink-500 transition-all text-left"
        >
          <Gift className="w-8 h-8 text-primary-foreground" />
          <div>
            <p className="font-bold text-primary-foreground text-sm">Redeem Gift Code</p>
            <p className="text-xs text-primary-foreground/80">Get bonus money instantly</p>
          </div>
        </button>
      </div>

      {/* History Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fade-in">
        <Link to="/history" className="gradient-primary rounded-xl p-4 flex items-start gap-2 hover:opacity-90 transition-all">
          <ArrowDownToLine className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-semibold text-primary-foreground">Recharge History</span>
        </Link>
        <Link to="/history" className="gradient-primary rounded-xl p-4 flex items-start gap-2 hover:opacity-90 transition-all">
          <ArrowUpFromLine className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-semibold text-primary-foreground">Withdraw History</span>
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-3 animate-fade-in">
        <Link to="/referral" className="gradient-primary rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          <Users className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-bold text-primary-foreground">Invite Friends</span>
        </Link>
        <Link to="/withdraw" className="gradient-primary rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          <Wallet className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-bold text-primary-foreground">Withdraw Account</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 animate-fade-in">
        <button className="gradient-primary rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          <Lock className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-bold text-primary-foreground">Account Password</span>
        </button>
        <button onClick={handleLogout} className="bg-destructive rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          <LogOut className="w-5 h-5 text-destructive-foreground" />
          <span className="text-sm font-bold text-destructive-foreground">Log Out</span>
        </button>
      </div>

      {/* User Info */}
      <div className="bg-card rounded-2xl p-4 shadow-card animate-fade-in">
        <h3 className="font-bold text-foreground mb-3">Account Info</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium text-foreground">{profile?.full_name || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Phone</span>
            <span className="font-medium text-foreground">{profile?.phone || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Referral Code</span>
            <span className="font-medium text-primary">{profile?.referral_code || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Member Since</span>
            <span className="font-medium text-foreground">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
            </span>
          </div>
        </div>
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

      <SuccessNotification
        isOpen={giftSuccess.show}
        onClose={() => setGiftSuccess({ show: false, amount: 0 })}
        type="gift"
        amount={giftSuccess.amount}
      />

      <BottomNav />
    </div>
  );
}
