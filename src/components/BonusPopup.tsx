import { Gift } from 'lucide-react';
import { PopupModal } from './PopupModal';
import { useApp } from '@/contexts/AppContext';

export function BonusPopup() {
  const { showBonusPopup, closeBonusPopup } = useApp();

  return (
    <PopupModal isOpen={showBonusPopup} onClose={closeBonusPopup}>
      <div className="text-center">
        <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-10 h-10 text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Welcome! 🎉</h3>
        <p className="text-muted-foreground mb-4">
          You received <span className="text-primary font-bold">1,500 RWF</span> bonus!
        </p>
        <button onClick={closeBonusPopup} className="action-btn w-full">
          Start Investing
        </button>
      </div>
    </PopupModal>
  );
}
