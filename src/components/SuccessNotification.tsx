import { PopupModal } from './PopupModal';
import { Gift, CheckCircle2, TrendingUp, PartyPopper, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

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
  accent: 'primary' | 'success' | 'warning' | 'info';
  amountLabel: string;
}> = {
  welcome: {
    icon: PartyPopper,
    title: 'Murakaza neza!',
    subtitle: 'Konti yawe yashyizweho neza kandi bonus yawe yakiriwe.',
    buttonText: 'Tangira Gushora',
    accent: 'primary',
    amountLabel: 'Bonus wakiriye',
  },
  gift: {
    icon: Gift,
    title: 'Kode Yemejwe',
    subtitle: 'Bonus yakuye muri kode yongewe kuri konti yawe.',
    buttonText: 'Murakoze',
    accent: 'success',
    amountLabel: 'Amafaranga wakiriye',
  },
  investment: {
    icon: TrendingUp,
    title: 'Umushinga Watangiye',
    subtitle: 'Umushinga wawe utangiye gukora — inyungu buri munsi ziratangira.',
    buttonText: 'Reba Dashboard',
    accent: 'success',
    amountLabel: 'Amafaranga washoye',
  },
  deposit: {
    icon: ArrowDownToLine,
    title: 'Ishyura Ryoherejwe',
    subtitle: 'Ishyura ryawe rizemezwa mu minota 15 gusa.',
    buttonText: 'Byumvikanye',
    accent: 'info',
    amountLabel: 'Amafaranga wishyuye',
  },
  withdraw: {
    icon: ArrowUpFromLine,
    title: 'Kwakira Byoherejwe',
    subtitle: 'Igikorwa cyawe cyo kwakira kizakorwa mu masaha 24.',
    buttonText: 'Byumvikanye',
    accent: 'warning',
    amountLabel: 'Amafaranga wakiriye',
  },
};

export function SuccessNotification({ isOpen, onClose, type, amount, productName }: SuccessNotificationProps) {
  const c = config[type];
  const Icon = c.icon;

  const iconBg = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-emerald-500/10 text-emerald-600',
    warning: 'bg-amber-500/10 text-amber-600',
    info: 'bg-sky-500/10 text-sky-600',
  }[c.accent];

  const btnBg = {
    primary: 'bg-primary hover:bg-primary/90',
    success: 'bg-emerald-500 hover:bg-emerald-600',
    warning: 'bg-amber-500 hover:bg-amber-600',
    info: 'bg-sky-500 hover:bg-sky-600',
  }[c.accent];

  return (
    <PopupModal isOpen={isOpen} onClose={onClose} accent={c.accent}>
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className="w-7 h-7" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Byakunze</span>
          </div>
          <h3 className="text-lg font-black text-foreground leading-tight">{c.title}</h3>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-muted/60 px-4 py-3 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-muted-foreground">{c.amountLabel}</span>
        <span className="text-xl font-black text-foreground tabular-nums">
          {amount.toLocaleString()} <span className="text-xs font-bold text-primary">RWF</span>
        </span>
      </div>

      {productName && (
        <p className="mt-2 text-xs text-muted-foreground text-right font-medium">{productName}</p>
      )}

      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{c.subtitle}</p>

      <button
        onClick={onClose}
        className={`mt-5 w-full ${btnBg} text-white font-bold text-sm py-3.5 rounded-2xl transition active:scale-[0.98] shadow-lg-custom`}
      >
        {c.buttonText}
      </button>
    </PopupModal>
  );
}
