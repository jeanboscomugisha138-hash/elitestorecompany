import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
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
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => setShowPopup(false);

  return (
    <PopupModal isOpen={showPopup} onClose={closePopup}>
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-button">
          <MessageCircle className="w-10 h-10 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Join Our WhatsApp Group!</h3>
        <p className="text-muted-foreground mb-4">
          Join our official WhatsApp group to receive the latest updates, news and fast support.
        </p>
        <a
          href={settings.whatsapp_group_url}
          target="_blank"
          rel="noopener noreferrer"
          className="action-btn w-full inline-block text-center"
          onClick={closePopup}
        >
          Join WhatsApp Group
        </a>
      </div>
    </PopupModal>
  );
}
