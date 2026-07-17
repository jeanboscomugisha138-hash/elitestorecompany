import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Phone, Lock, User, Gift, ArrowRight, UserPlus, ShieldCheck, Zap, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { SuccessNotification } from '@/components/SuccessNotification';
import petaneLogo from '@/assets/petane-logo.png';

export default function Signup() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (phone.length < 10) { setError(t('auth.invalidPhone')); return; }
    if (password.length < 6) { setError(t('auth.passwordTooShort')); return; }
    if (password !== confirmPassword) { setError(t('auth.passwordsDoNotMatch')); return; }
    setIsLoading(true);
    const { error: signUpError } = await signUp(phone, password, fullName, referralCode || undefined);
    if (signUpError) { setError(signUpError.message); setIsLoading(false); return; }
    setShowWelcomeBonus(true);
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

          <h1 className="text-primary-foreground text-3xl font-black leading-tight">
            {t('auth.createAccount')}
          </h1>
          <p className="text-primary-foreground/90 text-base mt-2 leading-relaxed max-w-[310px] font-medium">
            Fungura konti mu munota — utangire ushore vuba.
          </p>
        </div>
      </header>

      <main className="px-4 pt-4 pb-8">
        <div className="max-w-sm mx-auto w-full">
          <section className="auth-safe-panel px-5 py-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] font-black tracking-widest text-primary uppercase">Iyandikishe</p>
                <p className="text-2xl font-black text-foreground mt-1">Kora Konti Nshya</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-primary" strokeWidth={2.4} />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-xs font-semibold p-3 rounded-xl mb-4 text-center border border-destructive/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-muted-foreground ml-1 mb-2 block uppercase tracking-wider">{t('auth.fullName')}</label>
                <div className="auth-safe-field flex items-center gap-3 px-4 py-4">
                  <User className="w-5 h-5 text-muted-foreground shrink-0" />
                  <input type="text" placeholder={t('auth.fullName')} value={fullName} onChange={(e) => setFullName(e.target.value)} className="auth-safe-input text-base" required />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-muted-foreground ml-1 mb-2 block uppercase tracking-wider">{t('auth.phone')}</label>
                <div className="auth-safe-field flex items-center gap-3 px-4 py-4">
                  <Phone className="w-5 h-5 text-muted-foreground shrink-0" />
                  <input type="tel" placeholder={t('auth.phone')} value={phone} onChange={(e) => setPhone(e.target.value)} className="auth-safe-input text-base" required />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-muted-foreground ml-1 mb-2 block uppercase tracking-wider">{t('auth.password')}</label>
                <div className="auth-safe-field flex items-center gap-3 px-4 py-4">
                  <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                  <input type={showPassword ? 'text' : 'password'} placeholder={t('auth.password')} value={password} onChange={(e) => setPassword(e.target.value)} className="auth-safe-input text-base" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground shrink-0 p-1" aria-label="Hindura uko ijambobanga rigaragara">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-muted-foreground ml-1 mb-2 block uppercase tracking-wider">{t('auth.confirmPassword')}</label>
                <div className="auth-safe-field flex items-center gap-3 px-4 py-4">
                  <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                  <input type={showConfirmPassword ? 'text' : 'password'} placeholder={t('auth.confirmPassword')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="auth-safe-input text-base" required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-muted-foreground shrink-0 p-1" aria-label="Hindura uko ijambobanga rigaragara">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-muted-foreground ml-1 mb-2 block uppercase tracking-wider">
                  {t('auth.invitationCode')} <span className="text-muted-foreground/60 lowercase font-normal normal-case">(Bitegetswe)</span>
                </label>
                <div className="auth-safe-field flex items-center gap-3 px-4 py-4">
                  <Gift className="w-5 h-5 text-muted-foreground shrink-0" />
                  <input type="text" placeholder={t('auth.invitationCode')} value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} className="auth-safe-input text-base uppercase tracking-widest" />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="auth-safe-button w-full font-black text-base py-4 active:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                {isLoading ? t('auth.creatingAccount') : t('auth.register')}
                {!isLoading && <ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
              </button>
            </form>

            <div className="auth-safe-trust mt-5 grid grid-cols-3 gap-2 text-center px-2 py-3">
              {[
                { Icon: ShieldCheck, label: 'Umutekano' },
                { Icon: Zap, label: 'Byihuse' },
                { Icon: Users, label: '10K+ Bakoresha' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 min-w-0">
                  <Icon className="w-4 h-4 text-primary" strokeWidth={2.3} />
                  <span className="text-[10px] font-black truncate max-w-full">{label}</span>
                </div>
              ))}
            </div>
          </section>

          <p className="text-center mt-6 text-muted-foreground text-sm">
            {t('auth.haveAccount')} <Link to="/login" className="text-primary font-black hover:underline">{t('auth.login')}</Link>
          </p>
        </div>
      </main>

      <SuccessNotification isOpen={showWelcomeBonus} onClose={() => { setShowWelcomeBonus(false); navigate('/dashboard'); }} type="welcome" amount={1000} />
    </div>
  );
}
