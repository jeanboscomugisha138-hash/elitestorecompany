import { PopupModal } from './PopupModal';
import { AlertTriangle, XCircle } from 'lucide-react';

interface ErrorNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  buttonText?: string;
}

export function ErrorNotification({
  isOpen,
  onClose,
  title = 'Habaye Ikosa',
  message,
  buttonText = 'Byumvikanye',
}: ErrorNotificationProps) {
  return (
    <PopupModal isOpen={isOpen} onClose={onClose} accent="warning">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-red-500/10 text-red-600">
          <AlertTriangle className="w-7 h-7" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-1.5 text-red-600 mb-1">
            <XCircle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Ntibyakunze</span>
          </div>
          <h3 className="text-lg font-black text-foreground leading-tight">{title}</h3>
        </div>
      </div>

      <p className="mt-4 text-sm text-foreground leading-relaxed">{message}</p>

      <button
        onClick={onClose}
        className="mt-5 w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-2xl transition active:scale-[0.98] shadow-lg-custom"
      >
        {buttonText}
      </button>
    </PopupModal>
  );
}
