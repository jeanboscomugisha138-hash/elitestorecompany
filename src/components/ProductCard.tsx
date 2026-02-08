import drillingMachine from '@/assets/drilling-machine.png';

interface ProductCardProps {
  id: string;
  investment: number;
  dailyProfit: number;
  duration: number;
  onInvest: (id: string) => void;
}

export function ProductCard({
  id,
  investment,
  dailyProfit,
  duration,
  onInvest,
}: ProductCardProps) {
  const totalProfit = dailyProfit * duration;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card hover:shadow-lg-custom transition-all duration-300 animate-slide-up">
      <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-muted">
        <img
          src={drillingMachine}
          alt={`Product ${id}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Investment</span>
          <span className="font-semibold text-foreground">
            {investment.toLocaleString()} RWF
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Daily Income (30%)</span>
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
        >
          Invest Now
        </button>
      </div>
    </div>
  );
}
