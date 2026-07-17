import { useState, useEffect } from 'react';
import { ArrowLeft, Banknote, Info, Copy, Check, Phone, User, Wallet, Shield, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { BottomNav } from '@/components/BottomNav';
import { SuccessNotification } from '@/components/SuccessNotification';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Deposit() {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 });
  const [hasPending, setHasPending] = useState(false);
  const { profile } = useAuth();
  const { settings } = useSiteSettings();

  const momoNumber = settings.payment_phone;
  const momoName = settings.payment_name;
  const minDeposit = parseInt(settings.min_deposit) || 10000;
  const maxDeposit = parseInt(settings.max_deposit) || 1000000;

  useEffect(() => {
    const checkPending = async () => {
      if (!profile?.user_id) return;
      const { data } = await supabase
        .from('deposit_transactions')
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('status', 'pending')
        .limit(1);
      setHasPending(!!(data && data.length > 0));
    };
    checkPending();
  }, [profile?.user_id, depositSuccess.show]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(momoNumber);
    setCopied(true);
    toast.success(t('deposit.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !name || !amount) return;
    if (isLoading) return;
    if (hasPending) { toast.error(t('deposit.pendingError')); return; }

    const amountNum = parseFloat(amount);
    if (amountNum < minDeposit) { toast.error(t('deposit.minError', { min: minDeposit.toLocaleString() })); return; }
    if (amountNum > maxDeposit) { toast.error(t('deposit.maxError', { max: maxDeposit.toLocaleString() })); return; }

    setIsLoading(true);

    const { error } = await supabase
      .from('deposit_transactions')
      .insert({ user_id: profile?.user_id, phone, full_name: name, amount: amountNum, status: 'pending' });

    if (error) { toast.error(t('deposit.failed')); setIsLoading(false); return; }

    setDepositSuccess({ show: true, amount: amountNum });
    setPhone(''); setName(''); setAmount('');
    setIsLoading(false);
  };

  const quickAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

  const steps = [
    { icon: Phone, label: t('deposit.step1'), desc: t('deposit.step1Desc', 'Ohereza kuri MoMo') },
    { icon: Banknote, label: t('deposit.step2'), desc: t('deposit.step2Desc', 'Uzuza amakuru') },
    { icon: CheckCircle2, label: t('deposit.step3'), desc: t('deposit.step3Desc', 'Tegereza ubufasha') },
  ];

  return (
    <div className="min-h-screen bg-[hsl(226_78%_90%)] pb-28">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 pt-6 pb-10 rounded-b-[2rem] shadow-lg-custom">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{t('deposit.title')}</h1>
            <p className="text-xs text-primary-foreground/75">{t('deposit.subtitle', 'Shyiramo amafaranga mu konti yawe')}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6">
        {/* Recipient Card */}
        <div className="bg-card rounded-3xl p-5 shadow-elevated border border-border/40 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{t('deposit.sendMoneyTo')}</p>
              <p className="text-lg font-bold text-foreground">{momoName}</p>
            </div>
          </div>

          <div className="bg-muted rounded-2xl p-4 mb-3">
            <p className="text-xs text-muted-foreground mb-1">{t('deposit.momoNumber', 'Nimero ya MoMo')}</p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-2xl font-extrabold text-foreground tracking-wide break-all">{momoNumber}</p>
              <button type="button" onClick={handleCopy} className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform shadow-button">
                {copied ? <Check className="w-5 h-5 text-primary-foreground" /> : <Copy className="w-5 h-5 text-primary-foreground" />}
              </button>
            </div>
          </div>

          <a href={`tel:${encodeURIComponent(momoNumber)}`} className="w-full bg-primary text-primary-foreground font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-button">
            <Phone className="w-5 h-5" />
            {t('deposit.callToPay')}
          </a>
        </div>

        {/* Steps */}
        <div className="bg-card rounded-3xl p-5 shadow-card border border-border/40 mb-4">
          <p className="text-sm font-bold text-foreground mb-4">{t('deposit.stepsTitle', 'Intambwe 3 gusa')}</p>
          <div className="relative flex items-start justify-between">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border mx-6" />
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center w-1/3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-2">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs font-bold text-foreground">{s.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-3xl p-5 shadow-elevated border border-border/40 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Banknote className="w-4 h-4 text-primary" />
            </div>
            <p className="text-base font-bold text-foreground">{t('deposit.paymentDetails')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block ml-1">{t('deposit.phoneNumber')}</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="tel" placeholder={t('deposit.phoneUsed')} value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field pl-11 text-sm" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block ml-1">{t('deposit.fullName')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder={t('deposit.nameUsed')} value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-11 text-sm" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block ml-1">{t('deposit.amount')}</label>
              <div className="relative">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="number" placeholder={t('deposit.minMax', { min: minDeposit.toLocaleString(), max: maxDeposit.toLocaleString() })} min={minDeposit} max={maxDeposit} value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field pl-11 text-sm font-bold" required />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-2 ml-1">{t('deposit.quickAmounts', 'Hitamo cyoroheje')}</p>
              <div className="flex gap-2 flex-wrap">
                {quickAmounts.map((q) => (
                  <button key={q} type="button" onClick={() => setAmount(String(q))} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${amount === String(q) ? 'bg-primary text-primary-foreground shadow-button' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
                    {q.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {hasPending && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground">{t('deposit.pendingDeposit')}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('deposit.pendingDepositDesc')}</p>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-button disabled:opacity-70" disabled={isLoading || hasPending}>
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />{t('deposit.submitting')}</>
              ) : hasPending ? (
                <><Clock className="w-4 h-4" />{t('deposit.pendingInProgress')}</>
              ) : (
                <><CheckCircle2 className="w-5 h-5" />{t('deposit.submitDeposit')}</>
              )}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-primary/5 rounded-3xl p-5 border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground mb-1">{t('deposit.howItWorks')}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('deposit.howItWorksDesc', { number: momoNumber, minutes: 15 })}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
          </div>
        </div>
      </div>

      <SuccessNotification isOpen={depositSuccess.show} onClose={() => setDepositSuccess({ show: false, amount: 0 })} type="deposit" amount={depositSuccess.amount} />
      <BottomNav />
    </div>
  );
}
