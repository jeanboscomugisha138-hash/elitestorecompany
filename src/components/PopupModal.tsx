import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Optional accent color hue for the top bar. Defaults to primary. */
  accent?: 'primary' | 'success' | 'warning' | 'info';
}

const accentMap: Record<NonNullable<PopupModalProps['accent']>, string> = {
  primary: 'bg-primary',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  info: 'bg-sky-500',
};

export function PopupModal({ isOpen, onClose, children, accent = 'primary' }: PopupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 animate-fade-in"
        onClick={onClose}
      />
      <div
        className="relative bg-card w-full max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-in-right sm:animate-scale-in"
        style={{ animationDuration: '220ms' }}
      >
        <div className={`h-1.5 w-full ${accentMap[accent]}`} />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors z-10"
          aria-label="Funga"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="px-6 pt-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
