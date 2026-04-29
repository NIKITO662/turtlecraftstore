import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <article className="container max-w-3xl py-12 prose prose-invert prose-headings:font-medieval prose-headings:text-gold prose-a:text-gold">
        <h1 className="gold-text">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using TurtleCraft (the "Service"), including the Minecraft server at <code>play.turtlecraft.online</code>, the website, forums, and online store, you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Service.</p>

        <h2>2. Eligibility</h2>
        <p>You must be at least 13 years old to create an account. If you are under the age of majority in your country, you must have permission from a parent or legal guardian.</p>

        <h2>3. Accounts</h2>
        <ul>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You are responsible for all activity that occurs under your account.</li>
          <li>You must provide accurate information, including a valid Minecraft username when purchasing ranks.</li>
        </ul>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use cheats, hacks, exploits, or unauthorized modifications.</li>
          <li>Harass, threaten, or abuse other users or staff.</li>
          <li>Post unlawful, hateful, or sexually explicit content.</li>
          <li>Attempt to gain unauthorized access to any account, system, or network.</li>
          <li>Resell, share, or transfer ranks or in-game items.</li>
        </ul>

        <h2>5. Purchases & Ranks</h2>
        <ul>
          <li>All ranks and digital goods are licensed, not sold. We grant you a personal, non-transferable license to use them on the TurtleCraft network.</li>
          <li>Prices are in USD unless otherwise indicated and are processed through Stripe.</li>
          <li>The "Special (Lifetime)" rank refers to the operational lifetime of the TurtleCraft network and does not guarantee continued availability of the Service.</li>
          <li><strong>All sales are final and non-refundable</strong> except where required by law. Chargebacks may result in account termination.</li>
          <li>Delivery of in-game perks usually occurs within minutes after a successful payment.</li>
        </ul>

        <h2>6. User Content</h2>
        <p>You retain ownership of content you post on the forums. By posting, you grant TurtleCraft a worldwide, royalty-free, non-exclusive license to host, display, and distribute that content as part of the Service.</p>

        <h2>7. Suspension & Termination</h2>
        <p>We may suspend or terminate your account at any time, with or without notice, for any violation of these Terms. No refunds will be issued for ranks lost due to a ban for rule violations.</p>

        <h2>8. Disclaimer</h2>
        <p>The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted availability or that the Service will be error-free.</p>

        <h2>9. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, TurtleCraft shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>

        <h2>10. Trademarks</h2>
        <p>TurtleCraft is not affiliated with, endorsed by, or sponsored by Mojang AB or Microsoft. Minecraft is a trademark of Mojang Synergies AB.</p>

        <h2>11. Changes</h2>
        <p>We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the revised Terms.</p>

        <h2>12. Contact</h2>
        <p>Questions about these Terms? Reach us through the Support section of the website.</p>
      </article>
    </Layout>
  );
}
