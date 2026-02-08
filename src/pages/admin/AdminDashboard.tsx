import { useState } from 'react';
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
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

type TabType = 'users' | 'products' | 'deposits' | 'withdrawals';

const mockUsers = [
  { id: 1, phone: '+250 788 123 456', name: 'John Doe', balance: 15000, status: 'active' },
  { id: 2, phone: '+250 788 234 567', name: 'Jane Smith', balance: 8500, status: 'active' },
  { id: 3, phone: '+250 788 345 678', name: 'Bob Wilson', balance: 25000, status: 'pending' },
];

const mockProducts = [
  { id: 1, investment: 5000, dailyProfit: 300, duration: 11 },
  { id: 2, investment: 10000, dailyProfit: 600, duration: 12 },
  { id: 3, investment: 15000, dailyProfit: 900, duration: 13 },
];

const mockTransactions = [
  { id: 1, user: 'John Doe', phone: '+250 788 123 456', amount: 10000, status: 'pending', type: 'deposit' },
  { id: 2, user: 'Jane Smith', phone: '+250 788 234 567', amount: 5000, status: 'pending', type: 'deposit' },
  { id: 3, user: 'Bob Wilson', phone: '+250 788 345 678', amount: 8000, status: 'approved', type: 'withdraw' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const { adminLogout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  const handleApprove = (id: number) => {
    toast.success(`Transaction #${id} approved`);
  };

  const handleReject = (id: number) => {
    toast.error(`Transaction #${id} rejected`);
  };

  const tabs = [
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'products' as TabType, label: 'Products', icon: Package },
    { id: 'deposits' as TabType, label: 'Deposits', icon: ArrowDownToLine },
    { id: 'withdrawals' as TabType, label: 'Withdrawals', icon: ArrowUpFromLine },
  ];

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
        {activeTab === 'users' && (
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Users List</h2>
              <span className="text-sm text-muted-foreground">{mockUsers.length} users</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Balance</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4 font-medium text-foreground">{user.name}</td>
                      <td className="p-4 text-muted-foreground">{user.phone}</td>
                      <td className="p-4 text-primary font-medium">{user.balance.toLocaleString()} RWF</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.status}
                        </span>
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
              <button className="flex items-center gap-2 px-3 py-2 gradient-primary text-primary-foreground rounded-xl text-sm font-medium">
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Investment</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Daily Profit</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4 font-medium text-foreground">{product.investment.toLocaleString()} RWF</td>
                      <td className="p-4 text-primary font-medium">{product.dailyProfit.toLocaleString()} RWF</td>
                      <td className="p-4 text-muted-foreground">{product.duration} days</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
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

        {(activeTab === 'deposits' || activeTab === 'withdrawals') && (
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground capitalize">{activeTab} Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions
                    .filter((t) => t.type === (activeTab === 'deposits' ? 'deposit' : 'withdraw'))
                    .map((tx) => (
                      <tr key={tx.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-4 font-medium text-foreground">{tx.user}</td>
                        <td className="p-4 text-muted-foreground">{tx.phone}</td>
                        <td className="p-4 text-primary font-medium">{tx.amount.toLocaleString()} RWF</td>
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
                                onClick={() => handleApprove(tx.id)}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(tx.id)}
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
      </div>
    </div>
  );
}
