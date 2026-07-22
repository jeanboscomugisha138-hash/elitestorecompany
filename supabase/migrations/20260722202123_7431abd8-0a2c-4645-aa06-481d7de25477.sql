ALTER TABLE public.user_investments
ADD COLUMN IF NOT EXISTS last_profit_paid_on date;

CREATE INDEX IF NOT EXISTS idx_user_investments_daily_profit_guard
ON public.user_investments (status, last_profit_paid_on, end_date);