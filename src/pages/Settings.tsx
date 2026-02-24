import { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, LogOut, Shield, Bell, HelpCircle, Lock, Eye, EyeOff, MessageCircle, ChevronRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';

type SettingsPanel = null | 'profile' | 'security' | 'notifications' | 'help';

export default function Settings() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<SettingsPanel>(null);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: 'Profile', panel: 'profile' as SettingsPanel },
    { icon: Shield, label: 'Security', panel: 'security' as SettingsPanel },
    { icon: Bell, label: 'Notifications', panel: 'notifications' as SettingsPanel },
    { icon: HelpCircle, label: 'Help & Support', panel: 'help' as SettingsPanel },
  ];

  return (
    <div className="page-container bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/dashboard"
          className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-card hover:shadow-lg-custom transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="page-title mb-0 flex-1 text-left">Settings</h1>
      </div>

      {/* User Info */}
      <div className="bg-card rounded-3xl p-6 shadow-card mb-4 animate-slide-up">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{profile?.full_name || 'User'}</h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Phone className="w-4 h-4" />
              <span>{profile?.phone || '+250 XXX XXX XXX'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
              <Mail className="w-4 h-4" />
              <span>{user?.email || 'email@example.com'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-card rounded-3xl shadow-card mb-4 overflow-hidden animate-slide-up">
        {menuItems.map(({ icon: Icon, label, panel }, index) => (
          <button
            key={label}
            onClick={() => setActivePanel(panel)}
            className={`w-full flex items-center gap-4 p-4 hover:bg-accent transition-colors ${
              index !== menuItems.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-medium text-foreground flex-1 text-left">{label}</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-4 p-4 bg-card rounded-3xl shadow-card hover:bg-destructive/10 transition-colors animate-slide-up"
      >
        <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
          <LogOut className="w-5 h-5 text-destructive" />
        </div>
        <span className="font-medium text-destructive">Logout</span>
      </button>

      {/* Panel Overlays */}
      {activePanel && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={() => setActivePanel(null)}>
          <div className="bg-card rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-bold text-foreground text-lg">
                {activePanel === 'profile' && 'Profile'}
                {activePanel === 'security' && 'Security'}
                {activePanel === 'notifications' && 'Notifications'}
                {activePanel === 'help' && 'Help & Support'}
              </h2>
              <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-muted rounded-xl">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {activePanel === 'profile' && (
                <>
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                      <p className="font-medium text-foreground">{profile?.full_name || 'N/A'}</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                      <p className="font-medium text-foreground">{profile?.phone || 'N/A'}</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Referral Code</p>
                      <p className="font-medium text-primary">{profile?.referral_code || 'N/A'}</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                      <p className="font-medium text-foreground">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {activePanel === 'security' && (
                <>
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                      <Lock className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Password</p>
                        <p className="text-xs text-muted-foreground">Your password is encrypted and secure</p>
                      </div>
                      <Shield className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">SSL Encryption</p>
                        <p className="text-xs text-muted-foreground">All data is encrypted with 256-bit SSL</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Active</span>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                      <Eye className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Account Protection</p>
                        <p className="text-xs text-muted-foreground">Your account is protected against unauthorized access</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Secure</span>
                    </div>
                  </div>
                </>
              )}

              {activePanel === 'notifications' && (
                <>
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                      <Bell className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Deposit Notifications</p>
                        <p className="text-xs text-muted-foreground">Get notified when deposits are confirmed</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">On</span>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                      <Bell className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Withdrawal Notifications</p>
                        <p className="text-xs text-muted-foreground">Get notified when withdrawals are processed</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">On</span>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                      <Bell className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Daily Profit Notifications</p>
                        <p className="text-xs text-muted-foreground">Get notified when daily profits are credited</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">On</span>
                    </div>
                  </div>
                </>
              )}

              {activePanel === 'help' && (
                <>
                  <div className="space-y-3">
                    <a
                      href="https://chat.whatsapp.com/DRmt2Kr4cA4LGt4z0V7uMj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-muted/50 rounded-xl p-4 flex items-center gap-3 hover:bg-accent transition-colors block"
                    >
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">WhatsApp Support</p>
                        <p className="text-xs text-muted-foreground">Chat with our support team on WhatsApp</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </a>
                    <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">How to Invest</p>
                        <p className="text-xs text-muted-foreground">Deposit → Choose a product → Invest → Earn daily profits</p>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Minimum Deposit</p>
                        <p className="text-xs text-muted-foreground">The minimum deposit amount is 3,500 RWF</p>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Withdrawal Info</p>
                        <p className="text-xs text-muted-foreground">Min 1,000 RWF, max 1,000,000 RWF. 10% fee. Once per day.</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
