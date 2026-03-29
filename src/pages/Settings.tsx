import { useNavigate, Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  Users,
  Lock,
  LogOut,
  Gift,
  Wallet,
} from 'lucide-react';

export default function Settings() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();

  const formatRWF = (amount: number) => `${amount.toLocaleString()} RWF`;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="page-container bg-background">
      {/* Balance Section */}
      <div className="gradient-primary rounded-2xl p-5 mb-4 animate-fade-in">
        <p className="text-sm text-primary-foreground/80">Account Balance (RWF)</p>
        <p className="text-3xl font-extrabold text-primary-foreground mb-4">
          {formatRWF(profile?.main_balance || 0)}
        </p>

        {/* Recharge & Withdraw */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Link
            to="/deposit"
            className="flex items-center justify-center gap-2 bg-primary-foreground/20 border border-primary-foreground/30 rounded-xl py-3 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/30 transition-all"
          >
            <Wallet className="w-4 h-4" /> Recharge
          </Link>
          <Link
            to="/withdraw"
            className="flex items-center justify-center gap-2 bg-primary-foreground/20 border border-primary-foreground/30 rounded-xl py-3 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/30 transition-all"
          >
            <ArrowUpFromLine className="w-4 h-4" /> Withdraw
          </Link>
        </div>

        {/* Redeem Gift Code */}
        <div className="bg-pink-400 rounded-xl p-4 flex items-center gap-3">
          <Gift className="w-8 h-8 text-primary-foreground" />
          <div>
            <p className="font-bold text-primary-foreground text-sm">Redeem Gift Code</p>
            <p className="text-xs text-primary-foreground/80">Get bonus money instantly</p>
          </div>
        </div>
      </div>

      {/* History Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fade-in">
        <Link
          to="/history"
          className="gradient-primary rounded-xl p-4 flex items-start gap-2 hover:opacity-90 transition-all"
        >
          <ArrowDownToLine className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-semibold text-primary-foreground">Recharge History</span>
        </Link>
        <Link
          to="/history"
          className="gradient-primary rounded-xl p-4 flex items-start gap-2 hover:opacity-90 transition-all"
        >
          <ArrowUpFromLine className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-semibold text-primary-foreground">Withdraw History</span>
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-3 animate-fade-in">
        <Link
          to="/referral"
          className="gradient-primary rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
        >
          <Users className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-bold text-primary-foreground">Invite Friends</span>
        </Link>
        <Link
          to="/withdraw"
          className="gradient-primary rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
        >
          <Wallet className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-bold text-primary-foreground">Withdraw Account</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 animate-fade-in">
        <button
          className="gradient-primary rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
        >
          <Lock className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-bold text-primary-foreground">Account Password</span>
        </button>
        <button
          onClick={handleLogout}
          className="bg-destructive rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
        >
          <LogOut className="w-5 h-5 text-destructive-foreground" />
          <span className="text-sm font-bold text-destructive-foreground">Log Out</span>
        </button>
      </div>

      {/* User Info */}
      <div className="bg-card rounded-2xl p-4 shadow-card animate-fade-in">
        <h3 className="font-bold text-foreground mb-3">Account Info</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium text-foreground">{profile?.full_name || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Phone</span>
            <span className="font-medium text-foreground">{profile?.phone || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Referral Code</span>
            <span className="font-medium text-primary">{profile?.referral_code || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Member Since</span>
            <span className="font-medium text-foreground">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
