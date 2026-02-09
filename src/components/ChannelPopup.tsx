import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { PopupModal } from './PopupModal';

export function ChannelPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show channel popup every time after login
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
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Stay Updated!</h3>
        <p className="text-muted-foreground mb-4">
          Join our official WhatsApp channel for the latest updates and announcements.
        </p>
        <a
          href="https://whatsapp.com/channel/0029Vb7CmXWAe5VmWVZQTX3p"
          target="_blank"
          rel="noopener noreferrer"
          className="action-btn w-full inline-block text-center"
          onClick={closePopup}
        >
          Join Channel
        </a>
      </div>
    </PopupModal>
  );
}
