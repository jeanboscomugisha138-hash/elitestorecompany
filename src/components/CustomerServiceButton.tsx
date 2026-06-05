import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function CustomerServiceButton() {
  const { settings } = useSiteSettings();
  return (
    <a
      href={settings.customer_service_url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300"
      aria-label="Contact Customer Service"
    >
      <MessageCircle className="w-7 h-7 text-secondary-foreground" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse"></span>
    </a>
  );
}
