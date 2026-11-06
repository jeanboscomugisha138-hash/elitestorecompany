import { NotificationBell } from '@/components/NotificationCenter';
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
  ChevronRight,
  Bell,
  Copy,
  Gift,
  Package,
  Star,
  Eye,
} from 'lucide-react';
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
import petaneLogo from '@/assets/rubis-logo-square.png';

export default function Settings() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [serviceOpen, setServiceOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [investedVisible, setInvestedVisible] = useState(true);

  const handleLogout = async () => { await signOut(); navigate('/login'); };
  const name = profile?.full_name || 'Umukiriya';
  const initials = name.split(' ').map(p => p.charAt(0)).slice(0, 2).join('').toUpperCase() || 'U';
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('rw-RW', { year: 'numeric', month: 'short' })
    : '—';

  const copyRef = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      toast.success('Kode yakoporowe!');
    }
  };

  interface MenuItem {
    icon: React.ElementType;
    label: string;
    tint: string;
    to?: string;
    href?: string;
    onClick?: () => void;
  }

  const menuGroups: { title: string; items: MenuItem[] }[] = [
    {
      title: 'IMENYEREZO',
      items: [
        { icon: Package, label: 'Imishinga Yanjye', to: '/my-investments', tint: 'bg-amber-500/10 text-amber-600' },
        { icon: ArrowDownToLine, label: 'Amateka y\'Ishyura', to: '/history', tint: 'bg-primary/10 text-primary' },
        { icon: Wallet, label: 'Konti yo Kwakira', to: '/withdrawal-account', tint: 'bg-blue-500/10 text-blue-600' },
        { icon: Users, label: 'Tumira Inshuti', to: '/referral', tint: 'bg-emerald-500/10 text-emerald-600' },
        { icon: Headphones, label: 'Serivisi ku Ntandaro', onClick: () => setServiceOpen(true), tint: 'bg-amber-500/10 text-amber-600' },
        { icon: Star, label: 'Abo Turi Bo', to: '/about', tint: 'bg-amber-500/10 text-amber-600' },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-background">
      {/* Header: logo, name & phone, bell */}
      <div className="bg-primary px-4 pt-4 pb-20 relative">
        <div className="flex items-center gap-3">
          <img src={petaneLogo} alt="Rubis" className="logo-halo h-12 w-12 object-contain shrink-0" />
          <div className="flex-1 min-w-0">
            <h2 className="text-[16px] font-black text-primary-foreground leading-tight truncate">{name}</h2>
            <p className="text-[13px] text-primary-foreground font-bold mt-0.5">Konti - {profile?.phone || '---'}</p>
          </div>
          <NotificationBell />
        </div>
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-primary-foreground text-lg font-black tracking-tight">Konti Yanjye</h1>
        </div>
      </div>

      {/* Balance card */}
      <div className="px-3 -mt-16 relative z-10 space-y-3">
        <div className="bg-card rounded-3xl shadow-card border border-border/40 overflow-hidden">
          <div className="h-1 bg-primary" />
          <div className="px-5 pt-4 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-[0.14em] text-muted-foreground">AMAFARANGA UFITE</span>
              <span className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary" />
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-[30px] font-black text-foreground leading-none tracking-tight">
                {(profile?.main_balance || 0).toLocaleString()}
              </span>
              <span className="text-sm font-black text-primary">RWF</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 px-3 pb-3">
            <div className="rounded-2xl bg-background/40 border border-border/40 p-3">
              <div className="text-[10px] font-black tracking-wider text-muted-foreground">INYUNGU</div>
              <div className="text-[15px] font-black text-foreground mt-1">
                {(profile?.total_profit || 0).toLocaleString()} <span className="text-[10px] text-primary">RWF</span>
              </div>
            </div>
            <div className="rounded-2xl bg-background/40 border border-border/40 p-3">
              <div className="text-[10px] font-black tracking-wider text-muted-foreground">BONUS</div>
              <div className="text-[15px] font-black text-foreground mt-1">
                {(profile?.referral_balance || 0).toLocaleString()} <span className="text-[10px] text-primary">RWF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invested amount card */}
        <div className="bg-card rounded-3xl shadow-card border border-border/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-primary text-sm font-extrabold tracking-tight">{t('dashboard.totalInvested')}</div>
              <div className="text-foreground text-xl font-black leading-tight mt-0.5">
                <span className="text-primary text-xs font-extrabold mr-1">RWF</span>
                {investedVisible ? (profile?.invested_amount || 0).toLocaleString() : 'XXXXXX'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setInvestedVisible(v => !v)}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-button active:scale-95 transition"
            aria-label="Hisha cyangwa wereke amafaranga washoyemo"
          >
            <Eye className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </button>
        </div>

        {/* Referral code strip */}
        <button
          onClick={copyRef}
          className="w-full bg-card border border-dashed border-primary/40 rounded-2xl p-3 flex items-center gap-3 active:scale-[0.99] transition"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-[10px] text-muted-foreground font-bold tracking-widest">KODE YAWE</div>
            <div className="text-base font-black text-foreground tracking-widest">
              {profile?.referral_code || '---'}
            </div>
          </div>
          <div className="flex items-center gap-1 text-primary font-black text-xs">
            <Copy className="w-4 h-4" /> Koporora
          </div>
        </button>

        {/* Quick pills */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            to="/deposit"
            className="bg-primary text-primary-foreground rounded-2xl py-3.5 flex items-center justify-center gap-2 font-black text-sm shadow-[0_8px_16px_-6px_hsl(var(--primary)/0.55)] active:scale-[0.98] transition"
          >
            <Wallet className="w-4 h-4" /> Ishyura
          </Link>
          <Link
            to="/withdraw"
            className="bg-card border border-primary/30 text-primary rounded-2xl py-3.5 flex items-center justify-center gap-2 font-black text-sm active:scale-[0.98] transition"
          >
            <ArrowUpFromLine className="w-4 h-4" /> Kwakira
          </Link>
        </div>
      </div>

      {/* Menu groups */}
      <div className="px-3 mt-6 space-y-5">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <div className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-2 px-1">
              {group.title}
            </div>
            <div className="bg-card rounded-2xl border border-border/60 shadow-card overflow-hidden">
              {group.items.map((item, idx) => {
                const inner = (
                  <>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.tint}`}>
                      <item.icon className="w-5 h-5" strokeWidth={2.3} />
                    </div>
                    <span className="flex-1 text-sm font-bold text-foreground text-left">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </>
                );
                const base = `w-full flex items-center gap-3 px-4 py-3.5 ${idx > 0 ? 'border-t border-border/60' : ''} active:bg-muted/60 transition`;
                if ('to' in item && item.to) return <Link key={item.label} to={item.to} className={base}>{inner}</Link>;
                if ('href' in item && item.href) return <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={base}>{inner}</a>;
                return <button key={item.label} onClick={item.onClick} className={base}>{inner}</button>;
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-card border-2 border-destructive/30 text-destructive rounded-2xl py-3.5 flex items-center justify-center gap-2 font-black text-sm active:scale-[0.99] transition"
        >
          <LogOut className="w-5 h-5" /> Sohoka
        </button>

        <div className="text-center text-[10px] text-muted-foreground font-semibold pt-2">
          RUBIS COMPANY · v1.0.0
        </div>

      </div>

      <OnlineServiceDialog open={serviceOpen} onOpenChange={setServiceOpen} />

      <Dialog open={passOpen} onOpenChange={setPassOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Ijambobanga rya Konti
            </DialogTitle>
            <DialogDescription>
              Vugana n'itsinda ryacu kuri WhatsApp kugira ngo uhindure ijambobanga.
            </DialogDescription>
          </DialogHeader>
          <a
            href={settings.whatsapp_group_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { setPassOpen(false); toast.success('Turi gufungura WhatsApp...'); }}
            className="bg-success text-primary-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" /> Vugana n'Ubufasha
          </a>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
