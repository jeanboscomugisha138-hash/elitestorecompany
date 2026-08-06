import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Share2, Trophy, CheckCircle2, Users, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { BottomNav } from '@/components/BottomNav';
import { PopupModal } from '@/components/PopupModal';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TierRow {
  tier: string;
  required_referrals: number;
  min_invested: number;
  reward_amount: number;
  qualified: number;
  claimed: boolean;
}

const META: Record<string, { name: string; emoji: string; ring: string; chip: string }> = {
  bronze: { name: 'Bronze Ambassador', emoji: '🥉', ring: 'from-amber-500/20 to-amber-600/5', chip: 'bg-amber-500/15 text-amber-700' },
  silver: { name: 'Silver Ambassador', emoji: '🥈', ring: 'from-slate-400/25 to-slate-500/5', chip: 'bg-slate-400/20 text-slate-700' },
  gold: { name: 'Gold Ambassador', emoji: '🥇', ring: 'from-yellow-400/25 to-yellow-500/5', chip: 'bg-yellow-400/20 text-yellow-700' },
  diamond: { name: 'Diamond Ambassador', emoji: '💎', ring: 'from-cyan-400/25 to-blue-500/5', chip: 'bg-cyan-400/20 text-cyan-700' },
};

export default function Rewards() {
  const { profile, refreshProfile } = useAuth();
  const [tiers, setTiers] = useState<TierRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ name: string; amount: number } | null>(null);

  const referralCode = profile?.referral_code || '';
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${referralCode}`;

  const load = async () => {
    const { data, error } = await supabase.rpc('get_ambassador_progress');
    if (!error && data) setTiers(data as TierRow[]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (profile?.user_id) load();
  }, [profile?.user_id]);

  const claim = async (t: TierRow) => {
    if (claiming) return;
    setClaiming(t.tier);
    const { data, error } = await supabase.rpc('claim_ambassador_reward', { _tier: t.tier });
    setClaiming(null);
    if (error) {
      toast.error(error.message.replace(/^.*?:\s/, ''));
      return;
    }
    const amount = Number((data as any)?.amount || t.reward_amount);
    setSuccess({ name: META[t.tier]?.name || t.tier, amount });
    await Promise.all([load(), refreshProfile()]);
  };

  const share = async () => {
    const shareData = {
      title: 'Petane Shipping — Ambassador',
      text: `Injira kuri Petane Shipping ukoresheje kode yanjye: ${referralCode}`,
      url: referralLink,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        navigator.clipboard.writeText(referralLink);
        toast.success('Link yakoporowe');
      }
    } catch {
      /* ignore */
    }
  };

  const totalEarned = tiers.filter((t) => t.claimed).reduce((s, t) => s + Number(t.reward_amount), 0);

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-[hsl(226_78%_90%)]">
      {/* Header */}
      <div className="gradient-primary px-4 pt-4 pb-24 relative">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </Link>
          <h1 className="text-primary-foreground text-lg font-black tracking-tight">Shaka Ibihembo</h1>
          <button
            onClick={share}
            className="w-10 h-10 rounded-xl bg-primary-foreground text-primary flex items-center justify-center shadow-md"
            aria-label="Sangiza"
          >
            <Share2 className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-5 text-primary-foreground">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary-foreground/70">
            Porogaramu y'Ambassadors
          </p>
          <p className="text-3xl font-black tabular-nums mt-1">
            {totalEarned.toLocaleString()}
            <span className="text-base font-bold text-primary-foreground/80 ml-1.5">RWF</span>
          </p>
          <p className="text-[12px] font-semibold text-primary-foreground/85 mt-1">
            Ibihembo wamaze gufata
          </p>
        </div>
      </div>

      {/* Intro card */}
      <div className="px-3 -mt-16 relative z-10">
        <div className="bg-card rounded-2xl shadow-card border border-border/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Trophy className="w-5 h-5" strokeWidth={2.4} />
            </div>
            <p className="text-sm font-black text-foreground">Uko ubona ibihembo</p>
          </div>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Tumira inshuti zawe. Buri nshuti ishoye amafaranga asabwa ikubarirwa. Iyo wujuje umubare
            usabwa, buto ya <span className="font-bold text-foreground">Claim</span> ifunguka
            automatically kandi amafaranga ahita yiyongera kuri balance yawe.
          </p>
          <button
            onClick={share}
            className="mt-3 w-full bg-primary text-primary-foreground font-bold text-[13px] py-3 rounded-xl active:scale-[0.98] transition shadow-button flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Sangiza kode yawe
          </button>
        </div>
      </div>

      {/* Tier cards */}
      <div className="px-3 mt-5 space-y-3">
        {isLoading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-40 rounded-2xl bg-card border border-border/60" />
            ))
          : tiers.map((t) => {
              const meta = META[t.tier] || { name: t.tier, emoji: '🏅', ring: 'from-primary/20 to-primary/5', chip: 'bg-primary/10 text-primary' };
              const done = Math.min(t.qualified, t.required_referrals);
              const remaining = Math.max(0, t.required_referrals - t.qualified);
              const pct = Math.min(100, Math.round((t.qualified / t.required_referrals) * 100));
              const unlocked = remaining === 0;

              return (
                <div
                  key={t.tier}
                  className="bg-card rounded-2xl border border-border/60 shadow-card overflow-hidden"
                >
                  <div className={`bg-gradient-to-r ${meta.ring} px-4 py-3 flex items-center gap-3`}>
                    <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center text-2xl shadow-sm shrink-0">
                      {meta.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-foreground truncate">{meta.name}</p>
                      <p className="text-[11px] font-semibold text-muted-foreground">
                        {t.required_referrals} inshuti · buri wese ashoye +{Number(t.min_invested).toLocaleString()} RWF
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Igihembo</p>
                      <p className="text-base font-black text-primary tabular-nums">
                        {Number(t.reward_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                      <span className="inline-flex items-center gap-1 text-foreground">
                        <Users className="w-3.5 h-3.5 text-primary" /> {done}/{t.required_referrals} bujuje
                      </span>
                      <span className={remaining === 0 ? 'text-emerald-600' : 'text-muted-foreground'}>
                        {remaining === 0 ? 'Wujuje ibisabwa' : `Usigaje ${remaining}`}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {t.tier === 'diamond' && (
                      <p className="mt-2.5 text-[11px] font-semibold text-cyan-700 bg-cyan-500/10 rounded-lg px-2.5 py-2">
                        ✨ Bonus: uhabwa n'akazi muri Petane Shipping Company.
                      </p>
                    )}

                    {t.claimed ? (
                      <div className="mt-3 w-full bg-emerald-500/10 text-emerald-700 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Wamaze gufata igihembo
                      </div>
                    ) : unlocked ? (
                      <button
                        onClick={() => claim(t)}
                        disabled={claiming === t.tier}
                        className="mt-3 w-full bg-primary text-primary-foreground font-black text-sm py-3.5 rounded-xl shadow-button active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        {claiming === t.tier ? 'Birimo gukorwa...' : `Claim ${Number(t.reward_amount).toLocaleString()} RWF`}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="mt-3 w-full bg-muted text-muted-foreground font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4" /> Claim ifunze
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
      </div>

      {/* Success popup */}
      <PopupModal isOpen={!!success} onClose={() => setSuccess(null)} accent="success">
        {success && (
          <>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Trophy className="w-7 h-7" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Igihembo Cyakiriwe</span>
                </div>
                <h3 className="text-lg font-black text-foreground leading-tight">{success.name}</h3>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-muted/60 px-4 py-3 flex items-baseline justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Wongewe kuri balance</span>
              <span className="text-xl font-black text-foreground tabular-nums">
                +{success.amount.toLocaleString()} <span className="text-xs font-bold text-primary">RWF</span>
              </span>
            </div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Turagushimiye cyane ku bwitange wagaragaje mu gukwirakwiza Petane Shipping. Komeza
              gutumira inshuti ubone ibindi bihembo binini kurushaho.
            </p>

            <button
              onClick={() => setSuccess(null)}
              className="mt-5 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-3.5 rounded-2xl transition active:scale-[0.98]"
            >
              Byumvikanye
            </button>
          </>
        )}
      </PopupModal>

      <BottomNav />
    </div>
  );
}
