import { MessageCircle, Send, Headphones } from 'lucide-react';
import { PopupModal } from './PopupModal';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const TELEGRAM_URL = 'https://t.me/+12052657574';

export function OnlineServiceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { settings } = useSiteSettings();

  return (
    <PopupModal isOpen={open} onClose={() => onOpenChange(false)} accent="info">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Headphones className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-lg font-black text-foreground leading-tight">Serivisi kuri Murandasi</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Vugana n'abakora serivisi zacu kuri WhatsApp cyangwa Telegram.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 mt-2">
        <a
          href={settings.whatsapp_group_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white font-black text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-lg-custom"
        >
          <MessageCircle className="w-5 h-5" /> Injira mu Itsinda rya WhatsApp
        </a>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#229ED9] text-white font-black text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-lg-custom"
        >
          <Send className="w-5 h-5" /> Injira mu Itsinda rya Telegram
        </a>
      </div>
    </PopupModal>
  );
}
