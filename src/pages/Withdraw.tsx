import { useState, useEffect } from 'react';
import { ArrowLeft, Phone, User, Banknote, CheckCircle2, Shield, Wallet, Clock, Edit3, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { SuccessNotification } from '@/components/SuccessNotification';
import { ErrorNotification } from '@/components/ErrorNotification';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Withdraw() {
  const { settings } = useSiteSettings();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 });
  const [errorPopup, setErrorPopup] = useState<{ show: boolean; title?: string; message: string }>({ show: false, message: '' });
  const [hasPending, setHasPending] = useState(false);
  const [savedAccount, setSavedAccount] = useState<{ phone: string; name: string } | null>(null);
  const [showBindForm, setShowBindForm] = useState(false);
  const { profile } = useAuth();

  const startHour = parseInt(settings.withdraw_start_hour || '7');
  const endHour = parseInt(settings.withdraw_end_hour || '22');
  const minWithdraw = 1000;
  const maxWithdraw = 1000000;

  useEffect(() => {
    const loadSavedAccount = async () => {
      if (!profile?.user_id) return;
      const { data } = await supabase
        .from('withdrawal_transactions')
        .select('phone, full_name')
        .eq('user_id', profile.user_id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        setSavedAccount({ phone: data[0].phone, name: data[0].full_name });
        setPhone(data[0].phone);
        setName(data[0].full_name);
      } else {
        setShowBindForm(true);
      }
    };
    loadSavedAccount();
  }, [profile?.user_id]);

  useEffect(() => {
    const checkPending = async () => {
      if (!profile?.user_id) return;
      const { data } = await supabase
        .from('withdrawal_transactions')
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('status', 'pending')
        .limit(1);
      setHasPending(!!(data && data.length > 0));
    };
    checkPending();
  }, [profile?.user_id, withdrawSuccess.show]);

  const fee = amount ? Math.round(parseFloat(amount) * 0.1) : 0;
  const amountToReceive = amount ? parseFloat(amount) - fee : 0;

  const showError = (message: string, title?: string) => setErrorPopup({ show: true, title, message });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const hour = new Date().getHours();
    if (hour < startHour || hour >= endHour) {
      showError(`Ubwikuze bwemewe hagati ya saa ${startHour}:00 na ${endHour}:00 gusa. Ongera ugerageze mu masaha akora.`, 'Ntabwo ari amasaha akora');
      return;
    }
    if (hasPending) { showError('Ufite ubwikuze bwaheruka bugitegereje kwemezwa. Tegereza bwemezwe mbere yo gukora ubundi.', 'Hari ubwikuze butegereje'); return; }
    if (!phone.trim() || phone.replace(/\D/g,'').length < 10) { showError('Andika nimero ya telefoni y\'imibare 10 uzakoresha ubwikuze.', 'Nimero si nziza'); return; }
    if (!name.trim()) { showError('Andika amazina uko yanditse kuri konti ya MoMo.', 'Amazina arabura'); return; }

    const amountNum = parseInt(amount);
    if (!amount || isNaN(amountNum)) { showError('Andikamo amafaranga ushaka kwikuza.', 'Amafaranga ntayo'); return; }
    if ((profile?.invested_amount || 0) <= 0) { showError('Kugira ngo wikuze amafaranga, ugomba kubanza kugura umushinga.', 'Ntabwo ushobora kwikuza'); return; }
    if (amountNum < minWithdraw) { showError(`Amafaranga make ushobora kwikuza ni ${minWithdraw.toLocaleString()} RWF.`, 'Amafaranga ni make'); return; }
    if (amountNum > maxWithdraw) { showError(`Amafaranga menshi ushobora kwikuza ni ${maxWithdraw.toLocaleString()} RWF.`, 'Amafaranga ni menshi'); return; }
    if (amountNum > (profile?.main_balance || 0)) { showError('Ntufite amafaranga ahagije kuri konti yawe. Reba balance yawe.', 'Balance ntihagije'); return; }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: todayWithdrawals } = await supabase
      .from('withdrawal_transactions')
      .select('id')
      .eq('user_id', profile?.user_id)
      .gte('created_at', today.toISOString())
      .limit(1);

    if (todayWithdrawals && todayWithdrawals.length > 0) {
      showError('Wemerewe kwikuza rimwe ku munsi gusa. Garuka ejo.', 'Wamaze kwikuza uyu munsi');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from('withdrawal_transactions')
      .insert({ user_id: profile?.user_id, phone, full_name: name, amount: amountNum, status: 'pending' });

    if (error) { showError('Ntibyakunze kohereza ubwikuze bwawe. Gerageza nanone.', 'Ubwikuze ntibwohererejwe'); setIsLoading(false); return; }

    setSavedAccount({ phone, name });
    setShowBindForm(false);
    setWithdrawSuccess({ show: true, amount: amountNum });
    setAmount('');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[hsl(226_78%_90%)] pb-28">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 pt-6 pb-10 rounded-b-[2rem] shadow-lg-custom">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Kwikuza Amafaranga</h1>
            <p className="text-xs text-primary-foreground/75">Ohereza amafaranga kuri MoMo yawe</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6">
        {/* Balance card */}
        <div className="bg-card rounded-3xl p-5 shadow-elevated border border-border/40 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Balance ihari</p>
          </div>
          <p className="text-3xl font-extrabold text-foreground tracking-tight">
            {(profile?.main_balance || 0).toLocaleString()} <span className="text-sm font-bold text-primary">RWF</span>
          </p>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/40 text-[11px] font-semibold text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Amasaha yo kwikuza: <span className="text-primary">{startHour}:00 - {endHour}:00</span></span>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-card rounded-3xl p-5 shadow-elevated border border-border/40 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Banknote className="w-4 h-4 text-primary" />
            </div>
            <p className="text-base font-bold text-foreground">Amafaranga wikuza</p>
          </div>

          <div className="relative mb-3">
            <input
              type="number"
              placeholder="Andikamo amafaranga"
              min={minWithdraw}
              max={maxWithdraw}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-16 text-xl font-extrabold text-center rounded-2xl border-2 border-primary/20 bg-primary/5 focus:border-primary focus:bg-white focus:outline-none transition-colors placeholder:text-muted-foreground/50 placeholder:text-sm placeholder:font-semibold"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary">RWF</span>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-muted-foreground">
            <span>Bito: <span className="text-primary">{minWithdraw.toLocaleString()} RWF</span></span>
            <span>Byinshi: <span className="text-primary">{maxWithdraw.toLocaleString()} RWF</span></span>
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="mt-4 rounded-2xl bg-muted p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Amafaranga</span>
                <span className="font-bold text-foreground">{parseFloat(amount).toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Amafaranga ya serivisi (10%)</span>
                <span className="font-bold text-destructive">-{fee.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border/60">
                <span className="text-xs font-semibold text-foreground">Uzahabwa</span>
                <span className="text-base font-extrabold text-primary">{amountToReceive.toLocaleString()} RWF</span>
              </div>
            </div>
          )}
        </div>

        {/* MoMo account */}
        <div className="bg-card rounded-3xl p-5 shadow-elevated border border-border/40 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <p className="text-base font-bold text-foreground">Konti ya MoMo</p>
            </div>
            {savedAccount && !showBindForm && (
              <button onClick={() => setShowBindForm(true)} className="text-xs font-bold text-primary flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 active:scale-95 transition-transform">
                <Edit3 className="w-3 h-3" />
                Hindura
              </button>
            )}
          </div>

          {savedAccount && !showBindForm ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted">
                <span className="text-xs text-muted-foreground font-medium">Nimero</span>
                <span className="text-sm font-bold text-foreground">{savedAccount.phone}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted">
                <span className="text-xs text-muted-foreground font-medium">Amazina</span>
                <span className="text-sm font-bold text-foreground">{savedAccount.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Konti yemejwe</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block ml-1">Nimero ya telefoni</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="tel" placeholder="Nimero uzakoresha wikuza" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field pl-11 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block ml-1">Amazina yombi</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="Amazina yanditse kuri MoMo" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-11 text-sm" />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || hasPending}
          className="w-full bg-primary text-primary-foreground font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-button disabled:opacity-60 disabled:active:scale-100 mb-3"
        >
          {isLoading ? (
            <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Birimo gukorwa...</>
          ) : hasPending ? (
            <><Clock className="w-4 h-4" />Hari ubwikuze butegereje</>
          ) : (
            <><CheckCircle2 className="w-5 h-5" />Emeza Ubwikuze</>
          )}
        </button>

        <a href={settings.customer_service_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 bg-card rounded-2xl shadow-card border border-border/40 active:scale-[0.99] transition-transform">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Headphones className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Ukeneye ubufasha?</p>
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
