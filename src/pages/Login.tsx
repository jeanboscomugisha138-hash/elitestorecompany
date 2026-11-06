import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Phone, Lock, ArrowRight, ShieldCheck, Zap, BadgeCheck, ShieldAlert, Send, Fingerprint } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import petaneLogo from '@/assets/rubis-logo.png';

export default function Login() {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminTaps, setAdminTaps] = useState(0);
  const [lockedOpen, setLockedOpen] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (phone.length < 10) { setError(t('auth.invalidPhone')); setIsLoading(false); return; }
    if (password.length < 6) { setError(t('auth.passwordTooShort')); setIsLoading(false); return; }
    const { error: signInError } = await signIn(phone, password);
    if (signInError) {
      const msg = /invalid/i.test(signInError.message)
        ? "Nimero cyangwa ijambobanga ntibihuye. Ongera ugenzure, cyangwa usabe umuyobozi kuguhindurira ijambobanga."
        : "Kwinjira ntibyakunze. Ongera ugerageze nyuma gato.";
      setError(msg); setIsLoading(false); return;
    }
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('is_locked')
        .eq('user_id', authData.user.id)
        .maybeSingle();
      if (prof?.is_locked) {
        await supabase.auth.signOut();
        setIsLoading(false);
        setLockedOpen(true);
        return;
      }
    }
    sessionStorage.setItem('justLoggedIn', 'true');
    toast.success(t('auth.welcomeBackToast'));
    navigate('/dashboard');
  };

  return (
    <div className="auth-safe-page min-h-screen flex flex-col justify-center">
      {lockedOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 animate-fade-in" onClick={() => setLockedOpen(false)} />
          <div className="relative w-full max-w-[330px] bg-card rounded-3xl overflow-hidden shadow-2xl border border-border/50 animate-scale-in">
            <div className="h-1.5 w-full bg-gradient-to-r from-destructive via-destructive to-destructive/60" />
            <div className="px-5 pt-5 pb-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center mb-3">
                <ShieldAlert className="w-7 h-7 text-destructive" strokeWidth={2.3} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-destructive">Konti yafunzwe</p>
              <h2 className="text-base font-black text-foreground mt-1 leading-tight">Mukiriya wacu</h2>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">
                Account yawe yafunzwe by'agateganyo. Andikira umuyobozi wa Rubis Company agufashe.
              </p>
              <a
                href="https://t.me/petaneshipping"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-black active:opacity-90"
              >
                <Send className="w-4 h-4" /> Vugisha Umuyobozi
              </a>
              <button onClick={() => setLockedOpen(false)} className="mt-2 w-full py-2.5 rounded-xl bg-muted text-foreground text-xs font-bold">
                Funga
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="px-5 pt-4 pb-4">
        <div className="max-w-sm mx-auto w-full flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const next = adminTaps + 1;
              setAdminTaps(next);
              if (next >= 5) {
                setAdminTaps(0);
                navigate('/admin');
                return;
              }
              setTimeout(() => setAdminTaps(0), 1500);
            }}
            className="auth-safe-logo-box w-10 h-10 flex items-center justify-center shrink-0 bg-white rounded-xl"
            aria-label="logo"
          >
            <img src={petaneLogo} alt="Rubis Company" className="logo-halo h-7 w-auto object-contain pointer-events-none" />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">RUBIS COMPANY</p>
            <h1 className="text-foreground text-base font-black leading-tight truncate">{t('auth.welcomeBack')}</h1>
          </div>
        </div>
      </header>

      <main className="px-4 pb-6">
        <div className="max-w-sm mx-auto w-full">
          <section className="login-card">
            <div className="login-card-bar" />
            <div className="px-5 pt-5 pb-5">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Injira</p>
                  <p className="text-xl font-black text-foreground leading-tight mt-0.5">Injira muri Konti</p>
                  <p className="text-[11px] text-muted-foreground font-semibold mt-1">Kanda hano kugira ngo ukomeze</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shrink-0 shadow-[0_10px_22px_-12px_hsl(var(--primary))]">
                  <ShieldCheck className="w-5 h-5 text-primary-deep" strokeWidth={2.4} />
                </div>
              </div>

              {error && (
                <div className="bg-destructive/15 text-destructive text-xs font-bold p-3 rounded-xl mb-4 text-center border border-destructive/35">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="login-label" htmlFor="login-phone">{t('auth.phone')}</label>
                  <div className="login-field">
                    <span className="login-field-icon"><Phone className="w-4 h-4" strokeWidth={2.4} /></span>
                    <input
                      id="login-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={t('auth.phonePlaceholder')}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="login-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="login-label" htmlFor="login-password">{t('auth.password')}</label>
                  <div className="login-field">
                    <span className="login-field-icon"><Lock className="w-4 h-4" strokeWidth={2.4} /></span>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder={t('auth.passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="login-eye shrink-0"
                      aria-label={showPassword ? 'Hisha ijambobanga' : 'Erekana ijambobanga'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2.3} /> : <Eye className="w-4 h-4" strokeWidth={2.3} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-button w-full font-black text-[15px] py-3.5 active:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                >
                  {isLoading ? t('auth.signingIn') : t('auth.login')}
                  {!isLoading && <ArrowRight className="w-4 h-4" strokeWidth={2.6} />}
                </button>
              </form>

              <div className="auth-safe-trust mt-5 grid grid-cols-3 gap-2 text-center px-2 py-3">
                {[
                  { Icon: ShieldCheck, label: 'Umutekano' },
                  { Icon: Zap, label: 'Byihuse' },
                  { Icon: BadgeCheck, label: 'Byemejwe' },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 min-w-0">
                    <Icon className="w-4 h-4" strokeWidth={2.3} />
                    <span className="text-[9px] font-black truncate max-w-full">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <p className="login-hint mt-4">
            <Fingerprint className="w-3.5 h-3.5" strokeWidth={2.3} />
            Amakuru yawe arindwa na Rubis Company
          </p>

          <p className="text-center mt-2 text-muted-foreground text-xs font-semibold">
            {t('auth.newHere')} <Link to="/signup" className="text-primary font-black hover:underline">{t('auth.register')}</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
