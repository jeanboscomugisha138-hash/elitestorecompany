import { useState, useEffect } from 'react';
import { Megaphone, Send, X } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function AnnouncementPopup() {
  const { settings } = useSiteSettings();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn) {
      const timer = setTimeout(() => setShowPopup(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => setShowPopup(false);
  if (!showPopup) return null;

  const announcements = (settings.announcements || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 animate-fade-in"
        onClick={closePopup}
        style={{ backdropFilter: 'blur(2px)' }}
      />
      <div className="relative w-full max-w-[320px] animate-scale-in">
        <div className="absolute -inset-1 bg-primary/20 rounded-3xl blur-xl opacity-70 pointer-events-none" />
        <div className="relative bg-card rounded-3xl overflow-hidden shadow-2xl border border-border/50">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary to-primary/70" />

        <button
          onClick={closePopup}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors z-10"
          aria-label="Funga"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="px-6 pt-6 pb-2">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Megaphone className="w-7 h-7" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                Amatangazo
              </div>
              <h3 className="text-lg font-black text-foreground leading-tight">
                Murakaza neza kuri PETANE SHIPPING
              </h3>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 space-y-2.5 max-h-[45vh] overflow-y-auto">
          {announcements.map((item, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <p className="text-sm text-foreground leading-relaxed flex-1">{item}</p>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 pt-2">
          <a
            href={settings.whatsapp_group_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closePopup}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            Injira mu Itsinda
          </a>
        </div>
      </div>
    </div>
  );
}
