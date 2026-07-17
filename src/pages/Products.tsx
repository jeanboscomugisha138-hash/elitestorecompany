import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      const names: Record<string, string> = { '3500': 'Petane Peteroli Mbisi', '10000': 'Petane Mazutu', '20000': 'Petane Essence', '30000': 'Wireless Duo', '40000': 'Petane LPG', '50000': 'Petane Cargo', '100000': 'Petane Marine', '250000': 'Petane Tanker', '500000': 'Petane Fleet', '1000000': 'Petane Global Energy' };
      setInvestSuccess({ show: true, amount: product.investment_amount, name: names[product.investment_amount.toString()] || 'Petane Shipping' });
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
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-[hsl(226_83%_33%)] text-primary-foreground px-4 pt-6 pb-8 rounded-b-3xl shadow-lg-custom">
        <div className="flex items-center gap-3 mb-4 max-w-md mx-auto">
          <Link to="/dashboard" className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold">Imishinga ya Petane</h1>
            <p className="text-xs text-white/80">Hitamo umushinga ushoremo</p>
          </div>
        </div>
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-xs">
          <p className="font-semibold">💡 Inyungu ya buri munsi: VIP 1 = 7.14% · VIP 2–4 = 7% · VIP 5–7 = 7.5% · VIP 8–10 = 8%</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4">



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
