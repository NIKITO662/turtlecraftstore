import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Layout>
      <div className="container py-24 text-center">
        <div className="font-pixel text-7xl gold-text">404</div>
        <h1 className="font-medieval text-3xl mt-4 text-foreground">This page got lost in the End</h1>
        <p className="text-muted-foreground mt-2">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-gold inline-block mt-6 px-6 py-2 rounded-sm">Return Home</Link>
      </div>
    </Layout>
  );
}
