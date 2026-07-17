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
  const [refLocked, setRefLocked] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
      setRefLocked(true);
    }
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
      <header className="auth-safe-header px-5 pt-4 pb-4">
        <div className="max-w-sm mx-auto w-full flex items-center gap-3">
          <div className="auth-safe-logo-box w-11 h-11 flex items-center justify-center shrink-0">
            <img src={petaneLogo} alt="Petane Shipping" className="h-8 w-auto object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">PETANE SHIPPING</p>
            <h1 className="text-primary-foreground text-lg font-black leading-tight truncate">{t('auth.createAccount')}</h1>
          </div>
        </div>
      </header>

      <main className="px-4 pt-3 pb-6">
        <div className="max-w-sm mx-auto w-full">
          <section className="auth-safe-panel px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black tracking-widest text-primary uppercase">Iyandikishe</p>
                <p className="text-lg font-black text-foreground leading-tight">Kora Konti Nshya</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <UserPlus className="w-4 h-4 text-primary" strokeWidth={2.4} />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-xs font-semibold p-2.5 rounded-lg mb-3 text-center border border-destructive/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-muted-foreground ml-1 mb-1 block uppercase tracking-wider">{t('auth.fullName')}</label>
                <div className="auth-safe-field flex items-center gap-2.5 px-3 py-2.5">
                  <User className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input type="text" placeholder={t('auth.fullName')} value={fullName} onChange={(e) => setFullName(e.target.value)} className="auth-safe-input text-sm" required />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-muted-foreground ml-1 mb-1 block uppercase tracking-wider">{t('auth.phone')}</label>
                <div className="auth-safe-field flex items-center gap-2.5 px-3 py-2.5">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input type="tel" placeholder={t('auth.phone')} value={phone} onChange={(e) => setPhone(e.target.value)} className="auth-safe-input text-sm" required />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-muted-foreground ml-1 mb-1 block uppercase tracking-wider">{t('auth.password')}</label>
                <div className="auth-safe-field flex items-center gap-2.5 px-3 py-2.5">
                  <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input type={showPassword ? 'text' : 'password'} placeholder={t('auth.password')} value={password} onChange={(e) => setPassword(e.target.value)} className="auth-safe-input text-sm" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground shrink-0 p-1" aria-label="toggle">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-muted-foreground ml-1 mb-1 block uppercase tracking-wider">{t('auth.confirmPassword')}</label>
                <div className="auth-safe-field flex items-center gap-2.5 px-3 py-2.5">
                  <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input type={showConfirmPassword ? 'text' : 'password'} placeholder={t('auth.confirmPassword')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="auth-safe-input text-sm" required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-muted-foreground shrink-0 p-1" aria-label="toggle">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-muted-foreground ml-1 mb-1 block uppercase tracking-wider">
                  {t('auth.invitationCode')} <span className="text-muted-foreground/60 lowercase font-normal normal-case">(Bitegetswe)</span>
                </label>
                <div className="auth-safe-field flex items-center gap-2.5 px-3 py-2.5">
                  <Gift className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input type="text" placeholder={t('auth.invitationCode')} value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} className="auth-safe-input text-sm uppercase tracking-widest" />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="auth-safe-button w-full font-black text-sm py-3 active:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
                {isLoading ? t('auth.creatingAccount') : t('auth.register')}
                {!isLoading && <ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
              </button>
            </form>

            <div className="auth-safe-trust mt-4 grid grid-cols-3 gap-2 text-center px-2 py-2">
              {[
                { Icon: ShieldCheck, label: 'Umutekano' },
                { Icon: Zap, label: 'Byihuse' },
                { Icon: Users, label: '10K+' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-0.5 min-w-0">
                  <Icon className="w-3.5 h-3.5 text-primary" strokeWidth={2.3} />
                  <span className="text-[9px] font-black truncate max-w-full">{label}</span>
                </div>
              ))}
            </div>
          </section>

          <p className="text-center mt-4 text-muted-foreground text-xs">
            {t('auth.haveAccount')} <Link to="/login" className="text-primary font-black hover:underline">{t('auth.login')}</Link>
          </p>
        </div>
      </main>

      <SuccessNotification isOpen={showWelcomeBonus} onClose={() => { setShowWelcomeBonus(false); navigate('/dashboard'); }} type="welcome" amount={1000} />
    </div>
  );
}
