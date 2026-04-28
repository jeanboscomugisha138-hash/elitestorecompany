import { useState, useEffect } from 'react';
import { ArrowLeft, Banknote, Info, Copy, Check, Phone, User, Wallet, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BottomNav } from '@/components/BottomNav';
import { SuccessNotification } from '@/components/SuccessNotification';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function Deposit() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 });
  const [hasPending, setHasPending] = useState(false);
  const { profile } = useAuth();

  const momoNumber = '*182*8*1*1978296#';
  const momoName = 'Thacienne';

  useEffect(() => {
    const checkPending = async () => {
      if (!profile?.user_id) return;
      const { data } = await supabase
        .from('deposit_transactions')
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('status', 'pending')
        .limit(1);
      setHasPending(!!(data && data.length > 0));
    };
    checkPending();
  }, [profile?.user_id, depositSuccess.show]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(momoNumber);
    setCopied(true);
    toast.success('Number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !name || !amount) return;
    if (isLoading) return;
    if (hasPending) {
      toast.error('You already have a pending deposit. Please wait for it to be processed.');
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum < 6500) {
      toast.error('Minimum deposit is 6,500 RWF');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from('deposit_transactions')
      .insert({
        user_id: profile?.user_id,
        phone,
        full_name: name,
        amount: amountNum,
        status: 'pending'
      });

    if (error) {
      toast.error('Failed to submit deposit request');
      setIsLoading(false);
      return;
    }

    setDepositSuccess({ show: true, amount: amountNum });
    setPhone('');
    setName('');
    setAmount('');
    setIsLoading(false);
  };

  const quickAmounts = [5000, 10000, 25000, 50000];

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
        <h1 className="page-title mb-0 flex-1 text-left">Deposit</h1>
      </div>

      {/* Mobile Money Info Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-3xl p-5 mb-5 shadow-button">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary-foreground/5 rounded-full translate-y-8 -translate-x-8" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-primary-foreground/80 uppercase tracking-wider">Send Money To</span>
          </div>

          <p className="text-lg font-bold text-primary-foreground mb-1">{momoName}</p>
          
          <button
            type="button"
            onClick={handleCopy}
            className="w-full mt-3 bg-primary-foreground/15 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center justify-between gap-2 active:scale-[0.98] transition-all"
          >
            <p className="text-base sm:text-xl font-extrabold text-primary-foreground tracking-wider select-all break-all">{momoNumber}</p>
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
              {copied ? (
                <Check className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Copy className="w-5 h-5 text-primary-foreground" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-5 px-1">
        {[
          { step: '1', label: 'Send money' },
          { step: '2', label: 'Fill form' },
          { step: '3', label: 'Get confirmed' },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">{s.step}</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-3xl p-5 shadow-card animate-slide-up mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Payment Details</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                placeholder="Phone used for payment"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field pl-11 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Name used for payment"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-11 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block ml-1">Amount (RWF)</label>
            <div className="relative">
              <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                placeholder="Min 6,500 RWF"
                min="6500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field pl-11 text-sm"
                required
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex gap-2 flex-wrap">
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setAmount(String(q))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  amount === String(q)
                    ? 'bg-primary text-primary-foreground shadow-button'
                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {q.toLocaleString()}
              </button>
            ))}
          </div>

          {hasPending && (
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 p-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-foreground">Pending Deposit</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Please wait for your current deposit to be processed.
                  </p>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="action-btn w-full flex items-center justify-center gap-2" disabled={isLoading || hasPending}>
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Submitting...
              </>
            ) : hasPending ? (
              <>
                <Clock className="w-4 h-4" />
                Pending Deposit in Progress
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Submit Deposit
              </>
            )}
          </button>
        </form>
      </div>

      {/* Info Footer */}
      <div className="flex items-start gap-3 p-4 bg-card rounded-2xl shadow-card">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">How it works</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Send money to <span className="font-semibold text-foreground">{momoNumber}</span> via Mobile Money, then fill the form above and submit. Your deposit will be confirmed within <span className="font-semibold text-primary">5 minutes</span>.
          </p>
        </div>
      </div>

      <SuccessNotification
        isOpen={depositSuccess.show}
        onClose={() => setDepositSuccess({ show: false, amount: 0 })}
        type="deposit"
        amount={depositSuccess.amount}
      />

      <BottomNav />
    </div>
  );
}
