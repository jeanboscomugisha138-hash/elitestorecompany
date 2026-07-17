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
    <div className="auth-safe-page">
      <header className="auth-safe-header px-5 pt-8 pb-7">
        <div className="max-w-sm mx-auto w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="auth-safe-logo-box w-14 h-14 flex items-center justify-center shrink-0">
              <img src={petaneLogo} alt="Petane Shipping" className="h-10 w-auto object-contain" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary-foreground/80">PETANE SHIPPING</p>
              <p className="text-xl font-black leading-tight text-primary-foreground">Serivisi Nyayo</p>
            </div>
          </div>

          <h1 className="text-primary-foreground text-3xl font-black leading-tight">{t('auth.welcomeBack')}</h1>
          <p className="text-primary-foreground/90 text-base mt-2 leading-relaxed max-w-[300px] font-medium">{t('auth.signInContinue')}</p>
        </div>
      </header>

      <main className="px-4 pt-4 pb-8">
        <div className="max-w-sm mx-auto w-full">
          <section className="auth-safe-panel px-5 py-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] font-black tracking-widest text-primary uppercase">Injira</p>
                <p className="text-2xl font-black text-foreground mt-1">Injira muri Konti</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={2.4} />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-xs font-semibold p-3 rounded-xl mb-4 text-center border border-destructive/20">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-[11px] font-black text-muted-foreground ml-1 mb-2 block uppercase tracking-wider">{t('auth.phone')}</label>
                <div className="auth-safe-field flex items-center gap-3 px-4 py-4">
                  <Phone className="w-5 h-5 text-muted-foreground shrink-0" />
                  <input type="tel" placeholder={t('auth.phonePlaceholder')} value={phone} onChange={(e) => setPhone(e.target.value)} className="auth-safe-input text-base" required />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-muted-foreground ml-1 mb-2 block uppercase tracking-wider">{t('auth.password')}</label>
                <div className="auth-safe-field flex items-center gap-3 px-4 py-4">
                  <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                  <input type={showPassword ? 'text' : 'password'} placeholder={t('auth.passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} className="auth-safe-input text-base" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground shrink-0 p-1" aria-label="Hindura uko ijambobanga rigaragara">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="auth-safe-button w-full font-black text-base py-4 active:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                {isLoading ? t('auth.signingIn') : t('auth.login')}
                {!isLoading && <ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
              </button>
            </form>

            <div className="auth-safe-trust mt-5 grid grid-cols-3 gap-2 text-center px-2 py-3">
              {[
                { Icon: ShieldCheck, label: 'Umutekano' },
                { Icon: Zap, label: 'Byihuse' },
                { Icon: BadgeCheck, label: 'Byemejwe' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 min-w-0">
                  <Icon className="w-4 h-4 text-primary" strokeWidth={2.3} />
                  <span className="text-[10px] font-black truncate max-w-full">{label}</span>
                </div>
              ))}
            </div>
          </section>

          <p className="text-center mt-6 text-muted-foreground text-sm">
            {t('auth.newHere')} <Link to="/signup" className="text-primary font-black hover:underline">{t('auth.register')}</Link>
          </p>

          <Link to="/admin" className="block text-center mt-3 text-[11px] font-semibold text-muted-foreground/70 hover:text-muted-foreground">
            {t('auth.adminPanel')}
          </Link>
        </div>
      </main>
    </div>
  );
}
