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
      if (!profile?.user_id) return;
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

  return (
    <div className="min-h-screen bg-[hsl(226_78%_90%)] pb-28">
      <div className="gradient-primary px-4 pt-6 pb-14 rounded-b-[2rem] shadow-lg-custom">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center active:scale-95 transition">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-black text-primary-foreground">Imishinga Yanjye</h1>
            <p className="text-xs text-primary-foreground/80">Imishinga yose waguze</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-3 -mt-10">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="dashboard-card p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wide">Ikora</p>
            </div>
            <p className="text-2xl font-black text-foreground">{activeCount}</p>
          </div>
          <div className="dashboard-card p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Wallet className="w-4 h-4 text-primary" />
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wide">Yashowe</p>
            </div>
            <p className="text-lg font-black text-foreground">
              {totalInvested.toLocaleString()} <span className="text-xs text-primary">RWF</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="dashboard-card p-8 text-center text-sm text-muted-foreground">Turi gukura amakuru...</div>
        ) : items.length === 0 ? (
          <div className="dashboard-card p-8 text-center">
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
              const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
              const daysPassed = Math.min(totalDays, Math.max(0, Math.round((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24))));
              const progress = Math.min(100, Math.round((daysPassed / totalDays) * 100));
              const isActive = it.status === 'active';
              return (
                <div key={it.id} className="dashboard-card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground leading-tight">{it.investment_products?.name || 'Umushinga'}</p>
                        <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">
                          {Number(it.amount).toLocaleString()} RWF
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                      {isActive ? <><Clock className="w-3 h-3" /> IKORA</> : <><CheckCircle2 className="w-3 h-3" /> YARANGIYE</>}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-muted/60 rounded-xl p-2.5">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Inyungu/Umunsi</p>
                      <p className="text-sm font-black text-primary">{Number(it.daily_profit).toLocaleString()} RWF</p>
                    </div>
                    <div className="bg-muted/60 rounded-xl p-2.5">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Iminsi</p>
                      <p className="text-sm font-black text-foreground">{daysPassed}/{totalDays}</p>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
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
