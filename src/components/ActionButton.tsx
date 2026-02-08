import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  to: string;
}

export function ActionButton({ icon: Icon, label, to }: ActionButtonProps) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg-custom transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </Link>
  );
}
