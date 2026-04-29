import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Thread() {
  const { id } = useParams();
  const [thread, setThread] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [authors, setAuthors] = useState<Record<string, any>>({});
  const [user, setUser] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [posting, setPosting] = useState(false);

  const load = async () => {
    const { data: t } = await supabase.from("forum_threads").select("*").eq("id", id).maybeSingle();
    setThread(t);
    const { data: p } = await supabase.from("forum_posts").select("*").eq("thread_id", id).order("created_at");
    setPosts(p || []);
    const ids = [...new Set([t?.author_id, ...(p || []).map(x => x.author_id)].filter(Boolean))];
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id,username,avatar_url").in("id", ids);
      const map: Record<string, any> = {};
      (profs || []).forEach(pr => { map[pr.id] = pr; });
      setAuthors(map);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    load();
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in"); return; }
    if (reply.trim().length < 2) return;
    if (thread.locked) { toast.error("This thread is locked"); return; }
    setPosting(true);
    const { error } = await supabase.from("forum_posts").insert({ thread_id: id, author_id: user.id, content: reply.trim() });
    setPosting(false);
    if (error) { toast.error(error.message); return; }
    setReply("");
    load();
  };

  if (!thread) return <Layout><div className="container py-20 text-center text-muted-foreground">Loading…</div></Layout>;

  const Post = ({ author_id, content, created_at, isOp }: any) => {
    const a = authors[author_id];
    return (
      <div className="stone-panel p-6 grid md:grid-cols-[160px_1fr] gap-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-sm bg-gradient-gold pixel-border flex items-center justify-center font-pixel text-stone-dark text-2xl">
            {(a?.username || "?")[0].toUpperCase()}
          </div>
          <div className="mt-2 font-medieval text-gold text-sm">{a?.username || "Unknown"}</div>
          {isOp && <div className="text-xs text-muted-foreground">Original Poster</div>}
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-3">{new Date(created_at).toLocaleString()}</div>
          <div className="whitespace-pre-wrap break-words text-foreground/90">{content}</div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        <div className="text-sm text-muted-foreground mb-2">
          <Link to="/" className="hover:text-gold">Home</Link> › <Link to="/forums" className="hover:text-gold">Forums</Link> › {thread.title}
        </div>
        <h1 className="font-medieval text-3xl gold-text font-black mb-6">{thread.title}</h1>

        <div className="space-y-4">
          <Post author_id={thread.author_id} content={thread.content} created_at={thread.created_at} isOp />
          {posts.map(p => <Post key={p.id} {...p} />)}
        </div>

        <div className="mt-8">
          {user ? (
            <form onSubmit={submit} className="stone-panel p-6 space-y-3">
              <h3 className="font-medieval text-gold">Reply</h3>
              <textarea className="input-medieval w-full px-3 py-2 rounded-sm min-h-[120px]" value={reply} onChange={e => setReply(e.target.value)} maxLength={5000} placeholder="Write your reply..." />
              <button disabled={posting} className="btn-gold px-5 py-2 rounded-sm disabled:opacity-50">{posting ? "Posting…" : "Post Reply"}</button>
            </form>
          ) : (
            <div className="stone-panel p-6 text-center"><Link to="/login" className="text-gold hover:underline">Log in</Link> to reply.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
