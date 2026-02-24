import { useState, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import { PopupModal } from './PopupModal';

export function AnnouncementPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2500);
    return () => clearTimeout(timer);
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
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl mb-3">
          <p className="text-sm font-semibold text-primary">🎉 Itangazo rishya:</p>
          <p className="text-sm text-foreground mt-1">
            Company yashyiriyeho abanyamuryango bayo ibicuruzwa byamafaranga macye ariyo <span className="font-bold text-primary">3,500 RWF</span> na <span className="font-bold text-primary">6,500 RWF</span> kugirango yorohereza abanyamuryango bayo gushora imari bijyanye n'ubushobozi bwabo. <span className="font-semibold">Ntawuhejwe!</span>
          </p>
        </div>
        <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-xl mb-3">
          <p className="text-sm font-semibold text-secondary">📱 Injira mu WhatsApp group yacu:</p>
          <a href="https://chat.whatsapp.com/DRmt2Kr4cA4LGt4z0V7uMj" target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline font-medium">Kanda hano winjire mu group</a>
        </div>
        <p className="text-sm font-semibold text-foreground mb-2">✨ Ibyiza bya platform:</p>
        <ul className="text-sm text-muted-foreground space-y-1.5 mb-4">
          <li>✔ Bonus yo gutangira: <span className="text-primary font-semibold">500 RWF</span> ku kwiyandikisha</li>
          <li>✔ Ibicuruzwa bitangirira kuri <span className="text-primary font-semibold">3,500 RWF</span> gusa!</li>
          <li>✔ Inyungu ya <span className="text-primary font-semibold">15%</span> buri munsi ku mafaranga washyize mu ishoramari</li>
          <li>✔ Daily bonus: ushobora gusaba buri munsi</li>
          <li>✔ Referral system: winjize inshuti, ubone commission (Level 1: 15%, Level 2: 4%, Level 3: 1%)</li>
          <li>✔ Withdrawal: igihe icyo ari cyo cyose, inshuro <span className="font-semibold text-primary">1 ku munsi</span></li>
          <li>✔ Byoroshye gukoresha – ukeneye gusa telefoni na internet</li>
        </ul>
        <button onClick={closePopup} className="action-btn w-full text-sm">
          Komeza →
        </button>
      </div>
    </PopupModal>
  );
}
