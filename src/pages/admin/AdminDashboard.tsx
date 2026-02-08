import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  LogOut,
  Shield,
  Check,
  X,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type TabType = 'users' | 'products' | 'deposits' | 'withdrawals';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  main_balance: number;
  invested_amount: number;
  created_at: string;
}

interface Product {
  id: string;
  investment_amount: number;
  daily_profit_rate: number;
  duration_days: number;
  is_active: boolean;
}

interface Transaction {
  id: string;
  user_id: string;
  phone: string;
  full_name: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);

    if (activeTab === 'users') {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setUsers(data || []);
    } else if (activeTab === 'products') {
      const { data } = await supabase.from('investment_products').select('*').order('investment_amount', { ascending: true });
      setProducts(data || []);
    } else if (activeTab === 'deposits') {
      const { data } = await supabase.from('deposit_transactions').select('*').order('created_at', { ascending: false });
      setDeposits(data || []);
    } else if (activeTab === 'withdrawals') {
      const { data } = await supabase.from('withdrawal_transactions').select('*').order('created_at', { ascending: false });
      setWithdrawals(data || []);
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin');
  };

  const handleApproveDeposit = async (tx: Transaction) => {
    // Update transaction status
    const { error: txError } = await supabase
      .from('deposit_transactions')
      .update({ status: 'approved' })
      .eq('id', tx.id);

    if (txError) {
      toast.error('Failed to approve deposit');
      return;
    }

    // Update user balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('main_balance')
      .eq('user_id', tx.user_id)
      .single();

    if (profile) {
      await supabase
        .from('profiles')
        .update({ main_balance: profile.main_balance + tx.amount })
        .eq('user_id', tx.user_id);
    }

    toast.success(`Deposit of ${tx.amount.toLocaleString()} RWF approved`);
    fetchData();
  };

  const handleRejectDeposit = async (tx: Transaction) => {
    const { error } = await supabase
      .from('deposit_transactions')
      .update({ status: 'rejected' })
      .eq('id', tx.id);

    if (error) {
      toast.error('Failed to reject deposit');
      return;
    }

    toast.error(`Deposit rejected`);
    fetchData();
  };

  const handleApproveWithdrawal = async (tx: Transaction) => {
    // Check user balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('main_balance')
      .eq('user_id', tx.user_id)
      .single();

    if (!profile || profile.main_balance < tx.amount) {
      toast.error('Insufficient user balance');
      return;
    }

    // Update transaction status
    const { error: txError } = await supabase
      .from('withdrawal_transactions')
      .update({ status: 'approved' })
      .eq('id', tx.id);

    if (txError) {
      toast.error('Failed to approve withdrawal');
      return;
    }

    // Deduct from user balance
    await supabase
      .from('profiles')
      .update({ main_balance: profile.main_balance - tx.amount })
      .eq('user_id', tx.user_id);

    toast.success(`Withdrawal of ${tx.amount.toLocaleString()} RWF approved`);
    fetchData();
  };

  const handleRejectWithdrawal = async (tx: Transaction) => {
    const { error } = await supabase
      .from('withdrawal_transactions')
      .update({ status: 'rejected' })
      .eq('id', tx.id);

    if (error) {
      toast.error('Failed to reject withdrawal');
      return;
    }

    toast.error(`Withdrawal rejected`);
    fetchData();
  };

  const tabs = [
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'products' as TabType, label: 'Products', icon: Package },
    { id: 'deposits' as TabType, label: 'Deposits', icon: ArrowDownToLine },
    { id: 'withdrawals' as TabType, label: 'Withdrawals', icon: ArrowUpFromLine },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Drilltools Company</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Users List</h2>
                  <span className="text-sm text-muted-foreground">{users.length} users</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Balance</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Invested</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4 font-medium text-foreground">{user.full_name}</td>
                          <td className="p-4 text-muted-foreground">{user.phone}</td>
                          <td className="p-4 text-primary font-medium">{user.main_balance.toLocaleString()} RWF</td>
                          <td className="p-4 text-secondary font-medium">{user.invested_amount.toLocaleString()} RWF</td>
                          <td className="p-4 text-muted-foreground">{formatDate(user.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Products Management</h2>
                  <span className="text-sm text-muted-foreground">{products.length} products</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Investment</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Daily Rate</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4 font-medium text-foreground">{product.investment_amount.toLocaleString()} RWF</td>
                          <td className="p-4 text-primary font-medium">{(product.daily_profit_rate * 100).toFixed(0)}%</td>
                          <td className="p-4 text-muted-foreground">{product.duration_days} days</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'deposits' && (
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold text-foreground">Deposits Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deposits.map((tx) => (
                        <tr key={tx.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4 font-medium text-foreground">{tx.full_name}</td>
                          <td className="p-4 text-muted-foreground">{tx.phone}</td>
                          <td className="p-4 text-primary font-medium">{tx.amount.toLocaleString()} RWF</td>
                          <td className="p-4 text-muted-foreground">{formatDate(tx.created_at)}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tx.status === 'approved' ? 'bg-green-100 text-green-700' :
                              tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {tx.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApproveDeposit(tx)}
                                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectDeposit(tx)}
                                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'withdrawals' && (
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold text-foreground">Withdrawals Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((tx) => (
                        <tr key={tx.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4 font-medium text-foreground">{tx.full_name}</td>
                          <td className="p-4 text-muted-foreground">{tx.phone}</td>
                          <td className="p-4 text-primary font-medium">{tx.amount.toLocaleString()} RWF</td>
                          <td className="p-4 text-muted-foreground">{formatDate(tx.created_at)}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tx.status === 'approved' ? 'bg-green-100 text-green-700' :
                              tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {tx.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApproveWithdrawal(tx)}
                                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectWithdrawal(tx)}
                                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
