import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function Login() {
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

    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const { error: signInError } = await signIn(phone, password);
    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    sessionStorage.setItem('justLoggedIn', 'true');
    toast.success('Welcome back!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#e9eae4] flex flex-col items-center justify-center px-5 py-8">
      <div className="w-full max-w-sm bg-white rounded-3xl px-6 py-8 shadow-card">
        {/* Brand badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary text-primary-foreground font-bold text-sm tracking-wide px-5 py-2 rounded-md">
            ELITESTORE
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-center text-foreground mb-1">Login</h1>
        <p className="text-center text-muted-foreground mb-8">Sign in to your account</p>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="tel"
            placeholder="Phone number"
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
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-foreground text-background font-semibold py-4 rounded-full hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-muted-foreground text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>

      <Link to="/admin" className="mt-6 text-sm text-muted-foreground hover:text-foreground">
        Admin Panel
      </Link>
    </div>
  );
}
