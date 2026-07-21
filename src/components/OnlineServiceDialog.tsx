import { Send, Headphones, MessageCircle, Users2, Video } from 'lucide-react';
import { PopupModal } from './PopupModal';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function OnlineServiceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { settings } = useSiteSettings();

  const links = [
    {
      label: 'Vugisha Umuyobozi',
      sub: 'Vugana n\'umuyobozi wacu ku giti cye',
      href: settings.telegram_admin_url,
      icon: MessageCircle,
    },
    {
      label: 'Injira muri Group Isanzwe',
      sub: 'Group yacu rusange ya buri munsi',
      href: settings.telegram_group_url,
      icon: Users2,
    },
    {
      label: 'Injira muri Group y\'Inama',
      sub: 'Aho tuganirira inama z\'ishoramari',
      href: settings.telegram_meeting_url,
      icon: Video,
    },
  ];

  return (
    <PopupModal isOpen={open} onClose={() => onOpenChange(false)} accent="info">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Headphones className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-lg font-black text-foreground leading-tight">Ubufasha bwa PETANE SHIPPING</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Hitamo uburyo ushaka kutugeraho kuri Telegram.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {links.map(({ label, sub, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#1747E0] to-[#0E2E9A] text-white active:scale-[0.98] transition shadow-lg-custom"
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-black leading-tight">{label}</div>
              <div className="text-[11px] text-white/80 mt-0.5 leading-tight">{sub}</div>
            </div>
            <Send className="w-4 h-4 opacity-80" />
          </a>
        ))}
      </div>
    </PopupModal>
  );
}
