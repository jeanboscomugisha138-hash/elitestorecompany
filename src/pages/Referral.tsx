import { ArrowLeft, Copy, Users, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';

export default function Referral() {
  const { user } = useApp();
  const referralLink = `https://drilltools.com/ref/${user?.referralCode || 'ABC123'}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
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
        <h1 className="page-title mb-0 flex-1 text-left">Referral Program</h1>
      </div>

      {/* Referral Link */}
      <div className="bg-card rounded-3xl p-6 shadow-card mb-4 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Your Referral Link</h3>
            <p className="text-sm text-muted-foreground">Share to earn commissions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="input-field text-sm"
          />
          <button
            onClick={copyLink}
            className="flex-shrink-0 w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-button hover:scale-105 transition-transform"
          >
            <Copy className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Commission Levels */}
      <div className="bg-card rounded-3xl p-6 shadow-card mb-4 animate-slide-up">
        <h3 className="font-semibold text-foreground mb-4">Commission Levels</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-accent rounded-xl">
            <span className="text-foreground font-medium">Level 1</span>
            <span className="text-primary font-bold">15%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-accent rounded-xl">
            <span className="text-foreground font-medium">Level 2</span>
            <span className="text-primary font-bold">4%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-accent rounded-xl">
            <span className="text-foreground font-medium">Level 3</span>
            <span className="text-primary font-bold">1%</span>
          </div>
        </div>
      </div>

      {/* Earnings */}
      <div className="bg-card rounded-3xl p-6 shadow-card animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Referral Earnings</p>
            <p className="text-2xl font-bold text-primary">
              {(user?.referralBalance || 0).toLocaleString()} RWF
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
