import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t-2 border-gold-dark bg-stone-dark">
      <div className="container py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="font-medieval text-2xl gold-text font-black">TurtleCraft</div>
          <p className="text-sm text-muted-foreground mt-2">A Minecraft network forged for adventurers. Join thousands of players online.</p>
          <div className="mt-3 font-pixel text-xs gold-text">play.turtlecraft.online</div>
        </div>
        <div>
          <h4 className="font-medieval text-gold mb-3">Network</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/store" className="hover:text-gold">Store</Link></li>
            <li><Link to="/forums" className="hover:text-gold">Forums</Link></li>
            <li><Link to="/leaderboard" className="hover:text-gold">Leaderboard</Link></li>
            <li><Link to="/support" className="hover:text-gold">Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medieval text-gold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/terms" className="hover:text-gold">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link to="/rules" className="hover:text-gold">Server Rules</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medieval text-gold mb-3">Community</h4>
          <p className="text-sm text-muted-foreground">Not affiliated with Mojang or Microsoft. Minecraft is a trademark of Mojang Synergies AB.</p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TurtleCraft Network. All rights reserved.
      </div>
    </footer>
  );
}
