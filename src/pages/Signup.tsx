import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Phone, Lock, User, Gift, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { SuccessNotification } from '@/components/SuccessNotification';

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
    <div className="min-h-screen relative flex flex-col items-center justify-center px-5 py-10 overflow-hidden bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-400/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-sm animate-fade-in">
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-semibold tracking-widest text-white">ELITE STORE</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mt-5 tracking-tight">{t('auth.createAccount')}</h1>
        </div>

        <div className="bg-white rounded-3xl px-6 py-6 shadow-2xl border border-white/40">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-2xl mb-3 text-center border border-destructive/20">{error}</div>
          )}

          <form onSubmit={handleSignup} className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder={t('auth.fullName')} value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-gray-50 rounded-2xl pl-11 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all" required />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="tel" placeholder={t('auth.phone')} value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-gray-50 rounded-2xl pl-11 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all" required />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} placeholder={t('auth.password')} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 rounded-2xl pl-11 pr-12 py-3.5 text-gray-900 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type={showConfirmPassword ? 'text' : 'password'} placeholder={t('auth.confirmPassword')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-50 rounded-2xl pl-11 pr-12 py-3.5 text-gray-900 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all" required />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder={t('auth.invitationCode')} value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} className="w-full bg-gray-50 rounded-2xl pl-11 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 uppercase border border-gray-200 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 rounded-2xl hover:opacity-95 hover:scale-[1.01] transition-all active:scale-[0.98] disabled:opacity-60 shadow-lg shadow-pink-500/30 mt-2">
              {isLoading ? t('auth.creatingAccount') : t('auth.register')}
            </button>
          </form>

          <p className="text-center mt-5 text-gray-500 text-sm">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="text-fuchsia-600 font-bold hover:underline">{t('auth.login')}</Link>
          </p>
        </div>
      </div>

      <SuccessNotification isOpen={showWelcomeBonus} onClose={() => { setShowWelcomeBonus(false); navigate('/dashboard'); }} type="welcome" amount={1000} />
    </div>
  );
}
