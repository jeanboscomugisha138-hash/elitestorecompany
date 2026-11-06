import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Phone, Lock, User, Gift, ArrowRight, UserPlus, ShieldCheck, Zap, BadgeCheck, Fingerprint, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { SuccessNotification } from '@/components/SuccessNotification';
import petaneLogo from '@/assets/rubis-logo-square.png';

export default function Signup() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setReferralCode(ref.toUpperCase());
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) { setError(t('auth.enterName')); return; }
    if (phone.length !== 10) { setError(t('auth.invalidPhone')); return; }
    if (password.length < 6) { setError(t('auth.passwordTooShort')); return; }
    if (password.length > 12) { setError('Ijambobanga rigomba kuba rifite inyuguti 12 cyangwa munsi'); return; }
    setIsLoading(true);
    const { error: signUpError } = await signUp(phone, password, fullName, referralCode || undefined);
    if (signUpError) { setError(signUpError.message); setIsLoading(false); return; }
    setShowWelcomeBonus(true);
  };

  return (
    <div className="auth-safe-page min-h-screen flex flex-col justify-center">
      <header className="px-5 pt-4 pb-3">
        <div className="max-w-sm mx-auto w-full flex flex-col items-center text-center gap-2">
          <div className="auth-safe-logo-box w-16 h-16 flex items-center justify-center shrink-0 !bg-transparent !border-0">
            <img src={petaneLogo} alt="Rubis Company" className="logo-halo h-16 w-16 object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">RUBIS COMPANY</p>
            <h1 className="text-foreground text-lg font-black leading-tight">{t('auth.createAccount')}</h1>
          </div>
        </div>
      </header>

      <main className="px-4 pb-6">
        <div className="max-w-sm mx-auto w-full">
          <section className="login-card">
            <div className="login-card-bar" />
            <div className="px-5 pt-4 pb-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Iyandikishe</p>
                  <p className="text-xl font-black text-foreground leading-tight mt-0.5">Kora Konti Nshya</p>
                  <p className="text-[11px] text-muted-foreground font-semibold mt-1">Uzuza amakuru yawe ukomeze</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shrink-0 shadow-[0_10px_22px_-12px_hsl(var(--primary))]">
                  <UserPlus className="w-5 h-5 text-primary-foreground" strokeWidth={2.4} />
                </div>
              </div>

              {error && (
                <div className="login-error mb-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-2">
                <div>
                  <label className="login-label" htmlFor="su-name">{t('auth.fullName')}</label>
                  <div className="login-field">
                    <span className="login-field-icon"><User className="w-4 h-4" strokeWidth={2.4} /></span>
                    <input id="su-name" type="text" autoComplete="name" placeholder={t('auth.fullName')} value={fullName} onChange={(e) => setFullName(e.target.value)} className="login-input" required />
                  </div>
                </div>

                <div>
                  <label className="login-label" htmlFor="su-phone">{t('auth.phone')}</label>
                  <div className="login-field">
                    <span className="login-field-icon"><Phone className="w-4 h-4" strokeWidth={2.4} /></span>
                    <input id="su-phone" type="tel" inputMode="numeric" pattern="[0-9]*" maxLength={10} placeholder={t('auth.phone')} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="login-input" required />
                  </div>
                </div>

                <div>
                  <label className="login-label" htmlFor="su-pass">{t('auth.password')}</label>
                  <div className="login-field">
                    <span className="login-field-icon"><Lock className="w-4 h-4" strokeWidth={2.4} /></span>
                    <input id="su-pass" type={showPassword ? 'text' : 'password'} autoComplete="new-password" maxLength={12} placeholder={t('auth.password')} value={password} onChange={(e) => setPassword(e.target.value.slice(0, 12))} className="login-input" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="login-eye shrink-0" aria-label={showPassword ? 'Hisha ijambobanga' : 'Erekana ijambobanga'}>
                      {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2.3} /> : <Eye className="w-4 h-4" strokeWidth={2.3} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="login-label" htmlFor="su-ref">Kode y'uwagutumiye</label>
                  <div className="login-field">
                    <span className="login-field-icon"><Gift className="w-4 h-4" strokeWidth={2.4} /></span>
                    <input id="su-ref" type="text" placeholder="Kode y'uwagutumiye" value={referralCode} readOnly tabIndex={-1} className="login-input uppercase tracking-widest cursor-default" />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="login-button w-full font-black text-[15px] py-3 active:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
                  {isLoading ? t('auth.creatingAccount') : t('auth.register')}
                  {!isLoading && <ArrowRight className="w-4 h-4" strokeWidth={2.6} />}
                </button>
              </form>
            </div>
          </section>

          <p className="login-hint mt-3">
            <Fingerprint className="w-3.5 h-3.5" strokeWidth={2.3} />
            Amakuru yawe arindwa na Rubis Company
          </p>

          <p className="mt-3 text-center text-sm font-bold text-foreground">{t('auth.haveAccount')} <Link to="/login" className="text-accent font-black underline underline-offset-4">{t('auth.login')}</Link></p>
        </div>
      </main>

      <SuccessNotification isOpen={showWelcomeBonus} onClose={() => { setShowWelcomeBonus(false); navigate('/dashboard'); }} type="welcome" amount={1000} />
    </div>
  );
}
