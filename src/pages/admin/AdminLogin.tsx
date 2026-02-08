import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, Shield } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { adminLogin } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      adminLogin();
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-secondary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-secondary">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Drilltools Company</p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-3xl p-6 shadow-card animate-slide-up">
          <h2 className="text-xl font-bold text-foreground text-center mb-6">
            Admin Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            <button type="submit" className="w-full bg-secondary text-secondary-foreground font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
              Login to Admin
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
