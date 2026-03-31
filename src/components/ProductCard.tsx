import productBuds from '@/assets/product-buds.png';
import productWatch from '@/assets/product-watch.png';
import productPhoneA15 from '@/assets/product-phone-a15.png';
import productPhoneA35 from '@/assets/product-phone-a35.png';
import productSpeaker from '@/assets/product-speaker.png';
import productCharger from '@/assets/product-charger.png';
import productFlip from '@/assets/product-flip.png';
import productTabA9 from '@/assets/product-tab-a9.png';
import productLaptopBook from '@/assets/product-laptop-book.png';
import productMonitor from '@/assets/product-monitor.png';
import productFold from '@/assets/product-fold.png';
import productLaptopPro from '@/assets/product-laptop-pro.png';
import productTvSmart from '@/assets/product-tv-smart.png';
import productTvNeo from '@/assets/product-tv-neo.png';

const productImages: Record<string, { image: string; name: string }> = {
  '3500':    { image: productBuds,       name: 'Galaxy Buds' },
  '6500':    { image: productWatch,      name: 'Galaxy Watch' },
  '10000':   { image: productSpeaker,    name: 'Galaxy Speaker' },
  '20000':   { image: productPhoneA15,   name: 'Galaxy A15' },
  '30000':   { image: productCharger,    name: 'Wireless Charger Duo' },
  '40000':   { image: productFlip,       name: 'Galaxy Z Flip' },
  '50000':   { image: productPhoneA35,   name: 'Galaxy A35' },
  '100000':  { image: productTabA9,      name: 'Galaxy Tab A9' },
  '250000':  { image: productLaptopBook, name: 'Galaxy Book' },
  '500000':  { image: productTvSmart,    name: 'Samsung Smart TV' },
  '1000000': { image: productTvNeo,      name: 'Samsung Neo QLED' },
};

function getProductInfo(investment: number) {
  const key = investment.toString();
  return productImages[key] || { image: productFold, name: 'Samsung Device' };
}

interface ProductCardProps {
  id: string;
  investment: number;
  dailyProfit: number;
  duration: number;
  onInvest: (id: string) => void;
  isLoading?: boolean;
}

export function ProductCard({
  id,
  investment,
  dailyProfit,
  duration,
  onInvest,
  isLoading,
}: ProductCardProps) {
  const totalProfit = dailyProfit * duration;
  const { image, name } = getProductInfo(investment);

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-lg-custom transition-all duration-300 animate-slide-up border border-border/50">
      {/* Image area */}
      <div className="relative bg-muted/30 p-4 flex items-center justify-center">
        <img
          src={image}
          alt={name}
          loading="lazy"
          width={512}
          height={512}
          className="w-28 h-28 object-contain drop-shadow-md"
        />
        <span className="absolute top-2 right-2 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
          15%/day
        </span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <p className="text-sm font-bold text-foreground text-center truncate">{name}</p>

        <div className="bg-muted/50 rounded-xl p-2.5 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Price</span>
            <span className="font-bold text-foreground">
              {investment.toLocaleString()} RWF
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Daily</span>
            <span className="font-semibold text-primary">
              +{dailyProfit.toLocaleString()} RWF
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-semibold text-foreground">{duration} days</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-muted-foreground">Total Profit</span>
          <span className="font-extrabold text-secondary text-sm">
            {totalProfit.toLocaleString()} RWF
          </span>
        </div>

        <button
          onClick={() => onInvest(id)}
          className="action-btn w-full text-sm py-2.5 mt-1"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Invest Now'}
        </button>
      </div>
    </div>
  );
}
