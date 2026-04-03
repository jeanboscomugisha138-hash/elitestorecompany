import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Users, Gift, TrendingUp, User, Share2, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  full_name: string;
  invested_amount: number;
  created_at: string;
  level: number;
}

interface ReferralEarning {
  level: number;
  total: number;
  count: number;
}

export default function Referral() {
  const { profile } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [earnings, setEarnings] = useState<ReferralEarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'team'>('overview');

  const baseUrl = 'https://samsung-worldtechnology.lovable.app';
  const referralLink = `${baseUrl}/signup?ref=${profile?.referral_code || 'XXXXXX'}`;

  const level1 = teamMembers.filter(m => m.level === 1);
  const level2 = teamMembers.filter(m => m.level === 2);
  const level3 = teamMembers.filter(m => m.level === 3);

  const totalEarnings = earnings.reduce((sum, e) => sum + e.total, 0);

  useEffect(() => {
    if (profile?.user_id) {
      fetchTeamMembers();
      fetchEarnings();
    }
  }, [profile]);

  const fetchTeamMembers = async () => {
    if (!profile?.user_id) return;
    const { data, error } = await supabase.rpc('get_team_members', { _user_id: profile.user_id });
    if (!error && data) setTeamMembers(data as TeamMember[]);
    setIsLoading(false);
  };

  const fetchEarnings = async () => {
    if (!profile?.user_id) return;
    const { data, error } = await supabase
      .from('referral_earnings')
      .select('level, amount, from_user_id')
      .eq('user_id', profile.user_id);

    if (!error && data) {
      const grouped: Record<number, { total: number; users: Set<string> }> = {};
      data.forEach((curr) => {
        if (!grouped[curr.level]) grouped[curr.level] = { total: 0, users: new Set() };
        grouped[curr.level].total += Number(curr.amount);
        grouped[curr.level].users.add(curr.from_user_id);
      });
      setEarnings([
        { level: 1, total: grouped[1]?.total || 0, count: grouped[1]?.users.size || 0 },
        { level: 2, total: grouped[2]?.total || 0, count: grouped[2]?.users.size || 0 },
        { level: 3, total: grouped[3]?.total || 0, count: grouped[3]?.users.size || 0 },
      ]);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Join Samsung World Technology', text: 'Start investing and earning!', url: referralLink });
      } catch { /* user cancelled */ }
    } else {
      copyLink();
    }
  };

  const commissionLevels = [
    { level: 1, rate: '15%', color: 'from-primary to-secondary', members: level1.length, earned: earnings[0]?.total || 0 },
    { level: 2, rate: '4%', color: 'from-violet-500 to-purple-400', members: level2.length, earned: earnings[1]?.total || 0 },
    { level: 3, rate: '1%', color: 'from-blue-500 to-cyan-400', members: level3.length, earned: earnings[2]?.total || 0 },
  ];

  return (
    <div className="page-container bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link
          to="/dashboard"
          className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-card hover:shadow-lg-custom transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="text-xl font-bold text-foreground flex-1">Referral Program</h1>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-6 mb-5 shadow-button">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary-foreground/80" />
            <span className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">Your Referral Code</span>
          </div>
          <p className="text-3xl font-extrabold text-primary-foreground tracking-[0.2em] mb-4">
            {profile?.referral_code || 'XXXXXX'}
          </p>
          <div className="flex gap-2">
            <button onClick={copyLink} className="flex-1 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-primary-foreground font-semibold py-2.5 px-4 rounded-xl hover:bg-white/30 transition-all text-sm">
              <Copy className="w-4 h-4" /> Copy Link
            </button>
            <button onClick={shareLink} className="flex-1 flex items-center justify-center gap-2 bg-primary-foreground text-primary font-semibold py-2.5 px-4 rounded-xl hover:opacity-90 transition-all text-sm">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-card rounded-2xl p-3 shadow-card text-center">
          <p className="text-2xl font-bold text-primary">{teamMembers.length}</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Team Size</p>
        </div>
        <div className="bg-card rounded-2xl p-3 shadow-card text-center">
          <p className="text-2xl font-bold text-primary">{totalEarnings.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Earned (RWF)</p>
        </div>
        <div className="bg-card rounded-2xl p-3 shadow-card text-center">
          <p className="text-2xl font-bold text-primary">{(profile?.referral_balance || 0).toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Balance (RWF)</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-card rounded-2xl p-1 shadow-card mb-5">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'overview' ? 'gradient-primary text-primary-foreground shadow-button' : 'text-muted-foreground'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'team' ? 'gradient-primary text-primary-foreground shadow-button' : 'text-muted-foreground'}`}
        >
          My Team
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Commission Levels */}
          <div className="space-y-3 mb-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">Commission Tiers</h3>
            {commissionLevels.map((tier) => (
              <div key={tier.level} className="bg-card rounded-2xl p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <span className="text-sm font-bold text-white">L{tier.level}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-foreground">Level {tier.level}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${tier.color} text-white`}>{tier.rate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{tier.members} members</span>
                      <span className="text-sm font-bold text-primary">{tier.earned.toLocaleString()} RWF</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="bg-card rounded-2xl p-5 shadow-card mb-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">How It Works</h3>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Share your referral link with friends' },
                { step: '2', text: 'They sign up and start investing' },
                { step: '3', text: 'You earn commissions instantly!' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <p className="text-sm text-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Team Members */
        <div className="space-y-3">
          {/* Level filters */}
          <div className="flex gap-2 mb-1">
            {[
              { label: 'All', count: teamMembers.length },
              { label: 'L1', count: level1.length },
              { label: 'L2', count: level2.length },
              { label: 'L3', count: level3.length },
            ].map((f) => (
              <span key={f.label} className="text-xs bg-card shadow-card rounded-full px-3 py-1.5 text-muted-foreground font-medium">
                {f.label} <span className="text-primary font-bold">{f.count}</span>
              </span>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" />
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 shadow-card text-center">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground mb-1">No team members yet</p>
              <p className="text-sm text-muted-foreground">Share your referral link to start building your team!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-card rounded-2xl p-3.5 shadow-card flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{member.full_name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      L{member.level} · {new Date(member.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${member.invested_amount > 0 ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                    {member.invested_amount > 0 ? 'Active' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
