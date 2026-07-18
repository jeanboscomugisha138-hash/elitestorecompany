import { useState, useEffect } from 'react';
import { ArrowLeft, Banknote, CheckCircle2, Shield, Wallet, Clock, Headphones, Lock, Phone, User as UserIcon, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { SuccessNotification } from '@/components/SuccessNotification';
import { ErrorNotification } from '@/components/ErrorNotification';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Withdraw() {
  const { settings } = useSiteSettings();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 });
  const [errorPopup, setErrorPopup] = useState<{ show: boolean; title?: string; message: string }>({ show: false, message: '' });
  const [hasPending, setHasPending] = useState(false);
  const [approvedCount, setApprovedCount] = useState(0);
  const [checking, setChecking] = useState(true);

  const startHour = parseInt(settings.withdraw_start_hour || '7');
  const endHour = parseInt(settings.withdraw_end_hour || '22');
  const minFirst = parseInt(settings.min_withdraw_first || '1000');
  const minRecurring = parseInt(settings.min_withdraw || '3000');
  const maxWithdraw = parseInt(settings.max_withdraw || '1000000');

  const isFirstWithdraw = approvedCount === 0;
  const minWithdraw = isFirstWithdraw ? minFirst : minRecurring;
  const bound = !!(profile?.withdraw_phone && profile?.withdraw_password);

  useEffect(() => {
    (async () => {
      if (!profile?.user_id) return;
      const { data: pend } = await supabase
        .from('withdrawal_transactions')
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('status', 'pending')
        .limit(1);
      setHasPending(!!(pend && pend.length > 0));

      const { data: apr } = await supabase
        .from('withdrawal_transactions')
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('status', 'approved');
      setApprovedCount(apr?.length || 0);
      setChecking(false);
    })();
  }, [profile?.user_id, withdrawSuccess.show]);

  const fee = amount ? Math.round(parseFloat(amount) * 0.1) : 0;
  const amountToReceive = amount ? parseFloat(amount) - fee : 0;

  const showError = (message: string, title?: string) => setErrorPopup({ show: true, title, message });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!bound) {
      showError('Ubanze wandike konti yo kwakira mbere yo gukora ibikuza bwa mbere.', 'Konti ntiragenwa');
      return;
    }

    const hour = new Date().getHours();
    if (hour < startHour || hour >= endHour) {
      showError(`Ibikuza byemewe hagati ya saa ${startHour}:00 na ${endHour}:00 gusa.`, 'Ntabwo ari amasaha akora');
      return;
    }
    if (hasPending) { showError('Ufite ibikuza byaheruka bigitegereje kwemezwa. Tegereza byemezwe.', 'Hari ibikuza bitegereje'); return; }

    const amountNum = parseInt(amount);
    if (!amount || isNaN(amountNum)) { showError('Andikamo amafaranga ushaka gukura.', 'Amafaranga ntayo'); return; }
    if ((profile?.invested_amount || 0) <= 0) { showError('Kugira ngo ubikuze, ugomba kubanza kugura umushinga.', 'Ntabwo ushobora gukura'); return; }
    if (amountNum < minWithdraw) { showError(`Amafaranga make ushobora gukura ni ${minWithdraw.toLocaleString()} RWF${isFirstWithdraw ? ' (ibikuza bya mbere)' : ''}.`, 'Amafaranga ni make'); return; }
    if (amountNum > maxWithdraw) { showError(`Amafaranga menshi ushobora gukura ni ${maxWithdraw.toLocaleString()} RWF.`, 'Amafaranga ni menshi'); return; }
    if (amountNum > (profile?.main_balance || 0)) { showError('Ntufite amafaranga ahagije kuri konti yawe.', 'Balance ntihagije'); return; }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: todayWithdrawals } = await supabase
      .from('withdrawal_transactions')
      .select('id')
      .eq('user_id', profile?.user_id)
      .gte('created_at', today.toISOString())
      .limit(1);
    if (todayWithdrawals && todayWithdrawals.length > 0) {
      showError('Wemerewe gukura amafaranga rimwe ku munsi gusa. Garuka ejo.', 'Wamaze gukura uyu munsi');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from('withdrawal_transactions')
      .insert({
        user_id: profile?.user_id,
        phone: profile!.withdraw_phone!,
        full_name: profile!.withdraw_name || profile!.full_name,
        amount: amountNum,
        status: 'pending',
      });
    setIsLoading(false);

    if (error) { showError('Ntibyakunze kohereza ibikuza. Gerageza nanone.', 'Ibikuza ntibyohererejwe'); return; }

    setWithdrawSuccess({ show: true, amount: amountNum });
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-[hsl(226_78%_90%)] pb-28">
      <div className="gradient-primary px-4 pt-6 pb-14 rounded-b-[2rem] shadow-lg-custom">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center active:scale-95 transition">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-black text-primary-foreground">Bikuza Amafaranga</h1>
            <p className="text-xs text-primary-foreground/80">Ohereza amafaranga kuri MoMo yawe</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-3 -mt-10">
        {/* Balance card */}
        <div className="dashboard-card p-5 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">Balance ihari</p>
          </div>
          <p className="text-3xl font-black text-foreground tracking-tight">
            {(profile?.main_balance || 0).toLocaleString()} <span className="text-sm font-black text-primary">RWF</span>
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Isaha: <span className="text-primary">{startHour}:00-{endHour}:00</span></span>
            </div>
            {!checking && (
              <span className="text-[10px] font-black px-2 py-1 rounded-full bg-primary/10 text-primary">
                {isFirstWithdraw ? 'UBWIKUZE BWA MBERE' : `UBWIKUZE #${approvedCount + 1}`}
              </span>
            )}
          </div>
        </div>

        {/* Bound account banner */}
        {!bound ? (
          <div className="dashboard-card p-4 mb-3 border-l-4 border-amber-500">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-black text-foreground">Konti ntiragenwa</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Ubanze wandike konti yo kwakira. Igenwa rimwe gusa kandi ntishobora guhindurwa.</p>
                <button
                  onClick={() => navigate('/withdrawal-account')}
                  className="mt-3 bg-primary text-primary-foreground text-xs font-black px-4 py-2 rounded-xl active:scale-95 transition"
                >
                  Genya Konti
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-card p-4 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Konti yo kwakira</p>
                  <p className="text-sm font-black text-foreground">{profile?.withdraw_phone}</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">YEMEJWE</span>
            </div>
          </div>
        )}

        {/* Amount */}
        <div className="dashboard-card p-5 mb-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Banknote className="w-4 h-4 text-primary" />
            </div>
            <p className="text-base font-black text-foreground">Amafaranga wikuza</p>
          </div>

          <div className="relative mb-3">
            <input
              type="number" inputMode="numeric"
              placeholder="Andikamo amafaranga"
              min={minWithdraw} max={maxWithdraw}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-16 text-xl font-black text-center rounded-2xl border-2 border-primary/20 bg-primary/5 focus:border-primary focus:bg-white focus:outline-none transition-colors placeholder:text-muted-foreground/50 placeholder:text-sm"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-primary">RWF</span>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] font-bold text-muted-foreground">
            <span>Bito: <span className="text-primary">{minWithdraw.toLocaleString()} RWF</span></span>
            <span>Byinshi: <span className="text-primary">{maxWithdraw.toLocaleString()} RWF</span></span>
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="mt-4 rounded-2xl bg-muted p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Amafaranga</span>
                <span className="font-black text-foreground">{parseFloat(amount).toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Serivisi (10%)</span>
                <span className="font-black text-destructive">-{fee.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border/60">
                <span className="text-xs font-bold text-foreground">Uzahabwa</span>
                <span className="text-base font-black text-primary">{amountToReceive.toLocaleString()} RWF</span>
              </div>
            </div>
          )}
        </div>

        {/* Password */}
        {bound && (
          <div className="dashboard-card p-5 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <p className="text-base font-black text-foreground">Ijambobanga ryo Kwakira</p>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Andika ijambobanga ryawe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-11 pr-11 text-sm"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground p-1">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading || hasPending || !bound}
          className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-lg-custom disabled:opacity-60 mb-3"
        >
          {isLoading ? (
            <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Birimo gukorwa...</>
          ) : hasPending ? (
            <><Clock className="w-4 h-4" />Hari ubwikuze butegereje</>
          ) : (
            <><CheckCircle2 className="w-5 h-5" />Emeza Ubwikuze</>
          )}
        </button>

        <a href={settings.customer_service_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 dashboard-card active:scale-[0.99] transition">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Headphones className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-foreground">Ukeneye ubufasha?</p>
            <p className="text-[11px] text-muted-foreground">Vugana na serivisi z'abakiriya</p>
          </div>
        </a>
      </div>

      <SuccessNotification isOpen={withdrawSuccess.show} onClose={() => setWithdrawSuccess({ show: false, amount: 0 })} type="withdraw" amount={withdrawSuccess.amount} />
      <ErrorNotification isOpen={errorPopup.show} onClose={() => setErrorPopup({ show: false, message: '' })} title={errorPopup.title} message={errorPopup.message} />
      <BottomNav />
    </div>
  );
}
