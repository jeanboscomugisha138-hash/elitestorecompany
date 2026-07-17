import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const token = (req.headers.get('Authorization') || '').replace('Bearer ', '')
    const { data: { user: caller } } = await admin.auth.getUser(token)
    if (!caller) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const { data: roleData } = await admin
      .from('user_roles').select('role').eq('user_id', caller.id).eq('role', 'admin').maybeSingle()
    if (!roleData) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    // Get all admin user_ids (to keep them)
    const { data: adminRoles } = await admin.from('user_roles').select('user_id').eq('role', 'admin')
    const adminIds = new Set((adminRoles || []).map((r: any) => r.user_id))

    // Wipe transactional / activity data for everyone
    await admin.from('daily_bonuses').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await admin.from('referral_earnings').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await admin.from('user_investments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await admin.from('deposit_transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await admin.from('withdrawal_transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await admin.from('gift_code_redemptions').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Get non-admin profiles
    const { data: profiles } = await admin.from('profiles').select('user_id')
    const targets = (profiles || []).map((p: any) => p.user_id).filter((id: string) => !adminIds.has(id))

    let deleted = 0
    for (const uid of targets) {
      await admin.from('user_roles').delete().eq('user_id', uid)
      await admin.from('profiles').delete().eq('user_id', uid)
      const { error } = await admin.auth.admin.deleteUser(uid)
      if (!error) deleted++
    }

    // Reset admin balances too
    for (const aid of adminIds) {
      await admin.from('profiles').update({
        main_balance: 0, referral_balance: 0, invested_amount: 0, total_profit: 0,
      }).eq('user_id', aid)
    }

    return new Response(JSON.stringify({ success: true, deleted }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
