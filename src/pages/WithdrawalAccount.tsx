import { useState } from 'react';
import { ArrowLeft, Wallet, Phone, User as UserIcon, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SuccessNotification } from '@/components/SuccessNotification';
import { ErrorNotification } from '@/components/ErrorNotification';

export default function WithdrawalAccount() {
  const { profile, refreshProfile } = useAuth();
  const bound = !!(profile?.withdraw_phone && profile?.withdraw_name);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<{ show: boolean; title?: string; message: string }>({ show: false, message: '' });
  const showError = (message: string, title?: string) => setErr({ show: true, title, message });

  const submit = async () => {
    if (bound || loading) return;
    const cleanedPhone = phone.replace(/\D/g, '');
    const cleanedName = name.trim();
    if (cleanedName.length < 3) return showError('Andika amazina yombi neza.', 'Amazina si yo');
    if (cleanedPhone.length !== 10) return showError("Andika nimero ya telefoni y'imibare 10.", 'Nimero si nziza');

    setLoading(true);

    // Uniqueness check: no other account already uses this phone as its withdraw account
    const { data: taken } = await supabase
      .from('profiles')
      .select('id')
      .eq('withdraw_phone', cleanedPhone)
      .neq('user_id', profile!.user_id)
      .limit(1);
    if (taken && taken.length > 0) {
      setLoading(false);
      return showError('Iyi nimero yamaze gukoreshwa kuri konti yindi. Koresha indi nimero.', 'Nimero yakoreshejwe');
    }

    const { error } = await supabase
      .from('profiles')
      .update({ withdraw_phone: cleanedPhone, withdraw_name: cleanedName })
      .eq('user_id', profile!.user_id);
    setLoading(false);

    if (error) {
      const msg = /unique|duplicate/i.test(error.message)
        ? 'Iyi nimero yamaze gukoreshwa kuri konti yindi. Koresha indi nimero.'
        : error.message || 'Ntibyakunze kubika konti. Gerageza nanone.';
      return showError(msg, 'Ikosa');
    }
    await refreshProfile();
    setSuccess(true);
    setName(''); setPhone('');
  };

  return (
    <div className="min-h-screen bg-[hsl(226_78%_90%)] pb-28">
      <div className="gradient-primary px-4 pt-6 pb-14 rounded-b-[2rem] shadow-lg-custom">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link to="/settings" className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center active:scale-95 transition">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-black text-primary-foreground">Konti yo Kwakira</h1>
            <p className="text-xs text-primary-foreground/80">Konti uzajya wakirira amafaranga</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-3 -mt-10">
        {bound ? (
          <div className="dashboard-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-base font-black text-foreground">Konti Yemejwe</p>
                <p className="text-[11px] text-muted-foreground font-semibold">Konti yawe irahamye kandi ntibishoboka kuyihindura.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted">
                <div className="flex items-center gap-2.5">
                  <UserIcon className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground font-bold">Amazina</span>
                </div>
                <span className="text-sm font-black text-foreground">{profile?.withdraw_name}</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground font-bold">Nimero</span>
                </div>
                <span className="text-sm font-black text-foreground">{profile?.withdraw_phone}</span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                Nta muntu ushobora guhindura cyangwa gusiba iyi konti. Kugira ngo uyihindure vugana na serivisi z'abakiriya.
              </p>
            </div>

            <Link to="/withdraw" className="mt-4 block w-full bg-primary text-primary-foreground text-center font-black py-3.5 rounded-2xl active:scale-[0.98] transition">
              Genda Kwakira Amafaranga
            </Link>
          </div>
        ) : (
          <div className="dashboard-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-base font-black text-foreground">Shyiramo Konti Ubikurizaho</p>
                <p className="text-[11px] text-muted-foreground font-semibold">Amazina na nimero uzajya ukoresha wakira.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-foreground mb-1.5 block ml-1">Amazina</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text" maxLength={60}
                    placeholder="Urugero: MUKAMANA Alice"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-11 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1.5 block ml-1">Nimero ya telefoni</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel" inputMode="numeric" maxLength={10}
                    placeholder="Urugero: 0788123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="input-field pl-11 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                Menya neza! Amakuru uzashyiraho ntabwo ushobora kuyahindura. Nimero imwe ntishobora gukoreshwa kuri konti zirenze imwe.
              </p>
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="mt-4 w-full bg-primary text-primary-foreground font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-60"
            >
              {loading ? 'Birimo kubikwa...' : <><CheckCircle2 className="w-5 h-5" /> Bika Konti Burundu</>}
            </button>
          </div>
        )}
      </div>

      <SuccessNotification
        isOpen={success}
        onClose={() => setSuccess(false)}
        type="gift"
        amount={0}
      />

      <ErrorNotification isOpen={err.show} onClose={() => setErr({ show: false, message: '' })} title={err.title} message={err.message} />
      <BottomNav />
    </div>
  );
}
