import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Copy, MessageSquare, ShoppingBag, Users } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [threads, setThreads] = useState<any[]>([]);
  const [ranks, setRanks] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("forum_threads").select("id,title,created_at,category_id").order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => setThreads(data || []));
    supabase.from("ranks").select("*").eq("active", true).order("sort_order").limit(3)
      .then(({ data }) => setRanks(data || []));
  }, []);

  const copyIp = () => {
    navigator.clipboard.writeText("play.turtlecraft.online");
    toast.success("Server IP copied!");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b-4 border-gold-dark">
        <div className="absolute inset-0 bg-gradient-sky" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0 32px, rgba(0,0,0,0.05) 32px 33px), repeating-linear-gradient(90deg, transparent 0 32px, rgba(0,0,0,0.05) 32px 33px)`
        }} />
        {/* Pixel mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{
          background: 'linear-gradient(180deg, transparent 0%, hsl(120 35% 18%) 60%, hsl(120 40% 14%) 100%)',
          clipPath: 'polygon(0 100%, 0 70%, 8% 50%, 14% 65%, 22% 40%, 30% 55%, 40% 35%, 50% 50%, 60% 30%, 70% 55%, 80% 40%, 90% 60%, 100% 45%, 100% 100%)'
        }} />
        <div className="container relative py-16 md:py-24 text-center">
          <h1 className="font-medieval text-5xl md:text-7xl font-black gold-text drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
            TurtleCraft
          </h1>
          <p className="mt-4 text-foreground/90 font-medieval text-lg tracking-wider">
            JOIN <span className="text-gold font-black">27,000+</span> PLAYERS ONLINE
          </p>
          <div className="mt-8 inline-flex flex-col sm:flex-row items-center gap-4 stone-panel p-4">
            <div className="text-left">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Server IP</div>
              <div className="font-pixel text-xl gold-text">play.turtlecraft.online</div>
            </div>
            <button onClick={copyIp} className="btn-gold px-5 py-2 rounded-sm flex items-center gap-2">
              <Copy className="h-4 w-4" /> Copy IP
            </button>
          </div>
        </div>
      </section>

      {/* Featured ranks teaser */}
      <section className="container py-16">
        <div className="text-center mb-10">
          <h2 className="font-medieval text-4xl gold-text font-black">Upgrade Your Account</h2>
          <p className="text-muted-foreground mt-2">Unlock perks, cosmetics, and exclusive features.</p>
          <div className="ornament-divider mt-6 max-w-md mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {ranks.map(r => (
            <Link key={r.id} to="/store" className="rank-card p-6 group">
              <div className="font-pixel text-xs uppercase tracking-wider mb-2" style={{ color: r.color }}>[{r.short_name}]</div>
              <h3 className="font-medieval text-2xl gold-text">{r.name}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{r.description}</p>
              <div className="mt-4 font-pixel text-2xl gold-text">${(r.price_cents / 100).toFixed(2)}</div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/store" className="btn-gold inline-block px-8 py-3 rounded-sm"><ShoppingBag className="inline h-4 w-4 mr-2" />Open Store</Link>
        </div>
      </section>

      {/* Recent threads */}
      <section className="container py-12 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 stone-panel p-6">
          <h3 className="font-medieval text-2xl gold-text mb-4 flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Latest Threads</h3>
          <ul className="divide-y divide-border">
            {threads.length === 0 && <li className="py-3 text-muted-foreground text-sm">No threads yet — be the first to post!</li>}
            {threads.map(t => (
              <li key={t.id} className="py-3">
                <Link to={`/forums/thread/${t.id}`} className="hover:text-gold font-medium">{t.title}</Link>
                <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
          <div className="mt-4"><Link to="/forums" className="text-gold hover:underline text-sm">View all forums →</Link></div>
        </div>
        <div className="stone-panel p-6">
          <h3 className="font-medieval text-2xl gold-text mb-4 flex items-center gap-2"><Users className="h-5 w-5" /> Community</h3>
          <p className="text-muted-foreground text-sm">Join the discussion, share your builds, and meet thousands of TurtleCraft adventurers.</p>
          <Link to="/register" className="btn-gold inline-block mt-4 px-5 py-2 rounded-sm text-sm">Create Account</Link>
        </div>
      </section>
    </Layout>
  );
}
