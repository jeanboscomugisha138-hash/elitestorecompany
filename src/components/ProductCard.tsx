import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import vip1 from '@/assets/petane-vip1.jpg';
import vip2 from '@/assets/petane-vip2.jpg';
import vip3 from '@/assets/petane-vip3.jpg';
import vip4 from '@/assets/petane-vip4.jpg';
import vip5 from '@/assets/petane-vip5.jpg';
import vip6 from '@/assets/petane-vip6.jpg';
import vip7 from '@/assets/petane-vip7.jpg';
import vip8 from '@/assets/petane-vip8.jpg';
import vip9 from '@/assets/petane-vip9.jpg';
import vip10 from '@/assets/petane-vip10.jpg';

const productImages: Record<string, { image: string; name: string; tier: string }> = {
  '3500':    { image: vip1,  name: 'Petane Peteroli Mbisi',   tier: 'VIP 1' },
  '10000':   { image: vip2,  name: 'Petane Mazutu',           tier: 'VIP 2' },
  '20000':   { image: vip3,  name: 'Petane Essence',          tier: 'VIP 3' },
  '30000':   { image: vip4,  name: 'Petane Sitasiyo',         tier: 'VIP 4' },
  '40000':   { image: vip5,  name: 'Petane LPG',              tier: 'VIP 5' },
  '50000':   { image: vip6,  name: 'Petane Cargo',            tier: 'VIP 6' },
  '100000':  { image: vip7,  name: 'Petane Marine',           tier: 'VIP 7' },
  '250000':  { image: vip8,  name: 'Petane Tanker',           tier: 'VIP 8' },
  '500000':  { image: vip9,  name: 'Petane Fleet',            tier: 'VIP 9' },
  '1000000': { image: vip10, name: 'Petane Global Energy',    tier: 'VIP 10' },
};

function getProductInfo(investment: number) {
  return productImages[investment.toString()] || { image: vip1, name: 'Petane Shipping', tier: 'VIP' };
}

interface ProductCardProps {
  id: string;
  investment: number;
  dailyProfit: number;
  duration: number;
  onInvest: (id: string) => void;
  isLoading?: boolean;
  purchased?: boolean;
}

export function ProductCard({ id, investment, dailyProfit, duration, onInvest, isLoading, purchased }: ProductCardProps) {
  const totalProfit = dailyProfit * duration;
  const { image, name, tier } = getProductInfo(investment);
  const { t } = useTranslation();

  return (
    <div className={`rounded-2xl overflow-hidden shadow-card animate-slide-up bg-card border-2 ${purchased ? 'border-emerald-500/40' : 'border-primary/30'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-primary">
        <span className="text-primary-foreground font-extrabold text-base tracking-wide">{tier}</span>
        {purchased ? (
          <span className="text-xs font-bold bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {t('products.purchased')}
          </span>
        ) : (
          <span className="text-xs font-semibold bg-primary-foreground/25 text-primary-foreground px-3 py-1 rounded-full backdrop-blur-sm">{name}</span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex gap-3">
        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
          <img src={image} alt={name} loading="lazy" width={256} height={256} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-1 text-[13px] text-foreground">
          <div className="flex justify-between"><span className="text-muted-foreground">{t('products.rentalAmount')}</span><span className="font-bold text-primary">{investment.toLocaleString()} RWF</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('products.incomeCycle')}</span><span className="font-bold text-foreground">{duration} {t('products.days')}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('products.dailyIncome')}</span><span className="font-bold text-foreground">{dailyProfit.toLocaleString()} RWF</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('products.totalProfit')}</span><span className="font-bold text-foreground">{totalProfit.toLocaleString()} RWF</span></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-primary/10">
        <span className="text-primary font-extrabold text-lg">{investment.toLocaleString()} RWF</span>
        <button
          onClick={() => !purchased && onInvest(id)}
          disabled={isLoading || purchased}
          className={`font-bold px-6 py-2 rounded-full text-sm shadow-button transition-all disabled:opacity-70 ${
            purchased
              ? 'bg-emerald-500 text-white cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          {purchased ? t('products.owned') : isLoading ? '...' : t('products.purchaseNow')}
        </button>
      </div>
    </div>
  );
}
