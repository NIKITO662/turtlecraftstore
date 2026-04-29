import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, LogOut } from "lucide-react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/store", label: "Store" },
  { to: "/forums", label: "Forums" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/rules", label: "Rules" },
  { to: "/support", label: "Support" },
];

export default function SiteHeader() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const signOut = async () => { await supabase.auth.signOut(); };

  return (
    <header className="relative">
      {/* Sky banner */}
      <div className="relative overflow-hidden bg-gradient-sky border-b-4 border-gold-dark">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 2px), radial-gradient(circle at 80% 60%, white 1px, transparent 2px)', backgroundSize: '120px 120px' }} />
        <div className="container relative flex items-center justify-between py-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md bg-gradient-gold pixel-border flex items-center justify-center font-pixel text-stone-dark text-xl">T</div>
            <div>
              <div className="font-medieval text-3xl font-black gold-text leading-none">TurtleCraft</div>
              <div className="text-xs text-foreground/80 font-medium tracking-widest uppercase">Minecraft Network</div>
            </div>
          </Link>
          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Link to="/account"><Button variant="ghost" className="text-foreground hover:bg-white/10">{user.email?.split('@')[0]}</Button></Link>
                  <Button onClick={signOut} variant="ghost" size="icon" className="text-foreground hover:bg-white/10"><LogOut className="h-4 w-4" /></Button>
                </>
              ) : (
                <>
                  <Link to="/login"><Button variant="ghost" className="text-foreground hover:bg-white/10 font-medieval">Log in</Button></Link>
                  <Link to="/register"><Button variant="ghost" className="text-foreground hover:bg-white/10 font-medieval">Register</Button></Link>
                </>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-foreground/80 font-medium uppercase tracking-wider">Server IP</div>
              <div className="font-pixel text-sm gold-text">play.turtlecraft.online</div>
            </div>
          </div>
          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <nav className="bg-stone-dark border-b-2 border-gold-dark">
        <div className={`container flex flex-wrap gap-2 py-3 ${open ? 'flex-col md:flex-row' : 'hidden md:flex'}`}>
          {navItems.map(item => (
            <RouterNavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `nav-tab px-5 py-2 text-sm rounded-sm ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </RouterNavLink>
          ))}
          <div className="ml-auto flex items-center gap-2 md:ml-auto">
            <button className="nav-tab px-3 py-2 rounded-sm" aria-label="Search"><Search className="h-4 w-4" /></button>
          </div>
        </div>
      </nav>
    </header>
  );
}
