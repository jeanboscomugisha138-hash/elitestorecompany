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
    <div className="min-h-screen relative flex flex-col bg-[hsl(0_0%_96%)]">
      {/* Brand header band */}
      <div className="relative pt-10 pb-24 px-6" style={{ background: 'linear-gradient(135deg, hsl(226 78% 48%) 0%, hsl(228 84% 33%) 100%)', transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', isolation: 'isolate' }}>
        <div className="relative max-w-sm mx-auto w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center">
              <img src={petaneLogo} alt="Petane" className="h-7 w-auto brightness-0 invert" />
            </div>
            <div className="text-primary-foreground">
              <p className="text-[10px] font-bold tracking-[0.2em] text-primary-foreground/75">PETANE SHIPPING</p>
              <p className="text-sm font-black">Serivisi Nyayo</p>
            </div>
          </div>

          <h1 className="text-primary-foreground text-3xl font-black tracking-tight leading-tight">
            {t('auth.welcomeBack')}
          </h1>
          <p className="text-primary-foreground/85 text-sm mt-2 leading-relaxed max-w-[280px]">
            {t('auth.signInContinue')}
          </p>
        </div>
      </div>

      {/* Overlapping form card */}
      <div className="relative flex-1 px-4 -mt-16 pb-8">
        <div className="max-w-sm mx-auto w-full">
          <div className="bg-card rounded-3xl px-6 pt-7 pb-6 shadow-lg border border-border/40">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                  Injira
                </p>
                <p className="text-lg font-black text-foreground mt-0.5">Injira muri Konti</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
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
                <label className="text-[11px] font-bold text-muted-foreground ml-1 mb-2 block uppercase tracking-wider">
                  {t('auth.phone')}
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="tel"
                    placeholder={t('auth.phonePlaceholder')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-muted/60 rounded-xl pl-11 pr-4 py-3.5 text-foreground text-sm font-semibold placeholder:text-muted-foreground/70 placeholder:font-normal border-2 border-transparent focus:outline-none focus:border-primary focus:bg-card transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground ml-1 mb-2 block uppercase tracking-wider">
                  {t('auth.password')}
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-muted/60 rounded-xl pl-11 pr-12 py-3.5 text-foreground text-sm font-semibold placeholder:text-muted-foreground/70 placeholder:font-normal border-2 border-transparent focus:outline-none focus:border-primary focus:bg-card transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground font-black text-sm py-4 rounded-xl active:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? t('auth.signingIn') : t('auth.login')}
                {!isLoading && <ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
              </button>
            </form>
          </div>

          {/* Trust row */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              { Icon: ShieldCheck, label: 'Umutekano' },
              { Icon: Zap, label: 'Byihuse' },
              { Icon: BadgeCheck, label: 'Byemejwe' },
            ].map(({ Icon, label }) => (
              <div key={label} className="bg-card rounded-xl border border-border/60 py-2.5 flex flex-col items-center gap-1">
                <Icon className="w-4 h-4 text-primary" strokeWidth={2.3} />
                <span className="text-[10px] font-bold text-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* Sign up prompt */}
          <p className="text-center mt-6 text-muted-foreground text-sm">
            {t('auth.newHere')}{' '}
            <Link to="/signup" className="text-primary font-black hover:underline">
              {t('auth.register')}
            </Link>
          </p>

          <Link
            to="/admin"
            className="block text-center mt-3 text-[11px] font-semibold text-muted-foreground/70 hover:text-muted-foreground"
          >
            {t('auth.adminPanel')}
          </Link>
        </div>
      </div>
    </div>
  );
}
