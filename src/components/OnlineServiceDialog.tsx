import { MessageCircle, Send, Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const TELEGRAM_URL = 'https://t.me/+12052657574';

export function OnlineServiceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-primary" /> {t('onlineService.title')}
          </DialogTitle>
          <DialogDescription>{t('onlineService.description')}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <a
            href={settings.whatsapp_group_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" /> {t('onlineService.joinWhatsApp')}
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#229ED9] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" /> {t('onlineService.joinTelegram')}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
