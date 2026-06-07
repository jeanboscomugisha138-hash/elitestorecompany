import { useState, useEffect } from 'react';
import { Bell, Send, X } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function AnnouncementPopup() {
  const { settings } = useSiteSettings();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => setShowPopup(false);

  if (!showPopup) return null;

  const announcements = [
    'Welcome to ELITE STORE COMPANY!',
    'Registration BONUS: 1,000 RWF',
    'Minimum deposit: 10,000 RWF · Maximum: 1,000,000 RWF (processed in 15 minutes)',
    'Minimum withdrawal: 1,000 RWF · Maximum: 1,000,000 RWF (processed in 24 hours)',
    'Team bonus at three levels: 10%, 3% and 1%',
    'Daily profit: 10% (VIP 2-4) · 15% (VIP 5-7) · 20% (VIP 8-10)',
    'Invite your friends to register and earn instant cash bonuses.',
    'Join the official WhatsApp group to learn about platform benefits.',
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm animate-fade-in"
        onClick={closePopup}
      />
      <div className="relative w-full max-w-sm animate-scale-in">
        {/* Bell icon floating on top */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg-custom border-4 border-background">
            <Bell className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        <div className="bg-card rounded-3xl overflow-hidden shadow-lg-custom">
          {/* Yellow header */}
          <div className="bg-gradient-to-br from-primary to-secondary pt-12 pb-5 px-6 relative">
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground/20 hover:bg-foreground/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-primary-foreground" />
            </button>
            <h3 className="text-xl font-bold text-primary-foreground text-center">
              Welcome to ELITE STORE
            </h3>
          </div>

          {/* Announcements list */}
          <div className="px-6 py-5 space-y-3 max-h-[50vh] overflow-y-auto">
            {announcements.map((item, i) => (
              <p key={i} className="text-sm text-foreground leading-relaxed">
                <span className="font-semibold">{i + 1}.</span> {item}
              </p>
            ))}
          </div>

          {/* CTA button */}
          <div className="px-5 pb-5">
            <a
              href={settings.whatsapp_group_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closePopup}
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-button active:scale-[0.98] transition-all"
            >
              <Send className="w-4 h-4" />
              Official Channel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
