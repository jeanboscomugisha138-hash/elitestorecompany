import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const authHeader = req.headers.get('Authorization') ?? ''
    const token = authHeader.replace('Bearer ', '')
    const { data: { user: caller } } = await supabaseAdmin.auth.getUser(token)
    if (!caller) return json({ error: 'Unauthorized' }, 401)

    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', caller.id)
      .eq('role', 'admin')
      .maybeSingle()
    if (!roleData) return json({ error: 'Forbidden' }, 403)

    const body = await req.json().catch(() => null) as { user_id?: string; new_password?: string } | null
    const user_id = body?.user_id
    const new_password = body?.new_password

    if (!user_id || typeof user_id !== 'string') {
      return json({ error: 'user_id is required' }, 400)
    }
    if (!new_password || typeof new_password !== 'string' || new_password.length < 6 || new_password.length > 72) {
      return json({ error: 'Password must be between 6 and 72 characters' }, 400)
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
      password: new_password,
    })
    if (error) return json({ error: error.message }, 500)

    return json({ success: true })
  } catch (error) {
    return json({ error: (error as Error).message }, 500)
  }
})
