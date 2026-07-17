import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowDownToLine,
  Users,
  Lock,
  LogOut,
  Wallet,
  Headphones,
  MessageCircle,
  ChevronRight,
  Bell,
  ScanLine,
  Copy,
  Gift,
  Package,
  Star,
} from 'lucide-react';
import { LiveActivity } from '@/components/LiveActivity';
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
import petaneLogo from '@/assets/petane-logo.png';

export default function Settings() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [serviceOpen, setServiceOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);

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

  const menuGroups = [
    {
      title: 'IMENYEREZO',
      items: [
        { icon: Package, label: 'Imishinga Yanjye', to: '/products', tint: 'bg-amber-500/10 text-amber-600' },
        { icon: ArrowDownToLine, label: 'Amateka y\'Ishyura', to: '/history', tint: 'bg-primary/10 text-primary' },
        { icon: Wallet, label: 'Konti yo Kwakira', to: '/withdraw', tint: 'bg-blue-500/10 text-blue-600' },
        { icon: Users, label: 'Tumira Inshuti', to: '/referral', tint: 'bg-emerald-500/10 text-emerald-600' },
        { icon: Headphones, label: 'Serivisi ku Ntandaro', onClick: () => setServiceOpen(true), tint: 'bg-purple-500/10 text-purple-600' },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-[hsl(0_0%_96%)]">
      {/* Red header */}
      <div className="bg-primary px-4 pt-4 pb-24 relative">
        <div className="flex items-center justify-between">
          <img
            src={petaneLogo}
            alt="Petane"
            className="h-11 w-auto brightness-0 invert"
          />
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-lg border-2 border-primary-foreground/50 flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-primary-foreground" />
            </button>
            <button className="relative w-10 h-10 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-primary-foreground" />
            </button>
          </div>
        </div>
        <h1 className="text-primary-foreground text-lg font-black mt-4 tracking-tight">Konti Yanjye</h1>
      </div>

      {/* Profile hero card */}
      <div className="px-3 -mt-20 relative z-10 space-y-3">
        <div className="bg-card rounded-2xl shadow-card border border-border/40 overflow-hidden">
          <div className="p-5 flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-black shadow-[0_8px_20px_-6px_hsl(var(--primary)/0.5)]">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center border-2 border-card">
                <Star className="w-3.5 h-3.5 text-white fill-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-foreground truncate leading-tight">{name}</h2>
              <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                Konti - {profile?.phone || '---'}
              </p>
              <div className="inline-flex items-center gap-1 mt-1.5 bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">
                <Star className="w-2.5 h-2.5 fill-primary" /> UMWIZERWA · {memberSince}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 border-t border-border">
            <div className="p-3 text-center">
              <div className="text-[15px] font-black text-foreground leading-none">
                {(profile?.main_balance || 0).toLocaleString()}
              </div>
              <div className="text-[9px] text-primary font-black mt-1">RWF</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Ayo ufiteho</div>
            </div>
            <div className="p-3 text-center border-x border-border">
              <div className="text-[15px] font-black text-foreground leading-none">
                {(profile?.total_profit || 0).toLocaleString()}
              </div>
              <div className="text-[9px] text-primary font-black mt-1">RWF</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Inyungu</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-[15px] font-black text-foreground leading-none">
                {(profile?.referral_balance || 0).toLocaleString()}
              </div>
              <div className="text-[9px] text-primary font-black mt-1">RWF</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Ubufasha</div>
            </div>
          </div>
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
          PETANE SHIPPING · v1.0.0
        </div>

        <LiveActivity />
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
            className="bg-[#25D366] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" /> Vugana n'Ubufasha
          </a>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
