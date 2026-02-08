import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowDownToLine, ArrowUpFromLine, Package, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type TabType = 'deposits' | 'withdrawals' | 'investments' | 'bonuses';

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'deposits', label: 'Deposits', icon: ArrowDownToLine },
  { id: 'withdrawals', label: 'Withdrawals', icon: ArrowUpFromLine },
  { id: 'investments', label: 'Investments', icon: Package },
  { id: 'bonuses', label: 'Bonuses', icon: Gift },
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

export default function History() {
  const [activeTab, setActiveTab] = useState<TabType>('deposits');
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      fetchHistory();
    }
  }, [profile, activeTab]);

  const fetchHistory = async () => {
    setIsLoading(true);

    if (activeTab === 'deposits') {
      const { data } = await supabase
        .from('deposit_transactions')
        .select('*')
        .eq('user_id', profile?.user_id)
        .order('created_at', { ascending: false });
      setDeposits(data || []);
    } else if (activeTab === 'withdrawals') {
      const { data } = await supabase
        .from('withdrawal_transactions')
        .select('*')
        .eq('user_id', profile?.user_id)
        .order('created_at', { ascending: false });
      setWithdrawals(data || []);
    } else if (activeTab === 'investments') {
      const { data } = await supabase
        .from('user_investments')
        .select('*')
        .eq('user_id', profile?.user_id)
        .order('created_at', { ascending: false });
      setInvestments(data || []);
    } else if (activeTab === 'bonuses') {
      const { data } = await supabase
        .from('daily_bonuses')
        .select('*')
        .eq('user_id', profile?.user_id)
        .order('claimed_at', { ascending: false });
      setBonuses(data || []);
    }

    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    const data = activeTab === 'deposits' ? deposits 
      : activeTab === 'withdrawals' ? withdrawals 
      : activeTab === 'investments' ? investments 
      : bonuses;

    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4">
            {(() => {
              const IconComponent = tabs.find((t) => t.id === activeTab)?.icon;
              return IconComponent ? <IconComponent className="w-8 h-8 text-muted-foreground" /> : null;
            })()}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No {activeTab} yet</h3>
          <p className="text-sm text-muted-foreground text-center">
            Your {activeTab} history will appear here
          </p>
        </div>
      );
    }

    if (activeTab === 'bonuses') {
      return (
        <div className="space-y-3">
          {bonuses.map((bonus) => (
            <div key={bonus.id} className="flex items-center justify-between p-4 bg-accent rounded-xl">
              <div>
                <p className="font-semibold text-foreground">Daily Bonus</p>
                <p className="text-sm text-muted-foreground">{formatDate(bonus.claimed_at)}</p>
              </div>
              <p className="font-bold text-primary">+{bonus.amount.toLocaleString()} RWF</p>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'investments') {
      return (
        <div className="space-y-3">
          {investments.map((inv) => (
            <div key={inv.id} className="p-4 bg-accent rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-foreground">{inv.amount.toLocaleString()} RWF</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inv.status)}`}>
                  {inv.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Daily: {inv.daily_profit.toLocaleString()} RWF</span>
                <span>{formatDate(inv.start_date)}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    const transactions = activeTab === 'deposits' ? deposits : withdrawals;
    return (
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 bg-accent rounded-xl">
            <div>
              <p className="font-semibold text-foreground">{tx.amount.toLocaleString()} RWF</p>
              <p className="text-sm text-muted-foreground">{formatDate(tx.created_at)}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
              {tx.status}
            </span>
          </div>
        ))}
      </div>
    );
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
        <h1 className="page-title mb-0 flex-1 text-left">History</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === id
                ? 'gradient-primary text-primary-foreground shadow-button'
                : 'bg-card text-muted-foreground hover:text-foreground shadow-card'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-card rounded-3xl p-6 shadow-card animate-fade-in min-h-[300px]">
        {renderContent()}
      </div>

      <BottomNav />
    </div>
  );
}
