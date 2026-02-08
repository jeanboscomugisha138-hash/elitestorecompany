import { useState } from 'react';
import { ArrowLeft, Phone, User, Banknote, Info } from 'lucide-react';
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
  const { profile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !name || !amount) return;

    setIsLoading(true);

    const { error } = await supabase
      .from('deposit_transactions')
      .insert({
        user_id: profile?.user_id,
        phone,
        full_name: name,
        amount: parseFloat(amount),
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
              placeholder="Phone number"
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
              placeholder="Amount (RWF)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field pl-12"
              required
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-accent rounded-xl">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-accent-foreground">
              Deposit will be confirmed within 5 minutes
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
