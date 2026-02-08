import { useState } from 'react';
import { ArrowLeft, ArrowDownToLine, ArrowUpFromLine, Package, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';

type TabType = 'deposits' | 'withdrawals' | 'investments' | 'bonuses';

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'deposits', label: 'Deposits', icon: ArrowDownToLine },
  { id: 'withdrawals', label: 'Withdrawals', icon: ArrowUpFromLine },
  { id: 'investments', label: 'Investments', icon: Package },
  { id: 'bonuses', label: 'Bonuses', icon: Gift },
];

export default function History() {
  const [activeTab, setActiveTab] = useState<TabType>('deposits');

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
      <div className="bg-card rounded-3xl p-6 shadow-card animate-fade-in min-h-[300px] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4">
          {tabs.find((t) => t.id === activeTab)?.icon && (
            <div className="w-8 h-8 text-muted-foreground">
              {(() => {
                const IconComponent = tabs.find((t) => t.id === activeTab)?.icon;
                return IconComponent ? <IconComponent className="w-8 h-8" /> : null;
              })()}
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No {activeTab} yet</h3>
        <p className="text-sm text-muted-foreground text-center">
          Your {activeTab} history will appear here
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
