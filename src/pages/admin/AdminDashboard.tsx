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
  Trash2,
  Eye,
  XCircle,
  Gift,
  Plus,
  ToggleLeft,
  ToggleRight,
  Settings as SettingsIcon,
  Bell,
  Send,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type TabType = 'overview' | 'users' | 'deposits' | 'withdrawals' | 'investments' | 'giftcodes' | 'products' | 'notifications' | 'settings';
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

const SETTING_FIELDS: { key: string; label: string; placeholder: string; type?: string; multiline?: boolean; full?: boolean }[] = [
  { key: 'payment_phone', label: 'Nimero yakira amafaranga (MoMo)', placeholder: '0799599856' },
  { key: 'payment_name', label: 'Amazina yakira amafaranga', placeholder: 'Cedric KWIBUKWANIMANA' },
  { key: 'telegram_admin_url', label: 'Telegram: Vuganisha Umuyobozi (link)', placeholder: 'https://t.me/petaneshipping' },
  { key: 'telegram_group_url', label: 'Telegram: Group Isanzwe (link)', placeholder: 'https://t.me/+xxxxxxxx' },
  { key: 'telegram_meeting_url', label: 'Telegram: Group y\'Inama (link)', placeholder: 'https://t.me/+xxxxxxxx' },
  { key: 'customer_service_url', label: 'Customer service link', placeholder: 'https://t.me/petaneshipping' },
  { key: 'min_deposit', label: 'Min deposit (RWF)', placeholder: '10000', type: 'number' },
  { key: 'max_deposit', label: 'Max deposit (RWF)', placeholder: '1000000', type: 'number' },
  { key: 'min_withdraw', label: 'Min withdraw (RWF)', placeholder: '1000', type: 'number' },
  { key: 'max_withdraw', label: 'Max withdraw (RWF)', placeholder: '1000000', type: 'number' },
  { key: 'withdraw_start_hour', label: 'Withdraw start hour (0-23)', placeholder: '7', type: 'number' },
  { key: 'withdraw_end_hour', label: 'Withdraw end hour (0-23)', placeholder: '22', type: 'number' },
  { key: 'announcements', label: 'Notification / Announcements (one per line)', placeholder: 'Welcome message...', multiline: true, full: true },
];


interface GiftCode {
  id: string;
  code: string;
  amount: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  created_at: string;
}

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

interface UserInvestment {
  id: string;
  amount: number;
  daily_profit: number;
  start_date: string;
  end_date: string;
  status: string;
  product_id: string;
}

function TxCards({ items, filter, setFilter, onApprove, onReject, processingId, formatDate, title, accent }: {
  items: any[]; filter: StatusFilter; setFilter: (s: StatusFilter) => void;
  onApprove: (tx: any) => void; onReject: (tx: any) => void;
  processingId: string | null; formatDate: (d: string) => string; title: string; accent: string;
}) {
  const filtered = filter === 'all' ? items : items.filter(t => t.status === filter);
  const counts = {
    all: items.length,
    pending: items.filter(t => t.status === 'pending').length,
    approved: items.filter(t => t.status === 'approved').length,
    rejected: items.filter(t => t.status === 'rejected').length,
  };
  const chips: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {chips.map(c => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              filter === c.key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            {c.label} <span className="opacity-70">({counts[c.key]})</span>
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((tx) => (
          <div key={tx.id} className="bg-card rounded-2xl border border-border/60 shadow-sm p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{tx.full_name}</p>
                <p className="text-xs text-muted-foreground">{tx.phone} • {formatDate(tx.created_at)}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full whitespace-nowrap ${
                tx.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' :
                tx.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                'bg-rose-500/10 text-rose-600'
              }`}>{tx.status}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className={`text-xl font-extrabold ${accent}`}>{Number(tx.amount).toLocaleString()} <span className="text-xs font-medium text-muted-foreground">RWF</span></p>
              {tx.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(tx)}
                    disabled={processingId === tx.id}
                    className="flex items-center gap-1 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => onReject(tx)}
                    disabled={processingId === tx.id}
                    className="flex items-center gap-1 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No {title.toLowerCase()} in this view</div>
        )}
      </div>
    </div>
  );
}



export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [depositFilter, setDepositFilter] = useState<StatusFilter>('pending');
  const [withdrawalFilter, setWithdrawalFilter] = useState<StatusFilter>('pending');
  const [allInvestments, setAllInvestments] = useState<any[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalDeposits: 0, totalBalance: 0, totalInvested: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editBalance, setEditBalance] = useState('');
  const [editingInvestedUser, setEditingInvestedUser] = useState<Profile | null>(null);
  const [editInvestedAmount, setEditInvestedAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [viewingInvestmentsUser, setViewingInvestmentsUser] = useState<Profile | null>(null);
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([]);
  const [loadingInvestments, setLoadingInvestments] = useState(false);
  const [giftCodes, setGiftCodes] = useState<GiftCode[]>([]);
  const [newGiftCode, setNewGiftCode] = useState({ code: '', amount: '', max_uses: '1' });
  const [creatingGiftCode, setCreatingGiftCode] = useState(false);
  const [showNewGiftForm, setShowNewGiftForm] = useState(false);
  const [cancellingInvestmentId, setCancellingInvestmentId] = useState<string | null>(null);
  const [processingTxId, setProcessingTxId] = useState<string | null>(null);
  const [editProductData, setEditProductData] = useState({
    investment_amount: '',
    daily_profit_rate: '',
    duration_days: '',
    is_active: true,
  });
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = useState(false);

  // Notification broadcast
  const [notifTarget, setNotifTarget] = useState<'all' | 'user'>('all');
  const [notifUserId, setNotifUserId] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifCategory, setNotifCategory] = useState('announcement');
  const [sendingNotif, setSendingNotif] = useState(false);
  const [recentNotifs, setRecentNotifs] = useState<any[]>([]);

  const sendNotification = async () => {
    if (!notifTitle.trim() || !notifBody.trim()) {
      toast.error('Uzuza title na message');
      return;
    }
    if (notifTarget === 'user' && !notifUserId) {
      toast.error('Hitamo umukoresha');
      return;
    }
    setSendingNotif(true);
    const payload: any = {
      title: notifTitle.trim(),
      body: notifBody.trim(),
      category: notifCategory,
      user_id: notifTarget === 'user' ? notifUserId : null,
    };
    const { error } = await supabase.from('notifications').insert(payload);
    if (error) {
      toast.error('Failed: ' + error.message);
    } else {
      toast.success(notifTarget === 'all' ? 'Broadcast yohererejwe kuri bose' : 'Notification yohererejwe');
      setNotifTitle('');
      setNotifBody('');
      loadRecentNotifs();
    }
    setSendingNotif(false);
  };

  const loadRecentNotifs = async () => {
    const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(20);
    setRecentNotifs(data || []);
  };

  const deleteNotification = async (id: string) => {
    if (!window.confirm('Siba iyi notification?')) return;
    await supabase.from('notifications').delete().eq('id', id);
    loadRecentNotifs();
  };

  useEffect(() => {
    if (activeTab === 'notifications') {
      loadRecentNotifs();
    }
  }, [activeTab]);

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

    if (activeTab === 'users' || activeTab === 'overview') {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setUsers(data || []);
    }
    if (activeTab === 'products') {
      const { data } = await supabase.from('investment_products').select('*').order('investment_amount', { ascending: true });
      setProducts(data || []);
    } else if (activeTab === 'deposits' || activeTab === 'overview') {
      const { data } = await supabase.from('deposit_transactions').select('*').order('created_at', { ascending: false });
      setDeposits(data || []);
    }
    if (activeTab === 'withdrawals' || activeTab === 'overview') {
      const { data } = await supabase.from('withdrawal_transactions').select('*').order('created_at', { ascending: false });
      setWithdrawals(data || []);
    }
    if (activeTab === 'investments') {
      const { data } = await supabase
        .from('user_investments')
        .select('*, investment_products(investment_amount), profiles:user_id(full_name, phone)')
        .order('created_at', { ascending: false })
        .limit(200);
      setAllInvestments(data || []);
    } else if (activeTab === 'giftcodes') {
      const { data } = await supabase.from('gift_codes').select('*').order('created_at', { ascending: false });
      setGiftCodes((data as GiftCode[]) || []);
    } else if (activeTab === 'settings') {
      const { data } = await supabase.from('site_settings').select('key, value');
      const map: Record<string, string> = {};
      (data || []).forEach((r: any) => { map[r.key] = r.value; });
      SETTING_FIELDS.forEach(f => { if (!(f.key in map)) map[f.key] = ''; });
      setSiteSettings(map);
    }

    setIsLoading(false);
  };




  const saveSiteSettings = async () => {
    setSavingSettings(true);
    try {
      const rows = SETTING_FIELDS.map(f => ({
        key: f.key,
        value: (siteSettings[f.key] ?? '').toString(),
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
      if (error) {
        toast.error('Failed to save settings');
      } else {
        toast.success('Settings saved successfully');
      }
    } finally {
      setSavingSettings(false);
    }
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

  const handleDeleteUser = async (user: Profile) => {
    if (deletingUserId) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete user "${user.full_name}"? This will remove all their data permanently.`);
    if (!confirmed) return;

    setDeletingUserId(user.user_id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ user_id: user.user_id }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || 'Failed to delete user');
        return;
      }

      toast.success(`User "${user.full_name}" deleted successfully`);
      fetchData();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setDeletingUserId(null);
    }
  };

  const viewUserInvestments = async (user: Profile) => {
    setViewingInvestmentsUser(user);
    setLoadingInvestments(true);
    const { data } = await supabase
      .from('user_investments')
      .select('*')
      .eq('user_id', user.user_id)
      .order('created_at', { ascending: false });
    setUserInvestments(data || []);
    setLoadingInvestments(false);
  };

  const cancelInvestment = async (investment: UserInvestment) => {
    if (cancellingInvestmentId) return;
    
    const confirmed = window.confirm(`Cancel this investment of ${investment.amount.toLocaleString()} RWF? The amount will be refunded to the user's balance.`);
    if (!confirmed) return;

    setCancellingInvestmentId(investment.id);
    try {
      // Update investment status
      const { error: invError } = await supabase
        .from('user_investments')
        .update({ status: 'cancelled' })
        .eq('id', investment.id);

      if (invError) {
        toast.error('Failed to cancel investment');
        return;
      }

      // Refund balance and reduce invested_amount
      const userId = viewingInvestmentsUser?.user_id;
      if (userId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('main_balance, invested_amount')
          .eq('user_id', userId)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              main_balance: profile.main_balance + investment.amount,
              invested_amount: Math.max(0, profile.invested_amount - investment.amount),
            })
            .eq('user_id', userId);
        }
      }

      toast.success('Investment cancelled and amount refunded');
      // Refresh investments list
      if (viewingInvestmentsUser) {
        viewUserInvestments(viewingInvestmentsUser);
      }
      fetchData();
      fetchStats();
    } catch (error) {
      toast.error('Failed to cancel investment');
    } finally {
      setCancellingInvestmentId(null);
    }
  };

  // User invested amount edit functions
  const startEditInvested = (user: Profile) => {
    setEditingInvestedUser(user);
    setEditInvestedAmount(user.invested_amount.toString());
  };

  const cancelEditInvested = () => {
    setEditingInvestedUser(null);
    setEditInvestedAmount('');
  };

  const saveUserInvestedAmount = async () => {
    if (!editingInvestedUser) return;

    const newAmount = parseFloat(editInvestedAmount);
    if (isNaN(newAmount) || newAmount < 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ invested_amount: newAmount })
      .eq('user_id', editingInvestedUser.user_id);

    if (error) {
      toast.error('Failed to update invested amount');
      return;
    }

    toast.success(`Invested amount updated to ${newAmount.toLocaleString()} RWF`);
    setEditingInvestedUser(null);
    setEditInvestedAmount('');
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
    if (processingTxId) return;
    setProcessingTxId(tx.id);
    try {
      // Balance update is handled automatically by the database trigger
      const { error: txError } = await supabase
        .from('deposit_transactions')
        .update({ status: 'approved' })
        .eq('id', tx.id)
        .eq('status', 'pending');

      if (txError) {
        toast.error('Failed to approve deposit');
        return;
      }

      toast.success(`Deposit of ${tx.amount.toLocaleString()} RWF approved`);
      fetchData();
      fetchStats();
    } finally {
      setProcessingTxId(null);
    }
  };

  const handleRejectDeposit = async (tx: Transaction) => {
    if (tx.status !== 'pending') {
      toast.error('This deposit has already been processed');
      return;
    }
    if (processingTxId) return;
    setProcessingTxId(tx.id);
    try {
      const { error } = await supabase
        .from('deposit_transactions')
        .update({ status: 'rejected' })
        .eq('id', tx.id)
        .eq('status', 'pending');

      if (error) {
        toast.error('Failed to reject deposit');
        return;
      }

      toast.error(`Deposit rejected`);
      fetchData();
    } finally {
      setProcessingTxId(null);
    }
  };

  const handleApproveWithdrawal = async (tx: Transaction) => {
    if (tx.status !== 'pending') {
      toast.error('This withdrawal has already been processed');
      return;
    }
    if (processingTxId) return;
    setProcessingTxId(tx.id);
    try {
      const { error: txError } = await supabase
        .from('withdrawal_transactions')
        .update({ status: 'approved' })
        .eq('id', tx.id)
        .eq('status', 'pending');

      if (txError) {
        toast.error('Failed to approve withdrawal');
        return;
      }

      toast.success(`Withdrawal of ${tx.amount.toLocaleString()} RWF approved`);
      fetchData();
      fetchStats();
    } finally {
      setProcessingTxId(null);
    }
  };

  const handleRejectWithdrawal = async (tx: Transaction) => {
    if (tx.status !== 'pending') {
      toast.error('This withdrawal has already been processed');
      return;
    }
    if (processingTxId) return;
    setProcessingTxId(tx.id);
    try {
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

      if (profile) {
        await supabase
          .from('profiles')
          .update({ main_balance: profile.main_balance + tx.amount })
          .eq('user_id', tx.user_id);
      }

      toast.error(`Withdrawal rejected and balance refunded`);
      fetchData();
    } finally {
      setProcessingTxId(null);
    }
  };

  const createGiftCode = async () => {
    const code = newGiftCode.code.trim().toUpperCase();
    const amount = parseFloat(newGiftCode.amount);
    const maxUses = parseInt(newGiftCode.max_uses);
    if (!code || isNaN(amount) || amount <= 0 || isNaN(maxUses) || maxUses <= 0) {
      toast.error('Please fill all fields correctly');
      return;
    }
    setCreatingGiftCode(true);
    const { error } = await supabase.from('gift_codes').insert({ code, amount, max_uses: maxUses } as any);
    if (error) {
      toast.error(error.message.includes('duplicate') ? 'Code already exists' : 'Failed to create gift code');
    } else {
      toast.success(`Gift code "${code}" created`);
      setNewGiftCode({ code: '', amount: '', max_uses: '1' });
      setShowNewGiftForm(false);
      fetchData();
    }
    setCreatingGiftCode(false);
  };

  const toggleGiftCodeActive = async (gc: GiftCode) => {
    const { error } = await supabase.from('gift_codes').update({ is_active: !gc.is_active } as any).eq('id', gc.id);
    if (error) {
      toast.error('Failed to update gift code');
    } else {
      toast.success(`Gift code ${!gc.is_active ? 'activated' : 'deactivated'}`);
      fetchData();
    }
  };

  const deleteGiftCode = async (gc: GiftCode) => {
    if (!window.confirm(`Delete gift code "${gc.code}"?`)) return;
    const { error } = await supabase.from('gift_codes').delete().eq('id', gc.id);
    if (error) {
      toast.error('Failed to delete gift code');
    } else {
      toast.success('Gift code deleted');
      fetchData();
    }
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: TrendingUp },
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'deposits' as TabType, label: 'Recharges', icon: ArrowDownToLine },
    { id: 'withdrawals' as TabType, label: 'Withdrawals', icon: ArrowUpFromLine },
    { id: 'investments' as TabType, label: 'Investments', icon: PiggyBank },
    { id: 'giftcodes' as TabType, label: 'Gift Codes', icon: Gift },
    { id: 'products' as TabType, label: 'Products', icon: Package },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell },
    { id: 'settings' as TabType, label: 'Settings', icon: SettingsIcon },
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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-primary tracking-tight">Petane Admin</h1>
              <p className="text-[11px] text-muted-foreground -mt-0.5">Control Panel</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-2 relative">
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors relative ${
                  activeTab === id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {id === 'deposits' && pendingDeposits > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                    {pendingDeposits}
                  </span>
                )}
                {id === 'withdrawals' && pendingWithdrawals > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                    {pendingWithdrawals}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, tint: 'text-primary bg-primary/10' },
              { label: 'Deposits', value: `${stats.totalDeposits.toLocaleString()} RWF`, icon: ArrowDownToLine, tint: 'text-green-600 bg-green-500/10' },
              { label: 'Withdrawals', value: `${withdrawals.filter(w=>w.status==='approved').reduce((s,w)=>s+w.amount,0).toLocaleString()} RWF`, icon: ArrowUpFromLine, tint: 'text-rose-600 bg-rose-500/10' },
              { label: 'Investments', value: `${stats.totalInvested.toLocaleString()} RWF`, icon: PiggyBank, tint: 'text-amber-600 bg-amber-500/10' },
              { label: 'Total Balance', value: `${stats.totalBalance.toLocaleString()} RWF`, icon: Wallet, tint: 'text-secondary bg-secondary/10' },
            ].map((c) => (
              <div key={c.label} className="bg-card rounded-2xl p-4 border border-border/60 shadow-sm">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c.tint}`}>
                  <c.icon className="w-4 h-4" />
                </div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="text-lg font-bold text-foreground mt-0.5">{c.value}</p>
              </div>
            ))}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <p className="text-xs text-muted-foreground">Pending Recharges</p>
              <p className="text-2xl font-extrabold text-primary mt-1">{pendingDeposits}</p>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <p className="text-xs text-muted-foreground">Pending Withdrawals</p>
              <p className="text-2xl font-extrabold text-primary mt-1">{pendingWithdrawals}</p>
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div>
                <div className="bg-card rounded-2xl border border-border/60 p-3 mb-3 flex items-center gap-2 shadow-sm">
                  <Search className="w-4 h-4 text-muted-foreground ml-2" />
                  <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap pr-2">
                    {filteredUsers.length}/{users.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredUsers.map((user) => {
                    const isEditingBal = editingUser?.id === user.id;
                    const isEditingInv = editingInvestedUser?.id === user.id;
                    return (
                      <div key={user.id} className="bg-card rounded-2xl border border-border/60 shadow-sm p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold flex items-center justify-center flex-shrink-0">
                              {user.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{user.full_name}</p>
                              <p className="text-xs text-muted-foreground">{user.phone} • {formatDate(user.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            {isEditingBal || isEditingInv ? (
                              <>
                                <button onClick={isEditingBal ? saveUserBalance : saveUserInvestedAmount} className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                                  <Save className="w-4 h-4" />
                                </button>
                                <button onClick={isEditingBal ? cancelEditUser : cancelEditInvested} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => viewUserInvestments(user)} className="p-2 text-secondary hover:bg-secondary/10 rounded-lg" title="View investments">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => startEditUser(user)} className="p-2 text-primary hover:bg-primary/10 rounded-lg" title="Edit balance">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => startEditInvested(user)} className="p-2 text-amber-600 hover:bg-amber-500/10 rounded-lg" title="Edit invested">
                                  <PiggyBank className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteUser(user)} disabled={deletingUserId === user.user_id} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg disabled:opacity-50" title="Delete">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-primary/5 rounded-xl p-2.5">
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Balance</p>
                            {isEditingBal ? (
                              <input type="number" value={editBalance} onChange={(e)=>setEditBalance(e.target.value)} className="w-full mt-1 px-2 py-1 border border-border rounded-md bg-background text-sm" />
                            ) : (
                              <p className="text-sm font-bold text-primary mt-0.5">{user.main_balance.toLocaleString()}</p>
                            )}
                          </div>
                          <div className="bg-amber-500/5 rounded-xl p-2.5">
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Invested</p>
                            {isEditingInv ? (
                              <input type="number" value={editInvestedAmount} onChange={(e)=>setEditInvestedAmount(e.target.value)} className="w-full mt-1 px-2 py-1 border border-border rounded-md bg-background text-sm" />
                            ) : (
                              <p className="text-sm font-bold text-amber-600 mt-0.5">{user.invested_amount.toLocaleString()}</p>
                            )}
                          </div>
                          <div className="bg-emerald-500/5 rounded-xl p-2.5">
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Referral</p>
                            <p className="text-sm font-bold text-emerald-600 mt-0.5">{user.referral_balance.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">No users found</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'investments' && (
              <div className="space-y-3">
                {allInvestments.map((inv: any) => {
                  const earned = Number(inv.daily_profit) * Math.max(0, Math.floor((Date.now() - new Date(inv.start_date).getTime()) / 86400000));
                  return (
                    <div key={inv.id} className="bg-card rounded-2xl border border-border/60 shadow-sm p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">{inv.profiles?.full_name || 'User'}</p>
                          <p className="text-xs text-muted-foreground">{inv.profiles?.phone} • {formatDate(inv.start_date)}</p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${inv.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                          {inv.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-primary/5 rounded-xl p-2.5">
                          <p className="text-[10px] uppercase text-muted-foreground">Amount</p>
                          <p className="text-sm font-bold text-primary mt-0.5">{Number(inv.amount).toLocaleString()}</p>
                        </div>
                        <div className="bg-amber-500/5 rounded-xl p-2.5">
                          <p className="text-[10px] uppercase text-muted-foreground">Daily</p>
                          <p className="text-sm font-bold text-amber-600 mt-0.5">{Number(inv.daily_profit).toLocaleString()}</p>
                        </div>
                        <div className="bg-emerald-500/5 rounded-xl p-2.5">
                          <p className="text-[10px] uppercase text-muted-foreground">Earned</p>
                          <p className="text-sm font-bold text-emerald-600 mt-0.5">{earned.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {allInvestments.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">No investments</div>
                )}
              </div>
            )}


            {/* User Investments Modal */}
            {viewingInvestmentsUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewingInvestmentsUser(null)}>
                <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-foreground">Investments - {viewingInvestmentsUser.full_name}</h2>
                      <p className="text-sm text-muted-foreground">{viewingInvestmentsUser.phone}</p>
                    </div>
                    <button onClick={() => setViewingInvestmentsUser(null)} className="p-2 hover:bg-muted rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="overflow-auto max-h-[60vh]">
                    {loadingInvestments ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : userInvestments.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">No investments found</div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Amount</th>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Daily Profit</th>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Start</th>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">End</th>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userInvestments.map((inv) => (
                            <tr key={inv.id} className="border-b border-border">
                              <td className="p-3 font-medium text-foreground">{inv.amount.toLocaleString()} RWF</td>
                              <td className="p-3 text-primary">{inv.daily_profit.toLocaleString()} RWF</td>
                              <td className="p-3 text-muted-foreground">{formatDate(inv.start_date)}</td>
                              <td className="p-3 text-muted-foreground">{formatDate(inv.end_date)}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  inv.status === 'active' ? 'bg-green-100 text-green-700' :
                                  inv.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-muted text-muted-foreground'
                                }`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td className="p-3">
                                {inv.status === 'active' && (
                                  <button
                                    onClick={() => cancelInvestment(inv)}
                                    disabled={cancellingInvestmentId === inv.id}
                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                                    title="Cancel & refund"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
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
              <TxCards
                items={deposits}
                filter={depositFilter}
                setFilter={setDepositFilter}
                onApprove={handleApproveDeposit}
                onReject={handleRejectDeposit}
                processingId={processingTxId}
                formatDate={formatDate}
                title="Recharges"
                accent="text-emerald-600"
              />
            )}

            {activeTab === 'withdrawals' && (
              <TxCards
                items={withdrawals}
                filter={withdrawalFilter}
                setFilter={setWithdrawalFilter}
                onApprove={handleApproveWithdrawal}
                onReject={handleRejectWithdrawal}
                processingId={processingTxId}
                formatDate={formatDate}
                title="Withdrawals"
                accent="text-rose-600"
              />
            )}


            {activeTab === 'giftcodes' && (
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Gift Codes Management</h2>
                  <button
                    onClick={() => setShowNewGiftForm(!showNewGiftForm)}
                    className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> New Code
                  </button>
                </div>

                {showNewGiftForm && (
                  <div className="p-4 border-b border-border bg-muted/50">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Code (e.g. WELCOME500)"
                        value={newGiftCode.code}
                        onChange={(e) => setNewGiftCode({ ...newGiftCode, code: e.target.value.toUpperCase() })}
                        className="px-3 py-2 border border-border rounded-xl bg-background text-foreground text-sm placeholder:text-muted-foreground"
                      />
                      <input
                        type="number"
                        placeholder="Amount (RWF)"
                        value={newGiftCode.amount}
                        onChange={(e) => setNewGiftCode({ ...newGiftCode, amount: e.target.value })}
                        className="px-3 py-2 border border-border rounded-xl bg-background text-foreground text-sm placeholder:text-muted-foreground"
                      />
                      <input
                        type="number"
                        placeholder="Max uses"
                        value={newGiftCode.max_uses}
                        onChange={(e) => setNewGiftCode({ ...newGiftCode, max_uses: e.target.value })}
                        className="px-3 py-2 border border-border rounded-xl bg-background text-foreground text-sm placeholder:text-muted-foreground"
                      />
                      <button
                        onClick={createGiftCode}
                        disabled={creatingGiftCode}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {creatingGiftCode ? 'Creating...' : 'Create'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Code</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Uses</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {giftCodes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">No gift codes yet</td>
                        </tr>
                      ) : giftCodes.map((gc) => (
                        <tr key={gc.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4 font-mono font-bold text-foreground tracking-wider">{gc.code}</td>
                          <td className="p-4 text-primary font-medium">{gc.amount.toLocaleString()} RWF</td>
                          <td className="p-4 text-muted-foreground">{gc.current_uses} / {gc.max_uses}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              gc.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {gc.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground">{formatDate(gc.created_at)}</td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              <button
                                onClick={() => toggleGiftCodeActive(gc)}
                                className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                                title={gc.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {gc.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => deleteGiftCode(gc)}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                      <Send className="w-5 h-5 text-primary" /> Send Notification
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Send an instant notification to one user or broadcast to everyone.
                    </p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNotifTarget('all')}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium ${notifTarget === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                      >Bose (Broadcast)</button>
                      <button
                        onClick={() => setNotifTarget('user')}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium ${notifTarget === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                      >Umukoresha umwe</button>
                    </div>

                    {notifTarget === 'user' && (
                      <select
                        value={notifUserId}
                        onChange={(e) => setNotifUserId(e.target.value)}
                        className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm"
                      >
                        <option value="">-- Hitamo umukoresha --</option>
                        {users.map((u) => (
                          <option key={u.user_id} value={u.user_id}>{u.full_name} ({u.phone})</option>
                        ))}
                      </select>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Title"
                        value={notifTitle}
                        onChange={(e) => setNotifTitle(e.target.value)}
                        className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm"
                      />
                      <select
                        value={notifCategory}
                        onChange={(e) => setNotifCategory(e.target.value)}
                        className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm"
                      >
                        <option value="announcement">Announcement</option>
                        <option value="service">New Service</option>
                        <option value="income">Income</option>
                        <option value="deposit">Deposit</option>
                        <option value="withdrawal">Withdrawal</option>
                        <option value="referral">Referral</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <textarea
                      placeholder="Message body..."
                      rows={4}
                      value={notifBody}
                      onChange={(e) => setNotifBody(e.target.value)}
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm"
                    />

                    <button
                      onClick={sendNotification}
                      disabled={sendingNotif}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {sendingNotif ? 'Sending...' : 'Send Notification'}
                    </button>
                  </div>
                </div>

                <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h2 className="font-semibold text-foreground">Recent Notifications</h2>
                  </div>
                  <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                    {recentNotifs.length === 0 ? (
                      <div className="p-8 text-center text-sm text-muted-foreground">Nta notification zoherejwe.</div>
                    ) : recentNotifs.map((n) => (
                      <div key={n.id} className="p-4 flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase text-primary">{n.category}</span>
                            <span className="text-[10px] text-muted-foreground">{n.user_id ? 'user' : 'broadcast'}</span>
                          </div>
                          <p className="font-semibold text-foreground text-sm mt-1">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{formatDate(n.created_at)}</p>
                        </div>
                        <button
                          onClick={() => deleteNotification(n.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                      <SettingsIcon className="w-5 h-5 text-primary" /> Platform Settings
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Update payment details, links and limits used across the app. Changes apply instantly.
                    </p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SETTING_FIELDS.map((f) => (
                    <div key={f.key} className={`flex flex-col ${f.full ? 'md:col-span-2' : ''}`}>
                      <label className="text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                      {f.multiline ? (
                        <textarea
                          value={siteSettings[f.key] ?? ''}
                          placeholder={f.placeholder}
                          rows={8}
                          onChange={(e) =>
                            setSiteSettings((prev) => ({ ...prev, [f.key]: e.target.value }))
                          }
                          className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      ) : (
                        <input
                          type={f.type || 'text'}
                          value={siteSettings[f.key] ?? ''}
                          placeholder={f.placeholder}
                          onChange={(e) =>
                            setSiteSettings((prev) => ({ ...prev, [f.key]: e.target.value }))
                          }
                          className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border flex justify-end">
                  <button
                    onClick={saveSiteSettings}
                    disabled={savingSettings}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {savingSettings ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}
          </>

        )}
      </div>
    </div>
  );
}
