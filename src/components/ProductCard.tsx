import samsungPhone from '@/assets/samsung-phone.png';
import samsungLaptop from '@/assets/samsung-laptop.png';
import samsungTablet from '@/assets/samsung-tablet.png';
import samsungWatch from '@/assets/samsung-watch.png';
import samsungBuds from '@/assets/samsung-buds.png';
import samsungTv from '@/assets/samsung-tv.png';

const productImages: Record<string, { image: string; name: string }> = {
  '3500': { image: samsungBuds, name: 'Galaxy Buds' },
  '6500': { image: samsungWatch, name: 'Galaxy Watch' },
  '12000': { image: samsungPhone, name: 'Galaxy A15' },
  '20000': { image: samsungPhone, name: 'Galaxy A35' },
  '35000': { image: samsungTablet, name: 'Galaxy Tab A9' },
  '60000': { image: samsungTablet, name: 'Galaxy Tab S9' },
  '100000': { image: samsungLaptop, name: 'Galaxy Book' },
  '200000': { image: samsungLaptop, name: 'Galaxy Book Pro' },
  '500000': { image: samsungTv, name: 'Samsung Smart TV' },
  '1000000': { image: samsungTv, name: 'Samsung Neo QLED' },
};

function getProductInfo(investment: number) {
  const key = investment.toString();
  return productImages[key] || { image: samsungPhone, name: 'Samsung Device' };
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
    <div className="bg-card rounded-2xl p-4 shadow-card hover:shadow-lg-custom transition-all duration-300 animate-slide-up">
      <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-xs font-semibold text-primary text-center mb-2">{name}</p>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Investment</span>
          <span className="font-semibold text-foreground">
            {investment.toLocaleString()} RWF
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Daily Income (15%)</span>
          <span className="font-semibold text-primary">
            {dailyProfit.toLocaleString()} RWF
          </span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Auto-credited daily at 00:00
        </p>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Duration</span>
          <span className="font-semibold text-foreground">{duration} days</span>
        </div>
        <div className="flex justify-between text-sm pt-1 border-t border-border">
          <span className="text-muted-foreground">Total Profit</span>
          <span className="font-bold text-secondary">
            {totalProfit.toLocaleString()} RWF
          </span>
        </div>
        <button
          onClick={() => onInvest(id)}
          className="action-btn w-full mt-3 text-sm py-2.5"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Invest Now'}
        </button>
      </div>
    </div>
  );
}
