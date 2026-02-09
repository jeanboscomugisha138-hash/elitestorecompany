-- Create trigger to automatically process referral commissions when an investment is created
CREATE TRIGGER on_investment_created
  AFTER INSERT ON public.user_investments
  FOR EACH ROW
  EXECUTE FUNCTION public.process_referral_commission();