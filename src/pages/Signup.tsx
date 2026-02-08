import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock, Shield, ArrowRight, Drill } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function Signup() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const { signup } = useApp();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && password && code) {
      signup(phone, 'New User');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-button">
            <Drill className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-secondary">Drilltools Company</h1>
          <p className="text-muted-foreground mt-1">Investment Platform</p>
        </div>

        {/* Signup Form */}
        <div className="bg-card rounded-3xl p-6 shadow-card animate-slide-up">
          <h2 className="text-xl font-bold text-foreground text-center mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field pl-12"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12"
                required
              />
            </div>

            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input-field pl-12"
                required
              />
            </div>

            <button type="submit" className="action-btn w-full flex items-center justify-center gap-2">
              Create Account
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center mt-6 text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
