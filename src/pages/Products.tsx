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
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { profile, refreshProfile } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (profile?.user_id) fetchPurchased();
  }, [profile?.user_id]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('investment_products')
      .select('*')
      .eq('is_active', true)
      .order('investment_amount', { ascending: true });
    if (data) setProducts(data);
    setIsLoading(false);
  };

  const fetchPurchased = async () => {
    if (!profile?.user_id) return;
    const { data } = await supabase
      .from('user_investments')
      .select('product_id')
      .eq('user_id', profile.user_id);
    if (data) setPurchasedIds(new Set(data.map(d => d.product_id)));
  };

  const [investingId, setInvestingId] = useState<string | null>(null);
  const investingRef = useRef(false);
  const [investSuccess, setInvestSuccess] = useState<{ show: boolean; amount: number; name: string }>({ show: false, amount: 0, name: '' });

  const handleInvest = async (productId: string) => {
    if (investingRef.current) return;
    if (purchasedIds.has(productId)) {
      toast.error('You have already purchased this product.');
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product || !profile?.user_id) return;

    investingRef.current = true;
    setInvestingId(productId);

    try {
      const { data: freshProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('main_balance, invested_amount')
        .eq('user_id', profile.user_id)
        .single();

      if (fetchError || !freshProfile) { toast.error('Failed to verify balance'); return; }

      if (freshProfile.main_balance < product.investment_amount) {
        toast.error('Insufficient balance. Please deposit first.');
        return;
      }

      // Double-check no duplicate
      const { data: existing } = await supabase
        .from('user_investments')
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('product_id', productId)
        .limit(1);
      if (existing && existing.length > 0) {
        setPurchasedIds(prev => new Set(prev).add(productId));
        toast.error('You have already purchased this product.');
        return;
      }

      const dailyProfit = product.investment_amount * product.daily_profit_rate;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + product.duration_days);

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

      if (investError) { toast.error('Failed to create investment'); return; }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          main_balance: freshProfile.main_balance - product.investment_amount,
          invested_amount: freshProfile.invested_amount + product.investment_amount
        })
        .eq('user_id', profile.user_id);

      if (updateError) { toast.error('Failed to update balance'); return; }

      refreshProfile();
      setPurchasedIds(prev => new Set(prev).add(productId));
      const names: Record<string, string> = { '3500': 'Elite Watch', '10000': 'Elite Speaker', '20000': 'Elite Phone A', '30000': 'Wireless Duo', '40000': 'Elite Flip', '50000': 'Elite Phone Pro', '100000': 'Elite Tab', '250000': 'Elite Book', '500000': 'Elite Smart TV', '1000000': 'Elite Neo QLED' };
      setInvestSuccess({ show: true, amount: product.investment_amount, name: names[product.investment_amount.toString()] || 'Elite Device' });
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
      <div className="flex items-center gap-4 mb-6">
        <Link to="/dashboard" className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-card hover:shadow-lg-custom transition-all">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="page-title mb-0 flex-1 text-left">Investment Products</h1>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {products.map((product, index) => (
          <div key={product.id} style={{ animationDelay: `${index * 0.05}s` }}>
            <ProductCard
              id={product.id}
              investment={product.investment_amount}
              dailyProfit={product.investment_amount * product.daily_profit_rate}
              duration={product.duration_days}
              onInvest={handleInvest}
              isLoading={investingId === product.id}
              purchased={purchasedIds.has(product.id)}
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
