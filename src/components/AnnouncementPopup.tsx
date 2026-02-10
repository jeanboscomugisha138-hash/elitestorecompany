import { useState, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import { PopupModal } from './PopupModal';

export function AnnouncementPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenAnnouncement = localStorage.getItem('hasSeenAnnouncementV1');
    if (!hasSeenAnnouncement) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        localStorage.setItem('hasSeenAnnouncementV1', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => setShowPopup(false);

  return (
    <PopupModal isOpen={showPopup} onClose={closePopup}>
      <div className="text-left">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground">📢 Muraho 👋</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Injira kuri <span className="font-semibold text-foreground">Drilltools Company</span> – urubuga rwizewe kandi rworoshye gukoresha mu gushora imari no kunguka!
        </p>
        <p className="text-sm font-semibold text-foreground mb-2">✨ Ibyiza bya platform:</p>
        <ul className="text-sm text-muted-foreground space-y-1.5 mb-4">
          <li>✔ Bonus yo gutangira: <span className="text-primary font-semibold">1500 RWF</span> ku kwiyandikisha</li>
          <li>✔ Inyungu buri munsi ku mafaranga washyize mu ishoramari</li>
          <li>✔ Daily bonus: ushobora gusaba buri munsi</li>
          <li>✔ Referral system: winjize inshuti, ubone commission (Level 1: 15%, Level 2: 4%, Level 3: 1%)</li>
          <li>✔ Fast deposit & withdrawal – wohereza kandi wakira amafaranga byoroshye</li>
          <li>✔ Byoroshye gukoresha – ukeneye gusa telefoni na internet</li>
        </ul>
        <button onClick={closePopup} className="action-btn w-full text-sm">
          Komeza →
        </button>
      </div>
    </PopupModal>
  );
}
