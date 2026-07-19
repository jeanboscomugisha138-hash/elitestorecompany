import { useEffect, useState, useCallback } from 'react';
import {
  Bell, X, TrendingUp, Users, ArrowDownToLine, ArrowUpFromLine,
  Megaphone, Gift, CheckCheck, Trash2, Inbox,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  open: boolean;
  onClose: () => void;
}

type NotifItem = {
  id: string;
  title: string;
  body: string;
  category: string;
  created_at: string;
  read: boolean;
  system?: boolean; // derived / cannot be deleted individually
  broadcast?: boolean;
};

const CATEGORY_ICON: Record<string, any> = {
  income: TrendingUp,
  referral: Users,
  deposit: ArrowDownToLine,
  withdrawal: ArrowUpFromLine,
  service: Gift,
  announcement: Megaphone,
  admin: Megaphone,
};

const CATEGORY_COLOR: Record<string, string> = {
  income: 'text-emerald-600 bg-emerald-50',
  referral: 'text-indigo-600 bg-indigo-50',
  deposit: 'text-blue-600 bg-blue-50',
  withdrawal: 'text-orange-600 bg-orange-50',
  service: 'text-pink-600 bg-pink-50',
  announcement: 'text-primary bg-primary/10',
  admin: 'text-primary bg-primary/10',
};

const READ_STATE_KEY = 'petane_notif_read_v1';
const DELETED_STATE_KEY = 'petane_notif_deleted_v1';

const loadSet = (k: string): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(k) || '[]')); } catch { return new Set(); }
};
const saveSet = (k: string, s: Set<string>) => {
  try { localStorage.setItem(k, JSON.stringify(Array.from(s))); } catch {}
};

export function NotificationCenter({ open, onClose }: Props) {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<NotifItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [readSet, setReadSet] = useState<Set<string>>(loadSet(READ_STATE_KEY));
  const [deletedSet, setDeletedSet] = useState<Set<string>>(loadSet(DELETED_STATE_KEY));

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [notifRes, depRes, wdRes, refRes] = await Promise.all([
      supabase.from('notifications').select('*').or(`user_id.eq.${user.id},user_id.is.null`).order('created_at', { ascending: false }).limit(50),
      supabase.from('deposit_transactions').select('id,amount,status,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('withdrawal_transactions').select('id,amount,status,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('referral_earnings').select('id,amount,level,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    ]);

    const merged: NotifItem[] = [];

    (notifRes.data || []).forEach((n: any) => {
      merged.push({
        id: `n:${n.id}`,
        title: n.title,
        body: n.body,
        category: n.category || 'announcement',
        created_at: n.created_at,
        read: readSet.has(`n:${n.id}`),
        broadcast: n.user_id === null,
      });
    });

    const dailyProfit = Number(profile?.total_profit || 0);
    if (dailyProfit > 0) {
      const id = 'sys:income';
      merged.push({
        id, title: 'Inyungu ya buri munsi',
        body: `Wabonye inyungu ${dailyProfit.toLocaleString()} RWF muri konti yawe.`,
        category: 'income', created_at: new Date().toISOString(),
        read: readSet.has(id), system: true,
      });
    }

    (depRes.data || []).forEach((d: any) => {
      const id = `dep:${d.id}`;
      merged.push({
        id,
        title: d.status === 'approved' ? 'Depoti Yemejwe' : d.status === 'pending' ? 'Depoti Itegereje' : 'Depoti Yahakanwe',
        body: `${Number(d.amount).toLocaleString()} RWF - ${d.status}`,
        category: 'deposit', created_at: d.created_at,
        read: readSet.has(id), system: true,
      });
    });

    (wdRes.data || []).forEach((w: any) => {
      const id = `wd:${w.id}`;
      merged.push({
        id,
        title: w.status === 'approved' ? 'Ubwikuze Bwemejwe' : w.status === 'pending' ? 'Ubwikuze Butegereje' : 'Ubwikuze Bwahakanwe',
        body: `${Number(w.amount).toLocaleString()} RWF - ${w.status}`,
        category: 'withdrawal', created_at: w.created_at,
        read: readSet.has(id), system: true,
      });
    });

    (refRes.data || []).forEach((r: any) => {
      const id = `ref:${r.id}`;
      merged.push({
        id,
        title: `Bonus ya Referral (Level ${r.level})`,
        body: `+${Number(r.amount).toLocaleString()} RWF bonus wabonye mu batumira.`,
        category: 'referral', created_at: r.created_at,
        read: readSet.has(id), system: true,
      });
    });

    const filtered = merged
      .filter((x) => !deletedSet.has(x.id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setItems(filtered);
    setLoading(false);
  }, [user, profile?.total_profit, readSet, deletedSet]);

  useEffect(() => {
    if (open) fetchAll();
  }, [open, fetchAll]);

  const unreadCount = items.filter((i) => !i.read).length;

  const markAllRead = () => {
    const s = new Set(readSet);
    items.forEach((i) => s.add(i.id));
    setReadSet(s);
    saveSet(READ_STATE_KEY, s);
    setItems(items.map((i) => ({ ...i, read: true })));
  };

  const deleteOne = (id: string) => {
    const s = new Set(deletedSet);
    s.add(id);
    setDeletedSet(s);
    saveSet(DELETED_STATE_KEY, s);
    setItems(items.filter((i) => i.id !== id));
  };

  const markRead = (id: string) => {
    if (readSet.has(id)) return;
    const s = new Set(readSet);
    s.add(id);
    setReadSet(s);
    saveSet(READ_STATE_KEY, s);
    setItems(items.map((i) => (i.id === id ? { ...i, read: true } : i)));
  };

  const clearAll = () => {
    const s = new Set(deletedSet);
    items.forEach((i) => s.add(i.id));
    setDeletedSet(s);
    saveSet(DELETED_STATE_KEY, s);
    setItems([]);
  };

  const fmtTime = (iso: string) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'ubu';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const days = Math.floor(h / 24);
    if (days < 7) return `${days}d`;
    return d.toLocaleDateString();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-end sm:justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full sm:max-w-md h-full sm:h-auto sm:max-h-[85vh] bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right sm:slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-[hsl(226,78%,48%)] to-[hsl(226,78%,32%)] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-white" />
            <h3 className="text-white font-bold text-base">Notification</h3>
            {unreadCount > 0 && (
              <span className="bg-white text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {items.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-gray-50/60">
            <button onClick={markAllRead} className="text-xs font-bold text-primary flex items-center gap-1">
              <CheckCheck className="w-4 h-4" /> Byose byasomwe
            </button>
            <button onClick={clearAll} className="text-xs font-bold text-red-500 flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Siba byose
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center">
              <Inbox className="w-14 h-14 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm font-bold text-foreground">Nta notification</p>
              <p className="text-xs text-muted-foreground mt-1">Notification zawe zizaboneka hano.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => {
                const Icon = CATEGORY_ICON[n.category] || Megaphone;
                const color = CATEGORY_COLOR[n.category] || CATEGORY_COLOR.announcement;
                return (
                  <li
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex gap-3 p-4 cursor-pointer transition ${n.read ? 'bg-white' : 'bg-primary/[0.04]'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm ${n.read ? 'font-medium' : 'font-bold'} text-foreground truncate`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{fmtTime(n.created_at)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteOne(n.id); }}
                      className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center shrink-0"
                      aria-label="Delete"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function useUnreadCount() {
  const { user, profile } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      const readSet = loadSet(READ_STATE_KEY);
      const deletedSet = loadSet(DELETED_STATE_KEY);
      const [notifRes, depRes, wdRes, refRes] = await Promise.all([
        supabase.from('notifications').select('id').or(`user_id.eq.${user.id},user_id.is.null`).limit(50),
        supabase.from('deposit_transactions').select('id').eq('user_id', user.id).limit(20),
        supabase.from('withdrawal_transactions').select('id').eq('user_id', user.id).limit(20),
        supabase.from('referral_earnings').select('id').eq('user_id', user.id).limit(20),
      ]);
      const ids: string[] = [];
      (notifRes.data || []).forEach((n: any) => ids.push(`n:${n.id}`));
      (depRes.data || []).forEach((d: any) => ids.push(`dep:${d.id}`));
      (wdRes.data || []).forEach((w: any) => ids.push(`wd:${w.id}`));
      (refRes.data || []).forEach((r: any) => ids.push(`ref:${r.id}`));
      if ((profile?.total_profit || 0) > 0) ids.push('sys:income');
      const unread = ids.filter((id) => !readSet.has(id) && !deletedSet.has(id)).length;
      if (mounted) setCount(unread);
    })();
    return () => { mounted = false; };
  }, [user, profile?.total_profit]);

  return count;
}
