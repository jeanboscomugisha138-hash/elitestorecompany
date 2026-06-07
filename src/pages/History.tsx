import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowDownToLine, ArrowUpFromLine, Package, Gift, Calendar, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle, Sparkles, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

type TabType = 'deposits' | 'withdrawals' | 'investments' | 'bonuses';

const tabs: { id: TabType; label: string; icon: React.ElementType; gradient: string }[] = [
  { id: 'deposits', label: 'Deposits', icon: ArrowDownToLine, gradient: 'from-primary to-primary/70' },
  { id: 'withdrawals', label: 'Withdrawals', icon: ArrowUpFromLine, gradient: 'from-secondary to-secondary/70' },
  { id: 'investments', label: 'Investments', icon: Package, gradient: 'from-primary via-secondary to-secondary' },
  { id: 'bonuses', label: 'Bonuses', icon: Gift, gradient: 'from-secondary via-primary to-primary' },
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

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'approved':
    case 'active':
    case 'completed':
      return <CheckCircle2 className="w-4 h-4" />;
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'rejected':
    case 'cancelled':
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'approved':
    case 'active':
      return 'bg-primary/10 text-primary border border-primary/20';
    case 'pending':
      return 'bg-secondary/10 text-secondary border border-secondary/20';
    case 'rejected':
    case 'cancelled':
      return 'bg-destructive/10 text-destructive border border-destructive/20';
    case 'completed':
      return 'bg-primary/10 text-primary border border-primary/20';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
};

export default function History() {
  const [activeTab, setActiveTab] = useState<TabType>('deposits');
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const activeTabData = tabs.find(t => t.id === activeTab)!;

  const totalAmount = (() => {
    if (activeTab === 'deposits') return deposits.reduce((s, d) => s + d.amount, 0);
    if (activeTab === 'withdrawals') return withdrawals.reduce((s, w) => s + w.amount, 0);
    if (activeTab === 'investments') return investments.reduce((s, i) => s + i.amount, 0);
    return bonuses.reduce((s, b) => s + b.amount, 0);
  })();

  const itemCount = (() => {
    if (activeTab === 'deposits') return deposits.length;
    if (activeTab === 'withdrawals') return withdrawals.length;
    if (activeTab === 'investments') return investments.length;
    return bonuses.length;
  })();

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${activeTabData.gradient} flex items-center justify-center mb-5 opacity-20`}>
        <activeTabData.icon className="w-10 h-10 text-primary-foreground" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">No {activeTab} yet</h3>
      <p className="text-sm text-muted-foreground text-center max-w-[240px]">
        Your {activeTab} history will appear here once you make your first transaction.
      </p>
    </div>
  );

  const renderTransactions = (transactions: Transaction[]) => (
    <div className="space-y-3">
      {transactions.map((tx, i) => (
        <div
          key={tx.id}
          className="group flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${activeTabData.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <activeTabData.icon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-foreground text-base">{tx.amount.toLocaleString()} RWF</p>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusStyle(tx.status)}`}>
                <StatusIcon status={tx.status} />
                {tx.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(tx.created_at)}</span>
              <span className="text-border">•</span>
              <Clock className="w-3 h-3" />
              <span>{formatTime(tx.created_at)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderInvestments = () => (
    <div className="space-y-3">
      {investments.map((inv, i) => (
        <div
          key={inv.id}
          className="group p-4 bg-card rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary via-secondary to-secondary flex items-center justify-center shadow-sm">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-foreground text-base">{inv.amount.toLocaleString()} RWF</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(inv.start_date)}</span>
                </div>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusStyle(inv.status)}`}>
              <StatusIcon status={inv.status} />
              {inv.status}
            </span>
          </div>
          <div className="flex items-center justify-between bg-accent/50 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold text-secondary">{inv.daily_profit.toLocaleString()} RWF/day</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Ends</span>
              <span className="font-medium text-foreground">{formatDate(inv.end_date)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBonuses = () => (
    <div className="space-y-3">
      {bonuses.map((bonus, i) => (
        <div
          key={bonus.id}
          className="group flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-secondary via-primary to-primary flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-foreground text-base">Daily Bonus</p>
              <p className="font-bold text-secondary text-base">+{bonus.amount.toLocaleString()} RWF</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(bonus.claimed_at)}</span>
              <span className="text-border">•</span>
              <Clock className="w-3 h-3" />
              <span>{formatTime(bonus.claimed_at)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const title = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Statement`;

      // ===== Header band =====
      doc.setFillColor(63, 32, 200); // primary indigo
      doc.rect(0, 0, pageWidth, 32, 'F');
      doc.setFillColor(220, 38, 130); // accent pink
      doc.rect(0, 32, pageWidth, 3, 'F');

      // Brand mark circle
      doc.setFillColor(255, 255, 255);
      doc.circle(18, 16, 7, 'F');
      doc.setTextColor(63, 32, 200);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('ES', 18, 19, { align: 'center' });

      // Brand title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('ELITE STORE COMPANY', 30, 15);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Smart Investment Platform · Kigali, Rwanda', 30, 22);

      // ===== Title section =====
      doc.setTextColor(20, 20, 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(title, 14, 50);
      doc.setDrawColor(220, 38, 130);
      doc.setLineWidth(0.8);
      doc.line(14, 53, 50, 53);

      // ===== User info card =====
      doc.setFillColor(245, 245, 250);
      doc.roundedRect(14, 60, pageWidth - 28, 36, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 100);
      doc.text('ACCOUNT HOLDER', 20, 68);
      doc.text('CONTACT', 20, 82);
      doc.text('GENERATED', pageWidth / 2 + 5, 68);
      doc.text('REFERENCE', pageWidth / 2 + 5, 82);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(20, 20, 30);
      doc.text(profile?.full_name || '—', 20, 74);
      doc.text(profile?.phone || '—', 20, 88);
      doc.text(new Date().toLocaleString(), pageWidth / 2 + 5, 74);
      doc.text(`ES-${Date.now().toString().slice(-8)}`, pageWidth / 2 + 5, 88);

      // ===== Summary pills =====
      const pillY = 104;
      doc.setFillColor(63, 32, 200);
      doc.roundedRect(14, pillY, (pageWidth - 32) / 2, 18, 3, 3, 'F');
      doc.setFillColor(220, 38, 130);
      doc.roundedRect(pageWidth / 2 + 2, pillY, (pageWidth - 32) / 2, 18, 3, 3, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('TOTAL AMOUNT', 20, pillY + 7);
      doc.text('RECORDS', pageWidth / 2 + 8, pillY + 7);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`${totalAmount.toLocaleString()} RWF`, 20, pillY + 14);
      doc.text(`${itemCount}`, pageWidth / 2 + 8, pillY + 14);

      // ===== Table =====
      let head: string[][] = [];
      let body: (string | number)[][] = [];

      if (activeTab === 'deposits' || activeTab === 'withdrawals') {
        const rows = activeTab === 'deposits' ? deposits : withdrawals;
        head = [['Date', 'Time', 'Amount (RWF)', 'Status']];
        body = rows.map(r => [formatDate(r.created_at), formatTime(r.created_at), r.amount.toLocaleString(), r.status.toUpperCase()]);
      } else if (activeTab === 'investments') {
        head = [['Start', 'End', 'Amount (RWF)', 'Daily Profit', 'Status']];
        body = investments.map(i => [formatDate(i.start_date), formatDate(i.end_date), i.amount.toLocaleString(), i.daily_profit.toLocaleString(), i.status.toUpperCase()]);
      } else {
        head = [['Date', 'Time', 'Type', 'Amount (RWF)']];
        body = bonuses.map(b => [formatDate(b.claimed_at), formatTime(b.claimed_at), 'Daily Bonus', b.amount.toLocaleString()]);
      }

      autoTable(doc, {
        head,
        body,
        startY: 130,
        margin: { left: 14, right: 14 },
        styles: { fontSize: 9, cellPadding: 3.5, textColor: [35, 35, 50] },
        headStyles: { fillColor: [63, 32, 200], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'left' },
        alternateRowStyles: { fillColor: [248, 248, 252] },
        theme: 'grid',
        tableLineColor: [225, 225, 235],
        tableLineWidth: 0.1,
      });

      // ===== Footer on every page =====
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let p = 1; p <= pageCount; p++) {
        doc.setPage(p);
        const ph = doc.internal.pageSize.getHeight();
        doc.setDrawColor(225, 225, 235);
        doc.line(14, ph - 18, pageWidth - 14, ph - 18);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 140);
        doc.text('ELITE STORE COMPANY · Official Statement · Confidential', 14, ph - 11);
        doc.text(`Page ${p} of ${pageCount}`, pageWidth - 14, ph - 11, { align: 'right' });
      }

      doc.save(`elite-store-${activeTab}-${Date.now()}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (e) {
      toast.error('Failed to generate PDF');
    }
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50">
              <div className="w-11 h-11 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded-lg w-2/3" />
                <div className="h-3 bg-muted rounded-lg w-1/3" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (itemCount === 0) return renderEmpty();

    if (activeTab === 'bonuses') return renderBonuses();
    if (activeTab === 'investments') return renderInvestments();
    return renderTransactions(activeTab === 'deposits' ? deposits : withdrawals);
  };

  return (
    <div className="page-container bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/dashboard"
          className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-card hover:shadow-lg-custom transition-all border border-border/50"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground flex-1 text-left">History</h1>
        <button
          onClick={handleDownloadPDF}
          disabled={isLoading || itemCount === 0}
          className="flex items-center gap-2 px-3 h-10 bg-primary text-primary-foreground rounded-xl shadow-card font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          PDF
        </button>
      </div>

      {/* Summary Card */}
      {!isLoading && itemCount > 0 && (
        <div className={`relative overflow-hidden rounded-2xl p-5 mb-5 bg-gradient-to-br ${activeTabData.gradient} text-primary-foreground shadow-button`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-sm font-medium text-primary-foreground/80 mb-1">
              Total {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </p>
            <p className="text-3xl font-extrabold tracking-tight">{totalAmount.toLocaleString()} RWF</p>
            <p className="text-sm text-primary-foreground/70 mt-1">{itemCount} transaction{itemCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {tabs.map(({ id, label, icon: Icon, gradient }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
              activeTab === id
                ? `bg-gradient-to-r ${gradient} text-primary-foreground shadow-button scale-[1.02]`
                : 'bg-card text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/20'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in min-h-[300px]">
        {renderContent()}
      </div>

      <BottomNav />
    </div>
  );
}
