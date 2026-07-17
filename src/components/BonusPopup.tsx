import { useState, useEffect } from 'react';
import { SuccessNotification } from './SuccessNotification';

export function BonusPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenBonus = localStorage.getItem('hasSeenBonusPopup');
    if (!hasSeenBonus) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        localStorage.setItem('hasSeenBonusPopup', 'true');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <SuccessNotification
      isOpen={showPopup}
      onClose={() => setShowPopup(false)}
      type="welcome"
      amount={1000}
    />
  );
}
