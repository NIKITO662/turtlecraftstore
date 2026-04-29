import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <article className="container max-w-3xl py-12 prose prose-invert prose-headings:font-medieval prose-headings:text-gold prose-a:text-gold">
        <h1 className="gold-text">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <p>This Privacy Policy explains how TurtleCraft ("we", "us") collects, uses, and protects information when you use our website, forums, store, and Minecraft server.</p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li><strong>Account information:</strong> username, email, encrypted password, optional Minecraft username.</li>
          <li><strong>Age verification:</strong> we collect your date of birth at signup to confirm you are at least 13. We do not store the exact birth date after verification.</li>
          <li><strong>Purchase information:</strong> Minecraft username, order details, and payment metadata. Card numbers and full payment details are processed and stored by Stripe — we never see them.</li>
          <li><strong>Forum content:</strong> threads and posts you publish.</li>
          <li><strong>In-game data:</strong> gameplay statistics, chat logs, and connection IP addresses for moderation and anti-cheat purposes.</li>
          <li><strong>Technical data:</strong> IP address, browser type, device, and pages visited (via standard server logs and cookies).</li>
        </ul>

        <h2>2. How We Use Information</h2>
        <ul>
          <li>To operate and improve the Service.</li>
          <li>To process purchases and deliver in-game ranks.</li>
          <li>To enforce the Terms of Service and server rules.</li>
          <li>To communicate with you about your account or important updates.</li>
          <li>To send marketing emails (only if you opt in — you can unsubscribe at any time).</li>
        </ul>

        <h2>3. Sharing</h2>
        <p>We do not sell your personal information. We share data only with:</p>
        <ul>
          <li><strong>Stripe</strong> for payment processing.</li>
          <li>Hosting and infrastructure providers strictly necessary to operate the Service.</li>
          <li>Authorities when required by law.</li>
        </ul>

        <h2>4. Cookies</h2>
        <p>We use essential cookies to keep you logged in and to remember preferences. We do not use third-party advertising trackers.</p>

        <h2>5. Data Retention</h2>
        <p>We retain account data while your account is active. Forum content and order records may be retained longer for legal, accounting, and moderation reasons.</p>

        <h2>6. Your Rights</h2>
        <p>You can access, update, or delete your account information at any time through your account settings or by contacting support. If you are in the EU/UK, you have additional rights under GDPR including the right to access, rectify, erase, restrict, and port your data, and to object to processing.</p>

        <h2>7. Children</h2>
        <p>The Service is not directed at children under 13. If we learn we have collected personal information from a child under 13 without parental consent, we will delete it.</p>

        <h2>8. Security</h2>
        <p>We use industry-standard measures to protect your data, including encrypted connections (HTTPS) and hashed passwords. No system is 100% secure; use a strong, unique password.</p>

        <h2>9. International Transfers</h2>
        <p>Your data may be stored or processed in countries outside your own. We use safeguards in line with applicable law.</p>

        <h2>10. Changes</h2>
        <p>We may update this Privacy Policy. Material changes will be communicated through the website.</p>

        <h2>11. Contact</h2>
        <p>For privacy questions, contact us through the Support section.</p>
      </article>
    </Layout>
  );
}
