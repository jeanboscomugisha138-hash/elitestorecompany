import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Optional accent color hue for the top bar. Defaults to primary. */
  accent?: 'primary' | 'success' | 'warning' | 'info';
}

const accentBar: Record<NonNullable<PopupModalProps['accent']>, string> = {
  primary: 'from-primary via-primary to-primary/70',
  success: 'from-emerald-500 via-emerald-500 to-emerald-400/70',
  warning: 'from-amber-500 via-amber-500 to-amber-400/70',
  info: 'from-sky-500 via-sky-500 to-sky-400/70',
};

const accentGlow: Record<NonNullable<PopupModalProps['accent']>, string> = {
  primary: 'bg-primary/20',
  success: 'bg-emerald-500/20',
  warning: 'bg-amber-500/20',
  info: 'bg-sky-500/20',
};

export function PopupModal({ isOpen, onClose, children, accent = 'primary' }: PopupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 animate-fade-in"
        onClick={onClose}
        style={{ backdropFilter: 'blur(2px)' }}
      />
      <div
        className="relative w-full max-w-[320px] animate-scale-in"
        style={{ animationDuration: '220ms' }}
      >
        {/* Blue glow accent behind the card */}
        <div className={`absolute -inset-1 ${accentGlow[accent]} rounded-3xl blur-xl opacity-70 pointer-events-none`} />

        <div className="relative bg-card rounded-3xl overflow-hidden shadow-2xl border border-border/50">
          {/* Top gradient accent bar */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${accentBar[accent]}`} />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors z-10"
            aria-label="Funga"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          <div className="px-5 pt-5 pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
