import { createClient } from '@supabase/supabase-js';
import { describe, it, expect } from 'vitest';

const token = process.env.INVESTMENT_TEST_TOKEN;
const userId = process.env.INVESTMENT_TEST_USER;
const url = process.env.INVESTMENT_TEST_URL;
const key = process.env.INVESTMENT_TEST_KEY;

describe.skipIf(!token || !userId || !url || !key)('admin investment deletion (isolated test account)', () => {
  it('deletes the investment with zero refund and resets the owner balance to 0 RWF', async () => {
    if (!token || !userId || !url || !key) throw new Error('Missing test session');
    const client = createClient(url, key, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: product, error: productError } = await client.from('investment_products').select('id').eq('is_active', true).limit(1).single();
    expect(productError).toBeNull();
    if (!product) throw new Error('No product');
    const { error: balanceError } = await client.from('profiles').update({ main_balance: 12000, referral_balance: 500, invested_amount: 7000 }).eq('user_id', userId);
    expect(balanceError).toBeNull();
    const { data: investment, error: insertError } = await client.from('user_investments').insert({ user_id: userId, product_id: product.id, amount: 7000, daily_profit: 700, end_date: new Date(Date.now() + 86400000).toISOString() }).select('id').single();
    expect(insertError).toBeNull();
    if (!investment) throw new Error('No test investment');
    const { data: result, error } = await client.rpc('admin_delete_investment', { _investment_id: investment.id });
    expect(error).toBeNull();
    expect(result).toMatchObject({ success: true, refunded_amount: 0, balance: 0 });
    const { data: profile } = await client.from('profiles').select('main_balance, referral_balance, invested_amount').eq('user_id', userId).single();
    expect(profile).toEqual({ main_balance: 0, referral_balance: 0, invested_amount: 0 });
    const { data: remaining } = await client.from('user_investments').select('id').eq('id', investment.id);
    expect(remaining).toEqual([]);
    const { error: repeated } = await client.rpc('admin_delete_investment', { _investment_id: investment.id });
    expect(repeated).not.toBeNull();
  });
});