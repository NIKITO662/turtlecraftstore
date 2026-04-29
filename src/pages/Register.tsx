import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import HumanVerification from "@/components/HumanVerification";
import { toast } from "sonner";

const schema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(24, "Max 24 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only"),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
  minecraftUsername: z.string().trim().max(16, "Max 16 characters").optional().or(z.literal("")),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear() - 13, "You must be at least 13"),
  agree: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
});

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    username: "", email: "", password: "", minecraftUsername: "",
    birthDay: "", birthMonth: "", birthYear: "", agree: false, news: false,
  });
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!verified) { toast.error("Please complete human verification"); return; }
    const parsed = schema.safeParse({
      username: form.username, email: form.email, password: form.password,
      minecraftUsername: form.minecraftUsername,
      birthYear: parseInt(form.birthYear || "0", 10), agree: form.agree,
    });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.errors.forEach(err => { if (err.path[0]) fe[err.path[0] as string] = err.message; });
      setErrors(fe); return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { username: form.username, minecraft_username: form.minecraftUsername },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created! Welcome to TurtleCraft.");
    nav("/");
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-12">
        <div className="text-sm text-muted-foreground mb-2"><Link to="/" className="hover:text-gold">Home</Link> › Register</div>
        <h1 className="font-medieval text-4xl gold-text font-black mb-6">Register</h1>

        <form onSubmit={submit} className="stone-panel p-6 md:p-8 space-y-6">
          <Field label="Username" required error={errors.username} hint="This is the name shown with your messages.">
            <input className="input-medieval w-full px-3 py-2 rounded-sm" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} maxLength={24} />
          </Field>

          <Field label="Email" required error={errors.email}>
            <input type="email" className="input-medieval w-full px-3 py-2 rounded-sm" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} maxLength={255} />
          </Field>

          <Field label="Password" required error={errors.password} hint="At least 8 characters.">
            <input type="password" className="input-medieval w-full px-3 py-2 rounded-sm" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} maxLength={72} />
          </Field>

          <Field label="Minecraft username" hint="Optional — used to deliver in-game ranks.">
            <input className="input-medieval w-full px-3 py-2 rounded-sm" value={form.minecraftUsername}
              onChange={e => setForm({ ...form, minecraftUsername: e.target.value })} maxLength={16} />
          </Field>

          <Field label="Date of birth" required error={errors.birthYear}
            hint="You must be at least 13 years old to register. Not stored.">
            <div className="grid grid-cols-3 gap-2">
              <select className="input-medieval px-3 py-2 rounded-sm" value={form.birthMonth} onChange={e => setForm({ ...form, birthMonth: e.target.value })}>
                <option value="">Month</option>
                {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => <option key={m} value={i+1}>{m}</option>)}
              </select>
              <input className="input-medieval px-3 py-2 rounded-sm" placeholder="Day" type="number" min={1} max={31}
                value={form.birthDay} onChange={e => setForm({ ...form, birthDay: e.target.value })} />
              <input className="input-medieval px-3 py-2 rounded-sm" placeholder="Year" type="number" min={1900} max={new Date().getFullYear()}
                value={form.birthYear} onChange={e => setForm({ ...form, birthYear: e.target.value })} />
            </div>
          </Field>

          <Field label="Verification" required>
            <HumanVerification onVerified={setVerified} />
          </Field>

          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={form.news} onChange={e => setForm({ ...form, news: e.target.checked })} className="mt-1" />
            <span className="text-muted-foreground">Receive news and updates from us by email</span>
          </label>

          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })} className="mt-1" />
            <span className="text-muted-foreground">
              I agree to the <Link to="/terms" className="text-gold hover:underline">terms</Link> and <Link to="/privacy" className="text-gold hover:underline">privacy policy</Link>.
            </span>
          </label>
          {errors.agree && <p className="text-destructive text-xs -mt-4">{errors.agree}</p>}

          <div className="flex justify-center pt-2">
            <button type="submit" disabled={loading} className="btn-gold px-8 py-3 rounded-sm disabled:opacity-50">
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-gold hover:underline">Log in</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

function Field({ label, required, hint, error, children }: any) {
  return (
    <div className="grid md:grid-cols-[180px_1fr] gap-2 md:gap-6 items-start">
      <div className="md:text-right pt-2">
        <div className="font-medieval text-gold">{label}{required && ":"}</div>
        {required && <div className="text-xs text-destructive/80">Required</div>}
      </div>
      <div className="space-y-1">
        {children}
        {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
