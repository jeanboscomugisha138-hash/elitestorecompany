import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Users, Gift, TrendingUp, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ReferralUser {
  id: string;
  full_name: string;
  invested_amount: number;
  created_at: string;
}

interface ReferralEarning {
  level: number;
  total: number;
}

export default function Referral() {
  const { profile } = useAuth();
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [earnings, setEarnings] = useState<ReferralEarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the actual app URL for the referral link
  const referralLink = `${window.location.origin}/signup?ref=${profile?.referral_code || 'XXXXXX'}`;

  useEffect(() => {
    if (profile?.user_id) {
      fetchReferrals();
      fetchEarnings();
    }
  }, [profile]);

  const fetchReferrals = async () => {
    if (!profile?.user_id) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, invested_amount, created_at')
      .eq('referred_by', profile.user_id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReferrals(data);
    }
    setIsLoading(false);
  };

  const fetchEarnings = async () => {
    if (!profile?.user_id) return;
    
    const { data, error } = await supabase
      .from('referral_earnings')
      .select('level, amount')
      .eq('user_id', profile.user_id);

    if (!error && data) {
      // Group earnings by level
      const grouped = data.reduce((acc: Record<number, number>, curr) => {
        acc[curr.level] = (acc[curr.level] || 0) + Number(curr.amount);
        return acc;
      }, {});
      
      setEarnings([
        { level: 1, total: grouped[1] || 0 },
        { level: 2, total: grouped[2] || 0 },
        { level: 3, total: grouped[3] || 0 },
      ]);
    }
  };

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

      {/* Referral Code */}
      <div className="bg-card rounded-3xl p-6 shadow-card mb-4 animate-slide-up">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
          <p className="text-3xl font-bold text-primary tracking-wider">{profile?.referral_code || 'XXXXXX'}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
          <Users className="w-4 h-4" />
          <span>{referrals.length} referrals</span>
        </div>
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

      {/* Commission Levels with Earnings */}
      <div className="bg-card rounded-3xl p-6 shadow-card mb-4 animate-slide-up">
        <h3 className="font-semibold text-foreground mb-4">Commission Levels</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-accent rounded-xl">
            <div>
              <span className="text-foreground font-medium">Level 1</span>
              <span className="text-primary font-bold ml-2">15%</span>
            </div>
            <span className="text-primary font-semibold">{earnings[0]?.total.toLocaleString() || 0} RWF</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-accent rounded-xl">
            <div>
              <span className="text-foreground font-medium">Level 2</span>
              <span className="text-primary font-bold ml-2">4%</span>
            </div>
            <span className="text-primary font-semibold">{earnings[1]?.total.toLocaleString() || 0} RWF</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-accent rounded-xl">
            <div>
              <span className="text-foreground font-medium">Level 3</span>
              <span className="text-primary font-bold ml-2">1%</span>
            </div>
            <span className="text-primary font-semibold">{earnings[2]?.total.toLocaleString() || 0} RWF</span>
          </div>
        </div>
      </div>

      {/* Earnings */}
      <div className="bg-card rounded-3xl p-6 shadow-card mb-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Referral Earnings</p>
            <p className="text-2xl font-bold text-primary">
              {(profile?.referral_balance || 0).toLocaleString()} RWF
            </p>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-card rounded-3xl p-6 shadow-card animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Your Referrals</h3>
            <p className="text-sm text-muted-foreground">{referrals.length} people joined</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : referrals.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No referrals yet</p>
            <p className="text-sm">Share your link to start earning!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {referrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-3 bg-accent rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{referral.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {referral.invested_amount > 0 ? (
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                      Active Investor
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                      Not invested
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
