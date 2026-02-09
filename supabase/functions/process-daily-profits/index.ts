import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all active investments
    const { data: activeInvestments, error: fetchError } = await supabase
      .from('user_investments')
      .select('id, user_id, daily_profit, end_date')
      .eq('status', 'active')

    if (fetchError) {
      throw fetchError
    }

    const now = new Date()
    let processedCount = 0
    let completedCount = 0

    for (const investment of activeInvestments || []) {
      const endDate = new Date(investment.end_date)
      
      // Check if investment has ended
      if (now >= endDate) {
        // Mark investment as completed
        await supabase
          .from('user_investments')
          .update({ status: 'completed' })
          .eq('id', investment.id)
        
        completedCount++
        continue
      }

      // Credit daily profit to user's main_balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('main_balance, total_profit')
        .eq('user_id', investment.user_id)
        .single()

      if (profileError) {
        console.error(`Error fetching profile for user ${investment.user_id}:`, profileError)
        continue
      }

      const newBalance = (profile.main_balance || 0) + investment.daily_profit
      const newTotalProfit = (profile.total_profit || 0) + investment.daily_profit

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          main_balance: newBalance,
          total_profit: newTotalProfit
        })
        .eq('user_id', investment.user_id)

      if (updateError) {
        console.error(`Error updating profile for user ${investment.user_id}:`, updateError)
        continue
      }

      processedCount++
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${processedCount} active investments, ${completedCount} completed` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error processing daily profits:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
