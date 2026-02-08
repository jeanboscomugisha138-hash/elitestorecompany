import { Home, Package, Clock, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: Clock, label: 'History', path: '/history' },
  { icon: User, label: 'Profile', path: '/settings' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="max-w-md mx-auto flex justify-around items-center py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 transition-transform duration-200 ${
                  isActive ? 'scale-110' : ''
                }`}
              />
              <span className="text-xs font-medium">{label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 gradient-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
