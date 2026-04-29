import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Pin, Lock } from "lucide-react";

export default function Forums() {
  const [cats, setCats] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from("forum_categories").select("*").order("sort_order");
      setCats(c || []);
      const { data: t } = await supabase.from("forum_threads").select("id,title,created_at,category_id,author_id,pinned,locked").order("created_at", { ascending: false });
      setRecent((t || []).slice(0, 10));
      const map: Record<string, number> = {};
      (t || []).forEach(th => { map[th.category_id] = (map[th.category_id] || 0) + 1; });
      setCounts(map);
    })();
  }, []);

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-sm text-muted-foreground mb-2"><Link to="/" className="hover:text-gold">Home</Link> › Forums</div>
        <h1 className="font-medieval text-5xl gold-text font-black mb-6">Forums</h1>

        <div className="stone-panel overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_120px] bg-stone-dark border-b border-border px-6 py-3 font-medieval text-gold text-sm uppercase">
            <div>Category</div>
            <div className="text-center">Threads</div>
            <div className="text-right">Last activity</div>
          </div>
          {cats.map(cat => (
            <Link key={cat.id} to={`/forums/${cat.slug}`} className="grid grid-cols-[1fr_100px_120px] px-6 py-4 border-b border-border last:border-0 hover:bg-stone-mid transition-colors items-center">
              <div>
                <div className="font-medieval text-lg text-gold flex items-center gap-2"><MessageSquare className="h-4 w-4" />{cat.name}</div>
                <div className="text-sm text-muted-foreground">{cat.description}</div>
              </div>
              <div className="text-center font-pixel text-gold">{counts[cat.id] || 0}</div>
              <div className="text-right text-xs text-muted-foreground">—</div>
            </Link>
          ))}
        </div>

        <h2 className="font-medieval text-2xl gold-text mt-12 mb-4">Latest Threads</h2>
        <div className="stone-panel divide-y divide-border">
          {recent.length === 0 && <div className="p-6 text-muted-foreground text-sm">No threads yet. Start the conversation!</div>}
          {recent.map(t => (
            <Link key={t.id} to={`/forums/thread/${t.id}`} className="block px-6 py-3 hover:bg-stone-mid">
              <div className="flex items-center gap-2">
                {t.pinned && <Pin className="h-3 w-3 text-gold" />}
                {t.locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                <span className="font-medium">{t.title}</span>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
