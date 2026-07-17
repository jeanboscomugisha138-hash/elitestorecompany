import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Phone, Lock, ArrowRight, ShieldCheck, Zap, BadgeCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import petaneLogo from '@/assets/petane-logo.png';

export default function Login() {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminTaps, setAdminTaps] = useState(0);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (phone.length < 10) { setError(t('auth.invalidPhone')); setIsLoading(false); return; }
    if (password.length < 6) { setError(t('auth.passwordTooShort')); setIsLoading(false); return; }
    const { error: signInError } = await signIn(phone, password);
    if (signInError) { setError(signInError.message); setIsLoading(false); return; }
    sessionStorage.setItem('justLoggedIn', 'true');
    toast.success(t('auth.welcomeBackToast'));
    navigate('/dashboard');
  };

  return (
    <div className="auth-safe-page min-h-screen flex flex-col justify-center">
      <header className="px-5 pt-4 pb-3">
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
            <img src={petaneLogo} alt="Petane Shipping" className="h-7 w-auto object-contain pointer-events-none" />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">PETANE SHIPPING</p>
            <h1 className="text-foreground text-base font-black leading-tight truncate">{t('auth.welcomeBack')}</h1>
          </div>
        </div>
      </header>

      <main className="px-4 pb-4">
        <div className="max-w-sm mx-auto w-full">
          <section className="auth-safe-panel px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black tracking-widest text-primary uppercase">Injira</p>
                <p className="text-lg font-black text-foreground leading-tight">Injira muri Konti</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={2.4} />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-xs font-semibold p-2.5 rounded-lg mb-3 text-center border border-destructive/20">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-muted-foreground ml-1 mb-1 block uppercase tracking-wider">{t('auth.phone')}</label>
                <div className="auth-safe-field flex items-center gap-2.5 px-3 py-2.5">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input type="tel" placeholder={t('auth.phonePlaceholder')} value={phone} onChange={(e) => setPhone(e.target.value)} className="auth-safe-input text-sm" required />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-muted-foreground ml-1 mb-1 block uppercase tracking-wider">{t('auth.password')}</label>
                <div className="auth-safe-field flex items-center gap-2.5 px-3 py-2.5">
                  <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input type={showPassword ? 'text' : 'password'} placeholder={t('auth.passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} className="auth-safe-input text-sm" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground shrink-0 p-1" aria-label="toggle">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="auth-safe-button w-full font-black text-sm py-3 active:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
                {isLoading ? t('auth.signingIn') : t('auth.login')}
                {!isLoading && <ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
              </button>
            </form>

            <div className="auth-safe-trust mt-4 grid grid-cols-3 gap-2 text-center px-2 py-2">
              {[
                { Icon: ShieldCheck, label: 'Umutekano' },
                { Icon: Zap, label: 'Byihuse' },
                { Icon: BadgeCheck, label: 'Byemejwe' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-0.5 min-w-0">
                  <Icon className="w-3.5 h-3.5 text-primary" strokeWidth={2.3} />
                  <span className="text-[9px] font-black truncate max-w-full">{label}</span>
                </div>
              ))}
            </div>
          </section>

          <p className="text-center mt-4 text-muted-foreground text-xs">
            {t('auth.newHere')} <Link to="/signup" className="text-primary font-black hover:underline">{t('auth.register')}</Link>
          </p>


        </div>
      </main>
    </div>
  );
}
