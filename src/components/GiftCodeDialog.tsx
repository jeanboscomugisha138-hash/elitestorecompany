import { useState } from 'react';
import { Gift, Loader2, Sparkles } from 'lucide-react';
import { PopupModal } from './PopupModal';
import { supabase } from '@/integrations/supabase/client';
import { SuccessNotification } from './SuccessNotification';

export function GiftCodeDialog({
  open,
  onOpenChange,
  onRedeemed,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onRedeemed?: () => void;
}) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 });

  const submit = async () => {
    const c = code.trim();
    if (!c) { setError('Andika kode ya bonus.'); return; }
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('redeem-gift-code', { body: { code: c } });
      if (error || data?.error) {
        setError(data?.error || 'Kode ntabwo ari yo cyangwa yakoreshejwe.');
      } else {
        setCode('');
        onOpenChange(false);
        onRedeemed?.();
        setSuccess({ show: true, amount: data.amount || 0 });
      }
    } catch {
      setError('Habaye ikosa. Gerageza nanone.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PopupModal isOpen={open} onClose={() => onOpenChange(false)} accent="primary">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="text-lg font-black text-foreground leading-tight">Kode ya Bonus</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Andika kode ya bonus kugira ngo wakire amafaranga ako kanya.
            </p>
          </div>
        </div>

        <input
          type="text"
          placeholder="ANDIKA KODE HANO"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
          maxLength={50}
          className="w-full h-14 text-center uppercase tracking-[0.3em] font-black text-base rounded-2xl border-2 border-primary/20 bg-primary/5 focus:border-primary focus:bg-white focus:outline-none transition-colors placeholder:text-muted-foreground/40 placeholder:text-xs placeholder:tracking-widest"
        />

        {error && (
          <p className="mt-2 text-xs text-destructive font-bold text-center">{error}</p>
        )}

        <button
          onClick={submit}
          disabled={loading || !code.trim()}
          className="mt-4 w-full bg-primary text-primary-foreground font-black text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-lg-custom disabled:opacity-60"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Birimo gukorwa...</> : <><Sparkles className="w-4 h-4" /> Emeza Kode</>}
        </button>
      </PopupModal>

      <SuccessNotification
        isOpen={success.show}
        onClose={() => setSuccess({ show: false, amount: 0 })}
        type="gift"
        amount={success.amount}
      />
    </>
  );
}
