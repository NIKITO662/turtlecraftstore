import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Check, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export default function Store() {
  const [ranks, setRanks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [mc, setMc] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    supabase.from("ranks").select("*").eq("active", true).order("sort_order")
      .then(({ data }) => setRanks(data || []));
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        supabase.from("profiles").select("minecraft_username").eq("id", data.session.user.id).maybeSingle()
          .then(({ data: p }) => p?.minecraft_username && setMc(p.minecraft_username));
      }
    });
  }, []);

  const buy = async (rankId: string) => {
    if (!user) { toast.error("Please log in to purchase"); nav("/login"); return; }
    if (!mc.trim() || mc.length > 16) { toast.error("Enter a valid Minecraft username (max 16 chars)"); return; }
    setLoadingId(rankId);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { rank_id: rankId, minecraft_username: mc.trim() },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        toast.error("Could not start checkout");
      }
    } catch (e: any) {
      toast.error(e.message || "Checkout failed. Make sure Stripe is set up.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-sm text-muted-foreground mb-2"><Link to="/" className="hover:text-gold">Home</Link> › Store</div>
        <h1 className="font-medieval text-5xl gold-text font-black">Ranks Store</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">Support TurtleCraft and unlock exclusive in-game perks. All purchases are delivered to your Minecraft account within minutes.</p>

        <div className="ornament-divider my-8" />

        <div className="stone-panel p-4 md:p-6 mb-8">
          <label className="font-medieval text-gold text-sm uppercase tracking-wider">Your Minecraft Username</label>
          <input
            value={mc} onChange={e => setMc(e.target.value)} maxLength={16}
            placeholder="e.g. Steve123"
            className="input-medieval w-full max-w-md mt-2 px-3 py-2 rounded-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">Required — your rank will be applied to this account.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ranks.map(r => (
            <div key={r.id} className={`rank-card p-6 flex flex-col ${r.is_lifetime ? 'ring-2 ring-gold' : ''}`}>
              {r.is_lifetime && (
                <div className="font-pixel text-xs text-stone-dark bg-gradient-gold px-3 py-1 rounded-sm self-start mb-3 flex items-center gap-1">
                  <Crown className="h-3 w-3" /> MOST EXCLUSIVE
                </div>
              )}
              <div className="font-pixel text-xs uppercase tracking-wider mb-2" style={{ color: r.color }}>[{r.short_name}]</div>
              <h3 className="font-medieval text-3xl gold-text">{r.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">{r.description}</p>

              <ul className="mt-4 space-y-2 flex-1">
                {(r.perks as string[]).map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-border flex items-end justify-between">
                <div>
                  <div className="font-pixel text-3xl gold-text">${(r.price_cents / 100).toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground uppercase">{r.is_lifetime ? "One-time, lifetime" : "One-time payment"}</div>
                </div>
                <button
                  onClick={() => buy(r.id)}
                  disabled={loadingId === r.id}
                  className="btn-gold px-5 py-2 rounded-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-8 max-w-3xl">
          Purchases are non-refundable except where required by law. By purchasing, you agree to our{" "}
          <Link to="/terms" className="text-gold hover:underline">Terms of Service</Link>. TurtleCraft is not affiliated with Mojang or Microsoft.
        </p>
      </div>
    </Layout>
  );
}
