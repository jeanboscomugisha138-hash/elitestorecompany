import { useState } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Msg = { role: 'user' | 'ai'; text: string };
const SUGGESTIONS = ['Ni ikihe gicuruzwa cyunguka cyane?', 'Nshoye 10,000 RWF nakunguka angahe?', 'Inyungu yishyurwa ryari?'];

export function ProductAssistant() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;
    setMsgs((m) => [...m, { role: 'user', text: question }]);
    setQ('');
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('product-assistant', { body: { question } });
    const answer = error ? 'Umufasha ntabonetse ubu, ongera ugerageze.' : data?.error || data?.answer || '—';
    setMsgs((m) => [...m, { role: 'ai', text: answer }]);
    setLoading(false);
  };

  return (
    <div className="rounded-2xl bg-card/95 border border-primary/40 p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-card-foreground text-sm">Baza ku bicuruzwa</h3>
          <p className="text-xs text-muted-foreground">Umufasha wa AI asubiza ku ishoramari</p>
        </div>
      </div>

      {msgs.length === 0 ? (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => ask(s)} className="text-xs px-3 py-1.5 rounded-full bg-primary/15 text-card-foreground border border-primary/40">
              {s}
            </button>
          ))}
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto space-y-2 mb-3">
          {msgs.map((m, i) => (
            <div key={i} className={`text-sm rounded-xl px-3 py-2 whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary text-primary-foreground ml-8' : 'bg-muted text-foreground mr-8'}`}>
              {m.text}
            </div>
          ))}
          {loading && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Ndimo gutekereza...</div>}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); ask(q); }} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={500}
          placeholder="Andika ikibazo cyawe..."
          className="flex-1 rounded-xl px-3 py-2 text-sm bg-background text-foreground border border-border outline-none focus:border-primary"
        />
        <button type="submit" disabled={loading || !q.trim()} className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50" aria-label="Ohereza">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
