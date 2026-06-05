import { useState, useEffect } from 'react';
import { ArrowLeft, Phone, User, Banknote, Info, AlertCircle, CheckCircle2, Shield, MessageCircle, Wallet, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BottomNav } from '@/components/BottomNav';
import { SuccessNotification } from '@/components/SuccessNotification';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Withdraw() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 });
  const [hasPending, setHasPending] = useState(false);
  const [savedAccount, setSavedAccount] = useState<{ phone: string; name: string } | null>(null);
  const [showBindForm, setShowBindForm] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const { profile } = useAuth();

  // Load saved account from previous withdrawals
  useEffect(() => {
    const loadSavedAccount = async () => {
      if (!profile?.user_id) return;
      const { data } = await supabase
        .from('withdrawal_transactions')
        .select('phone, full_name')
        .eq('user_id', profile.user_id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setSavedAccount({ phone: data[0].phone, name: data[0].full_name });
        setPhone(data[0].phone);
        setName(data[0].full_name);
      } else {
        setShowBindForm(true);
      }
      setIsLoadingSaved(false);
    };
    loadSavedAccount();
  }, [profile?.user_id]);

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

  const quickAmounts = [1000, 5000, 10000, 50000];

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

    setSavedAccount({ phone, name });
    setShowBindForm(false);
    setWithdrawSuccess({ show: true, amount: amountNum });
    setAmount('');
    setIsLoading(false);
  };

  return (
    <div className="page-container bg-background pb-28">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/dashboard"
          className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-card hover:shadow-lg-custom transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="page-title mb-0 flex-1 text-left">Withdraw</h1>
        <a
          href={settings.whatsapp_group_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#25D366]/10 rounded-xl flex items-center justify-center hover:bg-[#25D366]/20 transition-all"
        >
          <MessageCircle className="w-5 h-5 text-[#25D366]" />
        </a>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-2xl p-5 mb-5 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/5 rounded-full translate-y-8 -translate-x-8" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-primary-foreground/70" />
            <p className="text-sm text-primary-foreground/70 font-medium">Available Balance</p>
          </div>
          <p className="text-3xl font-bold text-primary-foreground tracking-tight">
            {(profile?.main_balance || 0).toLocaleString()} <span className="text-lg font-normal text-primary-foreground/70">RWF</span>
          </p>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-primary-foreground/10">
            <div className="flex items-center gap-1.5 text-xs text-primary-foreground/60">
              <Clock className="w-3.5 h-3.5" />
              <span>Processed in ~24 hours</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-primary-foreground/60">
              <Shield className="w-3.5 h-3.5" />
              <span>Secure transfer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Account Card */}
      {!isLoadingSaved && (
        <div className="bg-card rounded-2xl p-4 shadow-card mb-5 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Mobile Money Account</h3>
            </div>
            {savedAccount && !showBindForm && (
              <button
                onClick={() => setShowBindForm(true)}
                className="text-xs text-primary font-medium hover:underline"
              >
                Change
              </button>
            )}
          </div>

          {savedAccount && !showBindForm ? (
            <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{savedAccount.name}</p>
                <p className="text-xs text-muted-foreground">{savedAccount.phone}</p>
              </div>
              <div className="px-2 py-1 bg-primary/10 rounded-full">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Linked</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {!savedAccount && (
                <div className="flex items-start gap-2 p-3 bg-accent/50 rounded-xl mb-1">
                  <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Link your Mobile Money account to enable withdrawals. This will be saved for future use.
                  </p>
                </div>
              )}
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="Phone number (e.g. 078...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field pl-10 text-sm h-11"
                  required
                />
              </div>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Full name (as on MoMo)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-10 text-sm h-11"
                  required
                />
              </div>
              {savedAccount && (
                <button
                  onClick={() => {
                    setPhone(savedAccount.phone);
                    setName(savedAccount.name);
                    setShowBindForm(false);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Keep current account
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Amount Section */}
      <div className="bg-card rounded-2xl p-5 shadow-card mb-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Withdrawal Amount</h3>

        <div className="relative mb-4">
          <Banknote className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field pl-11 text-lg font-semibold h-14"
            min="1000"
            max="1000000"
            required
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">RWF</span>
        </div>

        {/* Quick amounts */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {quickAmounts.map((qa) => (
            <button
              key={qa}
              onClick={() => setAmount(qa.toString())}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                amount === qa.toString()
                  ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                  : 'bg-accent/50 text-foreground hover:bg-accent'
              }`}
            >
              {qa >= 1000 ? `${qa / 1000}K` : qa}
            </button>
          ))}
        </div>

        {/* Fee breakdown */}
        {amount && parseFloat(amount) > 0 && (
          <div className="bg-muted/30 rounded-xl p-4 space-y-2.5 border border-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-foreground font-medium">{parseFloat(amount).toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service fee (10%)</span>
              <span className="text-destructive font-medium">-{fee.toLocaleString()} RWF</span>
            </div>
            <div className="border-t border-border/50 pt-2.5 flex justify-between">
              <span className="text-sm font-semibold text-foreground">You receive</span>
              <span className="text-lg font-bold text-primary">{amountToReceive.toLocaleString()} RWF</span>
            </div>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="space-y-3 mb-5">
        {(profile?.invested_amount || 0) <= 0 && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-2xl border border-destructive/20">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Investment Required</p>
              <p className="text-xs text-muted-foreground">You need an active investment to withdraw funds.</p>
            </div>
          </div>
        )}

        {hasPending && (
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 p-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-xl">⏳</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">Pending Withdrawal</p>
                <p className="text-xs text-muted-foreground mt-0.5">Please wait for your current request to be processed.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="action-btn w-full mb-4 h-14 text-base font-bold rounded-2xl"
        disabled={isLoading || hasPending || !amount || !phone || !name}
      >
        {isLoading ? 'Processing...' : hasPending ? '⏳ Pending Withdrawal' : 'Withdraw Now'}
      </button>

      {/* WhatsApp Support */}
      <a
        href={settings.whatsapp_group_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg-custom transition-all mb-4"
      >
        <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 text-[#25D366]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Need Help?</p>
          <p className="text-xs text-muted-foreground">Chat with support on WhatsApp</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </a>

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
