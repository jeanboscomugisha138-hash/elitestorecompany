import { Link } from 'react-router-dom';
import { Home, Drill } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-button">
          <Drill className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className="text-6xl font-bold text-secondary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! Page not found
        </p>
        <Link to="/dashboard" className="action-btn inline-flex items-center gap-2">
          <Home className="w-5 h-5" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
