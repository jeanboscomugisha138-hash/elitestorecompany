import { useEffect, useState } from 'react';
import { ArrowLeft, Package, TrendingUp, Calendar, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Investment {
  id: string;
  amount: number;
  daily_profit: number;
  start_date: string;
  end_date: string;
  status: string;
  investment_products: { name: string } | null;
}

export default function MyInvestments() {
  const { profile } = useAuth();
  const [items, setItems] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!profile?.user_id) { setLoading(false); return; }
      const { data } = await supabase
        .from('user_investments')
        .select('id, amount, daily_profit, start_date, end_date, status, investment_products(name)')
        .eq('user_id', profile.user_id)
        .order('created_at', { ascending: false });
      setItems((data as unknown as Investment[]) || []);
      setLoading(false);
    })();
  }, [profile?.user_id]);

  const activeCount = items.filter(i => i.status === 'active').length;
  const totalInvested = items.reduce((s, i) => s + Number(i.amount), 0);
  const totalDaily = items.filter(i => i.status === 'active').reduce((s, i) => s + Number(i.daily_profit), 0);

  return (
    <div
      className="min-h-screen bg-[hsl(226_78%_96%)] pb-28"
      style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)', backfaceVisibility: 'hidden', isolation: 'isolate' }}
    >
      {/* Flat header — no gradient, no overlap, avoids Samsung/Chrome banding artifacts */}
      <header className="bg-primary px-4 pt-5 pb-5">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center active:scale-95 transition">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-primary-foreground leading-tight">Imishinga Yanjye</h1>
            <p className="text-xs text-primary-foreground/80">Imishinga yose waguze</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-3 pt-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white rounded-2xl p-3 border border-border">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Ikora</p>
            </div>
            <p className="text-xl font-black text-foreground leading-none">{activeCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-border">
            <div className="flex items-center gap-1.5 mb-1">
              <Wallet className="w-3.5 h-3.5 text-primary" />
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Yashowe</p>
            </div>
            <p className="text-sm font-black text-foreground leading-none">
              {totalInvested.toLocaleString()}
              <span className="text-[10px] text-primary ml-1">RWF</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-border">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Buri Munsi</p>
            </div>
            <p className="text-sm font-black text-primary leading-none">
              {totalDaily.toLocaleString()}
              <span className="text-[10px] ml-1">RWF</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center text-sm text-muted-foreground border border-border">
            Turi gukura amakuru...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-border">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <p className="text-base font-black text-foreground mb-1">Nta mushinga ufite</p>
            <p className="text-xs text-muted-foreground mb-4">Gura umushinga wa mbere kugira ngo utangire kwakira inyungu buri munsi.</p>
            <Link to="/products" className="inline-block bg-primary text-primary-foreground font-black text-sm px-6 py-3 rounded-2xl active:scale-95 transition">
              Gura Umushinga
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => {
              const start = new Date(it.start_date);
              const end = new Date(it.end_date);
              const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
              const daysPassed = Math.min(totalDays, Math.max(0, Math.round((Date.now() - start.getTime()) / 86400000)));
              const progress = Math.min(100, Math.round((daysPassed / totalDays) * 100));
              const isActive = it.status === 'active';
              return (
                <div key={it.id} className="bg-white rounded-2xl p-4 border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-foreground leading-tight truncate">{it.investment_products?.name || 'Umushinga'}</p>
                        <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">
                          {Number(it.amount).toLocaleString()} RWF
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full shrink-0 ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                      {isActive ? <><Clock className="w-3 h-3" /> IKORA</> : <><CheckCircle2 className="w-3 h-3" /> YARANGIYE</>}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-muted/50 rounded-xl p-2.5">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Inyungu/Umunsi</p>
                      <p className="text-sm font-black text-primary">{Number(it.daily_profit).toLocaleString()} RWF</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-2.5">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Iminsi</p>
                      <p className="text-sm font-black text-foreground">{daysPassed}/{totalDays}</p>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {start.toLocaleDateString('rw-RW')}</span>
                    <span>{end.toLocaleDateString('rw-RW')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
