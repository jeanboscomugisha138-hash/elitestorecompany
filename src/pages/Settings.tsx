import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Lock,
  LogOut,
  Wallet,
  Headphones,
  MessageCircle,
  Languages,
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
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { OnlineServiceDialog } from '@/components/OnlineServiceDialog';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { settings } = useSiteSettings();
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [serviceOpen, setServiceOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const changeLang = (lng: 'rw' | 'en') => {
    i18n.changeLanguage(lng);
    localStorage.setItem('app_lang', lng);
    setLangOpen(false);
  };

  const formatRWF = (amount: number) => `${amount.toLocaleString()} RWF`;
  const handleLogout = async () => { await signOut(); navigate('/login'); };

  const name = profile?.full_name || 'User';
  const initials = name.split(' ').map(p => p.charAt(0)).slice(0, 2).join('').toUpperCase() || 'U';

  return (
    <div className="page-container bg-background">
      {/* Balance card */}
      <div className="profile-balance-card mb-4">
        <div className="flex items-center gap-4 mb-5">
          <div className="profile-avatar-circle w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-2xl">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold truncate">{name}</p>
            <p className="text-xs opacity-80">{profile?.phone || ''}</p>
          </div>
        </div>
        <p className="text-xs opacity-80">{t('settings.accountBalance')}</p>
        <p className="text-3xl font-extrabold mb-4">{formatRWF(profile?.main_balance || 0)}</p>

        <div className="grid grid-cols-2 gap-3">
          <Link to="/deposit" className="profile-card-button flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm">
            <Wallet className="w-4 h-4" /> {t('settings.recharge')}
          </Link>
          <Link to="/withdraw" className="profile-card-button flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm">
            <ArrowUpFromLine className="w-4 h-4" /> {t('dashboard.withdraw')}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Link to="/history" className="profile-tile profile-tile-primary rounded-xl p-4 flex items-start gap-2">
          <ArrowDownToLine className="w-5 h-5" />
          <span className="text-sm font-semibold">{t('settings.rechargeHistory')}</span>
        </Link>
        <Link to="/history" className="profile-tile profile-tile-secondary rounded-xl p-4 flex items-start gap-2">
          <ArrowUpFromLine className="w-5 h-5" />
          <span className="text-sm font-semibold">{t('settings.withdrawHistory')}</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Link to="/referral" className="profile-tile rounded-xl py-3 flex items-center justify-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold">{t('settings.inviteFriends')}</span>
        </Link>
        <Link to="/withdraw" className="profile-tile rounded-xl py-3 flex items-center justify-center gap-2">
          <Wallet className="w-5 h-5 text-secondary" />
          <span className="text-sm font-bold">{t('settings.withdrawAccount')}</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <button onClick={() => setPassOpen(true)} className="profile-tile rounded-xl py-3 flex items-center justify-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold">{t('settings.accountPassword')}</span>
        </button>
        <button onClick={() => setServiceOpen(true)} className="profile-tile rounded-xl py-3 flex items-center justify-center gap-2">
          <Headphones className="w-5 h-5 text-secondary" />
          <span className="text-sm font-bold">{t('settings.onlineService')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-3">
        <a
          href={settings.whatsapp_group_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] rounded-xl py-3 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="text-sm font-bold text-white">{t('settings.whatsapp')}</span>
        </a>
      </div>


      <div className="grid grid-cols-1 gap-3 mb-4">
        <button onClick={handleLogout} className="bg-destructive rounded-xl py-3 flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5 text-destructive-foreground" />
          <span className="text-sm font-bold text-destructive-foreground">{t('settings.logout')}</span>
        </button>
      </div>

      {/* Account info */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <h3 className="font-bold text-foreground mb-3">{t('settings.accountInfo')}</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t('settings.name')}</span><span className="font-medium text-foreground">{name}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t('settings.phone')}</span><span className="font-medium text-foreground">{profile?.phone || 'N/A'}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t('settings.referralCode')}</span><span className="font-medium text-primary">{profile?.referral_code || 'N/A'}</span></div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('settings.memberSince')}</span>
            <span className="font-medium text-foreground">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString(i18n.language === 'rw' ? 'rw-RW' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <CompanyAchievements />
      <LiveActivity />

      <OnlineServiceDialog open={serviceOpen} onOpenChange={setServiceOpen} />

      {/* Language switcher */}
      <Dialog open={langOpen} onOpenChange={setLangOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Languages className="w-5 h-5 text-primary" /> {t('settings.language')}</DialogTitle>
            <DialogDescription>{t('settings.languageDesc')}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <button
              onClick={() => changeLang('rw')}
              className={`rounded-xl py-3 font-bold border-2 ${i18n.language === 'rw' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground'}`}
            >
              🇷🇼 {t('settings.kinyarwanda')}
            </button>
            <button
              onClick={() => changeLang('en')}
              className={`rounded-xl py-3 font-bold border-2 ${i18n.language === 'en' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground'}`}
            >
              🇬🇧 {t('settings.english')}
            </button>
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
            href={settings.whatsapp_group_url}
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
