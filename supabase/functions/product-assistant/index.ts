import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateResponse, GatewayError } from "npm:@lovable.dev/ai-gateway";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "Banza winjire." }, 401);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: "Banza winjire." }, 401);

    const { question } = await req.json();
    const q = String(question ?? "").trim().slice(0, 500);
    if (!q) return json({ error: "Andika ikibazo." }, 400);

    const { data: products } = await supabase
      .from("investment_products")
      .select("name,tier_label,category,investment_amount,daily_profit_rate,duration_days,max_purchases,payout_type")
      .eq("is_active", true)
      .order("sort_order");

    const catalog = (products ?? []).map((p) => {
      const daily = Math.round(p.investment_amount * p.daily_profit_rate / 100);
      const total = daily * p.duration_days;
      return `- ${p.name ?? p.tier_label} (${p.category}): igiciro ${p.investment_amount} RWF, inyungu ${p.daily_profit_rate}% ku munsi (~${daily} RWF/umunsi), iminsi ${p.duration_days}, inyungu yose ~${total} RWF, kwishyura: ${p.payout_type === "compound" ? "rimwe ku iherezo" : "buri munsi saa sita z'ijoro"}, ushobora kugura inshuro ${p.max_purchases}`;
    }).join("\n");

    const res = await generateResponse({
      model: "openai/gpt-6-astra",
      reasoning: { effort: "low" },
      instructions:
        "Uri umufasha w'abashoramari. Subiza mu Kinyarwanda gusa, mu magambo make kandi asobanutse. Shingira ku makuru y'ibicuruzwa ari hasi gusa; niba igisubizo kitarimo, vuga ko utabizi ubohereze kuri serivisi y'abakiriya. Ntukemeze inyungu zirenze izanditse. Amafaranga ni RWF. Andi mategeko: amafaranga ntarengwa yo kubitsa 3,500 RWF; kubikuza bisaba kuba warashoye; amafaranga yo kubikuza ni 20%.\n\nIbicuruzwa:\n" + catalog,
      input: q,
    });
    // deno-lint-ignore no-explicit-any
    const r = res as any;
    const answer: string = r.output_text ||
      (r.output ?? []).flatMap((o: any) => o.content ?? []).filter((c: any) => c.type === "output_text").map((c: any) => c.text).join("\n");
    return json({ answer });
  } catch (e) {
    if (e instanceof GatewayError) {
      const status = e.httpStatus === 429 ? 429 : e.httpStatus === 402 ? 402 : 500;
      return json({ error: status === 429 ? "Hari benshi babaza, ongera ugerageze nyuma gato." : "Umufasha ntabonetse ubu." }, status);
    }
    return json({ error: "Habaye ikibazo." }, 500);
  }
});
