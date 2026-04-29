import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stay, setStay] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) { toast.error("Enter your email and password"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
    nav("/");
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-12">
        <div className="text-sm text-muted-foreground mb-2"><Link to="/" className="hover:text-gold">Home</Link> › Log in</div>
        <h1 className="font-medieval text-4xl gold-text font-black mb-6">Log in</h1>

        <form onSubmit={submit} className="stone-panel p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-[200px_1fr] gap-2 md:gap-6 items-center">
            <label className="md:text-right font-medieval text-gold">Your name or email address:</label>
            <input className="input-medieval w-full px-3 py-2 rounded-sm" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>

          <div className="grid md:grid-cols-[200px_1fr] gap-2 md:gap-6 items-start">
            <label className="md:text-right font-medieval text-gold pt-2">Password:</label>
            <div className="space-y-2">
              <input type="password" className="input-medieval w-full px-3 py-2 rounded-sm" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
              <Link to="/forgot-password" className="text-sm text-gold hover:underline">Forgot your password?</Link>
            </div>
          </div>

          <div className="grid md:grid-cols-[200px_1fr] gap-2 md:gap-6 items-center">
            <div />
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={stay} onChange={e => setStay(e.target.checked)} />
              Stay logged in
            </label>
          </div>

          <div className="flex justify-center">
            <button type="submit" disabled={loading} className="btn-gold px-8 py-3 rounded-sm flex items-center gap-2 disabled:opacity-50">
              <Lock className="h-4 w-4" /> {loading ? "Logging in..." : "Log in"}
            </button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="inline-block bg-stone-light text-foreground px-4 py-1 rounded-sm hover:bg-stone-mid font-medieval">Register now</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
