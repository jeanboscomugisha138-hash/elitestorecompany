import { useState } from 'react';
import { ArrowLeft, Banknote, Info, Copy, Check, Phone, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function Deposit() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { profile } = useAuth();

  const momoCode = '*182*8*1*1943783#';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(momoCode);
    setCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !name || !amount) return;
    if (isLoading) return;

    const amountNum = parseFloat(amount);
    if (amountNum < 3500) {
      toast.error('Minimum deposit is 3,500 RWF');
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

    toast.success('Deposit request submitted! Will be confirmed within 5 minutes.');
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
        <h1 className="page-title mb-0 flex-1 text-left">Deposit</h1>
      </div>

      {/* Form */}
      <div className="bg-card rounded-3xl p-6 shadow-card animate-slide-up">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="tel"
              placeholder="Phone number used for payment"
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
              placeholder="Name used for payment"
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
              placeholder="Amount (min 3,500 RWF)"
              min="3500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field pl-12"
              required
            />
          </div>

          {/* MOMO Pay Code */}
          <div className="bg-primary/10 border-2 border-primary rounded-2xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Pay to: <span className="font-semibold text-foreground">Vestine</span></p>
            <p className="text-sm text-muted-foreground mb-2">Dial this MOMO Pay Code:</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-xl font-bold text-primary tracking-wider">{momoCode}</p>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : (
                  <Copy className="w-5 h-5 text-primary" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-accent rounded-xl">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-accent-foreground">
              After dialing, fill the form above and submit. Deposit will be confirmed within 5 minutes.
            </p>
          </div>

          <button type="submit" className="action-btn w-full" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Deposit'}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
