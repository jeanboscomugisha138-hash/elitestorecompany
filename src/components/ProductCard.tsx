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
  '3500':    { image: productBuds,       name: 'Elite Buds',     tier: 'F1' },
  '10000':   { image: productSpeaker,    name: 'Elite Speaker',  tier: 'F2' },
  '20000':   { image: productPhoneA15,   name: 'Elite Phone A',  tier: 'F3' },
  '30000':   { image: productCharger,    name: 'Wireless Duo',   tier: 'F4' },
  '40000':   { image: productFlip,       name: 'Elite Flip',     tier: 'F5' },
  '50000':   { image: productPhoneA35,   name: 'Elite Phone Pro',tier: 'F6' },
  '100000':  { image: productTabA9,      name: 'Elite Tab',      tier: 'F7' },
  '250000':  { image: productLaptopBook, name: 'Elite Book',     tier: 'F8' },
  '500000':  { image: productTvSmart,    name: 'Elite Smart TV', tier: 'F9' },
  '1000000': { image: productTvNeo,      name: 'Elite Neo QLED', tier: 'F10' },
};

function getProductInfo(investment: number) {
  return productImages[investment.toString()] || { image: productFold, name: 'Elite Device', tier: 'F' };
}

interface ProductCardProps {
  id: string;
  investment: number;
  dailyProfit: number;
  duration: number;
  onInvest: (id: string) => void;
  isLoading?: boolean;
}

export function ProductCard({ id, investment, dailyProfit, duration, onInvest, isLoading }: ProductCardProps) {
  const totalProfit = dailyProfit * duration;
  const { image, name, tier } = getProductInfo(investment);

  return (
    <div className="rounded-2xl overflow-hidden shadow-card animate-slide-up bg-card border-2 border-primary/30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-primary to-secondary">
        <span className="text-primary-foreground font-extrabold text-base tracking-wide">{tier}</span>
        <span className="text-xs font-semibold bg-primary-foreground/25 text-primary-foreground px-3 py-1 rounded-full backdrop-blur-sm">Standard</span>
      </div>

      {/* Body */}
      <div className="p-4 flex gap-3">
        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <img src={image} alt={name} loading="lazy" width={256} height={256} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-1 text-[13px] text-foreground">
          <div className="flex justify-between"><span className="text-muted-foreground">Rental Amount:</span><span className="font-bold text-primary">{investment.toLocaleString()} RWF</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Income Cycle:</span><span className="font-bold text-foreground">{duration} Days</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Daily Income:</span><span className="font-bold text-secondary">{dailyProfit.toLocaleString()} RWF</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Est. Income:</span><span className="font-bold text-secondary">{totalProfit.toLocaleString()} RWF</span></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-primary/10">
        <span className="text-primary font-extrabold text-lg">{investment.toLocaleString()} RWF</span>
        <button
          onClick={() => onInvest(id)}
          disabled={isLoading}
          className="bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold px-6 py-2 rounded-full text-sm shadow-button hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isLoading ? '...' : 'Rent Now'}
        </button>
      </div>
    </div>
  );
}
