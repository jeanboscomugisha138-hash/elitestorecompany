import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { code } = await req.json();
    if (!code || typeof code !== "string" || code.trim().length === 0 || code.trim().length > 50) {
      return new Response(JSON.stringify({ error: "Invalid code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const trimmedCode = code.trim().toUpperCase();

    // Use service role for the transactional operations
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find the gift code
    const { data: giftCode, error: codeError } = await adminClient
      .from("gift_codes")
      .select("*")
      .eq("code", trimmedCode)
      .eq("is_active", true)
      .maybeSingle();

    if (codeError || !giftCode) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired gift code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (giftCode.current_uses >= giftCode.max_uses) {
      return new Response(
        JSON.stringify({ error: "This gift code has been fully redeemed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user already redeemed this code
    const { data: existing } = await adminClient
      .from("gift_code_redemptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("gift_code_id", giftCode.id)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: "You have already redeemed this code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Record redemption
    const { error: insertError } = await adminClient
      .from("gift_code_redemptions")
      .insert({
        user_id: user.id,
        gift_code_id: giftCode.id,
        amount: giftCode.amount,
      });

    if (insertError) {
      return new Response(
        JSON.stringify({ error: "Failed to redeem code" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update uses count
    await adminClient
      .from("gift_codes")
      .update({ current_uses: giftCode.current_uses + 1 })
      .eq("id", giftCode.id);

    // Credit user balance
    const { data: profile } = await adminClient
      .from("profiles")
      .select("main_balance")
      .eq("user_id", user.id)
      .single();

    await adminClient
      .from("profiles")
      .update({ main_balance: (profile?.main_balance || 0) + giftCode.amount })
      .eq("user_id", user.id);

    return new Response(
      JSON.stringify({
        success: true,
        amount: giftCode.amount,
        message: `${giftCode.amount.toLocaleString()} RWF added to your balance!`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
