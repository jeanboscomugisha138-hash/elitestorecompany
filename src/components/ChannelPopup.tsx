import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { PopupModal } from './PopupModal';
import { useSiteSettings } from '@/hooks/useSiteSettings';



export function ChannelPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.removeItem('justLoggedIn');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => setShowPopup(false);

  return (
    <PopupModal isOpen={showPopup} onClose={closePopup} accent="info">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Send className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-lg font-black text-foreground leading-tight">Injira muri Telegram Group</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Injira muri Telegram group y'abashoramari uhabwe amakuru, amatangazo n'ubufasha bwihuse.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        <a
          href={settings.telegram_meeting_url || 'https://t.me/rubissharecommunity'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closePopup}
          className="w-full bg-gradient-to-r from-primary to-success text-primary-foreground font-black text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-lg-custom"
        >
          <Send className="w-5 h-5" /> INJIRA MURI TELEGRAM GROUP
        </a>
      </div>
    </PopupModal>
  );
}
