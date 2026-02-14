import { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';
import { PopupModal } from './PopupModal';

export function BonusPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if this is a new signup (show bonus popup once ever using localStorage)
    const hasSeenBonus = localStorage.getItem('hasSeenBonusPopup');
    if (!hasSeenBonus) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        localStorage.setItem('hasSeenBonusPopup', 'true');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => setShowPopup(false);

  return (
    <PopupModal isOpen={showPopup} onClose={closePopup}>
      <div className="text-center">
        <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-10 h-10 text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Welcome! 🎉</h3>
        <p className="text-muted-foreground mb-4">
          You received <span className="text-primary font-bold">500 RWF</span> bonus!
        </p>
        <button onClick={closePopup} className="action-btn w-full">
          Start Investing
        </button>
      </div>
    </PopupModal>
  );
}
