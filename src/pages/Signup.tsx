import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SuccessNotification } from '@/components/SuccessNotification';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreed, setAgreed] = useState(false);
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

    if (!agreed) { setError('Please accept the terms'); return; }
    if (!fullName.trim()) { setError('Please enter your full name'); return; }
    if (phone.length < 10) { setError('Please enter a valid phone number'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    setIsLoading(true);
    const { error: signUpError } = await signUp(phone, password, fullName, referralCode || undefined);
    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }
    setShowWelcomeBonus(true);
  };

  return (
    <div className="min-h-screen bg-[#e9eae4] flex flex-col items-center justify-center px-5 py-8">
      <div className="w-full max-w-sm bg-white rounded-3xl px-6 py-8 shadow-card">
        <div className="flex justify-center mb-5">
          <div className="bg-primary text-primary-foreground font-bold text-sm tracking-wide px-5 py-2 rounded-md">
            ELITESTORE
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-center text-foreground mb-2">Register</h1>
        <p className="text-center text-primary font-semibold mb-6">
          🎁 Get 1,500 RWF welcome bonus!
        </p>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-3">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-[#f1f1ee] rounded-full px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#f1f1ee] rounded-full px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f1f1ee] rounded-full px-6 py-4 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#f1f1ee] rounded-full px-6 py-4 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <input
            type="text"
            placeholder="Invitation code (optional)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            className="w-full bg-[#f1f1ee] rounded-full px-6 py-4 text-foreground placeholder:text-muted-foreground uppercase focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          <label className="flex items-center gap-2 px-2 pt-1 text-sm text-foreground">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            Accept terms & conditions
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-foreground text-background font-semibold py-4 rounded-full hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60 mt-2"
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-5 text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold">
            Login
          </Link>
        </p>
      </div>

      <SuccessNotification
        isOpen={showWelcomeBonus}
        onClose={() => { setShowWelcomeBonus(false); navigate('/dashboard'); }}
        type="welcome"
        amount={1500}
      />
    </div>
  );
}
