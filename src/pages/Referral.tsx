import { useState, useEffect } from 'react';
import { Copy, Users, User } from 'lucide-react';
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

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${profile?.referral_code || 'XXXXXX'}`;

  const level1 = teamMembers.filter(m => m.level === 1);
  const level2 = teamMembers.filter(m => m.level === 2);
  const level3 = teamMembers.filter(m => m.level === 3);
  const totalInvitedIncome = earnings.reduce((sum, e) => sum + e.total, 0);

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
    toast.success('Invitation link copied!');
  };

  const tiers = [
    { label: 'Level 1 team 10%', guests: level1.length, income: earnings[0]?.total || 0 },
    { label: 'Level 2 team 3%', guests: level2.length, income: earnings[1]?.total || 0 },
    { label: 'Level 3 team 1%', guests: level3.length, income: earnings[2]?.total || 0 },
  ];

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Top invitation link bar */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate font-medium">{referralLink}</p>
            <p className="text-xs text-secondary font-semibold mt-0.5">Invitation link</p>
          </div>
          <button
            onClick={copyLink}
            className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold px-6 py-2.5 rounded-full text-sm shadow-button hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Copy className="w-4 h-4" /> Copy
          </button>
        </div>
      </div>

      {/* Commission table */}
      <div className="mx-4 mt-2 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-button">
        <div className="grid grid-cols-3 px-4 py-3 text-xs font-semibold border-b border-primary-foreground/20">
          <span>Commission rate</span>
          <span className="text-center">Number of guests</span>
          <span className="text-right">Income</span>
        </div>
        {tiers.map((t, i) => (
          <div key={i} className="grid grid-cols-3 px-4 py-3 text-sm border-b border-primary-foreground/15 last:border-0">
            <span>{t.label}</span>
            <span className="text-center">{t.guests}</span>
            <span className="text-right">{t.income.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Two stat tiles */}
      <div className="grid grid-cols-2 gap-3 mx-4 mt-3">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-4 text-center shadow-button">
          <p className="text-2xl font-extrabold">{teamMembers.length}</p>
          <p className="text-xs mt-1 opacity-90">Number of guests</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 text-primary-foreground p-4 text-center shadow-button">
          <p className="text-2xl font-extrabold">RWF {totalInvitedIncome.toLocaleString()}</p>
          <p className="text-xs mt-1 opacity-90">Invited income</p>
        </div>
      </div>

      {/* Invitation bonus panel */}
      <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-br from-secondary via-primary to-primary text-primary-foreground p-4 shadow-button">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-primary-foreground rounded-full" />
          <h3 className="font-semibold">Invitation bonus</h3>
        </div>
        <div className="space-y-2 text-xs leading-relaxed text-primary-foreground/90">
          <p>When a friend you invite signs up and invests, you immediately receive a cash reward of <span className="font-bold text-primary-foreground">10%</span> of their investment amount.</p>
          <p>When members of your Level 2 team invest, you receive a <span className="font-bold text-primary-foreground">3%</span> cash bonus.</p>
          <p>When members of your Level 3 team invest, you receive a <span className="font-bold text-primary-foreground">1%</span> cash bonus.</p>
          <p>Once your team member invests, the cash bonus is instantly credited to your referral balance.</p>
        </div>
      </div>

      {/* Team members list */}
      <div className="mx-4 mt-3 mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-2 px-1">My team</h3>
        {isLoading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" />
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="bg-card rounded-2xl p-6 shadow-card text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center mx-auto mb-2">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <p className="font-semibold text-foreground text-sm">No team members yet</p>
            <p className="text-xs text-muted-foreground mt-1">Share your invitation link to start!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {teamMembers.map((m) => (
              <div key={m.id} className="bg-card rounded-2xl p-3 shadow-card flex items-center gap-3 border border-primary/10">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{m.full_name}</p>
                  <p className="text-[11px] text-muted-foreground">L{m.level} · {new Date(m.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${m.invested_amount > 0 ? 'bg-secondary/15 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                  {m.invested_amount > 0 ? 'Active' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
