import { useNavigate, Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Lock,
  LogOut,
  Wallet,
  Info,
  MessageCircle,
} from 'lucide-react';
import { LiveActivity, CompanyAchievements } from '@/components/LiveActivity';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function Settings() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);

  const formatRWF = (amount: number) => `${amount.toLocaleString()} RWF`;
  const handleLogout = async () => { await signOut(); navigate('/login'); };

  const name = profile?.full_name || 'User';
  const initials = name.split(' ').map(p => p.charAt(0)).slice(0, 2).join('').toUpperCase() || 'U';

  return (
    <div className="page-container bg-background">
      {/* Profile header with avatar */}
      <div className="bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 rounded-3xl p-5 mb-4 animate-fade-in text-white relative overflow-hidden shadow-button">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="relative flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-2xl border-2 border-white/40 shadow-lg">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold truncate">{name}</p>
            <p className="text-xs text-white/80">{profile?.phone || ''}</p>
          </div>
        </div>
        <p className="text-xs text-white/80">Account Balance</p>
        <p className="text-3xl font-extrabold mb-4">{formatRWF(profile?.main_balance || 0)}</p>

        <div className="grid grid-cols-2 gap-3">
          <Link to="/deposit" className="flex items-center justify-center gap-2 bg-white/20 border border-white/30 rounded-xl py-3 font-semibold text-sm hover:bg-white/30 transition-all">
            <Wallet className="w-4 h-4" /> Recharge
          </Link>
          <Link to="/withdraw" className="flex items-center justify-center gap-2 bg-white/20 border border-white/30 rounded-xl py-3 font-semibold text-sm hover:bg-white/30 transition-all">
            <ArrowUpFromLine className="w-4 h-4" /> Withdraw
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 animate-fade-in">
        <Link to="/history" className="gradient-primary rounded-xl p-4 flex items-start gap-2 hover:opacity-90 transition-all">
          <ArrowDownToLine className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-semibold text-primary-foreground">Recharge History</span>
        </Link>
        <Link to="/history" className="gradient-primary rounded-xl p-4 flex items-start gap-2 hover:opacity-90 transition-all">
          <ArrowUpFromLine className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-semibold text-primary-foreground">Withdraw History</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 animate-fade-in">
        <Link to="/referral" className="gradient-primary rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          <Users className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-bold text-primary-foreground">Invite Friends</span>
        </Link>
        <Link to="/withdraw" className="gradient-primary rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          <Wallet className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-bold text-primary-foreground">Withdraw Account</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 animate-fade-in">
        <button onClick={() => setPassOpen(true)} className="gradient-primary rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          <Lock className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-bold text-primary-foreground">Account Password</span>
        </button>
        <button onClick={() => setAboutOpen(true)} className="gradient-primary rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          <Info className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-bold text-primary-foreground">About Us</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 animate-fade-in">
        <a
          href="https://chat.whatsapp.com/HAWV3a3MW9G8ErOVRRdPSX?s=cl&p=a&ilr=1"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
        >
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="text-sm font-bold text-white">WhatsApp</span>
        </a>
        <button onClick={handleLogout} className="bg-destructive rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          <LogOut className="w-5 h-5 text-destructive-foreground" />
          <span className="text-sm font-bold text-destructive-foreground">Log Out</span>
        </button>
      </div>

      {/* Account info */}
      <div className="bg-card rounded-2xl p-4 shadow-card animate-fade-in">
        <h3 className="font-bold text-foreground mb-3">Account Info</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Name</span><span className="font-medium text-foreground">{name}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Phone</span><span className="font-medium text-foreground">{profile?.phone || 'N/A'}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Referral Code</span><span className="font-medium text-primary">{profile?.referral_code || 'N/A'}</span></div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Member Since</span>
            <span className="font-medium text-foreground">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <CompanyAchievements />
      <LiveActivity />

      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Info className="w-5 h-5 text-primary" /> About ELITESTORE</DialogTitle>
            <DialogDescription>The trusted way to grow your money in Rwanda.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-foreground">
            <p>ELITESTORE COMPANY is a leading digital investment platform helping thousands of Rwandans earn daily passive income through smart device-rental plans.</p>
            <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
              <li><span className="text-foreground font-semibold">128,450+</span> active investors</li>
              <li><span className="text-foreground font-semibold">4.2B RWF</span> paid out</li>
              <li>Daily profits credited automatically</li>
              <li>Withdrawals processed within 24 hours</li>
              <li>3-level referral commissions: 10% / 3% / 1%</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={passOpen} onOpenChange={setPassOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Lock className="w-5 h-5 text-primary" /> Account Password</DialogTitle>
            <DialogDescription>Contact our support team on WhatsApp to securely reset your password.</DialogDescription>
          </DialogHeader>
          <a
            href="https://chat.whatsapp.com/HAWV3a3MW9G8ErOVRRdPSX?s=cl&p=a&ilr=1"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { setPassOpen(false); toast.success('Opening WhatsApp...'); }}
            className="bg-[#25D366] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" /> Contact Support
          </a>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
