import { useState, useEffect } from 'react';
import { Copy, Users, User, ArrowLeft, Share2, Gift, TrendingUp, Sparkles, QrCode } from 'lucide-react';
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
  const [activeLevel, setActiveLevel] = useState<0 | 1 | 2 | 3>(0);

  const referralCode = profile?.referral_code || 'XXXXXX';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const referralLink = `${origin}/register?ref=${referralCode}`;

  const level1 = teamMembers.filter((m) => m.level === 1);
  const level2 = teamMembers.filter((m) => m.level === 2);
  const level3 = teamMembers.filter((m) => m.level === 3);
  const totalIncome = earnings.reduce((sum, e) => sum + e.total, 0);
  const activeMembers = teamMembers.filter((m) => m.invested_amount > 0).length;

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

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} yakoporowe`);
  };

  const share = async () => {
    const shareData = {
      title: 'PETANE SHIPPING',
      text: `Injira uri kuri PETANE SHIPPING ukoresheje kode yanjye: ${referralCode}`,
      url: referralLink,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else copy(referralLink, 'Link');
    } catch {
      /* ignore */
    }
  };

  const tiers = [
    { level: 1 as const, rate: '10%', guests: level1.length, income: earnings[0]?.total || 0 },
    { level: 2 as const, rate: '3%', guests: level2.length, income: earnings[1]?.total || 0 },
    { level: 3 as const, rate: '1%', guests: level3.length, income: earnings[2]?.total || 0 },
  ];

  const displayedMembers =
    activeLevel === 0 ? teamMembers : teamMembers.filter((m) => m.level === activeLevel);

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-[hsl(0_0%_96%)]">
      {/* Header */}
      <div className="gradient-primary px-4 pt-4 pb-24 relative">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </Link>
          <h1 className="text-primary-foreground text-lg font-black tracking-tight">Tumira Inshuti</h1>
          <button
            onClick={share}
            className="w-10 h-10 rounded-xl bg-primary-foreground text-primary flex items-center justify-center shadow-md"
            aria-label="Sangiza"
          >
            <Share2 className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Hero income */}
        <div className="mt-5 text-primary-foreground">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary-foreground/70">
            Amafaranga wabonye
          </p>
          <p className="text-4xl font-black tabular-nums mt-1">
            {totalIncome.toLocaleString()}
            <span className="text-base font-bold text-primary-foreground/80 ml-1.5">RWF</span>
          </p>
          <div className="flex items-center gap-3 mt-2 text-[12px] font-semibold text-primary-foreground/85">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {teamMembers.length} bose
            </span>
            <span className="w-1 h-1 rounded-full bg-primary-foreground/50" />
            <span className="inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> {activeMembers} bakora
            </span>
          </div>
        </div>
      </div>

      {/* Overlapping invite card */}
      <div className="px-3 -mt-16 relative z-10">
        <div className="bg-card rounded-2xl shadow-card border border-border/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Kode Yawe
              </p>
              <p className="text-2xl font-black text-foreground tracking-widest mt-0.5 tabular-nums">
                {referralCode}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-primary" strokeWidth={2.3} />
            </div>
          </div>

          {/* Link row */}
          <div className="flex items-center gap-2 bg-muted/60 border border-border rounded-xl px-3 py-2.5">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Link yo kwinjira
              </p>
              <p className="text-[12px] font-semibold text-foreground truncate">{referralLink}</p>
            </div>
            <button
              onClick={() => copy(referralLink, 'Link')}
              className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center active:scale-95 transition"
              aria-label="Koporora"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={() => copy(referralCode, 'Kode')}
              className="flex items-center justify-center gap-1.5 bg-primary/10 text-primary font-bold text-[13px] py-2.5 rounded-xl active:scale-[0.98] transition"
            >
              <Copy className="w-4 h-4" /> Koporora Kode
            </button>
            <button
              onClick={share}
              className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-bold text-[13px] py-2.5 rounded-xl active:scale-[0.98] transition shadow-button"
            >
              <Share2 className="w-4 h-4" /> Sangiza
            </button>
          </div>
        </div>
      </div>

      {/* Commission tiers */}
      <div className="px-3 mt-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Komisiyo z'Urwego
          </p>
          <span className="text-[10px] font-bold text-primary">3 urwego</span>
        </div>
        <div className="bg-card rounded-2xl border border-border/60 divide-y divide-border/50 overflow-hidden">
          {tiers.map((t) => (
            <div key={t.level} className="flex items-center gap-3 p-3.5">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="text-sm font-black">L{t.level}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-foreground">Urwego rwa {t.level}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                    {t.rate}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t.guests} inshuti · {t.income.toLocaleString()} RWF wabonye
                </p>
              </div>
              <p className="text-sm font-black text-primary tabular-nums">
                +{t.income.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="px-3 mt-5">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-black text-foreground">Uko bikora</p>
          </div>
          <ul className="space-y-2">
            {[
              { n: '01', t: 'Sangiza kode yawe cyangwa link ku nshuti.' },
              { n: '02', t: 'Iyo yiyandikishije akanashora, wakira komisiyo ako kanya.' },
              { n: '03', t: 'Amafaranga ajya muri konti yawe ya referral vuba.' },
            ].map((s) => (
              <li key={s.n} className="flex gap-3">
                <span className="text-[11px] font-black text-primary/70 tabular-nums shrink-0 mt-0.5">
                  {s.n}
                </span>
                <p className="text-[12px] text-foreground leading-relaxed">{s.t}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Team list with filter */}
      <div className="px-3 mt-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Itsinda Ryawe
          </p>
          <span className="text-[10px] font-bold text-primary">{displayedMembers.length}</span>
        </div>

        {/* Level tabs */}
        <div className="bg-card rounded-xl border border-border/60 p-1 grid grid-cols-4 gap-1 mb-3">
          {[
            { key: 0 as const, label: 'Bose', count: teamMembers.length },
            { key: 1 as const, label: 'L1', count: level1.length },
            { key: 2 as const, label: 'L2', count: level2.length },
            { key: 3 as const, label: 'L3', count: level3.length },
          ].map((tab) => {
            const active = activeLevel === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveLevel(tab.key)}
                className={`py-2 rounded-lg text-[11px] font-bold transition ${
                  active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                {tab.label} · {tab.count}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-card rounded-xl border border-border/60">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedMembers.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/60 py-12 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <Gift className="w-8 h-8" strokeWidth={2} />
            </div>
            <p className="text-sm font-black text-foreground">Nta muntu urahamagara</p>
            <p className="text-[12px] text-muted-foreground mt-1 max-w-[240px] mx-auto">
              Sangiza kode yawe utangire wakire komisiyo.
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border/60 divide-y divide-border/50 overflow-hidden">
            {displayedMembers.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black text-sm">
                  {m.full_name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{m.full_name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Urwego {m.level} · {new Date(m.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    m.invested_amount > 0
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {m.invested_amount > 0 ? 'Arakora' : 'Ategereje'}
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
