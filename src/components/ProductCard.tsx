import { CheckCircle2, TrendingUp, Calendar, Coins, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import vip1 from '@/assets/petane-vip1.jpg';
import vip2 from '@/assets/petane-vip2.jpg';
import vip3 from '@/assets/petane-vip3.jpg';
import vip4 from '@/assets/petane-vip4.jpg';
import vip5 from '@/assets/petane-vip5.jpg';
import vip6 from '@/assets/petane-vip6.jpg';
import vip7 from '@/assets/petane-vip7.jpg';
import vip8 from '@/assets/petane-vip8.jpg';
import vip9 from '@/assets/petane-vip9.jpg';
import vip10 from '@/assets/petane-vip10.jpg';

const productImages: Record<string, { image: string; name: string; tier: string }> = {
  '3500':    { image: vip1,  name: 'Gutwara Peteroli Mbisi', tier: 'VIP 1' },
  '10000':   { image: vip2,  name: 'Gutwara Mazutu',         tier: 'VIP 2' },
  '20000':   { image: vip3,  name: 'Gutwara Essence',        tier: 'VIP 3' },
  '30000':   { image: vip4,  name: 'Sitasiyo ya Lisansi',    tier: 'VIP 4' },
  '40000':   { image: vip5,  name: 'Gutwara LPG',            tier: 'VIP 5' },
  '50000':   { image: vip6,  name: 'Ubwikorezi bwa Cargo',   tier: 'VIP 6' },
  '100000':  { image: vip7,  name: 'Ubwikorezi bwo mu Nyanja', tier: 'VIP 7' },
  '250000':  { image: vip8,  name: 'Ubwato bwa Tanker',      tier: 'VIP 8' },
  '500000':  { image: vip9,  name: 'Fleet ya Petane',        tier: 'VIP 9' },
  '1000000': { image: vip10, name: 'Ingufu ku Isi',          tier: 'VIP 10' },
};

function getProductInfo(investment: number) {
  return productImages[investment.toString()] || { image: vip1, name: 'Petane Shipping', tier: 'VIP' };
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
    <div className={`rounded-2xl overflow-hidden shadow-card animate-slide-up bg-card border-2 ${purchased ? 'border-emerald-500/40' : 'border-primary/20'}`}>
      {/* Hero image */}
      <div className="relative h-40 w-full bg-primary/5 overflow-hidden">
        <img src={image} alt={name} loading="lazy" width={1024} height={1024} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-extrabold px-3 py-1 rounded-full shadow-button">
          {tier}
        </div>
        {purchased && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow">
            <CheckCircle2 className="w-3 h-3" /> Byaguzwe
          </div>
        )}
        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="text-white font-extrabold text-base leading-tight drop-shadow">{name}</h3>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-2 text-[13px]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground"><Wallet className="w-4 h-4 text-primary" />Ishoramari</span>
          <span className="font-bold text-primary">{investment.toLocaleString()} RWF</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4 text-primary" />Igihe</span>
          <span className="font-bold text-foreground">{duration} iminsi</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground"><Coins className="w-4 h-4 text-primary" />Inyungu ya buri munsi</span>
          <span className="font-bold text-foreground">{dailyProfit.toLocaleString()} RWF</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="w-4 h-4 text-primary" />Inyungu yose</span>
          <span className="font-extrabold text-primary">{totalProfit.toLocaleString()} RWF</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 pb-4 pt-1">
        <span className="text-primary font-extrabold text-lg">{investment.toLocaleString()} RWF</span>
        <button
          onClick={() => !purchased && onInvest(id)}
          disabled={isLoading || purchased}
          className={`font-bold px-6 py-2.5 rounded-full text-sm shadow-button transition-all disabled:opacity-70 ${
            purchased
              ? 'bg-emerald-500 text-white cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-95'
          }`}
        >
          {purchased ? 'Byaguzwe' : isLoading ? '...' : 'Gura Nonaha'}
        </button>
      </div>
    </div>
  );
}
