import Layout from "@/components/Layout";

const Stub = ({ title, body }: { title: string; body: string }) => (
  <Layout>
    <div className="container py-16 max-w-3xl">
      <h1 className="font-medieval text-4xl gold-text font-black">{title}</h1>
      <p className="text-muted-foreground mt-4">{body}</p>
    </div>
  </Layout>
);

export const Leaderboard = () => <Stub title="Leaderboard" body="Top players coming soon. Check back after our next stat sync." />;
export const Rules = () => <Stub title="Server Rules" body="No cheats, no harassment, no spam. Be kind. Full rules will be published shortly." />;
export const Support = () => <Stub title="Support" body="Need help? Open a thread in the Help & Support forum or contact a staff member in-game." />;
export const Account = () => <Stub title="Your Account" body="Account settings coming soon." />;
export const ForgotPassword = () => <Stub title="Forgot Password" body="Password reset coming soon. Contact support for now." />;
