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

    const { data: st } = await supabase.from("site_settings").select("key,value");
    const S: Record<string, string> = {};
    (st ?? []).forEach((r: any) => { S[r.key] = String(r.value ?? ""); });
    const g = (k: string, d: string) => S[k] || d;
    const catalog = (products ?? []).map((p) => {
      const daily = Math.round(p.investment_amount * p.daily_profit_rate / 100);
      const total = daily * p.duration_days;
      return `- ${p.name ?? p.tier_label} (${p.category}): igiciro ${p.investment_amount} RWF, inyungu ${p.daily_profit_rate}% ku munsi (~${daily} RWF/umunsi), iminsi ${p.duration_days}, inyungu yose ~${total} RWF, kwishyura: ${p.payout_type === "compound" ? "rimwe ku iherezo" : "buri munsi saa sita z'ijoro"}, ushobora kugura inshuro ${p.max_purchases}`;
    }).join("\n");

    const res = await generateResponse({
      model: "openai/gpt-6-astra",
      reasoning: { effort: "low" },
      instructions: `Uri umufasha wa RUBIS SHARE COMPANY. Subiza mu Kinyarwanda gusa, mu magambo make asobanutse, nta markdown (nta ** cyangwa #); koresha (-) ku rutonde.

UMWANYA WAWE: Subiza GUSA ibibazo bijyanye no kubitsa, kubikuza, ishoramari/ibicuruzwa, inyungu, gutumira (referral), konti n'uko urubuga rukoreshwa. Niba umuntu abajije niba urubuga rwizewe, ari uburiganya, ruzamara igihe kingana iki, cyangwa ikindi kibazo kitari muri ibi, NTUSUBIZE icyo kibazo; vuga gusa uti: "Icyo kibazo nturi njye ugisubiza. Andikira umuyobozi kuri Telegram (${g("telegram_admin_url","https://t.me/rubisshare")}) akagusobanurira neza." Ntukavuge ko urubuga rwizewe cyangwa rutizewe. Niba utazi igisubizo, ntugahimbe: ohereza ku muyobozi.

AMAKURU Y'URUBUGA:
- Kwiyandikisha: nimero ya telefoni y'imibare 10 n'ijambo ry'ibanga. Uhabwa bonus ya 2,000 RWF ukiyandikisha; ishobora gukurwa ari uko umaze gushora.
- Kubitsa: hagati ya ${g("min_deposit","3500")} na ${g("max_deposit","2000000")} RWF. Intambwe: jya kuri "Kubitsa", andika amafaranga, wohereze kuri MoMo ${g("payment_phone","")} (${g("payment_name","")}), hanyuma wandike nimero/ID y'ubwishyu. Umuyobozi aremeza, amafaranga akajya kuri konti.
- Kubikuza: ubanza kuba warashoye igicuruzwa. Ubanza guhuza konti ya MoMo (izina na nimero). Bwa mbere ntoya ni ${g("min_withdraw_first","1000")} RWF, ubutaha ${g("min_withdraw","3000")} RWF, nini ni ${g("max_withdraw","2000000")} RWF. Amafaranga y'ishimwe (fee) ni ${g("withdraw_fee_percent","20")}%. Kubikuza rimwe ku munsi, hagati ya saa ${g("withdraw_start_hour","9")} na saa ${g("withdraw_end_hour","17")}. Umuyobozi aremeza mbere y'uko amafaranga akugeraho.
- Ishoramari: gura igicuruzwa kuri paji "Ibicuruzwa" ukoresheje amafaranga ari kuri konti. Inyungu ya buri munsi yongerwa kuri konti saa sita z'ijoro (isaha y'u Rwanda), rimwe ku munsi. Ibicuruzwa bya "compound" byishyura rimwe gusa ku iherezo ry'igihe. Ingano yashoye irerekanwa kuri "Konti".
- Gutumira: sangiza link yawe y'ubutumire (paji "Ikipe"). Uhabwa komisiyo: urwego 1 = 15%, urwego 2 = 2%, urwego 3 = 1% by'amafaranga bashoye.
- Gift code: andika kode kuri Home ubone bonus.
- Ibihembo (Ambassador): uko ikipe yawe ishora, ufungura ibihembo kuri paji "Ibihembo".
- Ubufasha: umuyobozi ${g("telegram_admin_url","https://t.me/rubisshare")}, group ${g("telegram_meeting_url","https://t.me/rubissharecommunity")}.
- Ntukemeze inyungu zirenze izanditse. Bara neza: inyungu ya buri munsi = igiciro x ijanisha.

IBICURUZWA:
` + catalog,
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
