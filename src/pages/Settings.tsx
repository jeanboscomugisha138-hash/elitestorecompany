import { ArrowLeft, User, Phone, LogOut, Shield, Bell, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';

export default function Settings() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: 'Profile', action: () => {} },
    { icon: Shield, label: 'Security', action: () => {} },
    { icon: Bell, label: 'Notifications', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
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
            <h3 className="font-semibold text-foreground">{user?.name || 'User'}</h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Phone className="w-4 h-4" />
              <span>{user?.phone || '+250 XXX XXX XXX'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-card rounded-3xl shadow-card mb-4 overflow-hidden animate-slide-up">
        {menuItems.map(({ icon: Icon, label, action }, index) => (
          <button
            key={label}
            onClick={action}
            className={`w-full flex items-center gap-4 p-4 hover:bg-accent transition-colors ${
              index !== menuItems.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-medium text-foreground">{label}</span>
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

      <BottomNav />
    </div>
  );
}
