import { useState } from 'react';
import { ArrowLeft, Phone, User, Banknote, Info, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BottomNav } from '@/components/BottomNav';

export default function Withdraw() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(amount);
    if (amountNum < 2000) {
      toast.error('Minimum withdrawal is 2,000 RWF');
      return;
    }
    if (amountNum > 1000000) {
      toast.error('Maximum withdrawal is 1,000,000 RWF');
      return;
    }
    if (phone && name && amount) {
      toast.success('Withdrawal request submitted! Will be processed within 10 minutes.');
      setPhone('');
      setName('');
      setAmount('');
    }
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
              placeholder="Amount (2,000 - 1,000,000 RWF)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field pl-12"
              min="2000"
              max="1000000"
              required
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-accent rounded-xl">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-accent-foreground">
              Withdrawal will be processed within 10 minutes
            </p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-xl border border-primary/20">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-primary font-medium">
              Only investors can withdraw
            </p>
          </div>

          <button type="submit" className="action-btn w-full">
            Submit Withdrawal
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
