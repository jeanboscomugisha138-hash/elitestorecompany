import { useState } from 'react';
import { PopupModal } from './PopupModal';
import { Gift, CheckCircle, TrendingUp, PartyPopper } from 'lucide-react';

type NotificationType = 'welcome' | 'gift' | 'investment' | 'deposit' | 'withdraw';

interface SuccessNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  type: NotificationType;
  amount: number;
  productName?: string;
}

const config: Record<NotificationType, {
  icon: typeof Gift;
  title: string;
  subtitle: string;
  buttonText: string;
  gradient: string;
}> = {
  welcome: {
    icon: PartyPopper,
    title: 'Welcome Bonus! 🎉',
    subtitle: 'Your signup bonus has been credited to your account.',
    buttonText: 'Start Investing',
    gradient: 'from-primary to-primary/70',
  },
  gift: {
    icon: Gift,
    title: 'Gift Redeemed! 🎁',
    subtitle: 'Gift code bonus added to your balance.',
    buttonText: 'Awesome!',
    gradient: 'from-pink-500 to-rose-400',
  },
  investment: {
    icon: TrendingUp,
    title: 'Investment Active! 📈',
    subtitle: 'Your investment is now earning daily profits.',
    buttonText: 'View Dashboard',
    gradient: 'from-emerald-500 to-green-400',
  },
  deposit: {
    icon: TrendingUp,
    title: 'Deposit Submitted! 💰',
    subtitle: 'Your deposit will be confirmed within 15 minutes.',
    buttonText: 'Got It!',
    gradient: 'from-blue-500 to-cyan-400',
  },
  withdraw: {
    icon: TrendingUp,
    title: 'Withdrawal Submitted! 🏦',
    subtitle: 'Your withdrawal will be processed within 24 hours.',
    buttonText: 'Got It!',
    gradient: 'from-amber-500 to-orange-400',
  },
};

export function SuccessNotification({ isOpen, onClose, type, amount, productName }: SuccessNotificationProps) {
  const c = config[type];
  const Icon = c.icon;

  return (
    <PopupModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center py-2">
        {/* Animated icon */}
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg animate-scale-in`}>
          <Icon className="w-10 h-10 text-white" />
        </div>

        {/* Success check */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm font-semibold text-green-500 uppercase tracking-wide">Success</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-foreground mb-1">{c.title}</h3>

        {/* Amount */}
        <div className="my-4 py-3 px-4 bg-muted rounded-2xl">
          <p className="text-sm text-muted-foreground mb-1">
            {type === 'investment' ? 'Amount Invested' : 'Amount Received'}
          </p>
          <p className="text-3xl font-extrabold text-primary">
            {amount.toLocaleString()} <span className="text-lg">RWF</span>
          </p>
          {productName && (
            <p className="text-xs text-muted-foreground mt-1">{productName}</p>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-5">{c.subtitle}</p>

        <button onClick={onClose} className="action-btn w-full text-base py-3">
          {c.buttonText}
        </button>
      </div>
    </PopupModal>
  );
}
