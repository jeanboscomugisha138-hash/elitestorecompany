import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import productBuds from '@/assets/product-buds.png';
import productWatch from '@/assets/product-watch.png';
import productPhoneA15 from '@/assets/product-phone-a15.png';
import productPhoneA35 from '@/assets/product-phone-a35.png';
import productSpeaker from '@/assets/product-speaker.png';
import productCharger from '@/assets/product-charger.png';
import productFlip from '@/assets/product-flip.png';
import productTabA9 from '@/assets/product-tab-a9.png';
import productLaptopBook from '@/assets/product-laptop-book.png';
import productFold from '@/assets/product-fold.png';
import productTvSmart from '@/assets/product-tv-smart.png';
import productTvNeo from '@/assets/product-tv-neo.png';

const productImages: Record<string, { image: string; name: string; tier: string }> = {
  '3500':    { image: productWatch,      name: 'Petane Peteroli Mbisi',    tier: 'VIP 1' },
  '10000':   { image: productSpeaker,    name: 'Petane Mazutu',  tier: 'VIP 2' },
  '20000':   { image: productPhoneA15,   name: 'Petane Essence',  tier: 'VIP 3' },
  '30000':   { image: productCharger,    name: 'Wireless Duo',   tier: 'VIP 4' },
  '40000':   { image: productFlip,       name: 'Petane LPG',     tier: 'VIP 5' },
  '50000':   { image: productPhoneA35,   name: 'Petane Cargo',tier: 'VIP 6' },
  '100000':  { image: productTabA9,      name: 'Petane Marine',      tier: 'VIP 7' },
  '250000':  { image: productLaptopBook, name: 'Petane Tanker',     tier: 'VIP 8' },
  '500000':  { image: productTvSmart,    name: 'Petane Fleet', tier: 'VIP 9' },
  '1000000': { image: productTvNeo,      name: 'Petane Global Energy', tier: 'VIP 10' },
};

function getProductInfo(investment: number) {
  return productImages[investment.toString()] || { image: productFold, name: 'Petane Shipping', tier: 'VIP' };
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
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-primary to-secondary">
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
        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <img src={image} alt={name} loading="lazy" width={256} height={256} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-1 text-[13px] text-foreground">
          <div className="flex justify-between"><span className="text-muted-foreground">{t('products.rentalAmount')}</span><span className="font-bold text-primary">{investment.toLocaleString()} RWF</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('products.incomeCycle')}</span><span className="font-bold text-foreground">{duration} {t('products.days')}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('products.dailyIncome')}</span><span className="font-bold text-secondary">{dailyProfit.toLocaleString()} RWF</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('products.totalProfit')}</span><span className="font-bold text-secondary">{totalProfit.toLocaleString()} RWF</span></div>
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
              : 'bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90'
          }`}
        >
          {purchased ? t('products.owned') : isLoading ? '...' : t('products.purchaseNow')}
        </button>
      </div>
    </div>
  );
}
