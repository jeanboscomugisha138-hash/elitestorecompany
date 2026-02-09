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
  Wallet,
  TrendingUp,
  PiggyBank,
  Save,
  Search,
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
  referral_balance: number;
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

interface Stats {
  totalUsers: number;
  totalDeposits: number;
  totalBalance: number;
  totalInvested: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalDeposits: 0, totalBalance: 0, totalInvested: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editBalance, setEditBalance] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editProductData, setEditProductData] = useState({
    investment_amount: '',
    daily_profit_rate: '',
    duration_days: '',
    is_active: true,
  });
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchStats();
    fetchData();
  }, [activeTab]);

  const fetchStats = async () => {
    // Fetch total users
    const { data: usersData } = await supabase.from('profiles').select('main_balance, referral_balance, invested_amount');
    
    // Fetch total deposits (approved only)
    const { data: depositsData } = await supabase
      .from('deposit_transactions')
      .select('amount')
      .eq('status', 'approved');
    
    const totalUsers = usersData?.length || 0;
    const totalBalance = usersData?.reduce((sum, u) => sum + (u.main_balance || 0) + (u.referral_balance || 0), 0) || 0;
    const totalInvested = usersData?.reduce((sum, u) => sum + (u.invested_amount || 0), 0) || 0;
    const totalDeposits = depositsData?.reduce((sum, d) => sum + d.amount, 0) || 0;
    
    setStats({ totalUsers, totalDeposits, totalBalance, totalInvested });
  };

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

  // User balance edit functions
  const startEditUser = (user: Profile) => {
    setEditingUser(user);
    setEditBalance(user.main_balance.toString());
  };

  const cancelEditUser = () => {
    setEditingUser(null);
    setEditBalance('');
  };

  const saveUserBalance = async () => {
    if (!editingUser) return;
    
    const newBalance = parseFloat(editBalance);
    if (isNaN(newBalance) || newBalance < 0) {
      toast.error('Please enter a valid balance');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ main_balance: newBalance })
      .eq('user_id', editingUser.user_id);

    if (error) {
      toast.error('Failed to update balance');
      return;
    }

    toast.success(`Balance updated to ${newBalance.toLocaleString()} RWF`);
    setEditingUser(null);
    setEditBalance('');
    fetchData();
    fetchStats();
  };

  // Product edit functions
  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditProductData({
      investment_amount: product.investment_amount.toString(),
      daily_profit_rate: (product.daily_profit_rate * 100).toString(),
      duration_days: product.duration_days.toString(),
      is_active: product.is_active,
    });
  };

  const cancelEditProduct = () => {
    setEditingProduct(null);
    setEditProductData({ investment_amount: '', daily_profit_rate: '', duration_days: '', is_active: true });
  };

  const saveProduct = async () => {
    if (!editingProduct) return;

    const amount = parseFloat(editProductData.investment_amount);
    const rate = parseFloat(editProductData.daily_profit_rate) / 100;
    const duration = parseInt(editProductData.duration_days);

    if (isNaN(amount) || isNaN(rate) || isNaN(duration)) {
      toast.error('Please fill all fields correctly');
      return;
    }

    const { error } = await supabase
      .from('investment_products')
      .update({
        investment_amount: amount,
        daily_profit_rate: rate,
        duration_days: duration,
        is_active: editProductData.is_active,
      })
      .eq('id', editingProduct.id);

    if (error) {
      toast.error('Failed to update product');
      return;
    }

    toast.success('Product updated successfully');
    cancelEditProduct();
    fetchData();
  };

  const handleApproveDeposit = async (tx: Transaction) => {
    if (tx.status !== 'pending') {
      toast.error('This deposit has already been processed');
      return;
    }

    const { error: txError } = await supabase
      .from('deposit_transactions')
      .update({ status: 'approved' })
      .eq('id', tx.id)
      .eq('status', 'pending');

    if (txError) {
      toast.error('Failed to approve deposit');
      return;
    }

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
    fetchStats();
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
    if (tx.status !== 'pending') {
      toast.error('This withdrawal has already been processed');
      return;
    }

    const { error: txError } = await supabase
      .from('withdrawal_transactions')
      .update({ status: 'approved' })
      .eq('id', tx.id)
      .eq('status', 'pending');

    if (txError) {
      toast.error('Failed to approve withdrawal');
      return;
    }

    // Balance already deducted by trigger on insert - no need to deduct again
    toast.success(`Withdrawal of ${tx.amount.toLocaleString()} RWF approved`);
    fetchData();
    fetchStats();
  };

  const handleRejectWithdrawal = async (tx: Transaction) => {
    if (tx.status !== 'pending') {
      toast.error('This withdrawal has already been processed');
      return;
    }

    // Refund the balance since it was deducted on insert
    const { data: profile } = await supabase
      .from('profiles')
      .select('main_balance')
      .eq('user_id', tx.user_id)
      .single();

    const { error } = await supabase
      .from('withdrawal_transactions')
      .update({ status: 'rejected' })
      .eq('id', tx.id)
      .eq('status', 'pending');

    if (error) {
      toast.error('Failed to reject withdrawal');
      return;
    }

    // Refund the deducted amount
    if (profile) {
      await supabase
        .from('profiles')
        .update({ main_balance: profile.main_balance + tx.amount })
        .eq('user_id', tx.user_id);
    }

    toast.error(`Withdrawal rejected and balance refunded`);
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

  const pendingDeposits = deposits.filter(d => d.status === 'pending').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;

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

      {/* Stats Overview */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Users</p>
                <p className="text-lg font-bold text-foreground">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                <ArrowDownToLine className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Deposits</p>
                <p className="text-lg font-bold text-foreground">{stats.totalDeposits.toLocaleString()} RWF</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Balance</p>
                <p className="text-lg font-bold text-foreground">{stats.totalBalance.toLocaleString()} RWF</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Invested</p>
                <p className="text-lg font-bold text-foreground">{stats.totalInvested.toLocaleString()} RWF</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors relative ${
                  activeTab === id
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {id === 'deposits' && pendingDeposits > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingDeposits}
                  </span>
                )}
                {id === 'withdrawals' && pendingWithdrawals > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingWithdrawals}
                  </span>
                )}
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
                <div className="p-4 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h2 className="font-semibold text-foreground">Users Management</h2>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search by name or phone..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full sm:w-64 pl-9 pr-4 py-2 border border-border rounded-xl bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {filteredUsers.length} of {users.length} users
                      </span>
                    </div>
                  </div>
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
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4 font-medium text-foreground">{user.full_name}</td>
                          <td className="p-4 text-muted-foreground">{user.phone}</td>
                          <td className="p-4">
                            {editingUser?.id === user.id ? (
                              <input
                                type="number"
                                value={editBalance}
                                onChange={(e) => setEditBalance(e.target.value)}
                                className="w-32 px-2 py-1 border border-border rounded-lg bg-background text-foreground"
                              />
                            ) : (
                              <span className="text-primary font-medium">{user.main_balance.toLocaleString()} RWF</span>
                            )}
                          </td>
                          <td className="p-4 text-secondary font-medium">{user.invested_amount.toLocaleString()} RWF</td>
                          <td className="p-4 text-muted-foreground">{formatDate(user.created_at)}</td>
                          <td className="p-4">
                            {editingUser?.id === user.id ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={saveUserBalance}
                                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEditUser}
                                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditUser(user)}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                          </td>
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
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4">
                            {editingProduct?.id === product.id ? (
                              <input
                                type="number"
                                value={editProductData.investment_amount}
                                onChange={(e) => setEditProductData({ ...editProductData, investment_amount: e.target.value })}
                                className="w-28 px-2 py-1 border border-border rounded-lg bg-background text-foreground"
                              />
                            ) : (
                              <span className="font-medium text-foreground">{product.investment_amount.toLocaleString()} RWF</span>
                            )}
                          </td>
                          <td className="p-4">
                            {editingProduct?.id === product.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={editProductData.daily_profit_rate}
                                  onChange={(e) => setEditProductData({ ...editProductData, daily_profit_rate: e.target.value })}
                                  className="w-16 px-2 py-1 border border-border rounded-lg bg-background text-foreground"
                                />
                                <span>%</span>
                              </div>
                            ) : (
                              <span className="text-primary font-medium">{(product.daily_profit_rate * 100).toFixed(0)}%</span>
                            )}
                          </td>
                          <td className="p-4">
                            {editingProduct?.id === product.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={editProductData.duration_days}
                                  onChange={(e) => setEditProductData({ ...editProductData, duration_days: e.target.value })}
                                  className="w-16 px-2 py-1 border border-border rounded-lg bg-background text-foreground"
                                />
                                <span>days</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">{product.duration_days} days</span>
                            )}
                          </td>
                          <td className="p-4">
                            {editingProduct?.id === product.id ? (
                              <select
                                value={editProductData.is_active ? 'active' : 'inactive'}
                                onChange={(e) => setEditProductData({ ...editProductData, is_active: e.target.value === 'active' })}
                                className="px-2 py-1 border border-border rounded-lg bg-background text-foreground"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {product.is_active ? 'Active' : 'Inactive'}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {editingProduct?.id === product.id ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={saveProduct}
                                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEditProduct}
                                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditProduct(product)}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
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
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Deposits Management</h2>
                  {pendingDeposits > 0 && (
                    <span className="text-sm text-primary font-medium">{pendingDeposits} pending</span>
                  )}
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
                        <tr key={tx.id} className={`border-b border-border hover:bg-muted/50 ${tx.status === 'pending' ? 'bg-yellow-50/50' : ''}`}>
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
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectDeposit(tx)}
                                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                  title="Reject"
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
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Withdrawals Management</h2>
                  {pendingWithdrawals > 0 && (
                    <span className="text-sm text-primary font-medium">{pendingWithdrawals} pending</span>
                  )}
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
                        <tr key={tx.id} className={`border-b border-border hover:bg-muted/50 ${tx.status === 'pending' ? 'bg-yellow-50/50' : ''}`}>
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
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectWithdrawal(tx)}
                                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                  title="Reject"
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
