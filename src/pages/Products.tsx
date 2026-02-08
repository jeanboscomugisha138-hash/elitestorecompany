import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { BottomNav } from '@/components/BottomNav';
import { toast } from 'sonner';

const products = [
  { id: 1, investment: 10000, dailyProfit: 3000, duration: 30 },
  { id: 2, investment: 20000, dailyProfit: 6000, duration: 30 },
  { id: 3, investment: 30000, dailyProfit: 9000, duration: 30 },
  { id: 4, investment: 40000, dailyProfit: 12000, duration: 30 },
  { id: 5, investment: 50000, dailyProfit: 15000, duration: 30 },
  { id: 6, investment: 100000, dailyProfit: 30000, duration: 30 },
  { id: 7, investment: 250000, dailyProfit: 75000, duration: 30 },
  { id: 8, investment: 500000, dailyProfit: 150000, duration: 30 },
  { id: 9, investment: 1000000, dailyProfit: 300000, duration: 30 },
];

export default function Products() {
  const handleInvest = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      toast.success(`Investment request for ${product.investment.toLocaleString()} RWF submitted!`);
    }
  };

  return (
    <div className="page-container bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/dashboard"
          className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-card hover:shadow-lg-custom transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="page-title mb-0 flex-1 text-left">Investment Products</h1>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product, index) => (
          <div
            key={product.id}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ProductCard
              id={product.id}
              investment={product.investment}
              dailyProfit={product.dailyProfit}
              duration={product.duration}
              onInvest={handleInvest}
            />
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
