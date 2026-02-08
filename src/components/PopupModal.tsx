import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function PopupModal({ isOpen, onClose, children }: PopupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-card rounded-3xl p-6 max-w-sm w-full shadow-lg-custom animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
