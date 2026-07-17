import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import shipCrude from '@/assets/ship-crude.jpg';
import shipDiesel from '@/assets/ship-diesel.jpg';
import shipGasoline from '@/assets/ship-gasoline.jpg';
import shipLpg from '@/assets/ship-lpg.jpg';
import shipCargo from '@/assets/ship-cargo.jpg';
import shipMarine from '@/assets/ship-marine.jpg';
import shipTanker from '@/assets/ship-tanker.jpg';
import shipFleet from '@/assets/ship-fleet.jpg';
import shipGlobal from '@/assets/ship-global.jpg';
import shipMonitor from '@/assets/ship-monitor.jpg';

const productImages: Record<string, { image: string; name: string; tier: string }> = {
  '3500':    { image: shipCrude,    name: 'Gutwara Peteroli Mbisi', tier: 'VIP 1' },
  '10000':   { image: shipDiesel,   name: 'Gutwara Mazutu',         tier: 'VIP 2' },
  '20000':   { image: shipGasoline, name: 'Gutwara Essence',        tier: 'VIP 3' },
  '30000':   { image: shipMonitor,  name: 'Ibikoresho by\'Ubugenzuzi', tier: 'VIP 4' },
  '40000':   { image: shipLpg,      name: 'Gutwara LPG',            tier: 'VIP 5' },
  '50000':   { image: shipCargo,    name: 'Ubwikorezi bwa Cargo',   tier: 'VIP 6' },
  '100000':  { image: shipMarine,   name: 'Ubwikorezi bwo mu Nyanja', tier: 'VIP 7' },
  '250000':  { image: shipTanker,   name: 'Gukodesha Ubwato bwa Tanker', tier: 'VIP 8' },
  '500000':  { image: shipFleet,    name: 'Amato ya Petane',        tier: 'VIP 9' },
  '1000000': { image: shipGlobal,   name: 'Serivisi z\'Ingufu ku Isi', tier: 'VIP 10' },
};

function getProductInfo(investment: number) {
  return productImages[investment.toString()] || { image: shipCargo, name: 'Petane Shipping', tier: 'VIP' };
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
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border/60">
        <span className="text-primary font-extrabold text-base tracking-wide">{tier}</span>
        {purchased ? (
          <span className="text-xs font-bold bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {t('products.purchased')}
          </span>
        ) : (
          <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">{name}</span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex gap-3">
        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-accent flex items-center justify-center">
          <img src={image} alt={name} loading="lazy" width={256} height={256} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-1 text-[13px] text-foreground">
          <div className="flex justify-between"><span className="text-muted-foreground">{t('products.rentalAmount')}</span><span className="font-bold text-primary">{investment.toLocaleString()} RWF</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('products.incomeCycle')}</span><span className="font-bold text-foreground">{duration} {t('products.days')}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('products.dailyIncome')}</span><span className="font-bold text-primary">{dailyProfit.toLocaleString()} RWF</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('products.totalProfit')}</span><span className="font-bold text-primary">{totalProfit.toLocaleString()} RWF</span></div>
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
