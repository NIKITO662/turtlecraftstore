import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Category() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [cat, setCat] = useState<any>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    (async () => {
      const { data: c } = await supabase.from("forum_categories").select("*").eq("slug", slug).maybeSingle();
      setCat(c);
      if (c) {
        const { data: t } = await supabase.from("forum_threads").select("*").eq("category_id", c.id).order("pinned", { ascending: false }).order("created_at", { ascending: false });
        setThreads(t || []);
      }
    })();
  }, [slug]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in"); return; }
    if (title.trim().length < 4 || content.trim().length < 4) { toast.error("Title and message are required"); return; }
    setPosting(true);
    const { data, error } = await supabase.from("forum_threads").insert({
      category_id: cat.id, author_id: user.id, title: title.trim(), content: content.trim(),
    }).select().single();
    setPosting(false);
    if (error) { toast.error(error.message); return; }
    nav(`/forums/thread/${data.id}`);
  };

  if (!cat) return <Layout><div className="container py-20 text-center text-muted-foreground">Loading…</div></Layout>;

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-sm text-muted-foreground mb-2">
          <Link to="/" className="hover:text-gold">Home</Link> › <Link to="/forums" className="hover:text-gold">Forums</Link> › {cat.name}
        </div>
        <h1 className="font-medieval text-4xl gold-text font-black">{cat.name}</h1>
        <p className="text-muted-foreground">{cat.description}</p>

        <div className="my-6">
          {user ? (
            <button onClick={() => setShowNew(!showNew)} className="btn-gold px-5 py-2 rounded-sm">
              {showNew ? "Cancel" : "+ New Thread"}
            </button>
          ) : (
            <Link to="/login" className="btn-gold inline-block px-5 py-2 rounded-sm">Log in to post</Link>
          )}
        </div>

        {showNew && (
          <form onSubmit={create} className="stone-panel p-6 space-y-4 mb-6">
            <input className="input-medieval w-full px-3 py-2 rounded-sm" placeholder="Thread title" value={title} onChange={e => setTitle(e.target.value)} maxLength={200} />
            <textarea className="input-medieval w-full px-3 py-2 rounded-sm min-h-[140px]" placeholder="Write your message..." value={content} onChange={e => setContent(e.target.value)} maxLength={5000} />
            <button type="submit" disabled={posting} className="btn-gold px-5 py-2 rounded-sm disabled:opacity-50">{posting ? "Posting…" : "Post Thread"}</button>
          </form>
        )}

        <div className="stone-panel divide-y divide-border">
          {threads.length === 0 && <div className="p-6 text-muted-foreground text-sm">No threads yet. Be the first!</div>}
          {threads.map(t => (
            <Link key={t.id} to={`/forums/thread/${t.id}`} className="block px-6 py-3 hover:bg-stone-mid">
              <div className="font-medium">{t.pinned ? "📌 " : ""}{t.title}</div>
              <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
