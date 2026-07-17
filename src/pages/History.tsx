import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  Package,
  Gift,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Search,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

type TabType = 'deposits' | 'withdrawals' | 'investments' | 'bonuses';

const tabs: {
  id: TabType;
  label: string;
  short: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}[] = [
  { id: 'deposits', label: 'Ishyura', short: 'Ishyura', icon: ArrowDownToLine, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'withdrawals', label: 'Kwakira', short: 'Kwakira', icon: ArrowUpFromLine, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'investments', label: 'Imishinga', short: 'Imishinga', icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 'bonuses', label: 'Bonus', short: 'Bonus', icon: Gift, color: 'text-sky-600', bg: 'bg-sky-50' },
];

interface Transaction {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

interface Investment {
  id: string;
  amount: number;
  daily_profit: number;
  status: string;
  start_date: string;
  end_date: string;
}

interface Bonus {
  id: string;
  amount: number;
  claimed_at: string;
}

const statusLabel: Record<string, string> = {
  approved: 'Byemejwe',
  active: 'Bikora',
  completed: 'Byarangiye',
  pending: 'Bitegereje',
  rejected: 'Byanzwe',
  cancelled: 'Byahagaritswe',
};

const StatusPill = ({ status }: { status: string }) => {
  const map: Record<string, { cls: string; Icon: React.ElementType }> = {
    approved: { cls: 'bg-emerald-50 text-emerald-700', Icon: CheckCircle2 },
    active: { cls: 'bg-emerald-50 text-emerald-700', Icon: CheckCircle2 },
    completed: { cls: 'bg-primary/10 text-primary', Icon: CheckCircle2 },
    pending: { cls: 'bg-amber-50 text-amber-700', Icon: Clock },
    rejected: { cls: 'bg-rose-50 text-rose-700', Icon: XCircle },
    cancelled: { cls: 'bg-rose-50 text-rose-700', Icon: XCircle },
  };
  const s = map[status] || { cls: 'bg-muted text-muted-foreground', Icon: AlertCircle };
  const Icon = s.Icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${s.cls}`}>
      <Icon className="w-3 h-3" strokeWidth={2.5} />
      {statusLabel[status] || status}
    </span>
  );
};

export default function History() {
  const [activeTab, setActiveTab] = useState<TabType>('deposits');
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) fetchHistory();
  }, [profile, activeTab]);

  const fetchHistory = async () => {
    setIsLoading(true);
    if (activeTab === 'deposits') {
      const { data } = await supabase.from('deposit_transactions').select('*').eq('user_id', profile?.user_id).order('created_at', { ascending: false });
      setDeposits(data || []);
    } else if (activeTab === 'withdrawals') {
      const { data } = await supabase.from('withdrawal_transactions').select('*').eq('user_id', profile?.user_id).order('created_at', { ascending: false });
      setWithdrawals(data || []);
    } else if (activeTab === 'investments') {
      const { data } = await supabase.from('user_investments').select('*').eq('user_id', profile?.user_id).order('created_at', { ascending: false });
      setInvestments(data || []);
    } else if (activeTab === 'bonuses') {
      const { data } = await supabase.from('daily_bonuses').select('*').eq('user_id', profile?.user_id).order('claimed_at', { ascending: false });
      setBonuses(data || []);
    }
    setIsLoading(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const groupKey = (d: string) => {
    const dt = new Date(d);
    const today = new Date();
    const y = new Date(); y.setDate(today.getDate() - 1);
    if (dt.toDateString() === today.toDateString()) return 'Uyu munsi';
    if (dt.toDateString() === y.toDateString()) return 'Ejo hashize';
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  const totalAmount = useMemo(() => {
    if (activeTab === 'deposits') return deposits.reduce((s, d) => s + d.amount, 0);
    if (activeTab === 'withdrawals') return withdrawals.reduce((s, w) => s + w.amount, 0);
    if (activeTab === 'investments') return investments.reduce((s, i) => s + i.amount, 0);
    return bonuses.reduce((s, b) => s + b.amount, 0);
  }, [activeTab, deposits, withdrawals, investments, bonuses]);

  const filterFn = (amount: number, status?: string) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return amount.toString().includes(q) || (status || '').toLowerCase().includes(q);
  };

  const itemCount = (() => {
    if (activeTab === 'deposits') return deposits.length;
    if (activeTab === 'withdrawals') return withdrawals.length;
    if (activeTab === 'investments') return investments.length;
    return bonuses.length;
  })();

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const title = `${activeTabData.label} - Raporo`;

      doc.setFillColor(23, 71, 224);
      doc.rect(0, 0, pageWidth, 32, 'F');
      doc.setFillColor(14, 46, 154);
      doc.rect(0, 32, pageWidth, 3, 'F');

      doc.setFillColor(255, 255, 255);
      doc.circle(18, 16, 7, 'F');
      doc.setTextColor(23, 71, 224);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('PS', 18, 19, { align: 'center' });

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('PETANE SHIPPING', 30, 15);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Kigali, Rwanda', 30, 22);

      doc.setTextColor(20, 20, 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(title, 14, 50);

      doc.setFillColor(245, 246, 250);
      doc.roundedRect(14, 60, pageWidth - 28, 36, 3, 3, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(90, 95, 110);
      doc.text('IZINA', 20, 68);
      doc.text('TELEFONI', 20, 82);
      doc.text('ITARIKI', pageWidth / 2 + 5, 68);
      doc.text('REFERANSI', pageWidth / 2 + 5, 82);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(20, 20, 30);
      doc.text(profile?.full_name || '—', 20, 74);
      doc.text(profile?.phone || '—', 20, 88);
      doc.text(new Date().toLocaleString(), pageWidth / 2 + 5, 74);
      doc.text(`PS-${Date.now().toString().slice(-8)}`, pageWidth / 2 + 5, 88);

      const pillY = 104;
      doc.setFillColor(23, 71, 224);
      doc.roundedRect(14, pillY, (pageWidth - 32) / 2, 18, 3, 3, 'F');
      doc.setFillColor(14, 46, 154);
      doc.roundedRect(pageWidth / 2 + 2, pillY, (pageWidth - 32) / 2, 18, 3, 3, 'F');
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
      doc.text('AMAFARANGA YOSE', 20, pillY + 7);
      doc.text('UMUBARE', pageWidth / 2 + 8, pillY + 7);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
      doc.text(`${totalAmount.toLocaleString()} RWF`, 20, pillY + 14);
      doc.text(`${itemCount}`, pageWidth / 2 + 8, pillY + 14);

      let head: string[][] = [];
      let body: (string | number)[][] = [];
      if (activeTab === 'deposits' || activeTab === 'withdrawals') {
        const rows = activeTab === 'deposits' ? deposits : withdrawals;
        head = [['Itariki', 'Isaha', 'Amafaranga (RWF)', 'Uko biteye']];
        body = rows.map((r) => [formatDate(r.created_at), formatTime(r.created_at), r.amount.toLocaleString(), (statusLabel[r.status] || r.status).toUpperCase()]);
      } else if (activeTab === 'investments') {
        head = [['Yatangiye', 'Irangira', 'Amafaranga', 'Inyungu/munsi', 'Uko biteye']];
        body = investments.map((i) => [formatDate(i.start_date), formatDate(i.end_date), i.amount.toLocaleString(), i.daily_profit.toLocaleString(), (statusLabel[i.status] || i.status).toUpperCase()]);
      } else {
        head = [['Itariki', 'Isaha', 'Ubwoko', 'Amafaranga']];
        body = bonuses.map((b) => [formatDate(b.claimed_at), formatTime(b.claimed_at), 'Bonus', b.amount.toLocaleString()]);
      }

      autoTable(doc, {
        head, body,
        startY: 130,
        margin: { left: 14, right: 14 },
        styles: { fontSize: 9, cellPadding: 3.5, textColor: [35, 35, 50] },
        headStyles: { fillColor: [23, 71, 224], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'left' },
        alternateRowStyles: { fillColor: [248, 249, 253] },
        theme: 'grid',
        tableLineColor: [225, 227, 235],
        tableLineWidth: 0.1,
      });

      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let p = 1; p <= pageCount; p++) {
        doc.setPage(p);
        const ph = doc.internal.pageSize.getHeight();
        doc.setDrawColor(225, 227, 235);
        doc.line(14, ph - 18, pageWidth - 14, ph - 18);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(120, 122, 140);
        doc.text('PETANE SHIPPING · Raporo yemewe · Ubwiru', 14, ph - 11);
        doc.text(`Ipaji ${p}/${pageCount}`, pageWidth - 14, ph - 11, { align: 'right' });
      }

      doc.save(`petane-shipping-${activeTab}-${Date.now()}.pdf`);
      toast.success('PDF yamanuwe neza');
    } catch {
      toast.error('Ntibyakunze gukora PDF');
    }
  };

  // ---- Rendering ----

  const renderRow = (
    key: string,
    left: React.ReactNode,
    title: string,
    subtitle: string,
    amount: number,
    status?: string,
    positive = true,
  ) => (
    <div key={key} className="flex items-center gap-3 py-3 px-3 bg-card first:rounded-t-2xl last:rounded-b-2xl">
      {left}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-foreground truncate">{title}</p>
          <p className={`text-sm font-black tabular-nums ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {positive ? '+' : '−'}{amount.toLocaleString()}
            <span className="text-[10px] font-bold text-muted-foreground ml-1">RWF</span>
          </p>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
          {status && <StatusPill status={status} />}
        </div>
      </div>
    </div>
  );

  const groupBy = <T,>(items: T[], getDate: (t: T) => string): [string, T[]][] => {
    const map = new Map<string, T[]>();
    items.forEach((it) => {
      const k = groupKey(getDate(it));
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(it);
    });
    return Array.from(map.entries());
  };

  const iconCircle = () => (
    <div className={`w-11 h-11 rounded-2xl ${activeTabData.bg} ${activeTabData.color} flex items-center justify-center shrink-0`}>
      <activeTabData.icon className="w-5 h-5" strokeWidth={2.3} />
    </div>
  );

  const renderList = () => {
    if (activeTab === 'deposits' || activeTab === 'withdrawals') {
      const items = (activeTab === 'deposits' ? deposits : withdrawals).filter((t) => filterFn(t.amount, t.status));
      const groups = groupBy(items, (t) => t.created_at);
      return groups.map(([label, rows]) => (
        <div key={label} className="mb-4">
          <div className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase px-1 mb-2">{label}</div>
          <div className="bg-card rounded-2xl border border-border/60 divide-y divide-border/50">
            {rows.map((tx) =>
              renderRow(
                tx.id,
                iconCircle(),
                activeTabData.label,
                formatTime(tx.created_at),
                tx.amount,
                tx.status,
                activeTab === 'deposits',
              ),
            )}
          </div>
        </div>
      ));
    }
    if (activeTab === 'investments') {
      const items = investments.filter((t) => filterFn(t.amount, t.status));
      const groups = groupBy(items, (i) => i.start_date);
      return groups.map(([label, rows]) => (
        <div key={label} className="mb-4">
          <div className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase px-1 mb-2">{label}</div>
          <div className="bg-card rounded-2xl border border-border/60 divide-y divide-border/50">
            {rows.map((inv) => (
              <div key={inv.id} className="p-3">
                <div className="flex items-center gap-3">
                  {iconCircle()}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-foreground truncate">Umushinga</p>
                      <p className="text-sm font-black tabular-nums text-foreground">
                        {inv.amount.toLocaleString()}<span className="text-[10px] font-bold text-muted-foreground ml-1">RWF</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-[11px] text-muted-foreground">Irangira {formatDate(inv.end_date)}</p>
                      <StatusPill status={inv.status} />
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 ml-14 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{inv.daily_profit.toLocaleString()} RWF <span className="text-muted-foreground font-medium">buri munsi</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ));
    }
    // bonuses
    const items = bonuses.filter((b) => filterFn(b.amount));
    const groups = groupBy(items, (b) => b.claimed_at);
    return groups.map(([label, rows]) => (
      <div key={label} className="mb-4">
        <div className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase px-1 mb-2">{label}</div>
        <div className="bg-card rounded-2xl border border-border/60 divide-y divide-border/50">
          {rows.map((b) => renderRow(b.id, iconCircle(), 'Bonus ya Buri munsi', formatTime(b.claimed_at), b.amount))}
        </div>
      </div>
    ));
  };

  const renderEmpty = () => (
    <div className="bg-card rounded-2xl border border-border/60 py-14 flex flex-col items-center px-6 text-center">
      <div className={`w-16 h-16 rounded-2xl ${activeTabData.bg} ${activeTabData.color} flex items-center justify-center mb-4`}>
        <FileText className="w-8 h-8" strokeWidth={2} />
      </div>
      <h3 className="text-base font-black text-foreground mb-1">Nta {activeTabData.label.toLowerCase()} ihari</h3>
      <p className="text-xs text-muted-foreground max-w-[240px]">
        Amateka y'ibikorwa byawe azagaragara hano nyuma yo gukora igikorwa cya mbere.
      </p>
    </div>
  );

  const renderLoading = () => (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-card rounded-2xl border border-border/60">
          <div className="w-11 h-11 rounded-2xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-[hsl(0_0%_96%)]">
      {/* Header */}
      <div className="gradient-primary px-4 pt-4 pb-20 relative">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </Link>
          <div className="text-primary-foreground">
            <h1 className="text-lg font-black tracking-tight">Amateka</h1>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isLoading || itemCount === 0}
            className="w-10 h-10 rounded-xl bg-primary-foreground text-primary flex items-center justify-center disabled:opacity-40 shadow-md"
            aria-label="PDF"
          >
            <Download className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Overlapping summary card */}
      <div className="px-3 -mt-14 relative z-10">
        <div className="bg-card rounded-2xl shadow-card border border-border/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {activeTabData.label} · Igiteranyo
              </p>
              <p className="text-2xl font-black text-foreground tabular-nums mt-1">
                {totalAmount.toLocaleString()}
                <span className="text-sm font-bold text-primary ml-1.5">RWF</span>
              </p>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${activeTabData.bg} ${activeTabData.color} flex items-center justify-center`}>
              <activeTabData.icon className="w-6 h-6" strokeWidth={2.3} />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ibikorwa</p>
              <p className="text-sm font-black text-foreground">{itemCount}</p>
            </div>
            <div className="flex-1 border-l border-border pl-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ubwoko</p>
              <p className="text-sm font-black text-foreground">{activeTabData.label}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-3 mt-4">
        <div className="bg-card rounded-2xl border border-border/60 p-1 grid grid-cols-4 gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl transition text-[11px] font-bold ${
                  isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" strokeWidth={2.3} />
                {tab.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="px-3 mt-3">
        <div className="flex items-center gap-2 bg-card border border-border/60 rounded-xl px-3 h-11">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Shakisha mu mateka..."
            className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-3 mt-4">
        {isLoading ? renderLoading() : itemCount === 0 ? renderEmpty() : renderList()}
      </div>

      <BottomNav />
    </div>
  );
}
