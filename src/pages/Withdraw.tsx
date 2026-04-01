import { useState, useEffect } from 'react';
import { ArrowLeft, Phone, User, Banknote, Info, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BottomNav } from '@/components/BottomNav';
import { SuccessNotification } from '@/components/SuccessNotification';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function Withdraw() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 });
  const [hasPending, setHasPending] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    const checkPending = async () => {
      if (!profile?.user_id) return;
      const { data } = await supabase
        .from('withdrawal_transactions')
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('status', 'pending')
        .limit(1);
      setHasPending(!!(data && data.length > 0));
    };
    checkPending();
  }, [profile?.user_id, withdrawSuccess.show]);

  const fee = amount ? Math.round(parseFloat(amount) * 0.1) : 0;
  const amountToReceive = amount ? parseFloat(amount) - fee : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (hasPending) {
      toast.error('You already have a pending withdrawal. Please wait for it to be processed.');
      return;
    }

    const amountNum = parseInt(amount);

    if ((profile?.invested_amount || 0) <= 0) {
      toast.error('Only investors can withdraw. Please invest first.');
      return;
    }

    if (amountNum < 1000) {
      toast.error('Minimum withdrawal is 1,000 RWF');
      return;
    }

    if (amountNum > 1000000) {
      toast.error('Maximum withdrawal is 1,000,000 RWF');
      return;
    }

    if (amountNum > (profile?.main_balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    // No time restriction - users can withdraw anytime

    // Check if user already withdrew today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: todayWithdrawals } = await supabase
      .from('withdrawal_transactions')
      .select('id')
      .eq('user_id', profile?.user_id)
      .gte('created_at', today.toISOString())
      .limit(1);

    if (todayWithdrawals && todayWithdrawals.length > 0) {
      toast.error('You can only withdraw once per day. Try again tomorrow.');
      return;
    }

    if (!phone || !name || !amount) return;

    setIsLoading(true);

    const { error } = await supabase
      .from('withdrawal_transactions')
      .insert({
        user_id: profile?.user_id,
        phone,
        full_name: name,
        amount: amountNum,
        status: 'pending'
      });

    if (error) {
      toast.error('Failed to submit withdrawal request');
      setIsLoading(false);
      return;
    }

    setWithdrawSuccess({ show: true, amount: amountNum });
    setPhone('');
    setName('');
    setAmount('');
    setIsLoading(false);
  };

  return (
    <div className="page-container bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/dashboard"
          className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-card hover:shadow-lg-custom transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="page-title mb-0 flex-1 text-left">Withdraw</h1>
      </div>

      {/* Balance Info */}
      <div className="bg-card rounded-2xl p-4 shadow-card mb-4 animate-slide-up">
        <p className="text-sm text-muted-foreground">Available Balance</p>
        <p className="text-xl font-bold text-primary">{(profile?.main_balance || 0).toLocaleString()} RWF</p>
      </div>

      {/* Form */}
      <div className="bg-card rounded-3xl p-6 shadow-card animate-slide-up">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="tel"
              placeholder="Phone number to receive money"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field pl-12"
              required
            />
          </div>

          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field pl-12"
              required
            />
          </div>

          <div className="relative">
            <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="number"
              placeholder="Amount (1,000 - 1,000,000 RWF)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field pl-12"
              min="1000"
              max="1000000"
              required
            />
          </div>

          {/* Fee breakdown */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-foreground">{parseFloat(amount).toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee (10%)</span>
                <span className="text-destructive">-{fee.toLocaleString()} RWF</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold">
                <span className="text-foreground">You receive</span>
                <span className="text-primary">{amountToReceive.toLocaleString()} RWF</span>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 bg-accent rounded-xl">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-accent-foreground">
              10% fee applies. Withdrawal will be processed within 10 minutes. One withdrawal per day. Available anytime.
            </p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-xl border border-primary/20">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-primary font-medium">
              Only investors can withdraw
            </p>
          </div>

          <button type="submit" className="action-btn w-full" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Withdrawal'}
          </button>
        </form>
      </div>

      <SuccessNotification
        isOpen={withdrawSuccess.show}
        onClose={() => setWithdrawSuccess({ show: false, amount: 0 })}
        type="withdraw"
        amount={withdrawSuccess.amount}
      />

      <BottomNav />
    </div>
  );
}
