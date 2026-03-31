import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { BottomNav } from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { SuccessNotification } from '@/components/SuccessNotification';

interface Product {
  id: string;
  investment_amount: number;
  daily_profit_rate: number;
  duration_days: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile, refreshProfile } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('investment_products')
      .select('*')
      .eq('is_active', true)
      .order('investment_amount', { ascending: true });

    if (!error && data) {
      setProducts(data);
    }
    setIsLoading(false);
  };

  const [investingId, setInvestingId] = useState<string | null>(null);
  const investingRef = useRef(false);
  const [investSuccess, setInvestSuccess] = useState<{ show: boolean; amount: number; name: string }>({ show: false, amount: 0, name: '' });

  const handleInvest = async (productId: string) => {
    if (investingRef.current) return;
    const product = products.find((p) => p.id === productId);
    if (!product || !profile?.user_id) return;

    investingRef.current = true;
    setInvestingId(productId);

    try {
      // Fetch fresh balance from DB to avoid stale state
      const { data: freshProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('main_balance, invested_amount')
        .eq('user_id', profile.user_id)
        .single();

      if (fetchError || !freshProfile) {
        toast.error('Failed to verify balance');
        return;
      }

      if (freshProfile.main_balance < product.investment_amount) {
        toast.error('Insufficient balance. Please deposit first.');
        return;
      }

      const dailyProfit = product.investment_amount * product.daily_profit_rate;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + product.duration_days);

      // Create investment
      const { error: investError } = await supabase
        .from('user_investments')
        .insert({
          user_id: profile.user_id,
          product_id: productId,
          amount: product.investment_amount,
          daily_profit: dailyProfit,
          end_date: endDate.toISOString(),
          status: 'active'
        });

      if (investError) {
        toast.error('Failed to create investment');
        return;
      }

      // Update profile balance using fresh DB values
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          main_balance: freshProfile.main_balance - product.investment_amount,
          invested_amount: freshProfile.invested_amount + product.investment_amount
        })
        .eq('user_id', profile.user_id);

      if (updateError) {
        toast.error('Failed to update balance');
        return;
      }

      refreshProfile();
      // Get product name from ProductCard mapping
      const names: Record<string, string> = { '3500': 'Galaxy Buds', '6500': 'Galaxy Watch', '12000': 'Galaxy A15', '20000': 'Galaxy A35', '35000': 'Galaxy Tab A9', '60000': 'Galaxy Tab S9', '100000': 'Galaxy Book', '200000': 'Galaxy Book Pro', '500000': 'Samsung Smart TV', '1000000': 'Samsung Neo QLED' };
      setInvestSuccess({ show: true, amount: product.investment_amount, name: names[product.investment_amount.toString()] || 'Samsung Device' });
    } finally {
      investingRef.current = false;
      setInvestingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              investment={product.investment_amount}
              dailyProfit={product.investment_amount * product.daily_profit_rate}
              duration={product.duration_days}
              onInvest={handleInvest}
              isLoading={investingId === product.id}
            />
          </div>
        ))}
      </div>

      <SuccessNotification
        isOpen={investSuccess.show}
        onClose={() => setInvestSuccess({ show: false, amount: 0, name: '' })}
        type="investment"
        amount={investSuccess.amount}
        productName={investSuccess.name}
      />

      <BottomNav />
    </div>
  );
}
